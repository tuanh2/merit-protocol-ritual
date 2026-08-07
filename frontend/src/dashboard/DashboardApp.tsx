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
  ChevronRight
} from 'lucide-react';
import { 
  fetchChainStatus, 
  getAddresses, 
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
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  }

  // Handle Contest Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionUrl) return;

    setIsSubmitting(true);
    setSubmissionStatus('SUBMITTED');

    // Simulate Multi-Block Async State Progression
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
  }

  // Handle New Contest Creation
  async function handleCreateContest(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;

    setIsCreatingContest(true);
    setTimeout(() => {
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
      alert("Contest created and prize pool locked successfully on Ritual Testnet!");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/index.html" className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white">MERIT</span>
                <span className="font-light text-xl text-cyan-400">PROTOCOL</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>RITUAL TESTNET #1979</span>
                <span>•</span>
                <span>BLOCK #{blockHeight}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Badges */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">MODE:</span>
              <span className={isMockMode ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                {isMockMode ? "MOCK TEE MODE" : "VERIFIED TEE MODE"}
              </span>
            </div>

            {/* Wallet Button */}
            {account ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-cyan-500/30 px-4 py-2 rounded-xl text-xs font-mono text-cyan-300">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-all"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('contests')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'contests' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Active Contests</span>
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'console' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Project Console</span>
            </button>

            <button
              onClick={() => setActiveTab('reputation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'reputation' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Reputation & Badges</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </div>

          {/* User Profile Summary Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">YOUR REPUTATION</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">{userRole}</span>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-black text-white">{userReputation}</span>
                <span className="text-xs font-mono text-slate-400">/ 500 PTS</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${(userReputation / 500) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {500 - userReputation} reputation points until <strong className="text-slate-200">Core Contributor</strong>.
              </p>
            </div>
          </div>

          {/* Demo Controls Drawer */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>DEMO SHOWCASE CONTROLS</span>
            </div>

            <button
              onClick={() => setIsMockMode(prev => !prev)}
              className="w-full text-xs font-mono py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Toggle Mock Mode: {isMockMode ? "ON" : "OFF"}
            </button>

            <button
              onClick={() => {
                setSubmissionUrl("https://x.com/ritual_builder/status/1049281");
                setActiveTab('contests');
              }}
              className="w-full text-xs font-mono py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-mono text-slate-400 block mb-1">ACTIVE CONTESTS</span>
                  <span className="text-3xl font-black text-white">{contests.length}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-mono text-slate-400 block mb-1">LOCKED ESCROW</span>
                  <span className="text-3xl font-black text-cyan-400">3,500 <span className="text-sm font-normal text-slate-400">MERIT</span></span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-mono text-slate-400 block mb-1">EVALUATED SUBMISSIONS</span>
                  <span className="text-3xl font-black text-indigo-400">22</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                  <span className="text-xs font-mono text-slate-400 block mb-1">GLOBAL CONTRIBUTORS</span>
                  <span className="text-3xl font-black text-violet-400">18</span>
                </div>
              </div>

              {/* Showcase Contests Header */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Featured Creator Contests</h2>
                <p className="text-sm text-slate-400 mb-6">Explore active contests on Ritual Testnet with transparent rules & locked prizes.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contests.map(c => (
                    <div key={c.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-base text-white">{c.title}</h3>
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                          {c.totalPrize} MERIT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>
                      
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>{c.submissionCount} Submissions</span>
                        <button 
                          onClick={() => { setSelectedContest(c); setActiveTab('contests'); }}
                          className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
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
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Active Creator Contest</h2>
                <p className="text-sm text-slate-400 mb-6">Select a contest, view immutable requirements, and submit content for Ritual AI evaluation.</p>

                {selectedContest && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                      <div>
                        <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">CONTEST #{selectedContest.id}</span>
                        <h3 className="text-2xl font-black text-white">{selectedContest.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-cyan-400 block">{selectedContest.totalPrize} MERIT</span>
                        <span className="text-xs font-mono text-slate-400">LOCKED ESCROW POOL</span>
                      </div>
                    </div>

                    {/* Requirements Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-mono text-slate-400 block">MANDATORY HARD REQUIREMENTS</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-200">
                            Min {selectedContest.requirements.minWords} Words
                          </span>
                          {selectedContest.requirements.requiredMentions.map((m, i) => (
                            <span key={i} className="px-2.5 py-1 rounded bg-cyan-950 text-xs font-mono text-cyan-300 border border-cyan-800">
                              Mention {m}
                            </span>
                          ))}
                          {selectedContest.requirements.requiredHashtags.map((h, i) => (
                            <span key={i} className="px-2.5 py-1 rounded bg-indigo-950 text-xs font-mono text-indigo-300 border border-indigo-800">
                              Hashtag {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
                        <span className="text-xs font-mono text-slate-400 block">SCORING WEIGHT DISTRIBUTION</span>
                        <div className="flex items-center gap-4 pt-1 text-sm font-mono">
                          <span className="text-slate-300">Objective: <strong className="text-cyan-400">{selectedContest.objectiveWeight}%</strong></span>
                          <span className="text-slate-300">Ritual AI: <strong className="text-indigo-400">{selectedContest.aiWeight}%</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Submission Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-800">
                      <label className="block text-sm font-semibold text-slate-200">
                        Submit Contribution URL (X Post, Article, Video, or Guide)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          required
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://x.com/your_username/status/..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSubmitting ? "Processing..." : "Submit Entry"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Async Lifecycle Progression Indicator */}
                    {submissionStatus && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 font-mono text-xs space-y-2">
                        <div className="flex items-center justify-between text-cyan-400 font-bold">
                          <span>RITUAL MULTI-BLOCK WORKFLOW STATUS</span>
                          <span>{submissionStatus}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-2 text-[11px]">
                          <div className={`p-2 rounded border text-center ${['SUBMITTED','FETCH_SCHEDULED','REQUIREMENTS_VERIFIED','AI_EVALUATING','SCORED'].includes(submissionStatus) ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-slate-950 text-slate-600 border-slate-900'}`}>
                            ✓ SUBMITTED
                          </div>
                          <div className={`p-2 rounded border text-center ${['REQUIREMENTS_VERIFIED','AI_EVALUATING','SCORED'].includes(submissionStatus) ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-slate-950 text-slate-600 border-slate-900'}`}>
                            ✓ HARD REQS
                          </div>
                          <div className={`p-2 rounded border text-center ${['AI_EVALUATING','SCORED'].includes(submissionStatus) ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-slate-950 text-slate-600 border-slate-900'}`}>
                            ● RITUAL AI
                          </div>
                          <div className={`p-2 rounded border text-center ${submissionStatus === 'SCORED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-950 text-slate-600 border-slate-900'}`}>
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
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Create Autonomous Contest</h2>
                <p className="text-sm text-slate-400">Lock prize tokens and define immutable rules. Ritual AI executes judging automatically.</p>
              </div>

              <form onSubmit={handleCreateContest} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">CONTEST TITLE</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Explain Ritual AI Precompiles"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">PRIZE ESCROW POOL (MERIT TOKENS)</label>
                    <input
                      type="number"
                      required
                      value={newPrize}
                      onChange={(e) => setNewPrize(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">CONTEST DESCRIPTION & RUBRIC</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe contest requirements and evaluation criteria..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">MINIMUM WORDS</label>
                    <input
                      type="number"
                      value={newMinWords}
                      onChange={(e) => setNewMinWords(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">REQUIRED MENTION</label>
                    <input
                      type="text"
                      value={newMentions}
                      onChange={(e) => setNewMentions(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">REQUIRED HASHTAG</label>
                    <input
                      type="text"
                      value={newHashtags}
                      onChange={(e) => setNewHashtags(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingContest}
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm"
                >
                  {isCreatingContest ? "Locking Prize & Creating..." : "Lock Prize Pool & Activate Contest"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: REPUTATION & BADGES */}
          {activeTab === 'reputation' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Soulbound Contribution Credentials</h2>
                <p className="text-sm text-slate-400 mb-6">Reputation points accrue deterministically from AI scores and automatically unlock non-transferable ERC-721 MeritBadges.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Badge Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-cyan-500/30 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-mono text-cyan-400 block font-bold">MERIT BADGE #104</span>
                          <h4 className="font-extrabold text-lg text-white">Verified Contributor</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                        NON-TRANSFERABLE
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>REPUTATION POINTS:</span>
                        <span className="text-cyan-300 font-bold">463 PTS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CONTRIBUTIONS EVALUATED:</span>
                        <span className="text-slate-200">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VERIFIED BY:</span>
                        <span className="text-emerald-400">Ritual TEE Engine</span>
                      </div>
                    </div>
                  </div>

                  {/* Role Progression Tree */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-sm text-white mb-2">Role Progression Thresholds</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                        <span>Newcomer</span>
                        <span>0 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                        <span>Contributor</span>
                        <span>100 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
                        <span>Verified Contributor (CURRENT)</span>
                        <span>250 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                        <span>Core Contributor</span>
                        <span>500 PTS</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
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
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Contest Leaderboard</h2>
                <p className="text-sm text-slate-400">Top ranked entries updated incrementally upon Ritual AI scoring with deterministic tie-breaking.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-mono text-slate-400">
                      <th className="py-3 px-4">RANK</th>
                      <th className="py-3 px-4">CREATOR</th>
                      <th className="py-3 px-4">FINAL SCORE</th>
                      <th className="py-3 px-4">OBJECTIVE</th>
                      <th className="py-3 px-4">SUBMISSION BLOCK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {leaderboard.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-cyan-400">#{idx + 1}</td>
                        <td className="py-4 px-4 font-mono font-medium text-slate-200">{item.submitter}</td>
                        <td className="py-4 px-4 font-bold text-white">{item.finalScore} / 100</td>
                        <td className="py-4 px-4 text-slate-400">{item.objectiveScore}</td>
                        <td className="py-4 px-4 font-mono text-xs text-slate-500">#{item.submissionBlock}</td>
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
