const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Merit Protocol with deployer:", deployer ? deployer.address : "No signer configured");

  if (!deployer) {
    console.error("Please configure PRIVATE_KEY in .env file before running deployment.");
    return;
  }

  // Mandatory priority fee >= 1 gwei
  const overrideOptions = {
    maxPriorityFeePerGas: hre.ethers.parseUnits("1.5", "gwei"),
    maxFeePerGas: hre.ethers.parseUnits("3.0", "gwei"),
  };

  console.log("1. Deploying MeritBadge...");
  const MeritBadge = await hre.ethers.getContractFactory("MeritBadge");
  const badge = await MeritBadge.deploy(deployer.address, overrideOptions);
  await badge.waitForDeployment();
  const badgeAddress = await badge.getAddress();
  console.log("MeritBadge deployed to:", badgeAddress);

  console.log("2. Deploying MockRewardToken...");
  const MockRewardToken = await hre.ethers.getContractFactory("MockRewardToken");
  const token = await MockRewardToken.deploy("Merit Token", "MERIT", deployer.address, overrideOptions);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("MockRewardToken deployed to:", tokenAddress);

  console.log("3. Deploying MeritProtocol...");
  const MeritProtocol = await hre.ethers.getContractFactory("MeritProtocol");
  const protocol = await MeritProtocol.deploy(deployer.address, overrideOptions);
  await protocol.waitForDeployment();
  const protocolAddress = await protocol.getAddress();
  console.log("MeritProtocol deployed to:", protocolAddress);

  console.log("4. Deploying MeritAgent...");
  const MeritAgent = await hre.ethers.getContractFactory("MeritAgent");
  const agent = await MeritAgent.deploy(deployer.address, overrideOptions);
  await agent.waitForDeployment();
  const agentAddress = await agent.getAddress();
  console.log("MeritAgent deployed to:", agentAddress);

  console.log("5. Linking contracts...");
  await (await protocol.setMeritAgent(agentAddress, overrideOptions)).wait();
  await (await protocol.setMeritBadge(badgeAddress, overrideOptions)).wait();
  await (await agent.setMeritProtocol(protocolAddress, overrideOptions)).wait();
  await (await badge.setMeritProtocol(protocolAddress, overrideOptions)).wait();
  await (await protocol.setMockMode(true, overrideOptions)).wait();
  console.log("Contracts linked successfully!");

  console.log("6. Creating Showcase Contest...");
  const prizeAmount = hre.ethers.parseEther("1000");
  await (await token.approve(protocolAddress, prizeAmount, overrideOptions)).wait();

  const currentBlock = await hre.ethers.provider.getBlockNumber();
  const reqs = {
    minWords: 5,
    requiredMentions: ["@Ritual"],
    requiredHashtags: ["#RitualTestnet"],
    requiredKeywords: ["Precompile"],
    requiresMedia: false,
  };

  const tx = await protocol.createContest(
    "Explain Ritual AI Precompiles",
    "Create a guide explaining Ritual AI Precompiles (0x0801 & 0x0802). Requirements: include @Ritual, hashtag #RitualTestnet, keyword 'Precompile'.",
    currentBlock,
    currentBlock + 10000000,
    tokenAddress,
    prizeAmount,
    3,
    [5000, 3000, 2000],
    40,
    60,
    reqs,
    1,
    hre.ethers.id("rubric-v1"),
    overrideOptions
  );
  await tx.wait();
  console.log("Showcase contest created successfully!");

  // Save metadata to deployment.json
  const deploymentData = {
    chainId: 1979,
    meritProtocol: protocolAddress,
    meritAgent: agentAddress,
    meritBadge: badgeAddress,
    mockRewardToken: tokenAddress,
    scheduler: "0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B",
    ritualWallet: "0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948",
    httpPrecompile: "0x0000000000000000000000000000000000000801",
    llmPrecompile: "0x0000000000000000000000000000000000000802",
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "../../frontend/src/config");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outDir, "deployment.json"), JSON.stringify(deploymentData, null, 2));
  console.log("Saved deployment config to frontend/src/config/deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
