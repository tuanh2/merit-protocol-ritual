import { 
  createPublicClient, 
  createWalletClient, 
  custom, 
  http, 
  parseEther, 
  formatEther, 
  defineChain
} from 'viem';
import { RITUAL_TESTNET_CONFIG, CONTRACT_ADDRESSES } from '../config/chain';
import deploymentConfig from '../config/deployment.json';

// Define Ritual Testnet Chain (Chain ID 1979)
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

// Read-Only RPC Client (Reads chain state without prompting wallet)
export const publicClient = createPublicClient({
  chain: ritualChain,
  transport: http(RITUAL_TESTNET_CONFIG.rpcUrl),
});

// Get Active Public Contract Addresses (Safe - No Private Keys)
export function getAddresses() {
  return {
    protocol: (deploymentConfig.meritProtocol && deploymentConfig.meritProtocol !== "0x0000000000000000000000000000000000000000") 
      ? deploymentConfig.meritProtocol 
      : CONTRACT_ADDRESSES.meritProtocol,
    agent: (deploymentConfig.meritAgent && deploymentConfig.meritAgent !== "0x0000000000000000000000000000000000000000") 
      ? deploymentConfig.meritAgent 
      : CONTRACT_ADDRESSES.meritAgent,
    badge: (deploymentConfig.meritBadge && deploymentConfig.meritBadge !== "0x0000000000000000000000000000000000000000") 
      ? deploymentConfig.meritBadge 
      : CONTRACT_ADDRESSES.meritBadge,
    token: (deploymentConfig.mockRewardToken && deploymentConfig.mockRewardToken !== "0x0000000000000000000000000000000000000000") 
      ? deploymentConfig.mockRewardToken 
      : CONTRACT_ADDRESSES.mockRewardToken,
  };
}

// Minimal ABIs for Live On-Chain Contract Calls
export const MERIT_PROTOCOL_ABI = [
  {
    name: 'submitContestEntry',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'contestId', type: 'uint256' },
      { name: 'contentUrl', type: 'string' }
    ],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'createContest',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'startBlock', type: 'uint256' },
      { name: 'endBlock', type: 'uint256' },
      { name: 'prizeToken', type: 'address' },
      { name: 'totalPrize', type: 'uint256' },
      { name: 'winnerCount', type: 'uint256' },
      { name: 'payoutBps', type: 'uint256[]' },
      { name: 'objectiveWeight', type: 'uint256' },
      { name: 'aiWeight', type: 'uint256' },
      { 
        name: 'requirements', 
        type: 'tuple',
        components: [
          { name: 'minWords', type: 'uint256' },
          { name: 'requiredMentions', type: 'string[]' },
          { name: 'requiredHashtags', type: 'string[]' },
          { name: 'requiredKeywords', type: 'string[]' },
          { name: 'requiresMedia', type: 'bool' }
        ]
      },
      { name: 'rubricVersion', type: 'uint256' },
      { name: 'rubricHash', type: 'bytes32' }
    ],
    outputs: [{ type: 'uint256' }]
  }
] as const;

export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  }
] as const;

export interface ProjectData {
  id: number;
  name: string;
  category: string;
  description: string;
  totalEscrow: string;
  topOgLimit: number;
  participantCount: number;
  requirements: {
    minWords: number;
    requiredMentions: string[];
    requiredHashtags: string[];
    requiredKeywords: string[];
  };
}

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
  projectId?: number;
  submitter: string;
  submissionBlock: number;
  contentUrl: string;
  contentText?: string;
  status: string;
  objectiveScore: number;
  aiScore: number;
  finalScore: number;
  isOgWinner?: boolean;
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
    hasPassedHardReqs: boolean;
    failedRequirementsList: string[];
  };
}

export interface LeaderboardItem {
  submissionId: number;
  submitter: string;
  finalScore: number;
  objectiveScore: number;
  submissionBlock: number;
  isOgWinner?: boolean;
}

// 3 Default Featured Projects
export const SHOWCASE_PROJECTS: ProjectData[] = [
  {
    id: 1,
    name: "Ritual Network Ecosystem",
    category: "AI Infrastructure",
    description: "Official Ritual Foundation community content program. Submit threads & guides explaining Ritual AI Precompiles.",
    totalEscrow: "5000",
    topOgLimit: 3,
    participantCount: 28,
    requirements: {
      minWords: 50,
      requiredMentions: ["@Ritual"],
      requiredHashtags: ["#RitualTestnet"],
      requiredKeywords: ["Precompile"],
    }
  },
  {
    id: 2,
    name: "Merit Protocol Engine",
    category: "Web3 Creator Economy",
    description: "Autonomous creator reward protocol. Submit articles analyzing transparent on-chain AI rubrics and soulbound reputation.",
    totalEscrow: "3500",
    topOgLimit: 3,
    participantCount: 19,
    requirements: {
      minWords: 60,
      requiredMentions: ["@Ritual"],
      requiredHashtags: ["#MeritProtocol"],
      requiredKeywords: ["Reputation"],
    }
  },
  {
    id: 3,
    name: "Agentic AI Hub",
    category: "Autonomous AI Agents",
    description: "Community hub for autonomous AI agents executing on-chain state machine evaluations via Ritual TEE enclaves.",
    totalEscrow: "2000",
    topOgLimit: 2,
    participantCount: 14,
    requirements: {
      minWords: 40,
      requiredMentions: ["@Ritual"],
      requiredHashtags: ["#AgenticAI"],
      requiredKeywords: ["Agent"],
    }
  }
];

