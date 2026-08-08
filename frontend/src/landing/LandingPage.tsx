import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Trophy, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Code2, 
  ExternalLink,
  Sparkles,
  Lock,
  Search,
  Check,
  Layers,
  Terminal,
  Activity,
  Layers3,
  UserCheck,
  Send
} from 'lucide-react';
import GreenSmokeCursor from '../components/GreenSmokeCursor';

export default function LandingPage() {
  const [introFinished, setIntroFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [introStepText, setIntroStepText] = useState("INITIALIZING RITUAL ENCLAVE");

  // Terminal Boot Sequence
  useEffect(() => {
    const steps = [
      { p: 25, text: "CONNECTING TO RITUAL TESTNET 1979" },
      { p: 50, text: "LOADING PRECOMPILES 0x0801 HTTP AND 0x0802 LLM" },
      { p: 75, text: "VERIFYING TEE ENCLAVE SIGNATURES GLM 4.7 FP8" },
      { p: 100, text: "MERIT PROTOCOL CORE SYSTEM ONLINE" },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setProgress(current);

      if (current >= 25 && current < 50) setIntroStepText(steps[0].text);
      if (current >= 50 && current < 75) setIntroStepText(steps[1].text);
      if (current >= 75 && current < 100) setIntroStepText(steps[2].text);
      if (current >= 100) {
        setIntroStepText(steps[3].text);
        clearInterval(interval);
        setTimeout(() => setIntroFinished(true), 600);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#040705] text-slate-100 font-sans relative overflow-hidden select-none ritual-bg-grid-sharp">
      
      {/* Interactive Green Smoke Cursor Particle Canvas */}
      <GreenSmokeCursor />

      {/* Intro Screen Animation */}
      {!introFinished && (
        <div className="fixed inset-0 z-50 bg-[#040705] flex flex-col items-center justify-center p-6 font-mono border-4 border-[#00E575]/40 transition-opacity duration-700">
          <div className="max-w-md w-full space-y-6">
            <div className="flex items-center gap-3 border-b border-[#00E575]/30 pb-4">
              <div className="w-8 h-8 bg-[#00E575] text-[#040705] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#040705]" />
              </div>
              <span className="font-black text-xl text-white uppercase tracking-wider">
                MERIT <span className="text-[#00E575]">SYS</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#00E575] font-bold">
                <span>SYSTEM BOOT</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-3 bg-[#07110c] border border-[#00E575]/40 p-0.5">
                <div 
                  className="h-full bg-[#00E575] transition-all duration-75 shadow-[0_0_15px_#00E575]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-[#07110c] border border-[#00E575]/30 p-3 text-[11px] text-[#00E575] font-mono h-16 flex items-center">
              <span>{`> ${introStepText}`}</span>
            </div>

            <button
              onClick={() => setIntroFinished(true)}
              className="w-full py-2 bg-[#00E575]/10 hover:bg-[#00E575]/20 text-[#00E575] border border-[#00E575]/40 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              SKIP INTRO
            </button>
          </div>
        </div>
      )}

      {/* Top Status Banner */}
      <div className="bg-[#07110c] border-b border-[#00E575]/30 py-2.5 text-center text-xs font-mono text-[#00E575] flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-none bg-[#00E575] animate-ping" />
        <span>RITUAL TESTNET NETWORK CHAIN ID 1979</span>
        <span className="bg-[#00E575]/10 text-[#00E575] px-2 py-0.5 border border-[#00E575]/40 font-bold uppercase tracking-wider">
          SYSTEM ONLINE TEE READY
        </span>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-30 max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00E575] text-[#040705] flex items-center justify-center font-black border border-[#00E575]">
            <ShieldCheck className="w-6 h-6 text-[#040705]" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase font-mono">
            Merit <span className="text-[#00E575]">Protocol</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase font-semibold text-slate-300">
          <a href="#features" className="hover:text-[#00E575] transition-colors">01 FEATURES</a>
          <a href="#infrastructure" className="hover:text-[#00E575] transition-colors">02 ARCHITECTURE</a>
          <a href="#workflow" className="hover:text-[#00E575] transition-colors">03 WORKFLOW</a>
        </nav>

        <a 
          href="/app.html" 
          className="btn-ritual-sharp h-11 px-6 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
        >
          <span>Launch App</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1300px] mx-auto flex flex-col items-center text-center px-6 pt-16 lg:pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#08140e] border border-[#00E575]/40 text-[#00E575] text-xs font-mono font-bold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(0,229,117,0.2)]">
          <Terminal className="w-4 h-4 text-[#00E575]" />
          <span>AUTONOMOUS REPUTATION AND CONTEST REWARD PROTOCOL</span>
        </div>

        {/* 3 DISTINCT LINES FOR EACH CONCEPT */}
        <h1 className="text-[clamp(42px,6vw,80px)] font-black text-white leading-[1.08] tracking-[-0.03em] max-w-[1100px] mb-8 font-sans uppercase">
          <span className="block">PROJECTS DEFINE RULES</span>
          <span className="block text-[#00E575]">CREATORS SUBMIT</span>
          <span className="block ritual-gradient-text">AI EVALUATES</span>
        </h1>

        <p className="text-base md:text-lg font-medium text-slate-300 max-w-[760px] mb-10 leading-relaxed font-sans">
          Remove administrator bias from Web3 creator rewards by locking escrow prize pools on chain before participation while Ritual TEE AI verifies content quality against immutable rubrics
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/app.html" 
            className="btn-ritual-sharp h-14 px-9 text-sm font-mono uppercase tracking-wider flex items-center gap-3 justify-center font-bold"
          >
            <span>Launch Web Application</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a 
            href="#workflow" 
            className="btn-ritual-outline-sharp h-14 px-8 text-sm font-mono uppercase tracking-wider flex items-center justify-center font-bold"
          >
            Explore Workflow
          </a>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 border-t border-[#00E575]/20">
        <div className="mb-14">
          <span className="inline-block px-3 py-1 bg-[#00E575]/10 text-[#00E575] text-xs font-mono font-bold uppercase tracking-wider border border-[#00E575]/30 mb-3">
            01 SYSTEM FEATURES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-sans uppercase">
            Deterministic Precision and TEE Verification
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card-sharp p-8 flex flex-col justify-between min-h-[380px] border border-[#00E575]/30">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#00E575]/10 border border-[#00E575]/40 text-[#00E575] flex items-center justify-center font-bold font-mono">
                <CheckCircle2 className="w-5 h-5 text-[#00E575]" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">Hard Requirement Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Objective criteria including required mentions mandatory hashtags and word counts are validated before AI processing so invalid submissions fail automatically
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#00E575]/20 space-y-2 font-mono text-xs">
              <div className="bg-[#040705] border border-[#00E575]/30 p-3 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">@Ritual Mention</span>
                <span className="text-emerald-400 font-bold">VERIFIED 100%</span>
              </div>
              <div className="bg-[#040705] border border-[#00E575]/30 p-3 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">#RitualTestnet Hashtag</span>
                <span className="text-emerald-400 font-bold">VERIFIED 100%</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card-sharp p-8 flex flex-col justify-between min-h-[380px] border border-[#00E575]/30">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#00E575]/10 border border-[#00E575]/40 text-[#00E575] flex items-center justify-center font-bold font-mono">
                <Cpu className="w-5 h-5 text-[#00E575]" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">Ritual LLM Precompiles</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Qualitative scoring evaluating relevance accuracy and clarity executes via precompile 0x0802 running model GLM 4.7 FP8 inside TEE enclaves
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#00E575]/20 font-mono">
              <div className="bg-[#040705] border border-[#00E575]/30 p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>PRECOMPILE 0x0802</span>
                  <span className="text-[#00E575] font-bold">TEE VERIFIED</span>
                </div>
                <div className="text-2xl font-black text-white">88.4 / 100</div>
                <div className="text-[11px] text-slate-400">Relevance 92 | Accuracy 88 | Clarity 94</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card-sharp p-8 flex flex-col justify-between min-h-[380px] border border-[#00E575]/30">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#00E575]/10 border border-[#00E575]/40 text-[#00E575] flex items-center justify-center font-bold font-mono">
                <Award className="w-5 h-5 text-[#00E575]" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">Soulbound Reputation</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Contribution points accrue on chain and automatically mint non transferable ERC-721 MeritBadge credentials upon reaching rank thresholds
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#00E575]/20 font-mono">
              <div className="bg-[#08140e] border border-[#00E575]/40 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#00E575] font-bold block">MERIT BADGE 104</span>
                  <span className="font-bold text-sm text-white">Core Contributor</span>
                </div>
                <span className="px-3 py-1 bg-[#00E575]/20 text-[#00E575] font-bold text-xs border border-[#00E575]/50">
                  500 PTS
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Architecture Section */}
      <section id="infrastructure" className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 border-t border-[#00E575]/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-[#00E575]/10 text-[#00E575] text-xs font-mono font-bold uppercase tracking-wider border border-[#00E575]/30 mb-4">
              02 RITUAL INFRASTRUCTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-sans uppercase mb-6 leading-tight">
              Native Precompiles and Multi-Block Workflows
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 font-sans">
              Merit Protocol handles async AI execution by organizing processing steps into a multi-block state machine managed by Ritual native Scheduler
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-[#07110c] border border-[#00E575]/30 flex items-center justify-between">
                <span className="text-[#00E575] font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00E575]" />
                  <span>0x0801 HTTP Precompile</span>
                </span>
                <span className="text-slate-400">Content Fetching</span>
              </div>
              <div className="p-4 bg-[#07110c] border border-[#00E575]/30 flex items-center justify-between">
                <span className="text-[#00E575] font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00E575]" />
                  <span>0x0802 LLM Precompile</span>
                </span>
                <span className="text-slate-400">GLM 4.7 FP8 Model</span>
              </div>
              <div className="p-4 bg-[#07110c] border border-[#00E575]/30 flex items-center justify-between">
                <span className="text-[#00E575] font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00E575]" />
                  <span>0x56e776 Scheduler</span>
                </span>
                <span className="text-slate-400">Multi-Block Callbacks</span>
              </div>
            </div>
          </div>

          <div className="bg-[#030604] border border-[#00E575]/40 p-6 font-mono text-xs leading-relaxed shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#00E575]/30 pb-4 mb-4">
              <span className="text-[#00E575] font-bold">MeritAgent.sol Precompile Invocation</span>
              <span className="text-slate-500">Solidity 0.8.20</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto">
{`bytes memory llmPayload = abi.encode(
    teeExecutor,          // TEE Executor
    new bytes[](0),       // Secrets
    uint256(300),         // TTL: 300 blocks
    new bytes[](0),       // Signatures
    bytes(""),            // User Key
    string(messagesJson), // Prompt
    "zai-org/GLM-4.7-FP8",// Pinned Model
    int256(0), "", false,
    int256(4096),         // Max Tokens
    "", "", 1, true, 0, "medium",
    "", -1, "auto", "", false,
    700, "", "", -1, 1000, "", false,
    StorageRef("", "", "")// StorageRef
);

(bool ok, bytes memory out) = 
    LLM_PRECOMPILE.call(llmPayload);`}
            </pre>
          </div>
        </div>
      </section>

      {/* DEDICATED WORKFLOW SECTION (SMOOTH SCROLL DESTINATION) */}
      <section id="workflow" className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 border-t border-[#00E575]/20">
        <div className="mb-14 text-center">
          <span className="inline-block px-3 py-1 bg-[#00E575]/10 text-[#00E575] text-xs font-mono font-bold uppercase tracking-wider border border-[#00E575]/30 mb-3">
            03 END TO END WORKFLOW
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-sans uppercase">
            Four Step Autonomous Protocol Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          
          <div className="glass-card-sharp p-6 space-y-4 border border-[#00E575]/30">
            <div className="w-10 h-10 bg-[#00E575]/20 text-[#00E575] flex items-center justify-center font-bold text-base border border-[#00E575]/40">
              01
            </div>
            <h3 className="font-extrabold text-white text-base uppercase font-sans">1 Create Campaign</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Project owner locks prize escrow on chain and defines evaluation rubric requirements
            </p>
          </div>

          <div className="glass-card-sharp p-6 space-y-4 border border-[#00E575]/30">
            <div className="w-10 h-10 bg-[#00E575]/20 text-[#00E575] flex items-center justify-center font-bold text-base border border-[#00E575]/40">
              02
            </div>
            <h3 className="font-extrabold text-white text-base uppercase font-sans">2 Submit Entry</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Contributor signs wallet transaction submitting post link and discord username
            </p>
          </div>

          <div className="glass-card-sharp p-6 space-y-4 border border-[#00E575]/30">
            <div className="w-10 h-10 bg-[#00E575]/20 text-[#00E575] flex items-center justify-center font-bold text-base border border-[#00E575]/40">
              03
            </div>
            <h3 className="font-extrabold text-white text-base uppercase font-sans">3 Ritual AI Evaluates</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Precompile 0x0801 fetches tweet data and 0x0802 computes GLM 4.7 FP8 quality score inside TEE
            </p>
          </div>

          <div className="glass-card-sharp p-6 space-y-4 border border-[#00E575]/30">
            <div className="w-10 h-10 bg-[#00E575]/20 text-[#00E575] flex items-center justify-center font-bold text-base border border-[#00E575]/40">
              04
            </div>
            <h3 className="font-extrabold text-white text-base uppercase font-sans">4 Rank and OG Award</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Leaderboard ranks top contributors and automatically assigns OG role credentials
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action Container Section */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 py-20">
        <div className="bg-[#07120c] border border-[#00E575]/40 p-10 md:p-16 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white font-sans uppercase tracking-tight">
            Start Building on Merit Protocol Today
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
            Deploy autonomous creator contests lock prize escrow and leverage Ritual AI precompiles on Ritual Testnet
          </p>
          <div className="pt-2">
            <a 
              href="/app.html"
              className="btn-ritual-sharp h-14 px-9 text-sm font-mono uppercase tracking-wider inline-flex items-center gap-3 justify-center font-bold"
            >
              <span>Launch Web Application</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00E575]/20 bg-[#030604] py-8 text-xs font-mono text-slate-400">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00E575] text-[#040705] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white uppercase">MeritProtocol 2026</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <span>RITUAL TESTNET 1979</span>
            <span>TEE VERIFIED</span>
            <span>ZERO ADMIN BIAS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
