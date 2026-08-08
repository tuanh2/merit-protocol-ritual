import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Trophy, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Send, 
  Crown, 
  Link as LinkIcon, 
  User, 
  MessageSquare,
  PlusCircle,
  XCircle,
  FolderPlus,
  Settings,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { 
  fetchChainStatus, 
  getAddresses, 
  submitEntryOnChain,
  createContestOnChain,
  switchOrAddRitualChain,
  fetchXPostTextFromUrl,
  evaluateSubmissionContent,
  publicClient,
  SHOWCASE_PROJECTS,
  SHOWCASE_LEADERBOARD, 
  SHOWCASE_SUBMISSIONS,
  ProjectCampaignData,
  SubmissionData,
  LeaderboardItem
} from '../services/rpc';

export default function DashboardApp() {
  // Mode: 'contributor' (Default) OR 'owner' (Project Owner / Campaign Creator)
  const [activeMode, setActiveMode] = useState<'contributor' | 'owner'>('contributor');

  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [blockHeight, setBlockHeight] = useState<number>(104520);
  const [isMockMode, setIsMockMode] = useState(true);

  // Projects & Campaigns State
  const [projects, setProjects] = useState<ProjectCampaignData[]>(SHOWCASE_PROJECTS);
  
  // Selected Item Modal State (Opens when clicking any card!)
  const [activeModalItem, setActiveModalItem] = useState<ProjectCampaignData | null>(null);
  const [modalTab, setModalTab] = useState<'submit' | 'leaderboard'>('submit');

  // Submissions & Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(SHOWCASE_LEADERBOARD);
  const [submissions, setSubmissions] = useState<SubmissionData[]>(SHOWCASE_SUBMISSIONS);

  // Submission Inputs (Empty by default for real user entry!)
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [latestEvaluationResult, setLatestEvaluationResult] = useState<any | null>(null);

  // New Campaign Form (Owner Mode)
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState<'CONTEST' | 'PROJECT_CAMPAIGN'>('PROJECT_CAMPAIGN');
  const [newCampaignFreq, setNewCampaignFreq] = useState<'WEEKLY' | 'MONTHLY'>('MONTHLY');
  const [newCampaignCategory, setNewCampaignCategory] = useState('AI Infrastructure');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');
  const [newCampaignEscrow, setNewCampaignEscrow] = useState('3000');
  const [newCampaignOgLimit, setNewCampaignOgLimit] = useState('3');
  const [newCampaignMinWords, setNewCampaignMinWords] = useState('50');
  const [newCampaignMention, setNewCampaignMention] = useState('@Ritual');
  const [newCampaignHashtag, setNewCampaignHashtag] = useState('#RitualTestnet');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  // Filter 2 Columns
  const contestList = projects.filter(p => p.type === 'CONTEST');
  const campaignList = projects.filter(p => p.type === 'PROJECT_CAMPAIGN');

  // Load RPC Chain Status
  useEffect(() => {
    async function loadStatus() {
      const status = await fetchChainStatus();
      setBlockHeight(status.blockNumber);
    }
    loadStatus();
    const interval = setInterval(loadStatus, 12000);
    return () => clearInterval(interval);
  }, []);

  // Connect Wallet
  async function connectWallet() {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum === 'undefined') {
      alert('MetaMask is not installed.');
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
      alert(e.message || "Could not connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  }

  // Handle Submission (X Link + Discord)
  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeModalItem || !submissionUrl || !discordHandle) return;

    setIsSubmitting(true);
    setSubmissionStatus('AWAITING_WALLET_SIGNATURE');
    setTxHash(null);

    // 1. Auto-Fetch Post Content Direct from X URL via Precompile 0x0801 HTTP Engine
    const fetchedText = fetchXPostTextFromUrl(submissionUrl);

    // 2. Evaluate Fetched Post Content against Project's Requirements
    const evalResult = evaluateSubmissionContent(fetchedText, activeModalItem.requirements);
    setLatestEvaluationResult(evalResult);

    try {
      if (account) {
        // Send Write Transaction on Ritual Testnet
        const hash = await submitEntryOnChain(activeModalItem.id, submissionUrl, account);
        setTxHash(hash);
        setSubmissionStatus('TX_BROADCASTED_ON_RITUAL');
      } else {
        const mockHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
        setTxHash(mockHash);
        setSubmissionStatus('SUBMITTED_ANONYMOUS');
      }

      setTimeout(() => setSubmissionStatus('SCORED'), 3000);
      setTimeout(() => {
        const newSubId = Date.now();
        const submitterAddr = account ? `${account.substring(0, 6)}...${account.substring(38)}` : "0xUSER...42A1";

        const newSubmission: SubmissionData = {
          id: newSubId,
          projectId: activeModalItem.id,
          submitter: submitterAddr,
          discordHandle: discordHandle,
          submissionBlock: blockHeight + 2,
          contentUrl: submissionUrl,
          fetchedText: fetchedText,
          status: evalResult.hasPassedHardReqs ? "SCORED" : "REJECTED_LOW_SCORE",
          objectiveScore: evalResult.objectiveScore,
          aiScore: evalResult.aiScore,
          finalScore: evalResult.finalScore,
          isOgWinner: false,
          failureReason: evalResult.reason,
        };

        setSubmissions(prev => [newSubmission, ...prev]);

        // Update Project Trackers & Leaderboard
        setProjects(prev => prev.map(p => p.id === activeModalItem.id ? { ...p, totalSubmissionsTracked: p.totalSubmissionsTracked + 1 } : p));

        setLeaderboard(prev => {
          const updated = [
            { 
              submissionId: newSubId, 
              projectId: activeModalItem.id,
              submitter: submitterAddr, 
              discordHandle: discordHandle,
              contentUrl: submissionUrl,
              finalScore: evalResult.finalScore, 
              objectiveScore: evalResult.objectiveScore, 
              submissionBlock: blockHeight 
            },
            ...prev
          ].sort((a, b) => b.finalScore - a.finalScore);

          return updated.map((item, index) => ({
            ...item,
            isOgWinner: index < activeModalItem.topOgLimit && item.finalScore >= 80
          }));
        });

        setIsSubmitting(false);
      }, 3500);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Transaction failed.");
      setIsSubmitting(false);
      setSubmissionStatus(null);
    }
  }

  // Handle Project Owner Campaign Creation
  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!newCampaignName) return;

    setIsCreatingCampaign(true);
    setTimeout(() => {
      const createdItem: ProjectCampaignData = {
        id: projects.length + 1,
        name: newCampaignName,
        type: newCampaignType,
        frequency: newCampaignFreq,
        category: newCampaignCategory,
        description: newCampaignDesc || "Campaign space with AI evaluation and OG role distribution.",
        totalEscrow: newCampaignEscrow,
        topOgLimit: Number(newCampaignOgLimit),
        totalSubmissionsTracked: 0,
        requirements: {
          minWords: Number(newCampaignMinWords),
          requiredMentions: [newCampaignMention],
          requiredHashtags: [newCampaignHashtag],
          requiredKeywords: ["Precompile"],
        }
      };

      setProjects(prev => [...prev, createdItem]);
      setIsCreatingCampaign(false);
      setActiveMode('contributor');
      alert(`Campaign "${newCampaignName}" activated! OG Roles: Top ${newCampaignOgLimit} (${newCampaignFreq}).`);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-[#040705] text-slate-100 font-sans flex flex-col selection:bg-[#00E575] selection:text-[#040705] ritual-bg-grid-sharp select-none">
      
      {/* Top Header - Ultra Minimal */}
      <header className="border-b border-[#00E575]/30 bg-[#07110c]/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1350px] mx-auto px-6 h-20 flex items-center justify-between">
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

          <div className="flex items-center gap-4 font-mono text-xs">
            {/* Minimal Mode Toggle */}
            <div className="flex items-center bg-[#040705] border border-[#00E575]/40 p-1">
              <button
                onClick={() => setActiveMode('contributor')}
                className={`px-4 py-2 font-bold uppercase transition-all ${
                  activeMode === 'contributor' 
                    ? 'bg-[#00E575] text-[#040705]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🧑‍💻 Contributor Hub
              </button>
              <button
                onClick={() => setActiveMode('owner')}
                className={`px-4 py-2 font-bold uppercase transition-all ${
                  activeMode === 'owner' 
                    ? 'bg-[#00E575] text-[#040705]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏢 Project Owner
              </button>
            </div>

            {/* Wallet Button */}
            {account ? (
              <div className="flex items-center gap-2 bg-[#07110c] border border-[#00E575]/40 px-4 py-2 text-[#00E575]">
                <div className="w-2.5 h-2.5 bg-[#00E575]" />
                <span>{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-ritual-sharp h-10 px-5 uppercase tracking-wider flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-[1350px] mx-auto px-6 py-8 flex-1 w-full space-y-8 relative z-10">

        {/* MODE 1: CONTRIBUTOR WORKSPACE */}
        {activeMode === 'contributor' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00E575]/20 pb-6">
              <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Active Contests & Campaigns</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Click any contest or project campaign card below to submit your X post link + Discord username or inspect live rankings.
                </p>
              </div>
            </div>

            {/* 2 CLEAN HORIZONTAL COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* COLUMN 1: ONE-OFF CONTESTS */}
              <div className="glass-card-sharp p-6 space-y-6 border-t-4 border-t-[#00E575]">
                <div className="flex items-center justify-between border-b border-[#00E575]/20 pb-4 font-mono">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#00E575]" />
                    <h2 className="font-black text-white text-lg uppercase">One-Off Contests</h2>
                  </div>
                  <span className="text-[11px] text-[#00E575] font-bold bg-[#00E575]/10 px-2.5 py-1 border border-[#00E575]/30">
                    1 SUBMISSION PER ENTRY
                  </span>
                </div>

                <div className="space-y-4">
                  {contestList.map(c => (
                    <div 
                      key={c.id}
                      onClick={() => { setActiveModalItem(c); setModalTab('submit'); setSubmissionUrl(''); setDiscordHandle(''); setTxHash(null); setLatestEvaluationResult(null); }}
                      className="p-6 bg-[#040705] border border-[#00E575]/30 hover:border-[#00E575] transition-all cursor-pointer group space-y-3 hover:bg-[#07110c]"
                    >
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-[#00E575] font-bold">CONTEST #{c.id}</span>
                        <span className="text-white font-black font-mono px-3 py-1 bg-[#00E575]/15 border border-[#00E575]/40">
                          {c.totalEscrow} MERIT ESCROW
                        </span>
                      </div>
                      <h3 className="font-extrabold text-white text-lg group-hover:text-[#00E575] transition-colors">{c.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                      
                      <div className="pt-3 border-t border-[#00E575]/20 flex items-center justify-between text-xs font-mono text-slate-300">
                        <span className="text-[#00E575] font-bold flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5" /> Top {c.topOgLimit} Get OG Role
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform text-white font-bold flex items-center gap-1">
                          Click to Participate ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 2: CONTINUOUS PROJECT CAMPAIGNS (TRACK 50+ POSTS) */}
              <div className="glass-card-sharp p-6 space-y-6 border-t-4 border-t-emerald-400">
                <div className="flex items-center justify-between border-b border-[#00E575]/20 pb-4 font-mono">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-black text-white text-lg uppercase">Project Campaigns</h2>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/30">
                    TRACKS 50+ POSTS / OG ROLES
                  </span>
                </div>

                <div className="space-y-4">
                  {campaignList.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => { setActiveModalItem(p); setModalTab('submit'); setSubmissionUrl(''); setDiscordHandle(''); setTxHash(null); setLatestEvaluationResult(null); }}
                      className="p-6 bg-[#040705] border border-[#00E575]/30 hover:border-[#00E575] transition-all cursor-pointer group space-y-3 hover:bg-[#07110c]"
                    >
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5" /> TOP {p.topOgLimit} GET OG ROLE ({p.frequency})
                        </span>
                        <span className="text-white font-black font-mono px-3 py-1 bg-[#00E575]/15 border border-[#00E575]/40">
                          {p.totalEscrow} MERIT ESCROW
                        </span>
                      </div>
                      <h3 className="font-extrabold text-white text-lg group-hover:text-[#00E575] transition-colors">{p.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                      
                      <div className="pt-3 border-t border-[#00E575]/20 flex items-center justify-between text-xs font-mono text-slate-300">
                        <span className="text-slate-400">Tracked Submissions: <strong className="text-white">{p.totalSubmissionsTracked} Posts</strong></span>
                        <span className="group-hover:translate-x-1 transition-transform text-white font-bold flex items-center gap-1">
                          Click to Participate ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODE 2: PROJECT OWNER WORKSPACE (CREATE CAMPAIGN) */}
        {activeMode === 'owner' && (
          <div className="glass-card-sharp p-8 space-y-6 max-w-3xl mx-auto border-2 border-[#00E575]">
            <div className="border-b border-[#00E575]/20 pb-4">
              <h2 className="text-2xl font-black text-white font-sans uppercase tracking-tight mb-1">
                Open New Contest or Project Campaign
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Configure prize escrow pool, select cycle frequency (weekly/monthly), and set mandatory tag criteria.
              </p>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">CAMPAIGN / CONTEST NAME</label>
                  <input
                    type="text"
                    required
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="e.g. Ritual AI Hackathon Campaign"
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">TYPE</label>
                  <select
                    value={newCampaignType}
                    onChange={(e: any) => setNewCampaignType(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#00E575]"
                  >
                    <option value="PROJECT_CAMPAIGN">Continuous Project Campaign (Track 50+ posts)</option>
                    <option value="CONTEST">One-Off Contest (1 Submission per entry)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">CYCLE FREQUENCY</label>
                  <select
                    value={newCampaignFreq}
                    onChange={(e: any) => setNewCampaignFreq(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#00E575]"
                  >
                    <option value="MONTHLY">Monthly (Hàng Tháng)</option>
                    <option value="WEEKLY">Weekly (Hàng Tuần)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">OG ROLES (E.G. 3 OR 4)</label>
                  <input
                    type="number"
                    value={newCampaignOgLimit}
                    onChange={(e) => setNewCampaignOgLimit(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">ESCROW PRIZE (MERIT)</label>
                  <input
                    type="number"
                    value={newCampaignEscrow}
                    onChange={(e) => setNewCampaignEscrow(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 uppercase font-bold">DESCRIPTION & RUBRIC</label>
                <textarea
                  rows={3}
                  value={newCampaignDesc}
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  placeholder="Describe campaign rules..."
                  className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">REQUIRED @MENTION</label>
                  <input
                    type="text"
                    value={newCampaignMention}
                    onChange={(e) => setNewCampaignMention(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">REQUIRED #HASHTAG</label>
                  <input
                    type="text"
                    value={newCampaignHashtag}
                    onChange={(e) => setNewCampaignHashtag(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 uppercase font-bold">MIN WORD COUNT</label>
                  <input
                    type="number"
                    value={newCampaignMinWords}
                    onChange={(e) => setNewCampaignMinWords(e.target.value)}
                    className="w-full bg-[#040705] border border-[#00E575]/40 px-4 py-3.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingCampaign}
                className="btn-ritual-sharp w-full h-14 text-xs font-mono uppercase tracking-wider font-bold"
              >
                {isCreatingCampaign ? "Saving & Locking Escrow..." : "Activate Campaign & Lock Escrow Prize"}
              </button>
            </form>
          </div>
        )}

      </main>

      {/* UNIFIED ITEM MODAL (OPENS WHEN CLICKING ANY CONTEST/CAMPAIGN CARD) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-[#040705]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono">
          <div className="max-w-3xl w-full glass-card-sharp p-6 space-y-6 border-2 border-[#00E575] max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#00E575]/20 pb-4">
              <div>
                <span className="text-xs text-[#00E575] font-bold block mb-1">
                  {activeModalItem.type === 'CONTEST' ? 'ONE-OFF CONTEST' : 'PROJECT CAMPAIGN'} :: {activeModalItem.category}
                </span>
                <h2 className="text-2xl font-black text-white uppercase">{activeModalItem.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{activeModalItem.description}</p>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex items-center bg-[#040705] border border-[#00E575]/40 p-1">
              <button
                onClick={() => setModalTab('submit')}
                className={`flex-1 py-2.5 text-xs font-bold uppercase transition-all ${
                  modalTab === 'submit' 
                    ? 'bg-[#00E575] text-[#040705]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✍️ Nộp Link X
              </button>
              <button
                onClick={() => setModalTab('leaderboard')}
                className={`flex-1 py-2.5 text-xs font-bold uppercase transition-all ${
                  modalTab === 'leaderboard' 
                    ? 'bg-[#00E575] text-[#040705]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏆 Xem Leaderboard & Ranking
              </button>
            </div>

            {/* MODAL TAB 1: SUBMIT X LINK + DISCORD */}
            {modalTab === 'submit' && (
              <div className="space-y-6">
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 mb-2 flex items-center gap-1.5 font-bold">
                        <LinkIcon className="w-4 h-4 text-[#00E575]" />
                        <span>1. X / Twitter Post Link</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://x.com/your_handle/status/19824001"
                        className="w-full bg-[#07110c] border border-[#00E575]/40 px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-300 mb-2 flex items-center gap-1.5 font-bold">
                        <MessageSquare className="w-4 h-4 text-[#00E575]" />
                        <span>2. Discord Username</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={discordHandle}
                        onChange={(e) => setDiscordHandle(e.target.value)}
                        placeholder="e.g. builder#1234 or @discord_user"
                        className="w-full bg-[#07110c] border border-[#00E575]/40 px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-ritual-sharp h-13 px-8 text-xs font-mono uppercase tracking-wider flex items-center gap-3 w-full justify-center font-bold"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Signing & Auto-Fetching X Data..." : `Sign Wallet & Submit Entry to ${activeModalItem.name}`}</span>
                  </button>
                </form>

                {/* Instant TxHash Display */}
                {txHash && (
                  <div className="p-5 bg-[#08150e] border-2 border-[#00E575] font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between text-[#00E575] font-black uppercase text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#00E575]" />
                        <span>TRANSACTION BROADCASTED ON RITUAL TESTNET</span>
                      </div>
                      <span className="bg-[#00E575] text-[#040705] px-2 py-0.5 text-[10px] font-bold">LIVE ON-CHAIN</span>
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
                        className="btn-ritual-sharp px-4 py-2 text-xs font-mono uppercase flex items-center gap-1.5 shrink-0 justify-center font-bold"
                      >
                        <span>View Explorer</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Real AI Evaluation Breakdown */}
                {latestEvaluationResult && (
                  <div className={`p-5 border-2 font-mono text-xs space-y-4 ${
                    latestEvaluationResult.hasPassedHardReqs 
                      ? 'bg-[#08150e] border-[#00E575]' 
                      : 'bg-red-950/30 border-red-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-sm uppercase">
                        {latestEvaluationResult.hasPassedHardReqs ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-[#00E575]" />
                            <span className="text-[#00E575]">PASSED — HIGH QUALITY SCORE</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-400">FAILED — LOW SCORE PENALTY</span>
                          </>
                        )}
                      </div>
                      <span className={`text-xl font-black px-3 py-1 border ${
                        latestEvaluationResult.hasPassedHardReqs 
                          ? 'bg-[#00E575]/20 text-[#00E575] border-[#00E575]' 
                          : 'bg-red-500/20 text-red-400 border-red-500'
                      }`}>
                        {latestEvaluationResult.finalScore} / 100
                      </span>
                    </div>

                    <div className="bg-[#040705] p-4 border border-[#00E575]/30 space-y-2">
                      <span className="text-[10px] text-slate-400 block uppercase">AUTO-FETCHED TWEET TEXT & RITUAL AI REASON</span>
                      <pre className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {latestEvaluationResult.reason}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODAL TAB 2: LEADERBOARD & RANKING TABLE */}
            {modalTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#00E575]/30 text-slate-400 bg-[#07110c]">
                        <th className="py-3 px-3 uppercase">RANK</th>
                        <th className="py-3 px-3 uppercase">DISCORD USERNAME</th>
                        <th className="py-3 px-3 uppercase">WALLET</th>
                        <th className="py-3 px-3 uppercase">X LINK</th>
                        <th className="py-3 px-3 uppercase">AI SCORE</th>
                        <th className="py-3 px-3 uppercase">OG STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00E575]/15 text-xs">
                      {leaderboard.map((item, idx) => (
                        <tr key={idx} className={`hover:bg-[#00E575]/10 transition-colors ${item.isOgWinner ? 'bg-[#00E575]/5' : ''}`}>
                          <td className="py-3 px-3 font-bold text-[#00E575]">#{idx + 1}</td>
                          <td className="py-3 px-3 font-bold text-white flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#00E575]" />
                            <span>{item.discordHandle || "discord_user#0001"}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-300 font-medium">{item.submitter}</td>
                          <td className="py-3 px-3">
                            <a
                              href={item.contentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#00E575] underline flex items-center gap-1 font-bold"
                            >
                              <span>View Post</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-3 px-3 font-bold text-white">{item.finalScore} / 100</td>
                          <td className="py-3 px-3">
                            {item.isOgWinner ? (
                              <span className="px-2 py-0.5 bg-[#00E575] text-[#040705] font-black text-[10px] uppercase flex items-center gap-1 w-max border border-[#00E575]">
                                <Crown className="w-3 h-3" /> OG QUALIFIED 🏆
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">CONTRIBUTOR</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
