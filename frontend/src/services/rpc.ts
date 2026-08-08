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
  },
  {
    name: 'finalizeContest',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'contestId', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'contests',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'contestId', type: 'uint256' }],
    outputs: [
      { name: 'contestId', type: 'uint256' },
      { name: 'owner', type: 'address' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'startBlock', type: 'uint256' },
      { name: 'endBlock', type: 'uint256' },
      { name: 'prizeToken', type: 'address' },
      { name: 'totalPrize', type: 'uint256' },
      { name: 'winnerCount', type: 'uint256' },
      { name: 'submissionCount', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'objectiveWeight', type: 'uint256' },
      { name: 'aiWeight', type: 'uint256' },
      { name: 'finalized', type: 'bool' }
    ]
  },
  {
    name: 'getContestLeaderboard',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'contestId', type: 'uint256' }],
    outputs: [{
      type: 'tuple[]',
      components: [
        { name: 'submissionId', type: 'uint256' },
        { name: 'submitter', type: 'address' },
        { name: 'finalScore', type: 'uint256' },
        { name: 'objectiveScore', type: 'uint256' },
        { name: 'submissionBlock', type: 'uint256' }
      ]
    }]
  },
  {
    name: 'userProfiles',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'reputation', type: 'uint256' },
      { name: 'roleLevel', type: 'uint256' },
      { name: 'contributionsSubmitted', type: 'uint256' },
      { name: 'contestsEntered', type: 'uint256' },
      { name: 'contestsWon', type: 'uint256' }
    ]
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

// Initial Showcase Contests
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

// Read Chain Status (Block Height & Online Status)
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

// Switch/Add Ritual Testnet to User's MetaMask
export async function switchOrAddRitualChain() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) throw new Error("MetaMask is not installed.");

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${RITUAL_TESTNET_CONFIG.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${RITUAL_TESTNET_CONFIG.chainId.toString(16)}`,
            chainName: RITUAL_TESTNET_CONFIG.chainName,
            rpcUrls: [RITUAL_TESTNET_CONFIG.rpcUrl],
            nativeCurrency: RITUAL_TESTNET_CONFIG.nativeCurrency,
            blockExplorerUrls: [RITUAL_TESTNET_CONFIG.blockExplorerUrl],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

// Live On-Chain Entry Submission via User's MetaMask
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

// Live On-Chain Contest Creation via User's MetaMask
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
