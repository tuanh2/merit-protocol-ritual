import { createPublicClient, createWalletClient, custom, http, parseEther, formatEther, defineChain } from 'viem';
import { RITUAL_TESTNET_CONFIG, CONTRACT_ADDRESSES } from '../config/chain';
import deploymentConfig from '../config/deployment.json';

export const ritualChain = defineChain({
  id: RITUAL_TESTNET_CONFIG.chainId,
  name: RITUAL_TESTNET_CONFIG.chainName,
  nativeCurrency: RITUAL_TESTNET_CONFIG.nativeCurrency,
  rpcUrls: {
    default: { http: [RITUAL_TESTNET_CONFIG.rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'Ritual Explorer', url: RITUAL_TESTNET_CONFIG.blockExplorerUrl },
  },
});

export const publicClient = createPublicClient({
  chain: ritualChain,
  transport: http(RITUAL_TESTNET_CONFIG.rpcUrl),
});

export interface ContestData {
  id: number;
  title: string;
  description: string;
  startBlock: number;
  endBlock: number;
  prizeToken: string;
  totalPrize: string;
  winnerCount: number;
  payoutBps: number[];
  submissionCount: number;
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'FINALIZED';
  objectiveWeight: number;
  aiWeight: number;
  requirements: {
    minWords: number;
    requiredMentions: string[];
    requiredHashtags: string[];
    requiredKeywords: string[];
    requiresMedia: boolean;
  };
}

export interface SubmissionData {
  id: number;
  contestId: number;
  submitter: string;
  submissionBlock: number;
  contentUrl: string;
  status: string;
  objectiveScore: number;
  aiScore: number;
  finalScore: number;
  failureReason?: string;
  aiBreakdown?: {
    relevance: number;
    accuracy: number;
    originality: number;
    clarity: number;
    usefulness: number;
    creativity: number;
    reason: string;
    usedMock: boolean;
  };
}

export interface LeaderboardItem {
  submissionId: number;
  submitter: string;
  finalScore: number;
  objectiveScore: number;
  submissionBlock: number;
}

export interface UserProfileData {
  reputation: number;
  roleLevel: number;
  roleName: string;
  contributionsSubmitted: number;
  contestsEntered: number;
  contestsWon: number;
}

// Showcase Initial Demo Data for Instant Interactive Exploration
export const SHOWCASE_CONTESTS: ContestData[] = [
  {
    id: 1,
    title: "Explain Ritual AI Precompiles",
    description: "Create an educational thread, guide, or video explaining how Ritual AI Precompiles (0x0801 HTTP & 0x0802 LLM) enable smart contracts to execute TEE-verified inference on Ritual Testnet.",
    startBlock: 104200,
    endBlock: 154200,
    prizeToken: "0xMERIT",
    totalPrize: "1000",
    winnerCount: 3,
    payoutBps: [5000, 3000, 2000],
    submissionCount: 14,
    status: "ACTIVE",
    objectiveWeight: 40,
    aiWeight: 60,
    requirements: {
      minWords: 50,
      requiredMentions: ["@Ritual"],
      requiredHashtags: ["#RitualTestnet"],
      requiredKeywords: ["Precompile"],
      requiresMedia: false,
    },
  },
  {
    id: 2,
    title: "Autonomous Agent Architecture Showcase",
    description: "Build or design a multi-block autonomous agent workflow utilizing Ritual Scheduler and TEE verification. Demonstrate transparent on-chain decision making.",
    startBlock: 102000,
    endBlock: 162000,
    prizeToken: "0xMERIT",
    totalPrize: "2500",
    winnerCount: 4,
    payoutBps: [4000, 2500, 2000, 1500],
    submissionCount: 8,
    status: "ACTIVE",
    objectiveWeight: 30,
    aiWeight: 70,
    requirements: {
      minWords: 100,
      requiredMentions: ["@Ritual"],
      requiredHashtags: ["#RitualAgent"],
      requiredKeywords: ["Scheduler", "TEE"],
      requiresMedia: true,
    },
  },
];

export const SHOWCASE_LEADERBOARD: LeaderboardItem[] = [
  { submissionId: 101, submitter: "0x71C...82A9", finalScore: 93, objectiveScore: 100, submissionBlock: 104320 },
  { submissionId: 102, submitter: "0x3F9...41B2", finalScore: 89, objectiveScore: 100, submissionBlock: 104350 },
  { submissionId: 103, submitter: "0x82D...19E4", finalScore: 86, objectiveScore: 100, submissionBlock: 104410 },
  { submissionId: 104, submitter: "0x14E...99A1", finalScore: 81, objectiveScore: 80, submissionBlock: 104480 },
];

export const SHOWCASE_SUBMISSIONS: SubmissionData[] = [
  {
    id: 101,
    contestId: 1,
    submitter: "0x71C...82A9",
    submissionBlock: 104320,
    contentUrl: "https://x.com/web3builder/status/17894210",
    status: "SCORED",
    objectiveScore: 100,
    aiScore: 88,
    finalScore: 93,
    aiBreakdown: {
      relevance: 95,
      accuracy: 92,
      originality: 88,
      clarity: 96,
      usefulness: 90,
      creativity: 85,
      reason: "Outstanding explanation of HTTP (0x0801) and LLM (0x0802) precompiles. Technical accuracy is top tier.",
      usedMock: true,
    },
  },
];

export async function fetchChainStatus() {
  try {
    const blockNumber = await publicClient.getBlockNumber();
    return {
      blockNumber: Number(blockNumber),
      chainId: RITUAL_TESTNET_CONFIG.chainId,
      rpcOnline: true,
    };
  } catch (e) {
    return {
      blockNumber: 104500,
      chainId: RITUAL_TESTNET_CONFIG.chainId,
      rpcOnline: false,
    };
  }
}

export function getAddresses() {
  return {
    protocol: deploymentConfig.meritProtocol || CONTRACT_ADDRESSES.meritProtocol,
    agent: deploymentConfig.meritAgent || CONTRACT_ADDRESSES.meritAgent,
    badge: deploymentConfig.meritBadge || CONTRACT_ADDRESSES.meritBadge,
    token: deploymentConfig.mockRewardToken || CONTRACT_ADDRESSES.mockRewardToken,
  };
}
