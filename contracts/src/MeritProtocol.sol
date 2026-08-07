// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./libraries/MeritTypes.sol";
import "./libraries/ScoreMath.sol";
import "./libraries/RequirementValidator.sol";
import "./MeritBadge.sol";

interface IMeritAgent {
    function triggerSubmissionWorkflow(uint256 submissionId) external;
}

contract MeritProtocol is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Custom Errors
    error ContestNotActive();
    error ContestAlreadyFinalized();
    error ContestNotEnded();
    error InvalidPrizeDistribution();
    error InvalidWinnerCount();
    error DuplicateSubmission();
    error UnauthorizedAgent();
    error InvalidWeights();
    error InsufficientPrizeEscrow();

    // State Variables
    address public meritAgent;
    address public meritBadge;
    bool public mockMode = true; // Default to Mock Mode for testnet safety

    uint256 public nextContestId = 1;
    uint256 public nextSubmissionId = 1;

    mapping(uint256 => MeritTypes.Contest) public contests;
    mapping(uint256 => MeritTypes.Submission) public submissions;
    mapping(uint256 => mapping(bytes32 => bool)) public usedContentHashes;
    mapping(uint256 => MeritTypes.LeaderboardEntry[]) public contestLeaderboards;
    mapping(address => MeritTypes.UserProfile) public userProfiles;
    mapping(uint256 => uint256[]) public contestSubmissionIds;

    // Events
    event ContestCreated(uint256 indexed contestId, address indexed owner, string title, uint256 totalPrize, address prizeToken);
    event SubmissionCreated(uint256 indexed contestId, uint256 indexed submissionId, address indexed submitter, string contentUrl);
    event SubmissionStatusChanged(uint256 indexed submissionId, MeritTypes.SubmissionStatus status);
    event SubmissionScored(uint256 indexed contestId, uint256 indexed submissionId, address indexed submitter, uint256 finalScore);
    event ReputationUpdated(address indexed user, uint256 newReputation, uint256 addedPoints);
    event RoleEligible(address indexed user, uint256 roleLevel, string roleName);
    event ContestFinalized(uint256 indexed contestId, uint256 totalWinners, uint256 totalDistributed);
    event PrizePaid(uint256 indexed contestId, address indexed winner, uint256 amount, uint256 rank);
    event MockModeChanged(bool enabled);
    event AgentUpdated(address indexed agent);
    event BadgeUpdated(address indexed badge);

    modifier onlyAgentOrOwner() {
        if (msg.sender != meritAgent && msg.sender != owner()) revert UnauthorizedAgent();
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Admin Configurations
    function setMeritAgent(address _meritAgent) external onlyOwner {
        require(_meritAgent != address(0), "Invalid agent address");
        meritAgent = _meritAgent;
        emit AgentUpdated(_meritAgent);
    }

    function setMeritBadge(address _meritBadge) external onlyOwner {
        require(_meritBadge != address(0), "Invalid badge address");
        meritBadge = _meritBadge;
        emit BadgeUpdated(_meritBadge);
    }

    function setMockMode(bool enabled) external onlyOwner {
        mockMode = enabled;
        emit MockModeChanged(enabled);
    }

    // Contest Management
    function createContest(
        string calldata title,
        string calldata description,
        uint256 startBlock,
        uint256 endBlock,
        address prizeToken,
        uint256 totalPrize,
        uint256 winnerCount,
        uint256[] calldata payoutBps,
        uint256 objectiveWeight,
        uint256 aiWeight,
        MeritTypes.HardRequirements calldata requirements,
        uint256 rubricVersion,
        bytes32 rubricHash
    ) external payable nonReentrant returns (uint256) {
        if (startBlock >= endBlock) revert ContestNotActive();
        if (winnerCount == 0 || winnerCount > 20 || winnerCount != payoutBps.length) revert InvalidWinnerCount();
        if (objectiveWeight + aiWeight != 100) revert InvalidWeights();

        uint256 totalBps = 0;
        for (uint256 i = 0; i < payoutBps.length; i++) {
            totalBps += payoutBps[i];
        }
        if (totalBps != 10000) revert InvalidPrizeDistribution();

        // Lock prize pool
        if (prizeToken == address(0)) {
            if (msg.value < totalPrize) revert InsufficientPrizeEscrow();
        } else {
            IERC20(prizeToken).safeTransferFrom(msg.sender, address(this), totalPrize);
        }

        uint256 contestId = nextContestId++;
        MeritTypes.Contest storage c = contests[contestId];
        c.contestId = contestId;
        c.owner = msg.sender;
        c.title = title;
        c.description = description;
        c.startBlock = startBlock;
        c.endBlock = endBlock;
        c.prizeToken = prizeToken;
        c.totalPrize = totalPrize;
        c.winnerCount = winnerCount;
        c.payoutBps = payoutBps;
        c.objectiveWeight = objectiveWeight;
        c.aiWeight = aiWeight;
        c.status = block.number >= startBlock ? MeritTypes.ContestStatus.ACTIVE : MeritTypes.ContestStatus.DRAFT;
        c.rubricVersion = rubricVersion;
        c.rubricHash = rubricHash;
        c.requirements = requirements;

        emit ContestCreated(contestId, msg.sender, title, totalPrize, prizeToken);
        return contestId;
    }

    // Submission Logic
    function submitContestEntry(uint256 contestId, string calldata contentUrl) external nonReentrant returns (uint256) {
        MeritTypes.Contest storage c = contests[contestId];
        if (c.contestId == 0) revert ContestNotActive();
        if (block.number < c.startBlock || block.number > c.endBlock) revert ContestNotActive();
        
        bytes32 contentHash = keccak256(abi.encodePacked(contestId, contentUrl, msg.sender));
        if (usedContentHashes[contestId][contentHash]) revert DuplicateSubmission();
        usedContentHashes[contestId][contentHash] = true;

        uint256 submissionId = nextSubmissionId++;
        MeritTypes.Submission storage sub = submissions[submissionId];
        sub.submissionId = submissionId;
        sub.contestId = contestId;
        sub.submitter = msg.sender;
        sub.submissionBlock = block.number;
        sub.contentUrl = contentUrl;
        sub.contentHash = contentHash;
        sub.status = MeritTypes.SubmissionStatus.SUBMITTED;

        c.submissionCount++;
        contestSubmissionIds[contestId].push(submissionId);
        userProfiles[msg.sender].contestsEntered++;
        userProfiles[msg.sender].contributionsSubmitted++;

        emit SubmissionCreated(contestId, submissionId, msg.sender, contentUrl);
        emit SubmissionStatusChanged(submissionId, MeritTypes.SubmissionStatus.SUBMITTED);

        // Trigger Agent workflow
        if (meritAgent != address(0)) {
            IMeritAgent(meritAgent).triggerSubmissionWorkflow(submissionId);
        }

        return submissionId;
    }

    // Callback from Agent: Update submission state & requirements
    function updateSubmissionRequirements(
        uint256 submissionId,
        bool passed,
        uint256 objectiveScore,
        string calldata failureReason
    ) external onlyAgentOrOwner {
        MeritTypes.Submission storage sub = submissions[submissionId];
        require(sub.submissionId != 0, "Submission does not exist");

        sub.objectiveScore = objectiveScore;
        if (!passed) {
            sub.status = MeritTypes.SubmissionStatus.REQUIREMENTS_FAILED;
            sub.failureReason = failureReason;
            emit SubmissionStatusChanged(submissionId, MeritTypes.SubmissionStatus.REQUIREMENTS_FAILED);
        } else {
            sub.status = MeritTypes.SubmissionStatus.FETCHED;
            emit SubmissionStatusChanged(submissionId, MeritTypes.SubmissionStatus.FETCHED);
        }
    }

    // Callback from Agent: Record AI evaluation & update leaderboard & reputation
    function recordSubmissionScore(
        uint256 submissionId,
        uint256 aiScore,
        MeritTypes.AIScoreBreakdown calldata breakdown
    ) external onlyAgentOrOwner {
        MeritTypes.Submission storage sub = submissions[submissionId];
        require(sub.submissionId != 0, "Submission does not exist");
        require(sub.status != MeritTypes.SubmissionStatus.REQUIREMENTS_FAILED, "Cannot score failed requirements");

        MeritTypes.Contest storage c = contests[sub.contestId];

        sub.aiScore = aiScore > 100 ? 100 : aiScore;
        sub.aiBreakdown = breakdown;
        sub.finalScore = ScoreMath.calculateFinalScore(sub.objectiveScore, sub.aiScore, c.objectiveWeight, c.aiWeight);
        sub.status = MeritTypes.SubmissionStatus.SCORED;

        emit SubmissionStatusChanged(submissionId, MeritTypes.SubmissionStatus.SCORED);
        emit SubmissionScored(sub.contestId, submissionId, sub.submitter, sub.finalScore);

        // Update bounded leaderboard
        _updateLeaderboard(sub.contestId, sub);

        // Update submitter reputation
        uint256 reputationPoints = ScoreMath.calculateReputationAward(sub.finalScore);
        MeritTypes.UserProfile storage profile = userProfiles[sub.submitter];
        profile.reputation += reputationPoints;
        emit ReputationUpdated(sub.submitter, profile.reputation, reputationPoints);

        // Role eligibility check
        uint256 newRoleLevel = ScoreMath.getRoleLevel(profile.reputation);
        if (newRoleLevel > profile.roleLevel) {
            profile.roleLevel = newRoleLevel;
            string memory roleName = ScoreMath.getRoleName(newRoleLevel);
            emit RoleEligible(sub.submitter, newRoleLevel, roleName);

            // Mint / update soulbound NFT badge if MeritBadge set
            if (meritBadge != address(0)) {
                MeritBadge(meritBadge).mintBadge(sub.submitter, newRoleLevel, profile.reputation);
            }
        }
    }

    // Bounded Leaderboard Helper (Top N, max 20)
    function _updateLeaderboard(uint256 contestId, MeritTypes.Submission storage sub) internal {
        MeritTypes.Contest storage c = contests[contestId];
        MeritTypes.LeaderboardEntry[] storage board = contestLeaderboards[contestId];

        MeritTypes.LeaderboardEntry memory newEntry = MeritTypes.LeaderboardEntry({
            submissionId: sub.submissionId,
            submitter: sub.submitter,
            finalScore: sub.finalScore,
            objectiveScore: sub.objectiveScore,
            submissionBlock: sub.submissionBlock
        });

        // If board empty
        if (board.length == 0) {
            board.push(newEntry);
            return;
        }

        // Check if submitter already has an entry in leaderboard, keep best
        int256 existingIdx = -1;
        for (uint256 i = 0; i < board.length; i++) {
            if (board[i].submitter == sub.submitter) {
                existingIdx = int256(i);
                break;
            }
        }

        if (existingIdx >= 0) {
            uint256 idx = uint256(existingIdx);
            if (_isBetter(newEntry, board[idx])) {
                board[idx] = newEntry;
            }
        } else {
            if (board.length < c.winnerCount) {
                board.push(newEntry);
            } else if (_isBetter(newEntry, board[board.length - 1])) {
                board[board.length - 1] = newEntry;
            }
        }

        // Sort leaderboard descending
        for (uint256 i = 0; i < board.length; i++) {
            for (uint256 j = i + 1; j < board.length; j++) {
                if (_isBetter(board[j], board[i])) {
                    MeritTypes.LeaderboardEntry memory temp = board[i];
                    board[i] = board[j];
                    board[j] = temp;
                }
            }
        }
    }

    function _isBetter(MeritTypes.LeaderboardEntry memory a, MeritTypes.LeaderboardEntry memory b) internal pure returns (bool) {
        if (a.finalScore != b.finalScore) return a.finalScore > b.finalScore;
        if (a.objectiveScore != b.objectiveScore) return a.objectiveScore > b.objectiveScore;
        if (a.submissionBlock != b.submissionBlock) return a.submissionBlock < b.submissionBlock;
        return a.submissionId < b.submissionId;
    }

    // Contest Settlement
    function finalizeContest(uint256 contestId) external nonReentrant {
        MeritTypes.Contest storage c = contests[contestId];
        if (c.contestId == 0) revert ContestNotActive();
        if (c.finalized) revert ContestAlreadyFinalized();
        if (block.number <= c.endBlock && c.status != MeritTypes.ContestStatus.CLOSED) revert ContestNotEnded();

        c.finalized = true;
        c.status = MeritTypes.ContestStatus.FINALIZED;

        MeritTypes.LeaderboardEntry[] storage board = contestLeaderboards[contestId];
        uint256 winnersToPay = board.length < c.winnerCount ? board.length : c.winnerCount;
        uint256 totalDistributed = 0;

        for (uint256 i = 0; i < winnersToPay; i++) {
            uint256 payoutAmount = (c.totalPrize * c.payoutBps[i]) / 10000;
            if (payoutAmount > 0) {
                totalDistributed += payoutAmount;
                userProfiles[board[i].submitter].contestsWon++;

                if (c.prizeToken == address(0)) {
                    (bool sent, ) = payable(board[i].submitter).call{value: payoutAmount}("");
                    require(sent, "Native transfer failed");
                } else {
                    IERC20(c.prizeToken).safeTransfer(board[i].submitter, payoutAmount);
                }

                emit PrizePaid(contestId, board[i].submitter, payoutAmount, i + 1);
            }
        }

        emit ContestFinalized(contestId, winnersToPay, totalDistributed);
    }

    // View Functions
    function getContestLeaderboard(uint256 contestId) external view returns (MeritTypes.LeaderboardEntry[] memory) {
        return contestLeaderboards[contestId];
    }

    function getContestSubmissionIds(uint256 contestId) external view returns (uint256[] memory) {
        return contestSubmissionIds[contestId];
    }

    function getContestRequirements(uint256 contestId) external view returns (
        uint256 minWords,
        string[] memory requiredMentions,
        string[] memory requiredHashtags,
        string[] memory requiredKeywords,
        bool requiresMedia
    ) {
        MeritTypes.HardRequirements storage reqs = contests[contestId].requirements;
        return (reqs.minWords, reqs.requiredMentions, reqs.requiredHashtags, reqs.requiredKeywords, reqs.requiresMedia);
    }
}
