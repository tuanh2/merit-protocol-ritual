const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Merit Protocol Comprehensive Test Suite", function () {
  let owner, creator1, creator2, creator3;
  let badge, token, protocol, agent;

  beforeEach(async function () {
    [owner, creator1, creator2, creator3] = await ethers.getSigners();

    // Deploy contracts
    const MeritBadge = await ethers.getContractFactory("MeritBadge");
    badge = await MeritBadge.deploy(owner.address);

    const MockRewardToken = await ethers.getContractFactory("MockRewardToken");
    token = await MockRewardToken.deploy("Merit Token", "MERIT", owner.address);

    const MeritProtocol = await ethers.getContractFactory("MeritProtocol");
    protocol = await MeritProtocol.deploy(owner.address);

    const MeritAgent = await ethers.getContractFactory("MeritAgent");
    agent = await MeritAgent.deploy(owner.address);

    // Link contracts
    await protocol.setMeritAgent(await agent.getAddress());
    await protocol.setMeritBadge(await badge.getAddress());
    await agent.setMeritProtocol(await protocol.getAddress());
    await badge.setMeritProtocol(await protocol.getAddress());
    await protocol.setMockMode(true);

    // Mint tokens to owner & approve protocol
    await token.mint(owner.address, ethers.parseEther("100000"));
    await token.approve(await protocol.getAddress(), ethers.MaxUint256);
  });

  describe("Contest Creation & Escrow", function () {
    it("should create contest and lock ERC20 prize pool", async function () {
      const currentBlock = await ethers.provider.getBlockNumber();
      const prizeAmount = ethers.parseEther("1000");

      const reqs = {
        minWords: 3,
        requiredMentions: ["@Ritual"],
        requiredHashtags: ["#RitualTestnet"],
        requiredKeywords: ["Precompile"],
        requiresMedia: false,
      };

      const tx = await protocol.createContest(
        "Explain Ritual AI Precompiles",
        "Tutorial on Ritual AI Precompiles",
        currentBlock,
        currentBlock + 1000,
        await token.getAddress(),
        prizeAmount,
        3,
        [5000, 3000, 2000],
        40,
        60,
        reqs,
        1,
        ethers.id("rubric-v1")
      );

      await tx.wait();
      const contest = await protocol.contests(1);
      expect(contest.title).to.equal("Explain Ritual AI Precompiles");
      expect(contest.totalPrize).to.equal(prizeAmount);

      const contractBalance = await token.balanceOf(await protocol.getAddress());
      expect(contractBalance).to.equal(prizeAmount);
    });

    it("should reject invalid prize payout distribution (sum != 10000)", async function () {
      const currentBlock = await ethers.provider.getBlockNumber();
      const reqs = { minWords: 0, requiredMentions: [], requiredHashtags: [], requiredKeywords: [], requiresMedia: false };

      await expect(
        protocol.createContest(
          "Bad Contest",
          "Desc",
          currentBlock,
          currentBlock + 100,
          await token.getAddress(),
          ethers.parseEther("100"),
          2,
          [5000, 4000], // Sum = 9000 != 10000
          50,
          50,
          reqs,
          1,
          ethers.ZeroHash
        )
      ).to.be.revertedWithCustomError(protocol, "InvalidPrizeDistribution");
    });
  });

  describe("Submissions, Requirements & Evaluation", function () {
    let contestId;

    beforeEach(async function () {
      const currentBlock = await ethers.provider.getBlockNumber();
      const reqs = {
        minWords: 3,
        requiredMentions: ["@Ritual"],
        requiredHashtags: ["#RitualTestnet"],
        requiredKeywords: ["Precompile"],
        requiresMedia: false,
      };

      await protocol.createContest(
        "AI Contest",
        "Desc",
        currentBlock,
        currentBlock + 1000,
        await token.getAddress(),
        ethers.parseEther("1000"),
        2,
        [6000, 4000],
        50,
        50,
        reqs,
        1,
        ethers.ZeroHash
      );
      contestId = 1;
    });

    it("should accept valid submission, calculate score, and update leaderboard", async function () {
      const content = "Deep dive into @Ritual AI Precompile for #RitualTestnet smart contracts.";
      
      await protocol.connect(creator1).submitContestEntry(contestId, content);

      const sub = await protocol.submissions(1);
      expect(sub.submitter).to.equal(creator1.address);
      expect(sub.status).to.equal(8); // SCORED

      const leaderboard = await protocol.getContestLeaderboard(contestId);
      expect(leaderboard.length).to.equal(1);
      expect(leaderboard[0].submitter).to.equal(creator1.address);

      const profile = await protocol.userProfiles(creator1.address);
      expect(profile.reputation).to.be.greaterThan(0);
    });

    it("should reject duplicate content submission by same creator", async function () {
      const content = "Deep dive into @Ritual AI Precompile for #RitualTestnet smart contracts.";
      await protocol.connect(creator1).submitContestEntry(contestId, content);

      await expect(
        protocol.connect(creator1).submitContestEntry(contestId, content)
      ).to.be.revertedWithCustomError(protocol, "DuplicateSubmission");
    });

    it("should mark submission failed if mandatory mention is missing", async function () {
      const badContent = "Missing mention on #RitualTestnet Precompile.";
      await protocol.connect(creator1).submitContestEntry(contestId, badContent);

      const sub = await protocol.submissions(1);
      expect(sub.status).to.equal(5); // REQUIREMENTS_FAILED
      expect(sub.failureReason).to.equal("MISSING_MENTION: @Ritual");
    });
  });

  describe("Contest Finalization & Reward Settlement", function () {
    it("should finalize contest and distribute locked rewards according to basis points", async function () {
      const currentBlock = await ethers.provider.getBlockNumber();
      const reqs = { minWords: 1, requiredMentions: ["@Ritual"], requiredHashtags: ["#RitualTestnet"], requiredKeywords: [], requiresMedia: false };
      const prizeAmount = ethers.parseEther("1000");

      await protocol.createContest(
        "Finalization Test",
        "Desc",
        currentBlock,
        currentBlock + 10,
        await token.getAddress(),
        prizeAmount,
        2,
        [6000, 4000],
        50,
        50,
        reqs,
        1,
        ethers.ZeroHash
      );

      await protocol.connect(creator1).submitContestEntry(1, "Guide for @Ritual on #RitualTestnet.");
      await protocol.connect(creator2).submitContestEntry(1, "Tutorial on @Ritual for #RitualTestnet.");

      // Fast forward past contest end block
      await ethers.provider.send("hardhat_mine", ["0x10"]);

      const c1BalanceBefore = await token.balanceOf(creator1.address);
      const c2BalanceBefore = await token.balanceOf(creator2.address);

      await protocol.finalizeContest(1);

      const c1BalanceAfter = await token.balanceOf(creator1.address);
      const c2BalanceAfter = await token.balanceOf(creator2.address);

      const totalPayout = (c1BalanceAfter - c1BalanceBefore) + (c2BalanceAfter - c2BalanceBefore);
      expect(totalPayout).to.equal(prizeAmount);

      const contest = await protocol.contests(1);
      expect(contest.finalized).to.be.true;
    });
  });

  describe("Soulbound MeritBadge NFT", function () {
    it("should enforce non-transferability for MeritBadge NFT", async function () {
      await badge.mintBadge(creator1.address, 1, 150);
      expect(await badge.ownerOf(1)).to.equal(creator1.address);

      await expect(
        badge.connect(creator1).transferFrom(creator1.address, creator2.address, 1)
      ).to.be.revertedWithCustomError(badge, "SoulboundTokenCannotBeTransferred");
    });
  });
});