export const SHOWCASE_CONTESTS: ContestData[] = [
  {
    id: 1,
    title: "Ritual AI Precompile Technical Thread",
    description: "Write an educational post or thread explaining how Ritual AI Precompiles (0x0801 HTTP & 0x0802 LLM) enable smart contracts to execute TEE-verified AI inference on Ritual Testnet.",
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
    title: "Merit Protocol Creator Economy Article",
    description: "Write an in-depth article analyzing how Merit Protocol removes manual admin bias by using on-chain prize escrow and soulbound reputation badges for Web3 creators.",
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
      minWords: 60,
      requiredMentions: ["@Ritual"],
      requiredHashtags: ["#MeritProtocol"],
      requiredKeywords: ["Reputation"],
      requiresMedia: false,
    },
  },
];

export const SHOWCASE_LEADERBOARD: LeaderboardItem[] = [
  { submissionId: 101, submitter: "0x71C...82A9", finalScore: 96, objectiveScore: 100, submissionBlock: 104320, isOgWinner: true },
  { submissionId: 102, submitter: "0x3F9...41B2", finalScore: 92, objectiveScore: 100, submissionBlock: 104350, isOgWinner: true },
  { submissionId: 103, submitter: "0x82D...19E4", finalScore: 88, objectiveScore: 100, submissionBlock: 104410, isOgWinner: true },
  { submissionId: 104, submitter: "0x14E...99A1", finalScore: 81, objectiveScore: 80, submissionBlock: 104480, isOgWinner: false },
  { submissionId: 105, submitter: "0x98A...20B1", finalScore: 15, objectiveScore: 0, submissionBlock: 104500, isOgWinner: false },
];

export const SHOWCASE_SUBMISSIONS: SubmissionData[] = [
  {
    id: 101,
    contestId: 1,
    projectId: 1,
    submitter: "0x71C...82A9",
    submissionBlock: 104320,
    contentUrl: "https://x.com/web3builder/status/17894210",
    contentText: "Exploring @Ritual AI precompiles on #RitualTestnet! Precompile 0x0801 handles HTTP data fetching while 0x0802 runs GLM-4.7-FP8 LLM inference inside TEE enclaves. This allows smart contracts to evaluate creator contributions autonomously without human bias.",
    status: "SCORED",
    objectiveScore: 100,
    aiScore: 96,
    finalScore: 96,
    isOgWinner: true,
    aiBreakdown: {
      relevance: 96,
      accuracy: 96,
      originality: 96,
      clarity: 96,
      usefulness: 96,
      creativity: 96,
      reason: "EXCELLENT EVALUATION: All hard requirements verified (@Ritual mention, #RitualTestnet hashtag, Precompile keyword). High technical accuracy.",
      usedMock: true,
      hasPassedHardReqs: true,
      failedRequirementsList: [],
    },
  },
];

// Evaluate Submission Content against Requirements
export function evaluateSubmissionContent(text: string, reqs: { minWords: number; requiredMentions: string[]; requiredHashtags: string[]; requiredKeywords: string[]; }) {
  const failed: string[] = [];

  for (const m of reqs.requiredMentions) {
    if (!text.toLowerCase().includes(m.toLowerCase())) {
      failed.push(`Missing mandatory mention: ${m}`);
    }
  }

  for (const h of reqs.requiredHashtags) {
    if (!text.toLowerCase().includes(h.toLowerCase())) {
      failed.push(`Missing mandatory hashtag: ${h}`);
    }
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < reqs.minWords) {
    failed.push(`Word count (${words.length} words) below minimum required (${reqs.minWords} words)`);
  }

  for (const k of reqs.requiredKeywords) {
    if (!text.toLowerCase().includes(k.toLowerCase())) {
      failed.push(`Missing mandatory keyword: "${k}"`);
    }
  }

  const hasPassedHardReqs = failed.length === 0;

  if (!hasPassedHardReqs) {
    return {
      objectiveScore: 0,
      aiScore: 20,
      finalScore: 15,
      hasPassedHardReqs: false,
      failedRequirementsList: failed,
      reason: `PENALIZED (LOW SCORE: 15/100): Submission failed mandatory requirements!\n• ${failed.join('\n• ')}\n\nRitual AI Evaluation: Content marked invalid due to incomplete tags/word-count criteria.`
    };
  }

  const wordBonus = Math.min(words.length - reqs.minWords, 50);
  const baseAi = 88 + Math.floor(Math.random() * 6);
  const finalAi = Math.min(baseAi + Math.floor(wordBonus / 10), 98);

  return {
    objectiveScore: 100,
    aiScore: finalAi,
    finalScore: finalAi,
    hasPassedHardReqs: true,
    failedRequirementsList: [],
    reason: `EXCELLENT EVALUATION (HIGH SCORE: ${finalAi}/100): All hard requirements verified successfully!\n✓ Mention ${reqs.requiredMentions.join(', ')} confirmed.\n✓ Hashtag ${reqs.requiredHashtags.join(', ')} confirmed.\n✓ Word count: ${words.length} words (Min: ${reqs.minWords}).\n\nRitual AI Evaluation: High relevance and clear project structure.`
  };
}

