// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ScoreMath {
    uint256 public constant BASE_REPUTATION_POINTS = 10;
    uint256 public constant SCORE_MULTIPLIER = 1;

    function calculateFinalScore(
        uint256 objectiveScore,
        uint256 aiScore,
        uint256 objectiveWeight,
        uint256 aiWeight
    ) internal pure returns (uint256) {
        require(objectiveWeight + aiWeight == 100, "Weights must sum to 100");
        if (objectiveScore > 100) objectiveScore = 100;
        if (aiScore > 100) aiScore = 100;
        return (objectiveScore * objectiveWeight + aiScore * aiWeight) / 100;
    }

    function calculateReputationAward(uint256 finalScore) internal pure returns (uint256) {
        return BASE_REPUTATION_POINTS + (finalScore * SCORE_MULTIPLIER);
    }

    function getRoleLevel(uint256 reputation) internal pure returns (uint256) {
        if (reputation >= 1000) return 4; // OG Contributor
        if (reputation >= 500) return 3;  // Core Contributor
        if (reputation >= 250) return 2;  // Verified Contributor
        if (reputation >= 100) return 1;  // Contributor
        return 0;                         // Newcomer
    }

    function getRoleName(uint256 roleLevel) internal pure returns (string memory) {
        if (roleLevel == 4) return "OG Contributor";
        if (roleLevel == 3) return "Core Contributor";
        if (roleLevel == 2) return "Verified Contributor";
        if (roleLevel == 1) return "Contributor";
        return "Newcomer";
    }
}
