// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MeritProtocol.sol";
import "../src/MeritAgent.sol";
import "../src/MeritBadge.sol";
import "../src/MockRewardToken.sol";
import "./mocks/MockHTTPPrecompile.sol";
import "./mocks/MockLLMPrecompile.sol";
import "./mocks/MockScheduler.sol";

contract MeritProtocolTest is Test {
    MeritProtocol public protocol;
    MeritAgent public agent;
    MeritBadge public badge;
    MockRewardToken public prizeToken;

    address public owner = address(100);
    address public creator1 = address(1);
    address public creator2 = address(2);
    address public creator3 = address(3);

    address constant HTTP_PRECOMPILE = 0x0000000000000000000000000000000000000801;
    address constant LLM_PRECOMPILE = 0x0000000000000000000000000000000000000802;
    address constant SCHEDULER = 0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B;

    function setUp() public {
        vm.startPrank(owner);

        // Etch mock runtime code at system addresses
        vm.etch(HTTP_PRECOMPILE, address(new MockHTTPPrecompile()).code);
        vm.etch(LLM_PRECOMPILE, address(new MockLLMPrecompile()).code);
        vm.etch(SCHEDULER, address(new MockScheduler()).code);

        // Deploy contracts
        badge = new MeritBadge(owner);
        protocol = new MeritProtocol(owner);
        agent = new MeritAgent(owner);
        prizeToken = new MockRewardToken("Merit Test Token", "MTT", owner);

        // Link contracts
        protocol.setMeritAgent(address(agent));
        protocol.setMeritBadge(address(badge));
        agent.setMeritProtocol(address(protocol));
        badge.setMeritProtocol(address(protocol));

        // Mint prize tokens to creator1 for contest creation
        prizeToken.mint(owner, 100_000 * 10**18);
        prizeToken.approve(address(protocol), type(uint256).max);

        vm.stopPrank();
    }

    function test_CreateContest_Success() public {
        vm.startPrank(owner);

        string[] memory mentions = new string[](1);
        mentions[0] = "@Ritual";
        string[] memory hashtags = new string[](1);
        hashtags[0] = "#RitualTestnet";
        string[] memory keywords = new string[](1);
        keywords[0] = "Precompile";

        MeritTypes.HardRequirements memory reqs = MeritTypes.HardRequirements({
            minWords: 5,
            requiredMentions: mentions,
            requiredHashtags: hashtags,
            requiredKeywords: keywords,
            requiresMedia: false
        });

        uint256[] memory payoutBps = new uint256[](3);
        payoutBps[0] = 5000; // 50%
        payoutBps[1] = 3000; // 30%
        payoutBps[2] = 2000; // 20%

        uint256 contestId = protocol.createContest(
            "Explain Ritual AI Precompiles",
            "Explain how precompiles work on Ritual Testnet.",
            block.number,
            block.number + 1000,
            address(prizeToken),
            1000 * 10**18,
            3,
            payoutBps,
            40,
            60,
            reqs,
            1,
            bytes32(uint256(1))
        );

        assertEq(contestId, 1);
        assertEq(prizeToken.balanceOf(address(protocol)), 1000 * 10**18);

        vm.stopPrank();
    }

    function test_CreateContest_InvalidPayoutDistribution_Reverts() public {
        vm.startPrank(owner);

        string[] memory empty = new string[](0);
        MeritTypes.HardRequirements memory reqs = MeritTypes.HardRequirements(0, empty, empty, empty, false);

        uint256[] memory badBps = new uint256[](2);
        badBps[0] = 5000;
        badBps[1] = 4000; // Total 9000 != 10000

        vm.expectRevert(MeritProtocol.InvalidPrizeDistribution.selector);
        protocol.createContest(
            "Bad Contest",
            "Desc",
            block.number,
            block.number + 100,
            address(prizeToken),
            500 * 10**18,
            2,
            badBps,
            50,
            50,
            reqs,
            1,
            bytes32(0)
        );

        vm.stopPrank();
    }

    function test_Submission_MockMode_FlowAndLeaderboard() public {
        uint256 contestId = _createSampleContest();

        // Submit creator 1
        vm.startPrank(creator1);
        string memory content1 = "Explain @Ritual AI Precompile on #RitualTestnet with high quality video content.";
        uint256 sub1 = protocol.submitContestEntry(contestId, content1);
        assertEq(sub1, 1);
        vm.stopPrank();

        // Submit creator 2
        vm.startPrank(creator2);
        string memory content2 = "Deep dive into @Ritual precompiles for #RitualTestnet smart contract evaluation.";
        uint256 sub2 = protocol.submitContestEntry(contestId, content2);
        assertEq(sub2, 2);
        vm.stopPrank();

        // Verify Leaderboard populated
        MeritTypes.LeaderboardEntry[] memory board = protocol.getContestLeaderboard(contestId);
        assertEq(board.length, 2);
        assertTrue(board[0].finalScore >= board[1].finalScore);

        // Check Reputation updated for creator1
        (uint256 rep1, uint256 role1, , , ) = protocol.userProfiles(creator1);
        assertTrue(rep1 > 0);
        assertEq(role1, 0); // Newcomer or Contributor based on score
    }

    function test_DuplicateSubmission_Reverts() public {
        uint256 contestId = _createSampleContest();

        vm.startPrank(creator1);
        string memory content = "Explain @Ritual AI Precompile on #RitualTestnet with video.";
        protocol.submitContestEntry(contestId, content);

        vm.expectRevert(MeritProtocol.DuplicateSubmission.selector);
        protocol.submitContestEntry(contestId, content);
        vm.stopPrank();
    }

    function test_RequirementFailure_SetsStatusFailed() public {
        uint256 contestId = _createSampleContest();

        vm.startPrank(creator1);
        // Missing @Ritual mention
        string memory badContent = "Missing mention on #RitualTestnet Precompile.";
        uint256 subId = protocol.submitContestEntry(contestId, badContent);

        (,,,,,, MeritTypes.SubmissionStatus status,,,, string memory reason) = protocol.submissions(subId);
        assertEq(uint8(status), uint8(MeritTypes.SubmissionStatus.REQUIREMENTS_FAILED));
        assertEq(reason, "MISSING_MENTION: @Ritual");
        vm.stopPrank();
    }

    function test_ContestFinalization_Payout() public {
        uint256 contestId = _createSampleContest();

        // Creator 1 submits
        vm.prank(creator1);
        protocol.submitContestEntry(contestId, "Explain @Ritual AI Precompile on #RitualTestnet with video media.");

        // Creator 2 submits
        vm.prank(creator2);
        protocol.submitContestEntry(contestId, "Overview of @Ritual AI Precompile for #RitualTestnet builders.");

        // Warp past end block
        vm.roll(block.number + 1001);

        uint256 c1BalanceBefore = prizeToken.balanceOf(creator1);
        uint256 c2BalanceBefore = prizeToken.balanceOf(creator2);

        // Finalize contest
        protocol.finalizeContest(contestId);

        uint256 c1BalanceAfter = prizeToken.balanceOf(creator1);
        uint256 c2BalanceAfter = prizeToken.balanceOf(creator2);

        assertTrue(c1BalanceAfter > c1BalanceBefore || c2BalanceAfter > c2BalanceBefore);

        // Verify cannot finalize twice
        vm.expectRevert(MeritProtocol.ContestAlreadyFinalized.selector);
        protocol.finalizeContest(contestId);
    }

    function test_SoulboundMeritBadge_CannotBeTransferred() public {
        vm.startPrank(owner);
        badge.mintBadge(creator1, 1, 150);
        assertEq(badge.ownerOf(1), creator1);
        vm.stopPrank();

        vm.startPrank(creator1);
        vm.expectRevert(MeritBadge.SoulboundTokenCannotBeTransferred.selector);
        badge.transferFrom(creator1, creator2, 1);
        vm.stopPrank();
    }

    function testFuzz_FinalScoreAlwaysBounded(uint256 obj, uint256 ai, uint256 objWeight) public {
        vm.assume(obj <= 100 && ai <= 100 && objWeight <= 100);
        uint256 aiWeight = 100 - objWeight;
        uint256 finalScore = ScoreMath.calculateFinalScore(obj, ai, objWeight, aiWeight);
        assertTrue(finalScore <= 100);
    }

    function _createSampleContest() internal returns (uint256) {
        vm.startPrank(owner);

        string[] memory mentions = new string[](1);
        mentions[0] = "@Ritual";
        string[] memory hashtags = new string[](1);
        hashtags[0] = "#RitualTestnet";
        string[] memory keywords = new string[](1);
        keywords[0] = "Precompile";

        MeritTypes.HardRequirements memory reqs = MeritTypes.HardRequirements({
            minWords: 3,
            requiredMentions: mentions,
            requiredHashtags: hashtags,
            requiredKeywords: keywords,
            requiresMedia: false
        });

        uint256[] memory payoutBps = new uint256[](2);
        payoutBps[0] = 6000;
        payoutBps[1] = 4000;

        uint256 contestId = protocol.createContest(
            "Ritual AI Precompile Contest",
            "Create a guide for Ritual AI Precompiles.",
            block.number,
            block.number + 500,
            address(prizeToken),
            1000 * 10**18,
            2,
            payoutBps,
            50,
            50,
            reqs,
            1,
            bytes32(0)
        );

        vm.stopPrank();
        return contestId;
    }
}
