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
  Layers
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050807] text-slate-100 font-sans relative overflow-hidden select-none ritual-bg-grid">
      
      {/* Top Announcement Bar */}
      <div className="bg-[#09150f] border-b border-[#00E575]/20 py-2.5 text-center text-xs font-mono text-[#00E575] flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#00E575] animate-ping" />
        <span>LIVE ON RITUAL TESTNET — CHAIN ID 1979</span>
        <span className="bg-[#00E575]/10 text-[#00E575] px-2.5 py-0.5 rounded-full border border-[#00E575]/30 font-semibold">
          TEE & MOCK READY
        </span>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-30 max-w-[1340px] mx-auto flex items-center justify-between px-6 lg:px-12 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00E575] to-[#046A38] flex items-center justify-center shadow-[0_4px_20px_rgba(0,229,117,0.3)]">
            <ShieldCheck className="w-6 h-6 text-[#050807]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Merit<span className="text-[#00E575]">Protocol</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-[#00E575] transition-colors">Features</a>
          <a href="#infrastructure" className="hover:text-[#00E575] transition-colors">Why Ritual</a>
          <a href="#workflow" className="hover:text-[#00E575] transition-colors">Workflow</a>
        </nav>

        <a 
          href="/app.html" 
          className="h-12 px-6 rounded-full bg-[#00E575] hover:bg-[#00C865] text-[#050807] font-extrabold text-sm transition-all shadow-[0_10px_30px_rgba(0,229,117,0.25)] flex items-center gap-2 transform active:scale-95"
        >
          <span>Launch App</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center text-center px-6 pt-16 lg:pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d1c14] border border-[#00E575]/30 text-[#00E575] text-xs font-mono font-bold mb-8 shadow-[0_4px_16px_rgba(0,229,117,0.15)]">
          <Cpu className="w-4 h-4 text-[#00E575]" />
          <span>AI-POWERED REPUTATION & CONTEST ENGINE</span>
        </div>

        <h1 className="text-[clamp(44px,6.5vw,84px)] font-black text-white leading-[1.02] tracking-[-0.04em] max-w-[1000px] mb-8">
          Projects define rules.<br />
          <span className="ritual-gradient-text">Creators contribute. AI evaluates.</span>
        </h1>

        <p className="text-lg md:text-xl font-medium text-slate-300 max-w-[720px] mb-10 leading-relaxed">
          Merit Protocol removes manual administrator bias. Projects lock prize pools on-chain, while Ritual AI evaluates content against transparent rubrics and hard requirements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/app.html" 
            className="h-14 px-9 rounded-full bg-[#00E575] hover:bg-[#00C865] text-[#050807] font-extrabold text-base transition-all shadow-[0_12px_35px_rgba(0,229,117,0.35)] flex items-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Launch Application</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a 
            href="#features" 
            className="h-14 px-8 rounded-full bg-[#0e1a14]/80 hover:bg-[#14261d] border border-[#00E575]/25 text-slate-200 font-semibold text-base transition-colors flex items-center gap-2"
          >
            <span>Explore Architecture</span>
          </a>
        </div>
      </section>

      {/* Core Features Grid Section (mycontext-ai-memory.vercel.app aesthetic) */}
      <section id="features" className="relative z-10 max-w-[1300px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[#00E575]/10 text-[#00E575] text-xs font-mono font-bold mb-3 border border-[#00E575]/20">
            CORE FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Built for Fairness & Ritual TEE Precision
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Everything you need to go from raw creator content to verifiable on-chain reputation and reward payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Feature Card 1 */}
          <div className="glass-card-emerald rounded-[28px] p-8 relative flex flex-col justify-between min-h-[380px] overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E575]/10 border border-[#00E575]/30 text-[#00E575] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Hard Requirement Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Objective criteria (mentions, hashtags, minimum word count, media attachments) are evaluated before AI scoring. Malformed entries fail deterministically.
              </p>
            </div>

            {/* Visual Decorative Pill Component inside card */}
            <div className="mt-8 pt-6 border-t border-[#00E575]/15 space-y-2">
              <div className="bg-[#050807] border border-[#00E575]/30 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="text-[#00E575] font-bold">@Ritual mention</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-3.5 h-3.5" /> PASSED</span>
              </div>
              <div className="bg-[#050807] border border-[#00E575]/30 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="text-[#00E575] font-bold">#RitualTestnet hashtag</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-3.5 h-3.5" /> PASSED</span>
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="glass-card-emerald rounded-[28px] p-8 relative flex flex-col justify-between min-h-[380px] overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E575]/10 border border-[#00E575]/30 text-[#00E575] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Ritual AI Precompiles</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Evaluates qualitative criteria (relevance, accuracy, originality, clarity) via precompile <code className="text-[#00E575] font-mono">0x0802</code> running pinned model <code className="text-[#00E575] font-mono">GLM-4.7-FP8</code>.
              </p>
            </div>

            {/* Visual Graphic Component inside card */}
            <div className="mt-8 pt-6 border-t border-[#00E575]/15">
              <div className="bg-[#050807] border border-[#00E575]/30 rounded-xl p-4 text-center space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>MODEL: GLM-4.7-FP8</span>
                  <span className="text-[#00E575] font-bold">TEE ENCLAVE</span>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">88.4 / 100</div>
                <span className="inline-block text-[11px] font-mono text-slate-400">Relevance 92 • Accuracy 88 • Clarity 94</span>
              </div>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="glass-card-emerald rounded-[28px] p-8 relative flex flex-col justify-between min-h-[380px] overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E575]/10 border border-[#00E575]/30 text-[#00E575] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Soulbound Reputation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Reputation accumulates on-chain and automatically mints non-transferable ERC-721 <code className="text-[#00E575] font-mono">MeritBadge</code> tokens upon reaching role rank thresholds.
              </p>
            </div>

            {/* Visual Badge Card Component */}
            <div className="mt-8 pt-6 border-t border-[#00E575]/15">
              <div className="bg-gradient-to-r from-[#0d1f16] to-[#08130d] border border-[#00E575]/40 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#00E575] font-bold block">SOULBOUND BADGE #104</span>
                  <span className="font-extrabold text-sm text-white">Core Contributor</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#00E575]/20 text-[#00E575] font-mono text-xs font-bold border border-[#00E575]/40">
                  500 PTS
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Infrastructure Section */}
      <section id="infrastructure" className="relative z-10 max-w-[1300px] mx-auto px-6 py-20 border-t border-[#00E575]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#00E575]/10 text-[#00E575] text-xs font-mono font-bold mb-4 border border-[#00E575]/20">
              RITUAL ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Native EVM Precompiles & Multi-Block Workflows
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Merit Protocol is engineered around Ritual's single-async-precompile execution constraint. Multi-block step callbacks are orchestrated natively by the Ritual Scheduler.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#09150f] border border-[#00E575]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#00E575]/20 text-[#00E575] font-bold">0x0801</span>
                  <span className="text-slate-200">HTTP Precompile (Content Retrieval)</span>
                </div>
                <span className="text-slate-500">Short-Running Async</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#09150f] border border-[#00E575]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#00E575]/20 text-[#00E575] font-bold">0x0802</span>
                  <span className="text-slate-200">LLM Precompile (GLM-4.7-FP8)</span>
                </div>
                <span className="text-slate-500">30-Field Request</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#09150f] border border-[#00E575]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#00E575]/20 text-[#00E575] font-bold">0x56e776</span>
                  <span className="text-slate-200">Ritual Native Scheduler</span>
                </div>
                <span className="text-slate-500">Execution Callbacks</span>
              </div>
            </div>
          </div>

          {/* Solidity Code Preview Card */}
          <div className="bg-[#050907] border border-[#00E575]/30 rounded-[28px] p-6 font-mono text-xs leading-relaxed shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-[#00E575]/20 pb-4 mb-4">
              <span className="text-[#00E575] font-bold">MeritAgent.sol — LLM Precompile Call</span>
              <span className="text-slate-500">Solidity 0.8.20</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto">
{`bytes memory llmPayload = abi.encode(
    teeExecutor,          // 0: TEE Executor
    new bytes[](0),       // 1: Secrets
    uint256(300),         // 2: TTL (300 blocks)
    new bytes[](0),       // 3: Signatures
    bytes(""),            // 4: User Key
    string(messagesJson), // 5: Prompt
    "zai-org/GLM-4.7-FP8",// 6: Pinned Model
    int256(0), "", false,
    int256(4096),         // 10: Max Tokens
    "", "", 1, true, 0, "medium",
    "", -1, "auto", "", false,
    700, "", "", -1, 1000, "", false,
    StorageRef("", "", "")// 29: StorageRef
);

(bool ok, bytes memory out) = 
    LLM_PRECOMPILE.call(llmPayload);`}
            </pre>
          </div>
        </div>
      </section>

      {/* Call to Action Container Section (mycontext-ai-memory.vercel.app style) */}
      <section className="relative z-10 max-w-[1140px] mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-[#0a1a11] via-[#050c08] to-[#04120a] border border-[#00E575]/30 rounded-[36px] p-10 md:p-16 shadow-[0_20px_60px_rgba(0,229,117,0.15)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E575]/10 blur-[100px] pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Start building on Merit Protocol today
          </h2>
          <p className="text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            Autonomous creator contests, transparent AI evaluations, and soulbound reputation on Ritual Testnet.
          </p>
          <div className="pt-2">
            <a 
              href="/app.html"
              className="h-14 px-9 rounded-full bg-[#00E575] hover:bg-[#00C865] text-[#050807] font-extrabold text-base transition-all shadow-[0_12px_35px_rgba(0,229,117,0.35)] inline-flex items-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Launch Web Application</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00E575]/15 bg-[#040705] py-10 text-xs text-slate-400 font-mono">
        <div className="max-w-[1300px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00E575] text-[#050807] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">MeritProtocol © 2026</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <span>Ritual Testnet #1979</span>
            <span>TEE Verified</span>
            <span>Zero Admin Bias</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
