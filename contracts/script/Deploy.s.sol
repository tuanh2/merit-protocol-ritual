// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MeritProtocol.sol";
import "../src/MeritAgent.sol";
import "../src/MeritBadge.sol";
import "../src/MockRewardToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying Merit Protocol to Ritual Testnet (Chain ID 1979)");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy MeritBadge
        MeritBadge badge = new MeritBadge(deployer);
        console.log("MeritBadge deployed at:", address(badge));

        // 2. Deploy MockRewardToken
        MockRewardToken token = new MockRewardToken("Merit Token", "MERIT", deployer);
        console.log("MockRewardToken deployed at:", address(token));

        // 3. Deploy MeritProtocol
        MeritProtocol protocol = new MeritProtocol(deployer);
        console.log("MeritProtocol deployed at:", address(protocol));

        // 4. Deploy MeritAgent
        MeritAgent agent = new MeritAgent(deployer);
        console.log("MeritAgent deployed at:", address(agent));

        // 5. Link contracts
        protocol.setMeritAgent(address(agent));
        protocol.setMeritBadge(address(badge));
        agent.setMeritProtocol(address(protocol));
        badge.setMeritProtocol(address(protocol));

        // 6. Enable Mock Mode by default for testnet resilience
        protocol.setMockMode(true);

        // 7. Create initial showcase contest
        token.approve(address(protocol), type(uint256).max);

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
        payoutBps[0] = 5000;
        payoutBps[1] = 3000;
        payoutBps[2] = 2000;

        uint256 showcaseContestId = protocol.createContest(
            "Explain Ritual AI Precompiles",
            "Create a guide or tutorial explaining Ritual AI Precompiles (0x0801 & 0x0802). Requirements: include @Ritual, mention #RitualTestnet, and keyword 'Precompile'.",
            block.number,
            block.number + 50000,
            address(token),
            1000 * 10**18,
            3,
            payoutBps,
            40,
            60,
            reqs,
            1,
            bytes32(uint256(1))
        );

        console.log("Showcase contest created with ID:", showcaseContestId);

        vm.stopBroadcast();
    }
}
