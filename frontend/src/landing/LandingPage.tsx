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
  Layers
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 py-2 text-center text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>LIVE ON RITUAL TESTNET — CHAIN ID 1979</span>
        <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">TEE & MOCK READY</span>
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">MERIT</span>
              <span className="font-light text-xl text-cyan-400 ml-1">PROTOCOL</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#contests" className="hover:text-cyan-400 transition-colors">Contests</a>
            <a href="#reputation" className="hover:text-cyan-400 transition-colors">Reputation & Badges</a>
            <a href="#infrastructure" className="hover:text-cyan-400 transition-colors">Why Ritual</a>
          </div>

          <a 
            href="/app.html" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 text-sm"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-semibold mb-8 backdrop-blur-sm">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI-Driven Web3 Contribution & Reputation Infrastructure</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
            Projects define the rules.<br />
            Creators contribute.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400">
              AI evaluates. Contracts reward.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Merit Protocol removes manual administrator bias from creator rewards. 
            Contests lock prizes on-chain before participation, while Ritual AI evaluates content against immutable rubrics and hard requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/app.html" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all text-base transform hover:-translate-y-0.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#how-it-works" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-colors text-base"
            >
              <span>Explore How It Works</span>
            </a>
          </div>
        </div>
      </section>

      {/* Visual Workflow Pipeline */}
      <section id="how-it-works" className="py-20 px-6 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Autonomous Multi-Block Lifecycle</h2>
            <p className="text-slate-400">
              Every contest and contribution runs through an immutable on-chain state machine coordinated by Ritual TEE precompiles and Scheduler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-bold text-lg">1</div>
              <h3 className="font-bold text-base mb-2">Create Rules</h3>
              <p className="text-xs text-slate-400">Project defines hard requirements & scoring weights before contest starts.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 font-bold text-lg">2</div>
              <h3 className="font-bold text-base mb-2">Lock Rewards</h3>
              <p className="text-xs text-slate-400">Complete ERC-20 prize pool is escrowed into MeritProtocol contract.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-bold text-lg">3</div>
              <h3 className="font-bold text-base mb-2">Creators Submit</h3>
              <p className="text-xs text-slate-400">Submissions verified for duplicates and objective hard requirements.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-bold text-lg">4</div>
              <h3 className="font-bold text-base mb-2">Ritual AI Judges</h3>
              <p className="text-xs text-slate-400">Ritual LLM (0x0802) evaluates relevance, accuracy, originality, clarity.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-bold text-lg">5</div>
              <h3 className="font-bold text-base mb-2">Reputation Updates</h3>
              <p className="text-xs text-slate-400">Deterministic points accrue. Non-transferable MeritBadge minted on threshold.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-bold text-lg">6</div>
              <h3 className="font-bold text-base mb-2">Winners Paid</h3>
              <p className="text-xs text-slate-400">Contest end block triggers automatic winner settlement from escrow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Ritual Section */}
      <section id="infrastructure" className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold mb-4">
                <Code2 className="w-4 h-4" />
                CONCRETE RITUAL INFRASTRUCTURE
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
                Native AI Precompiles & Multi-Block Workflows
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Unlike web2 apps that call closed centralized APIs, Merit Protocol relies on Ritual Chain's native EVM precompiles running inside TEE-verified environments.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">0x801</div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">HTTP Precompile (0x0801)</h4>
                    <p className="text-xs text-slate-400">Fetches external contribution data from social platforms with verifiable TEE execution.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">0x802</div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">LLM Precompile (0x0802) — GLM-4.7-FP8</h4>
                    <p className="text-xs text-slate-400">Evaluates content against rubric dimensions (relevance, accuracy, originality, clarity) and returns structured JSON scores.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">0x56e</div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">Native Ritual Scheduler (0x56e776...)</h4>
                    <p className="text-xs text-slate-400">Coordinates multi-block state transitions to comply with Ritual's one-async-precompile-per-transaction policy.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 font-mono text-xs text-slate-300 relative shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <span className="text-cyan-400 font-bold">MeritAgent.sol — Precompile Execution</span>
                <span className="text-slate-500">Solidity 0.8.20</span>
              </div>
              <pre className="overflow-x-auto leading-relaxed text-slate-300">
{`// Construct 30-field LLM request for 0x0802
bytes memory llmPayload = abi.encode(
    teeExecutor,
    new bytes[](0),
    uint256(300), // ttl: 300 blocks
    new bytes[](0),
    bytes(""),
    string(messagesJson),
    "zai-org/GLM-4.7-FP8",
    int256(0), "", false,
    int256(4096), // maxCompletionTokens
    "", "", 1, true, 0, "medium",
    "", -1, "auto", "", false,
    700, "", "", -1, 1000, "", false,
    StorageRef("", "", "")
);

(bool success, bytes memory rawOutput) = 
    LLM_PRECOMPILE.call(llmPayload);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-extrabold text-lg text-white">MERIT PROTOCOL</span>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Deployed on Ritual Testnet (Chain ID 1979) • RPC: https://rpc.ritualfoundation.org
          </div>

          <a 
            href="/app.html" 
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            Launch Dashboard <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