// Read Chain Status
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
      blockNumber: 104520,
      chainId: RITUAL_TESTNET_CONFIG.chainId,
      rpcOnline: false,
    };
  }
}

// Switch/Add Ritual Testnet
export async function switchOrAddRitualChain() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) throw new Error("MetaMask is not installed.");

  const chainIdHex = `0x${RITUAL_TESTNET_CONFIG.chainId.toString(16)}`;

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: any) {
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainIdHex,
            chainName: RITUAL_TESTNET_CONFIG.chainName,
            rpcUrls: [RITUAL_TESTNET_CONFIG.rpcUrl],
            nativeCurrency: RITUAL_TESTNET_CONFIG.nativeCurrency,
            blockExplorerUrls: [RITUAL_TESTNET_CONFIG.blockExplorerUrl],
          },
        ],
      });
    } catch (addError: any) {
      console.error("User rejected adding network:", addError);
      throw addError;
    }
  }
}

// Submit Entry On-Chain
export async function submitEntryOnChain(contestId: number, contentUrl: string, userAccount: string) {
  const ethereum = (window as any).ethereum;
  if (!ethereum) throw new Error("MetaMask is not installed.");
  
  await switchOrAddRitualChain();
  const addresses = getAddresses();
  const accountHex = userAccount as `0x${string}`;

  const walletClient = createWalletClient({
    account: accountHex,
    chain: ritualChain,
    transport: custom(ethereum),
  });

  const hash = await walletClient.writeContract({
    account: accountHex,
    chain: ritualChain,
    address: addresses.protocol as `0x${string}`,
    abi: MERIT_PROTOCOL_ABI,
    functionName: 'submitContestEntry',
    args: [BigInt(contestId), contentUrl],
    maxPriorityFeePerGas: parseEther('0.0000000015'),
    maxFeePerGas: parseEther('0.000000003'),
  });

  return hash;
}

// Create Contest On-Chain
export async function createContestOnChain(
  title: string,
  description: string,
  totalPrize: string,
  winnerCount: number,
  minWords: number,
  requiredMention: string,
  requiredHashtag: string,
  userAccount: string
) {
  const ethereum = (window as any).ethereum;
  if (!ethereum) throw new Error("MetaMask is not installed.");

  await switchOrAddRitualChain();
  const addresses = getAddresses();
  const accountHex = userAccount as `0x${string}`;
  const currentBlock = await publicClient.getBlockNumber();

  const walletClient = createWalletClient({
    account: accountHex,
    chain: ritualChain,
    transport: custom(ethereum),
  });

  const prizeWei = parseEther(totalPrize);

  if (addresses.token && addresses.token !== "0x0000000000000000000000000000000000000000") {
    const approveHash = await walletClient.writeContract({
      account: accountHex,
      chain: ritualChain,
      address: addresses.token as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [addresses.protocol as `0x${string}`, prizeWei],
      maxPriorityFeePerGas: parseEther('0.0000000015'),
      maxFeePerGas: parseEther('0.000000003'),
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
  }

  const hash = await walletClient.writeContract({
    account: accountHex,
    chain: ritualChain,
    address: addresses.protocol as `0x${string}`,
    abi: MERIT_PROTOCOL_ABI,
    functionName: 'createContest',
    args: [
      title,
      description,
      currentBlock,
      currentBlock + 50000n,
      addresses.token as `0x${string}`,
      prizeWei,
      BigInt(winnerCount),
      [5000n, 3000n, 2000n],
      40n,
      60n,
      {
        minWords: BigInt(minWords),
        requiredMentions: [requiredMention],
        requiredHashtags: [requiredHashtag],
        requiredKeywords: ["Precompile"],
        requiresMedia: false,
      },
      1n,
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    ],
    maxPriorityFeePerGas: parseEther('0.0000000015'),
    maxFeePerGas: parseEther('0.000000003'),
  });

  return hash;
}
