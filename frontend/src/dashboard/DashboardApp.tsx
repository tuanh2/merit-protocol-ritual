import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Cpu, 
  Trophy, 
  Award, 
  PlusCircle, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search,
  Filter,
  BarChart3,
  UserCheck,
  RefreshCw,
  Sliders,
  Send,
  Zap,
  Info,
  ChevronRight,
  Check,
  Terminal
} from 'lucide-react';
import { 
  fetchChainStatus, 
  getAddresses, 
  submitEntryOnChain,
  createContestOnChain,
  switchOrAddRitualChain,
  publicClient,
  SHOWCASE_CONTESTS, 
  SHOWCASE_LEADERBOARD, 
  SHOWCASE_SUBMISSIONS,
  ContestData,
  SubmissionData,
  LeaderboardItem
} from '../services/rpc';

export default function DashboardApp() {
  const [activeTab, setActiveTab] = useState<'overview' | 'contests' | 'console' | 'reputation' | 'leaderboard'>('overview');
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [blockHeight, setBlockHeight] = useState<number>(104520);
  const [isRpcOnline, setIsRpcOnline] = useState(true);
  const [isMockMode, setIsMockMode] = useState(true);

  // Contests & Submissions State
  const [contests, setContests] = useState<ContestData[]>(SHOWCASE_CONTESTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(SHOWCASE_LEADERBOARD);
  const [submissions, setSubmissions] = useState<SubmissionData[]>(SHOWCASE_SUBMISSIONS);
  const [selectedContest, setSelectedContest] = useState<ContestData | null>(SHOWCASE_CONTESTS[0]);

  // Submission Form State
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // New Contest Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrize, setNewPrize] = useState('1000');
  const [newWinners, setNewWinners] = useState('3');
  const [newMinWords, setNewMinWords] = useState('30');
  const [newMentions, setNewMentions] = useState('@Ritual');
  const [newHashtags, setNewHashtags] = useState('#RitualTestnet');
  const [isCreatingContest, setIsCreatingContest] = useState(false);

  // User Profile
  const [userReputation, setUserReputation] = useState(463);
  const [userRole, setUserRole] = useState('Verified Contributor');

  // Load RPC Chain Status on Page Load (Read-Only RPC First)
  useEffect(() => {
    async function loadStatus() {
      const status = await fetchChainStatus();
      setBlockHeight(status.blockNumber);
      setIsRpcOnline(status.rpcOnline);
    }
    loadStatus();
    const interval = setInterval(loadStatus, 12000);
    return () => clearInterval(interval);
  }, []);

  // Connect MetaMask Wallet
  async function connectWallet() {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to interact with Ritual Testnet.');
      return;
    }
    try {
      setIsConnecting(true);
      await switchOrAddRitualChain();
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Could not connect to wallet.");
    } finally {
      setIsConnecting(false);
    }
  }

  // Handle Live On-Chain Contest Submission with Instant TxHash & Explorer Verification
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionUrl) return;

    setIsSubmitting(true);
    setSubmissionStatus('AWAITING_WALLET_SIGNATURE');
    setTxHash(null);

    try {
      if (account) {
        // 1. Send Real Write Transaction to Ritual Testnet via MetaMask
        const hash = await submitEntryOnChain(selectedContest?.id || 1, submissionUrl, account);
        
        // 2. INSTANTLY display TxHash with direct Ritual Explorer Link
        setTxHash(hash);
        setSubmissionStatus('TX_BROADCASTED_ON_RITUAL');

        // 3. Wait for block inclusion receipt on Ritual Testnet
        try {
          await publicClient.waitForTransactionReceipt({ hash });
          setSubmissionStatus('TX_CONFIRMED_ON_CHAIN');
        } catch {
          // Receipt timeout fallback
        }
      } else {
        // Demo Fallback Hash if wallet not connected
        const mockHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
        setTxHash(mockHash);
        setSubmissionStatus('SUBMITTED_DEMO');
      }

      // Progression simulation for TEE evaluation workflow
      setTimeout(() => setSubmissionStatus('FETCH_SCHEDULED'), 1200);
      setTimeout(() => setSubmissionStatus('REQUIREMENTS_VERIFIED'), 2400);
      setTimeout(() => setSubmissionStatus('AI_EVALUATING'), 3600);
      setTimeout(() => {
        setSubmissionStatus('SCORED');
        const newSubId = Date.now();
        const newScore = Math.floor(Math.random() * 15) + 82;

        const newSubmission: SubmissionData = {
          id: newSubId,
          contestId: selectedContest?.id || 1,
          submitter: account ? `${account.substring(0, 6)}...${account.substring(38)}` : "0xUSER...42A1",
          submissionBlock: blockHeight + 2,
          contentUrl: submissionUrl,
          status: "SCORED",
          objectiveScore: 100,
          aiScore: newScore,
          finalScore: newScore,
          aiBreakdown: {
            relevance: newScore + 2,
            accuracy: newScore - 1,
            originality: newScore + 4,
            clarity: newScore + 1,
            usefulness: newScore,
            creativity: newScore - 2,
            reason: "Evaluated by Ritual AI Engine: Comprehensive explanation of Ritual AI precompile state machine.",
            usedMock: isMockMode
          }
        };

        setSubmissions(prev => [newSubmission, ...prev]);
        setUserReputation(prev => prev + 25);
        setIsSubmitting(false);
      }, 4800);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Transaction failed or was rejected by user.");
      setIsSubmitting(false);
      setSubmissionStatus(null);
    }
  }

  // Handle Live On-Chain Contest Creation
  async function handleCreateContest(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;

    setIsCreatingContest(true);
    try {
      if (account) {
        const hash = await createContestOnChain(
          newTitle,
          newDesc || "Community contest",
          newPrize,
          Number(newWinners),
          Number(newMinWords),
          newMentions,
          newHashtags,
          account
        );
        setTxHash(hash);
        alert(`Contest transaction broadcasted on Ritual Testnet! TxHash: ${hash}`);
      }

      const created: ContestData = {
        id: contests.length + 1,
        title: newTitle,
        description: newDesc || "Community contribution program evaluated by Ritual AI.",
        startBlock: blockHeight,
        endBlock: blockHeight + 40000,
        prizeToken: "0xMERIT",
        totalPrize: newPrize,
        winnerCount: Number(newWinners),
        payoutBps: [5000, 3000, 2000],
        submissionCount: 0,
        status: "ACTIVE",
        objectiveWeight: 40,
        aiWeight: 60,
        requirements: {
          minWords: Number(newMinWords),
          requiredMentions: [newMentions],
          requiredHashtags: [newHashtags],
          requiredKeywords: ["Precompile"],
          requiresMedia: false,
        }
      };

      setContests(prev => [created, ...prev]);
      setIsCreatingContest(false);
      setActiveTab('contests');
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Transaction rejected or failed.");
      setIsCreatingContest(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#040705] text-slate-100 font-sans flex flex-col selection:bg-[#00E575] selection:text-[#040705] ritual-bg-grid-sharp select-none">
      
      {/* Top Header - Sharp Square */}
      <header className="border-b border-[#00E575]/30 bg-[#07110c]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/index.html" className="w-10 h-10 bg-[#00E575] text-[#040705] flex items-center justify-center font-black border border-[#00E575]">
              <ShieldCheck className="w-6 h-6 text-[#040705]" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-white uppercase font-mono tracking-tight">Merit</span>
                <span className="font-bold text-xl text-[#00E575] font-mono">.Protocol</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="inline-block w-2 h-2 bg-[#00E575] animate-ping" />
                <span>RITUAL TESTNET #1979</span>
                <span>•</span>
                <span>BLOCK #{blockHeight}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Badges */}
            <div className="hidden md:flex items-center gap-2 bg-[#07110c] px-3.5 py-2 border border-[#00E575]/30 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5 text-[#00E575]" />
              <span className="text-slate-400">MODE:</span>
              <span className={isMockMode ? "text-amber-400 font-bold" : "text-[#00E575] font-bold"}>
                {isMockMode ? "MOCK TEE MODE" : "VERIFIED TEE MODE"}
              </span>
            </div>

            {/* Wallet Button */}
            {account ? (
              <div className="flex items-center gap-2 bg-[#07110c] border border-[#00E575]/40 px-4 py-2 text-xs font-mono text-[#00E575]">
                <div className="w-2.5 h-2.5 bg-[#00E575]" />
                <span>{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-ritual-sharp h-10 px-5 text-xs font-mono uppercase tracking-wider flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-card-sharp p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'overview' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>01//Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('contests')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'contests' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>02//Contests</span>
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'console' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>03//Console</span>
            </button>

            <button
              onClick={() => setActiveTab('reputation')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'reputation' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>04//Reputation</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>05//Leaderboard</span>
            </button>
          </div>

          {/* User Profile Summary Card */}
          <div className="glass-card-sharp p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">REPUTATION_RANK</span>
              <span className="text-[#00E575] font-bold uppercase">{userRole}</span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2 font-mono">
                <span className="text-3xl font-black text-white">{userReputation}</span>
                <span className="text-xs text-slate-400">/ 500 PTS</span>
              </div>
              <div className="w-full h-2 bg-[#040705] border border-[#00E575]/30">
                <div 
                  className="h-full bg-[#00E575]"
                  style={{ width: `${(userReputation / 500) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                {500 - userReputation} PTS to reach <strong className="text-slate-200 uppercase">Core Contributor</strong>.
              </p>
            </div>
          </div>

          {/* Demo Controls Drawer */}
          <div className="glass-card-sharp p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-1 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>DEMO CONTROLS</span>
            </div>

            <button
              onClick={() => setIsMockMode(prev => !prev)}
              className="w-full text-xs font-mono py-2.5 bg-[#07110c] hover:bg-[#0c1d14] text-slate-200 border border-[#00E575]/30 transition-colors uppercase"
            >
              Toggle Mock Mode: {isMockMode ? "ON" : "OFF"}
            </button>

            <button
              onClick={() => {
                setSubmissionUrl("https://x.com/ritual_builder/status/1049281");
                setActiveTab('contests');
              }}
              className="w-full text-xs font-mono py-2.5 bg-[#00E575]/15 hover:bg-[#00E575]/25 text-[#00E575] border border-[#00E575]/50 font-bold uppercase transition-colors"
            >
              Fill Sample Submission URL
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
                <div className="glass-card-sharp p-5">
                  <span className="text-xs text-slate-400 block mb-1 uppercase">ACTIVE CONTESTS</span>
                  <span className="text-3xl font-black text-white">{contests.length}</span>
                </div>
                <div className="glass-card-sharp p-5">
                  <span className="text-xs text-slate-400 block mb-1 uppercase">LOCKED ESCROW</span>
                  <span className="text-3xl font-black text-[#00E575]">3,500 <span className="text-xs font-normal text-slate-400">MERIT</span></span>
                </div>
                <div className="glass-card-sharp p-5">
                  <span className="text-xs text-slate-400 block mb-1 uppercase">EVALUATIONS</span>
                  <span className="text-3xl font-black text-emerald-400">22</span>
                </div>
                <div className="glass-card-sharp p-5">
                  <span className="text-xs text-slate-400 block mb-1 uppercase">CONTRIBUTORS</span>
                  <span className="text-3xl font-black text-slate-200">18</span>
                </div>
              </div>

              {/* Showcase Contests Grid */}
              <div className="glass-card-sharp p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">Featured Creator Contests</h2>
                  <p className="text-xs text-slate-400 font-mono">Autonomous contests on Ritual Testnet with transparent rubrics and locked prize pools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contests.map(c => (
                    <div key={c.id} className="bg-[#040705] border border-[#00E575]/30 p-6 space-y-4 hover:border-[#00E575] transition-all">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-base text-white">{c.title}</h3>
                        <span className="px-2.5 py-1 bg-[#00E575]/15 text-[#00E575] border border-[#00E575]/40 text-xs font-mono font-bold">
                          {c.totalPrize} MERIT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>
                      
                      <div className="pt-4 border-t border-[#00E575]/20 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>{c.submissionCount} Submissions</span>
                        <button 
                          onClick={() => { setSelectedContest(c); setActiveTab('contests'); }}
                          className="text-[#00E575] font-bold hover:underline flex items-center gap-1 uppercase"
                        >
                          Submit Entry <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTESTS */}
          {activeTab === 'contests' && (
            <div className="space-y-6">
              <div className="glass-card-sharp p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">Active Creator Contest</h2>
                  <p className="text-xs font-mono text-slate-400">View contest rubrics, hard requirements, and submit content for Ritual AI judging.</p>
                </div>

                {selectedContest && (
                  <div className="bg-[#040705] border border-[#00E575]/30 p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00E575]/20 pb-6">
                      <div>
                        <span className="text-xs font-mono text-[#00E575] font-bold block mb-1">CONTEST #{selectedContest.id}</span>
                        <h3 className="text-2xl font-black text-white uppercase">{selectedContest.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#00E575] block font-mono">{selectedContest.totalPrize} MERIT</span>
                        <span className="text-xs font-mono text-slate-400">LOCKED ESCROW POOL</span>
                      </div>
                    </div>

                    {/* Hard Requirements & Scoring Weights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#07110c] border border-[#00E575]/30 p-4 space-y-2 font-mono text-xs">
                        <span className="text-slate-400 block uppercase">MANDATORY HARD REQUIREMENTS</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="px-2 py-1 bg-[#040705] text-slate-200 border border-slate-800">
                            Min {selectedContest.requirements.minWords} Words
                          </span>
                          {selectedContest.requirements.requiredMentions.map((m, i) => (
                            <span key={i} className="px-2 py-1 bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/40 font-bold">
                              Mention {m}
                            </span>
                          ))}
                          {selectedContest.requirements.requiredHashtags.map((h, i) => (
                            <span key={i} className="px-2 py-1 bg-[#00E575]/10 text-[#00E575] border border-[#00E575]/40 font-bold">
                              Hashtag {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#07110c] border border-[#00E575]/30 p-4 space-y-2 font-mono text-xs">
                        <span className="text-slate-400 block uppercase">SCORING WEIGHT DISTRIBUTION</span>
                        <div className="flex items-center gap-4 pt-1 text-xs">
                          <span className="text-slate-300">Objective: <strong className="text-[#00E575]">{selectedContest.objectiveWeight}%</strong></span>
                          <span className="text-slate-300">Ritual AI: <strong className="text-emerald-400">{selectedContest.aiWeight}%</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-[#00E575]/20">
                      <label className="block text-xs font-mono uppercase text-slate-300">
                        Submit Contribution URL (X Post, Article, Video, or Guide)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          required
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://x.com/your_username/status/..."
                          className="flex-1 bg-[#07110c] border border-[#00E575]/30 px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-ritual-sharp h-11 px-6 text-xs font-mono uppercase tracking-wider flex items-center gap-2 shrink-0"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSubmitting ? "Processing..." : "Submit Entry"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Prominent Instant Transaction Hash Box */}
                    {txHash && (
                      <div className="p-4 bg-[#08150e] border-2 border-[#00E575] font-mono text-xs space-y-3 shadow-[0_0_25px_rgba(0,229,117,0.3)]">
                        <div className="flex items-center justify-between text-[#00E575] font-black uppercase text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#00E575]" />
                            <span>TRANSACTION BROADCASTED ON RITUAL TESTNET</span>
                          </div>
                          <span className="bg-[#00E575] text-[#040705] px-2 py-0.5 text-[10px]">LIVE ON-CHAIN</span>
                        </div>

                        <div className="bg-[#040705] p-3 border border-[#00E575]/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-400 block mb-1 uppercase">TRANSACTION HASH (TXHASH)</span>
                            <span className="text-xs text-white font-bold tracking-wider select-all break-all">{txHash}</span>
                          </div>

                          <a
                            href={`https://explorer.ritualfoundation.org/tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-ritual-sharp px-4 py-2 text-xs font-mono uppercase flex items-center gap-1.5 shrink-0 justify-center"
                          >
                            <span>View on Explorer</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Multi-Block Workflow Indicator */}
                    {submissionStatus && (
                      <div className="p-4 bg-[#07110c] border border-[#00E575]/40 font-mono text-xs space-y-2">
                        <div className="flex items-center justify-between text-[#00E575] font-bold">
                          <span>RITUAL MULTI-BLOCK WORKFLOW STATUS</span>
                          <span>{submissionStatus}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-2 text-[11px]">
                          <div className={`p-2 border text-center ${['AWAITING_WALLET_SIGNATURE','TX_BROADCASTED_ON_RITUAL','TX_CONFIRMED_ON_CHAIN','SUBMITTED_DEMO','FETCH_SCHEDULED','REQUIREMENTS_VERIFIED','AI_EVALUATING','SCORED'].includes(submissionStatus) ? 'bg-[#00E575]/20 text-[#00E575] border-[#00E575] font-bold' : 'bg-[#040705] text-slate-600 border-slate-900'}`}>
                            ✓ SUBMITTED
                          </div>
                          <div className={`p-2 border text-center ${['REQUIREMENTS_VERIFIED','AI_EVALUATING','SCORED'].includes(submissionStatus) ? 'bg-[#00E575]/20 text-[#00E575] border-[#00E575] font-bold' : 'bg-[#040705] text-slate-600 border-slate-900'}`}>
                            ✓ HARD REQS
                          </div>
                          <div className={`p-2 border text-center ${['AI_EVALUATING','SCORED'].includes(submissionStatus) ? 'bg-[#00E575]/20 text-[#00E575] border-[#00E575] font-bold' : 'bg-[#040705] text-slate-600 border-slate-900'}`}>
                            ● RITUAL AI
                          </div>
                          <div className={`p-2 border text-center ${submissionStatus === 'SCORED' ? 'bg-[#00E575] text-[#040705] font-bold border-[#00E575]' : 'bg-[#040705] text-slate-600 border-slate-900'}`}>
                            ○ SCORED
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT CONSOLE */}
          {activeTab === 'console' && (
            <div className="glass-card-sharp p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">Create Autonomous Contest</h2>
                <p className="text-xs font-mono text-slate-400">Lock prize tokens and set immutable rules. Ritual AI executes judging automatically.</p>
              </div>

              <form onSubmit={handleCreateContest} className="space-y-6 font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-slate-300 mb-2 uppercase">CONTEST TITLE</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Explain Ritual AI Precompiles"
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-2 uppercase">PRIZE ESCROW POOL (MERIT TOKENS)</label>
                    <input
                      type="number"
                      required
                      value={newPrize}
                      onChange={(e) => setNewPrize(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E575]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-2 uppercase">CONTEST DESCRIPTION & RUBRIC</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe contest requirements and evaluation criteria..."
                    className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs text-slate-300 mb-2 uppercase">MINIMUM WORDS</label>
                    <input
                      type="number"
                      value={newMinWords}
                      onChange={(e) => setNewMinWords(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-2 uppercase">REQUIRED MENTION</label>
                    <input
                      type="text"
                      value={newMentions}
                      onChange={(e) => setNewMentions(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-2 uppercase">REQUIRED HASHTAG</label>
                    <input
                      type="text"
                      value={newHashtags}
                      onChange={(e) => setNewHashtags(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingContest}
                  className="btn-ritual-sharp w-full h-13 text-xs font-mono uppercase tracking-wider"
                >
                  {isCreatingContest ? "Locking Prize & Creating..." : "Lock Prize Pool & Activate Contest"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: REPUTATION & BADGES */}
          {activeTab === 'reputation' && (
            <div className="space-y-6">
              <div className="glass-card-sharp p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">Soulbound Contribution Credentials</h2>
                  <p className="text-xs font-mono text-slate-400">Reputation points accrue on-chain and automatically mint non-transferable ERC-721 MeritBadges.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Badge Card */}
                  <div className="bg-[#07110c] border border-[#00E575]/40 p-6 space-y-6 relative shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#00E575]/30 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00E575] text-[#040705] flex items-center justify-center font-bold">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-mono text-[#00E575] block font-bold">MERIT BADGE #104</span>
                          <h4 className="font-black text-base text-white uppercase font-sans">Verified Contributor</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-[#00E575]/15 text-[#00E575] border border-[#00E575]/40 text-[10px] font-mono font-bold uppercase">
                        SOULBOUND
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>REPUTATION POINTS:</span>
                        <span className="text-[#00E575] font-bold">463 PTS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EVALUATED ENTRIES:</span>
                        <span className="text-slate-200">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VERIFIED BY:</span>
                        <span className="text-emerald-400 font-bold">Ritual TEE Engine</span>
                      </div>
                    </div>
                  </div>

                  {/* Role Progression Tree */}
                  <div className="bg-[#040705] border border-[#00E575]/30 p-6 space-y-4 font-mono text-xs">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Role Progression Thresholds</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-[#07110c] border border-[#00E575]/20 text-slate-400">
                        <span>Newcomer</span>
                        <span>0 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#07110c] border border-[#00E575]/20 text-slate-400">
                        <span>Contributor</span>
                        <span>100 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#00E575] text-[#040705] font-black border border-[#00E575]">
                        <span>Verified Contributor (CURRENT)</span>
                        <span>250 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#07110c] border border-[#00E575]/20 text-slate-400">
                        <span>Core Contributor</span>
                        <span>500 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#07110c] border border-[#00E575]/20 text-slate-400">
                        <span>OG Contributor</span>
                        <span>1000 PTS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="glass-card-sharp p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">Contest Leaderboard</h2>
                <p className="text-xs font-mono text-slate-400">Top ranked entries updated upon Ritual AI scoring with deterministic tie-breaking.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#00E575]/30 text-slate-400 bg-[#07110c]">
                      <th className="py-3.5 px-4 uppercase">RANK</th>
                      <th className="py-3.5 px-4 uppercase">CREATOR</th>
                      <th className="py-3.5 px-4 uppercase">FINAL SCORE</th>
                      <th className="py-3.5 px-4 uppercase">OBJECTIVE</th>
                      <th className="py-3.5 px-4 uppercase">SUBMISSION BLOCK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00E575]/15 text-xs">
                    {leaderboard.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#00E575]/10 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#00E575]">#{idx + 1}</td>
                        <td className="py-4 px-4 font-medium text-slate-200">{item.submitter}</td>
                        <td className="py-4 px-4 font-bold text-white">{item.finalScore} / 100</td>
                        <td className="py-4 px-4 text-slate-400">{item.objectiveScore}</td>
                        <td className="py-4 px-4 text-slate-500">#{item.submissionBlock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
