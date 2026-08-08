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
  Terminal,
  XCircle,
  FileText,
  FolderPlus,
  Settings,
  Crown,
  Link as LinkIcon,
  User,
  MessageSquare,
  Calendar
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
  // Role Selection: 'owner' (Open Contest / Campaign) OR 'contributor' (Participant)
  const [userRoleMode, setUserRoleMode] = useState<'owner' | 'contributor' | null>(null);

  const [activeTab, setActiveTab] = useState<'contribute_hub' | 'open_campaign' | 'leaderboard' | 'reputation'>('contribute_hub');
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [blockHeight, setBlockHeight] = useState<number>(104520);
  const [isRpcOnline, setIsRpcOnline] = useState(true);
  const [isMockMode, setIsMockMode] = useState(true);

  // Projects & Campaigns State
  const [projects, setProjects] = useState<ProjectCampaignData[]>(SHOWCASE_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectCampaignData>(SHOWCASE_PROJECTS[0]);

  // Submissions & Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(SHOWCASE_LEADERBOARD);
  const [submissions, setSubmissions] = useState<SubmissionData[]>(SHOWCASE_SUBMISSIONS);

  // Submission Inputs (X Link + Discord Username)
  const [submissionUrl, setSubmissionUrl] = useState('https://x.com/crypto_builder/status/19824001');
  const [discordHandle, setDiscordHandle] = useState('builder#1234');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [latestEvaluationResult, setLatestEvaluationResult] = useState<any | null>(null);

  // New Project/Campaign Creation State (For Owner)
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
  const [newCampaignKeyword, setNewCampaignKeyword] = useState('Precompile');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  // User Profile Stats
  const [userReputation, setUserReputation] = useState(463);
  const userRole = 'Verified Contributor';

  // Separate Projects into 2 Columns: Contests (1-off) vs Project Campaigns (Continuous)
  const contestList = projects.filter(p => p.type === 'CONTEST');
  const campaignList = projects.filter(p => p.type === 'PROJECT_CAMPAIGN');

  // Load RPC Chain Status
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

  // Handle Project/Campaign Submission (X Link + Discord Username)
  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !submissionUrl || !discordHandle) {
      alert("Please enter both your X Post URL and Discord Username.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('AWAITING_WALLET_SIGNATURE');
    setTxHash(null);

    // 1. Auto-Fetch Post Content Direct from X URL via Precompile 0x0801 HTTP Engine
    const fetchedText = fetchXPostTextFromUrl(submissionUrl);

    // 2. Evaluate Fetched Post Content against Project's Custom Settings
    const evalResult = evaluateSubmissionContent(fetchedText, selectedProject.requirements);
    setLatestEvaluationResult(evalResult);

    try {
      if (account) {
        // Send Real Write Transaction on Ritual Testnet via MetaMask
        const hash = await submitEntryOnChain(selectedProject.id, submissionUrl, account);
        setTxHash(hash);
        setSubmissionStatus('TX_BROADCASTED_ON_RITUAL');
      } else {
        const mockHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
        setTxHash(mockHash);
        setSubmissionStatus('SUBMITTED_ANONYMOUS');
      }

      setTimeout(() => setSubmissionStatus('FETCHING_X_DATA_0x0801'), 1000);
      setTimeout(() => setSubmissionStatus('REQUIREMENTS_VERIFIED'), 2000);
      setTimeout(() => setSubmissionStatus('AI_EVALUATING_0x0802'), 3000);
      setTimeout(() => {
        setSubmissionStatus('SCORED');
        const newSubId = Date.now();
        const submitterAddr = account ? `${account.substring(0, 6)}...${account.substring(38)}` : "0xUSER...42A1";

        const newSubmission: SubmissionData = {
          id: newSubId,
          contestId: selectedProject.id,
          projectId: selectedProject.id,
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
          aiBreakdown: {
            relevance: evalResult.aiScore,
            accuracy: evalResult.aiScore,
            originality: evalResult.aiScore,
            clarity: evalResult.aiScore,
            usefulness: evalResult.aiScore,
            creativity: evalResult.aiScore,
            reason: evalResult.reason,
            usedMock: isMockMode,
            hasPassedHardReqs: evalResult.hasPassedHardReqs,
            failedRequirementsList: evalResult.failedRequirementsList
          }
        };

        setSubmissions(prev => [newSubmission, ...prev]);

        // Update Project Trackers & Leaderboard
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, totalSubmissionsTracked: p.totalSubmissionsTracked + 1 } : p));

        setLeaderboard(prev => {
          const updated = [
            { 
              submissionId: newSubId, 
              projectId: selectedProject.id,
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
            isOgWinner: index < selectedProject.topOgLimit && item.finalScore >= 80
          }));
        });

        if (evalResult.hasPassedHardReqs) {
          setUserReputation(prev => prev + 25);
        }
        
        setIsSubmitting(false);
      }, 4000);
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
          requiredKeywords: [newCampaignKeyword],
        }
      };

      setProjects(prev => [...prev, createdItem]);
      setSelectedProject(createdItem);
      setIsCreatingCampaign(false);
      setActiveTab('contribute_hub');
      alert(`Campaign "${newCampaignName}" (${newCampaignType}) activated! OG Roles: Top ${newCampaignOgLimit} (${newCampaignFreq}).`);
    }, 1200);
  }

  // Presets
  const fillValidUrl = () => {
    setSubmissionUrl("https://x.com/crypto_builder/status/19824001");
    setDiscordHandle("satoshi_builder#1001");
  };

  const fillInvalidUrl = () => {
    setSubmissionUrl("https://x.com/spammer/status/1982999-fail-invalid");
    setDiscordHandle("spammer_bot#9999");
  };

  return (
    <div className="min-h-screen bg-[#040705] text-slate-100 font-sans flex flex-col selection:bg-[#00E575] selection:text-[#040705] ritual-bg-grid-sharp select-none">
      
      {/* Onboarding Role Selection Modal */}
      {!userRoleMode && (
        <div className="fixed inset-0 z-50 bg-[#040705]/95 backdrop-blur-md flex items-center justify-center p-6 border-4 border-[#00E575]/40 font-mono">
          <div className="max-w-xl w-full glass-card-sharp p-8 space-y-6 text-center border-2 border-[#00E575]">
            <div className="w-12 h-12 bg-[#00E575] text-[#040705] flex items-center justify-center font-black mx-auto">
              <ShieldCheck className="w-7 h-7 text-[#040705]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
                Welcome to Merit Protocol
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                Select your role to open new campaigns or contribute to active Web3 project contests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => { setUserRoleMode('owner'); setActiveTab('open_campaign'); }}
                className="p-6 bg-[#07110c] hover:bg-[#00E575]/15 border-2 border-[#00E575]/40 hover:border-[#00E575] text-left transition-all group space-y-3"
              >
                <div className="flex justify-between items-center text-[#00E575] font-bold text-xs">
                  <span>ROLE 01</span>
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-white text-base group-hover:text-[#00E575] uppercase">
                  Open Contest / Project Campaign
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Create contest or open project campaign. Set OG roles (3 or 4) & weekly/monthly cycle.
                </p>
              </button>

              <button
                onClick={() => { setUserRoleMode('contributor'); setActiveTab('contribute_hub'); }}
                className="p-6 bg-[#07110c] hover:bg-[#00E575]/15 border-2 border-[#00E575]/40 hover:border-[#00E575] text-left transition-all group space-y-3"
              >
                <div className="flex justify-between items-center text-[#00E575] font-bold text-xs">
                  <span>ROLE 02</span>
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-white text-base group-hover:text-[#00E575] uppercase">
                  Contributor
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Browse 2 horizontal columns (Contest vs Project Campaign). Submit X link + Discord username.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

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

          <div className="flex items-center gap-4 font-mono text-xs">
            {userRoleMode && (
              <button
                onClick={() => setUserRoleMode(userRoleMode === 'owner' ? 'contributor' : 'owner')}
                className="bg-[#00E575]/15 border border-[#00E575]/40 text-[#00E575] px-3.5 py-2 font-bold uppercase hover:bg-[#00E575]/25 transition-colors"
              >
                MODE: {userRoleMode === 'owner' ? "PROJECT OWNER" : "CONTRIBUTOR"} ⚙️
              </button>
            )}

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

      {/* Main Dashboard Layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="glass-card-sharp p-3 space-y-1">
            <button
              onClick={() => setActiveTab('contribute_hub')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'contribute_hub' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>01//Contribute Hub</span>
            </button>

            {userRoleMode === 'owner' && (
              <button
                onClick={() => setActiveTab('open_campaign')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                  activeTab === 'open_campaign' 
                    ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>02//Open Campaign</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'leaderboard' 
                  ? 'bg-[#00E575] text-[#040705] font-black border border-[#00E575]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#07110c]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>03//Participant List</span>
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
              <span>04//Reputation Badges</span>
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
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="glass-card-sharp p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00E575] font-bold mb-1 uppercase tracking-wider">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>TEST PRESETS</span>
            </div>

            <button
              onClick={fillValidUrl}
              className="w-full text-[11px] font-mono py-2.5 bg-[#00E575]/20 hover:bg-[#00E575]/30 text-[#00E575] border border-[#00E575] font-bold uppercase text-left px-3 flex items-center justify-between"
            >
              <span>Valid Post & Discord</span>
              <span className="text-emerald-400 font-bold">✓ PASS (96/100)</span>
            </button>

            <button
              onClick={fillInvalidUrl}
              className="w-full text-[11px] font-mono py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/40 font-bold uppercase text-left px-3 flex items-center justify-between"
            >
              <span>Invalid Post & Discord</span>
              <span className="text-red-400 font-bold">✗ FAIL (15/100)</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: CONTRIBUTE HUB (2 HORIZONTAL COLUMNS: CONTEST vs PROJECT CAMPAIGN) */}
          {activeTab === 'contribute_hub' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white font-sans uppercase tracking-tight mb-1">
                  01 // Contribute Hub (Horizontal Columns)
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Select a contest (1-off entry) or project campaign (continuous tracking for 50+ posts) to submit your X link & Discord handle.
                </p>
              </div>

              {/* 2 HORIZONTAL COLUMNS SIDE-BY-SIDE */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* COLUMN 1: ONE-OFF CONTESTS */}
                <div className="glass-card-sharp p-6 space-y-6 border-t-4 border-t-[#00E575]">
                  <div className="flex items-center justify-between border-b border-[#00E575]/20 pb-4 font-mono">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#00E575]" />
                      <h3 className="font-extrabold text-white text-lg uppercase font-sans">One-Off Contests</h3>
                    </div>
                    <span className="text-xs text-[#00E575] font-bold bg-[#00E575]/10 px-2.5 py-1 border border-[#00E575]/30">
                      1 SUBMISSION PER ENTRY
                    </span>
                  </div>

                  <div className="space-y-4">
                    {contestList.map(c => (
                      <div 
                        key={c.id}
                        className={`p-5 bg-[#040705] border transition-all space-y-4 ${
                          selectedProject?.id === c.id 
                            ? 'border-2 border-[#00E575] shadow-[0_0_20px_rgba(0,229,117,0.2)]' 
                            : 'border-[#00E575]/30 hover:border-[#00E575]/60'
                        }`}
                      >
                        <div className="flex justify-between items-start font-mono">
                          <span className="text-xs text-[#00E575] font-bold">CONTEST #{c.id}</span>
                          <span className="text-xs text-white font-bold font-mono px-2 py-0.5 bg-[#00E575]/15 border border-[#00E575]/40">
                            {c.totalEscrow} MERIT
                          </span>
                        </div>
                        <h4 className="font-black text-white text-base">{c.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                        
                        <div className="flex gap-2 pt-2 border-t border-[#00E575]/20 font-mono text-xs">
                          <button
                            onClick={() => setSelectedProject(c)}
                            className="btn-ritual-sharp flex-1 py-2 text-center font-bold uppercase"
                          >
                            Nộp Link X
                          </button>
                          <button
                            onClick={() => { setSelectedProject(c); setActiveTab('leaderboard'); }}
                            className="btn-ritual-outline-sharp px-4 py-2 uppercase font-bold"
                          >
                            Xem Leaderboard
                          </button>
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
                      <h3 className="font-extrabold text-white text-lg uppercase font-sans">Project Campaigns</h3>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/30">
                      TRACKS 50+ POSTS / OG ROLES
                    </span>
                  </div>

                  <div className="space-y-4">
                    {campaignList.map(p => (
                      <div 
                        key={p.id}
                        className={`p-5 bg-[#040705] border transition-all space-y-4 ${
                          selectedProject?.id === p.id 
                            ? 'border-2 border-[#00E575] shadow-[0_0_20px_rgba(0,229,117,0.2)]' 
                            : 'border-[#00E575]/30 hover:border-[#00E575]/60'
                        }`}
                      >
                        <div className="flex justify-between items-start font-mono text-xs">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5" /> TOP {p.topOgLimit} GET OG ROLE ({p.frequency})
                          </span>
                          <span className="text-white font-bold font-mono px-2 py-0.5 bg-[#00E575]/15 border border-[#00E575]/40">
                            {p.totalEscrow} MERIT
                          </span>
                        </div>
                        <h4 className="font-black text-white text-base">{p.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                        
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                          <span>Tracked Submissions: <strong className="text-white">{p.totalSubmissionsTracked} Posts</strong></span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[#00E575]/20 font-mono text-xs">
                          <button
                            onClick={() => setSelectedProject(p)}
                            className="btn-ritual-sharp flex-1 py-2 text-center font-bold uppercase"
                          >
                            Nộp Link X (Track History)
                          </button>
                          <button
                            onClick={() => { setSelectedProject(p); setActiveTab('leaderboard'); }}
                            className="btn-ritual-outline-sharp px-4 py-2 uppercase font-bold"
                          >
                            Xem Leaderboard
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Selected Item Submission Workspace */}
              {selectedProject && (
                <div className="glass-card-sharp p-6 space-y-6 border-2 border-[#00E575]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00E575]/20 pb-6">
                    <div>
                      <span className="text-xs font-mono text-[#00E575] font-bold block mb-1">
                        SELECTED: {selectedProject.name} ({selectedProject.type})
                      </span>
                      <h3 className="text-2xl font-black text-white uppercase">{selectedProject.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{selectedProject.description}</p>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="text-2xl font-black text-[#00E575] block">{selectedProject.totalEscrow} MERIT</span>
                      <span className="text-xs text-slate-400">CYCLE: {selectedProject.frequency} • TOP {selectedProject.topOgLimit} GET OG ROLE</span>
                    </div>
                  </div>

                  {/* Submission Form (X Link + Discord Username) */}
                  <form onSubmit={handleProjectSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 mb-2 flex items-center gap-1.5">
                          <LinkIcon className="w-4 h-4 text-[#00E575]" />
                          <span>1. X / Twitter Post Link</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://x.com/your_handle/status/19824001"
                          className="w-full bg-[#07110c] border border-[#00E575]/40 px-4 py-3.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 mb-2 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-[#00E575]" />
                          <span>2. Discord Username</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={discordHandle}
                          onChange={(e) => setDiscordHandle(e.target.value)}
                          placeholder="e.g. builder#1234 or @discord_user"
                          className="w-full bg-[#07110c] border border-[#00E575]/40 px-4 py-3.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-ritual-sharp h-14 px-8 text-xs font-mono uppercase tracking-wider flex items-center gap-3 w-full justify-center"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Signing Wallet & Auto-Fetching X Data..." : `Sign Wallet & Submit Entry to ${selectedProject.name}`}</span>
                    </button>
                  </form>

                  {/* Instant TxHash Display */}
                  {txHash && (
                    <div className="p-5 bg-[#08150e] border-2 border-[#00E575] font-mono text-xs space-y-3 shadow-[0_0_25px_rgba(0,229,117,0.3)]">
                      <div className="flex items-center justify-between text-[#00E575] font-black uppercase text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#00E575]" />
                          <span>TRANSACTION BROADCASTED ON RITUAL TESTNET</span>
                        </div>
                        <span className="bg-[#00E575] text-[#040705] px-2.5 py-0.5 text-[10px] font-bold">LIVE ON-CHAIN</span>
                      </div>

                      <div className="bg-[#040705] p-3.5 border border-[#00E575]/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                              <span className="text-[#00E575]">X POST CONTENT PASSED — HIGH QUALITY SCORE</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500" />
                              <span className="text-red-400">X POST CONTENT FAILED — LOW SCORE PENALTY</span>
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
            </div>
          )}

          {/* TAB 2: OPEN CAMPAIGN / CONTEST CREATION (PROJECT OWNER MODE) */}
          {activeTab === 'open_campaign' && (
            <div className="glass-card-sharp p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">
                  02 // Open Campaign or Create Contest
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Create a 1-off contest or continuous project campaign. Set OG Role limits (3 or 4), cycle frequency (weekly/monthly), and lock prize escrow.
                </p>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">CAMPAIGN / CONTEST NAME</label>
                    <input
                      type="text"
                      required
                      value={newCampaignName}
                      onChange={(e) => setNewCampaignName(e.target.value)}
                      placeholder="e.g. Ritual AI Hackathon Campaign"
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">TYPE</label>
                    <select
                      value={newCampaignType}
                      onChange={(e: any) => setNewCampaignType(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E575]"
                    >
                      <option value="PROJECT_CAMPAIGN">Continuous Project Campaign (Track 50+ posts)</option>
                      <option value="CONTEST">One-Off Contest (1 Submission per entry)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">OG EVALUATION FREQUENCY</label>
                    <select
                      value={newCampaignFreq}
                      onChange={(e: any) => setNewCampaignFreq(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00E575]"
                    >
                      <option value="MONTHLY">Monthly (Hàng Tháng)</option>
                      <option value="WEEKLY">Weekly (Hàng Tuần)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">ALLOCATED OG ROLES (E.G. 3 OR 4)</label>
                    <input
                      type="number"
                      value={newCampaignOgLimit}
                      onChange={(e) => setNewCampaignOgLimit(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">ESCROW PRIZE POOL (MERIT)</label>
                    <input
                      type="number"
                      value={newCampaignEscrow}
                      onChange={(e) => setNewCampaignEscrow(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 uppercase">CAMPAIGN DESCRIPTION & RUBRIC</label>
                  <textarea
                    rows={3}
                    value={newCampaignDesc}
                    onChange={(e) => setNewCampaignDesc(e.target.value)}
                    placeholder="Describe campaign rules and criteria..."
                    className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E575]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">REQUIRED @MENTION</label>
                    <input
                      type="text"
                      value={newCampaignMention}
                      onChange={(e) => setNewCampaignMention(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">REQUIRED #HASHTAG</label>
                    <input
                      type="text"
                      value={newCampaignHashtag}
                      onChange={(e) => setNewCampaignHashtag(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 uppercase">MIN WORD COUNT</label>
                    <input
                      type="number"
                      value={newCampaignMinWords}
                      onChange={(e) => setNewCampaignMinWords(e.target.value)}
                      className="w-full bg-[#040705] border border-[#00E575]/30 px-4 py-3 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCampaign}
                  className="btn-ritual-sharp w-full h-13 text-xs font-mono uppercase tracking-wider"
                >
                  {isCreatingCampaign ? "Saving Campaign & Locking Escrow..." : "Activate Campaign & Lock Escrow Prize"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PARTICIPANT LIST & OG RANKINGS */}
          {activeTab === 'leaderboard' && (
            <div className="glass-card-sharp p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white font-sans uppercase tracking-tight mb-1">
                  03 // Participant List & Un-Biased Ranking
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Transparent ranking calculated automatically by Ritual AI. Displays X post link, Discord username, quality score, and OG Role qualification.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#00E575]/30 text-slate-400 bg-[#07110c]">
                      <th className="py-3.5 px-4 uppercase">RANK</th>
                      <th className="py-3.5 px-4 uppercase">DISCORD USERNAME</th>
                      <th className="py-3.5 px-4 uppercase">WALLET ADDRESS</th>
                      <th className="py-3.5 px-4 uppercase">X POST LINK</th>
                      <th className="py-3.5 px-4 uppercase">AI SCORE</th>
                      <th className="py-3.5 px-4 uppercase">OG ROLE STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00E575]/15 text-xs">
                    {leaderboard.map((item, idx) => (
                      <tr key={idx} className={`hover:bg-[#00E575]/10 transition-colors ${item.isOgWinner ? 'bg-[#00E575]/5' : ''}`}>
                        <td className="py-4 px-4 font-bold text-[#00E575]">#{idx + 1}</td>
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#00E575]" />
                          <span>{item.discordHandle || "discord_user#0001"}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-300 font-medium">{item.submitter}</td>
                        <td className="py-4 px-4">
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
                        <td className="py-4 px-4 font-bold text-white">{item.finalScore} / 100</td>
                        <td className="py-4 px-4">
                          {item.isOgWinner ? (
                            <span className="px-2.5 py-1 bg-[#00E575] text-[#040705] font-black text-[10px] uppercase flex items-center gap-1 w-max border border-[#00E575]">
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

          {/* TAB 4: REPUTATION BADGES */}
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

        </main>
      </div>
    </div>
  );
}
