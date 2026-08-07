// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MeritTypes {
    enum SubmissionStatus {
        NONE,
        SUBMITTED,
        FETCH_SCHEDULED,
        FETCHING,
        FETCHED,
        REQUIREMENTS_FAILED,
        AI_SCHEDULED,
        EVALUATING,
        SCORED,
        FAILED
    }

    enum ContestStatus {
        DRAFT,
        ACTIVE,
        CLOSED,
        FINALIZING,
        FINALIZED,
        CANCELLED
    }

    struct HardRequirements {
        uint256 minWords;
        string[] requiredMentions;
        string[] requiredHashtags;
        string[] requiredKeywords;
        bool requiresMedia;
    }

    struct AIScoreBreakdown {
        uint256 relevance;
        uint256 accuracy;
        uint256 originality;
        uint256 clarity;
        uint256 usefulness;
        uint256 creativity;
        uint256 overallScore;
        string reason;
        bool usedMock;
    }

    struct Submission {
        uint256 submissionId;
        uint256 contestId;
        address submitter;
        uint256 submissionBlock;
        string contentUrl;
        bytes32 contentHash;
        SubmissionStatus status;
        uint256 objectiveScore;
        uint256 aiScore;
        uint256 finalScore;
        AIScoreBreakdown aiBreakdown;
        string failureReason;
    }

    struct Contest {
        uint256 contestId;
        address owner;
        string title;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        address prizeToken;
        uint256 totalPrize;
        uint256 winnerCount;
        uint256[] payoutBps;
        uint256 submissionCount;
        ContestStatus status;
        uint256 objectiveWeight;
        uint256 aiWeight;
        bool finalized;
        uint256 rubricVersion;
        bytes32 rubricHash;
        HardRequirements requirements;
    }

    struct LeaderboardEntry {
        uint256 submissionId;
        address submitter;
        uint256 finalScore;
        uint256 objectiveScore;
        uint256 submissionBlock;
    }

    struct UserProfile {
        uint256 reputation;
        uint256 roleLevel;
        uint256 contributionsSubmitted;
        uint256 contestsEntered;
        uint256 contestsWon;
    }

    struct StorageRef {
        string platform;
        string path;
        string keyRef;
    }
}
