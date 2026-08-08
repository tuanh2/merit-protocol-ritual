import React from 'react';
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
  Terminal
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040705] text-slate-100 font-sans relative overflow-hidden select-none ritual-bg-grid-sharp">
      
      {/* Top Technical Status Banner */}
      <div className="bg-[#07110c] border-b border-[#00E575]/30 py-2.5 text-center text-xs font-mono text-[#00E575] flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-none bg-[#00E575] animate-ping" />
        <span>RITUAL TESTNET NETWORK :: CHAIN ID 1979</span>
        <span className="bg-[#00E575]/10 text-[#00E575] px-2 py-0.5 border border-[#00E575]/40 font-bold uppercase tracking-wider">
          SYSTEM ONLINE • TEE & MOCK READY
        </span>
      </div>

      {/* Navigation Bar - Sharp Square Geometric */}
      <header className="relative z-30 max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-[#00E575] text-[#040705] flex items-center justify-center font-black border border-[#00E575]">
            <ShieldCheck className="w-6 h-6 text-[#040705]" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase font-mono">
            Merit<span className="text-[#00E575]">.Protocol</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase font-semibold text-slate-300">
          <a href="#features" className="hover:text-[#00E575] transition-colors">01//FEATURES</a>
          <a href="#infrastructure" className="hover:text-[#00E575] transition-colors">02//ARCHITECTURE</a>
          <a href="#workflow" className="hover:text-[#00E575] transition-colors">03//WORKFLOW</a>
        </nav>

        <a 
          href="/app.html" 
          className="btn-ritual-sharp h-11 px-6 text-xs font-mono uppercase tracking-wider flex items-center gap-2"
        >
          <span>Launch App</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </header>

      {/* Hero Section - Sharp Geometric & Technical */}
      <section className="relative z-10 max-w-[1300px] mx-auto flex flex-col items-center text-center px-6 pt-16 lg:pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#08140e] border border-[#00E575]/40 text-[#00E575] text-xs font-mono font-bold uppercase tracking-wider mb-8">
          <Terminal className="w-4 h-4 text-[#00E575]" />
          <span>AUTONOMOUS REPUTATION & CONTEST REWARD PROTOCOL</span>
        </div>

        <h1 className="text-[clamp(42px,6vw,80px)] font-black text-white leading-[1.02] tracking-[-0.03em] max-w-[1100px] mb-8 font-sans">
          PROJECTS DEFINE RULES.<br />
          <span className="ritual-gradient-text">CREATORS SUBMIT. AI EVALUATES.</span>
        </h1>

        <p className="text-base md:text-lg font-medium text-slate-300 max-w-[760px] mb-10 leading-relaxed font-sans">
          Eliminate manual administrator bias from Web3 creator rewards. Contests lock prize pools on-chain before participation, while Ritual TEE AI evaluates content against immutable rubrics and hard requirements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/app.html" 
            className="btn-ritual-sharp h-14 px-9 text-sm font-mono uppercase tracking-wider flex items-center gap-3"
          >
            <span>Launch Web Application</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a 
            href="#features" 
            className="btn-ritual-outline-sharp h-14 px-8 text-sm font-mono uppercase tracking-wider flex items-center gap-2"
          >
            <span>Read Documentation</span>
          </a>
        </div>
      </section>

      {/* Core Features Grid - Sharp 0px Cards */}
      <section id="features" className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 border-t border-[#00E575]/20">
        <div className="mb-14">
          <span className="inline-block px-3 py-1 bg-[#00E575]/10 text-[#00E575] text-xs font-mono font-bold uppercase tracking-wider border border-[#00E575]/30 mb-3">
            01 // SYSTEM FEATURES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-sans uppercase">
            Deterministic Precision & TEE Verification
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card-sharp p-8 flex flex-col justify-between min-h-[380px] border border-[#00E575]/30">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#00E575]/10 border border-[#00E575]/40 text-[#00E575] flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">Hard Requirement Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Objective criteria (required mentions, mandatory hashtags, word counts, media attachments) are validated before AI processing. Invalid entries fail deterministically.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#00E575]/20 space-y-2 font-mono text-xs">
              <div className="bg-[#040705] border border-[#00E575]/30 p-3 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">@Ritual Mention</span>
                <span className="text-emerald-400 font-bold">VERIFIED [100%]</span>
              </div>
              <div className="bg-[#040705] border border-[#00E575]/30 p-3 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">#RitualTestnet Hashtag</span>
                <span className="text-emerald-400 font-bold">VERIFIED [100%]</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card-sharp p-8 flex flex-col justify-between min-h-[380px] border border-[#00E575]/30">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#00E575]/10 border border-[#00E575]/40 text-[#00E575] flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">Ritual LLM Precompiles</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Qualitative scoring (relevance, accuracy, originality, clarity) executed via precompile <code className="text-[#00E575] font-mono">0x0802</code> with model <code className="text-[#00E575] font-mono">GLM-4.7-FP8</code> inside TEE enclaves.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#00E575]/20 font-mono">
              <div className="bg-[#040705] border border-[#00E575]/30 p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>PRECOMPILE: 0x0802</span>
                  <span className="text-[#00E575] font-bold">TEE VERIFIED</span>
                </div>
                <div className="text-2xl font-black text-white">88.4 / 100</div>
                <div className="text-[11px] text-slate-400">Relevance: 92 | Accuracy: 88 | Clarity: 94</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card-sharp p-8 flex flex-col justify-between min-h-[380px] border border-[#00E575]/30">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#00E575]/10 border border-[#00E575]/40 text-[#00E575] flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">Soulbound Reputation</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Reputation points accrue on-chain and automatically mint non-transferable ERC-721 <code className="text-[#00E575] font-mono">MeritBadge</code> credentials upon reaching rank thresholds.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#00E575]/20 font-mono">
              <div className="bg-[#08140e] border border-[#00E575]/40 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#00E575] font-bold block">MERIT BADGE #104</span>
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
              02 // RITUAL INFRASTRUCTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-sans uppercase mb-6 leading-tight">
              Native Precompiles & Multi-Block Workflows
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 font-sans">
              Merit Protocol enforces Ritual's one-async-precompile constraint by organizing execution into a multi-block state machine coordinated by Ritual's native Scheduler.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-[#07110c] border border-[#00E575]/30 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">0x0801 HTTP Precompile</span>
                <span className="text-slate-400">Content Fetching</span>
              </div>
              <div className="p-4 bg-[#07110c] border border-[#00E575]/30 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">0x0802 LLM Precompile</span>
                <span className="text-slate-400">GLM-4.7-FP8 Model</span>
              </div>
              <div className="p-4 bg-[#07110c] border border-[#00E575]/30 flex items-center justify-between">
                <span className="text-[#00E575] font-bold">0x56e776 Scheduler</span>
                <span className="text-slate-400">Multi-Block Callbacks</span>
              </div>
            </div>
          </div>

          <div className="bg-[#030604] border border-[#00E575]/40 p-6 font-mono text-xs leading-relaxed shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#00E575]/30 pb-4 mb-4">
              <span className="text-[#00E575] font-bold">MeritAgent.sol — Precompile Invocation</span>
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

      {/* Call to Action Container Section - Sharp Geometric */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 py-20">
        <div className="bg-[#07120c] border border-[#00E575]/40 p-10 md:p-16 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white font-sans uppercase tracking-tight">
            Start Building on Merit Protocol Today
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
            Deploy autonomous creator contests, lock prize escrow, and leverage Ritual AI precompiles on Ritual Testnet.
          </p>
          <div className="pt-2">
            <a 
              href="/app.html"
              className="btn-ritual-sharp h-14 px-9 text-sm font-mono uppercase tracking-wider inline-flex items-center gap-3"
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
            <span className="font-bold text-white uppercase">MeritProtocol © 2026</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <span>RITUAL TESTNET #1979</span>
            <span>TEE VERIFIED</span>
            <span>ZERO ADMIN BIAS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
