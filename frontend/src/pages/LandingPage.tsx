import React, { useState } from 'react';
import { Shield, Terminal, ArrowRight, Activity, Radio, Cpu, Lock, CheckCircle2, Award, Zap, BookOpen, Layers } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const { playClick } = useSound();
  const [activeTerminalTab, setActiveTerminalTab] = useState<'log' | 'alert' | 'triage'>('log');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 max-w-7xl mx-auto text-center">
        {/* Neon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-xs mb-6 shadow-[0_0_15px_rgba(0,243,255,0.2)] animate-cyber-pulse">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>PROJECT LMCYS • NEXT-GEN GAMIFIED SOC L1 PLATFORM</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto">
          Let’s Make <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Cyber Security Simple</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
          The all-in-one gamified training academy designed to transform ambitious students into battle-ready <span className="text-cyan-300 font-semibold">SOC Level 1 Analysts</span> through realistic log analysis, alert triage, incident investigation, and report writing.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => { playClick(); onStart(); }}
            className="cyber-btn-primary py-3.5 px-8 text-sm"
          >
            <span>Launch Cyber Training</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => { playClick(); onLogin(); }}
            className="cyber-btn-secondary py-3.5 px-6 text-sm"
          >
            <span>Cadet Sign In</span>
          </button>
        </div>

        {/* USP Ribbon */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono text-slate-400">
          <div className="p-2 rounded bg-slate-900/50 border border-slate-800">🎯 1. LEARN</div>
          <div className="p-2 rounded bg-slate-900/50 border border-slate-800">⚡ 2. PRACTICE</div>
          <div className="p-2 rounded bg-slate-900/50 border border-slate-800">🔍 3. INVESTIGATE</div>
          <div className="p-2 rounded bg-slate-900/50 border border-slate-800">📊 4. ANALYZE</div>
          <div className="p-2 rounded bg-slate-900/50 border border-slate-800">📝 5. REPORT</div>
          <div className="p-2 rounded bg-slate-900/50 border border-slate-800">🏆 6. PROVE SOC SKILLS</div>
        </div>
      </section>

      {/* Interactive Cyber HUD Preview */}
      <section className="px-4 max-w-6xl mx-auto pb-20">
        <div className="terminal-window shadow-[0_0_50px_rgba(0,243,255,0.15)]">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 ml-2 font-mono">lmcys-soc-terminal@defense-core:~</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTerminalTab('log')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  activeTerminalTab === 'log' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Log Stream
              </button>
              <button
                onClick={() => setActiveTerminalTab('alert')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  activeTerminalTab === 'alert' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400'
                }`}
              >
                Alert LMCYS-4821
              </button>
              <button
                onClick={() => setActiveTerminalTab('triage')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  activeTerminalTab === 'triage' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                }`}
              >
                SOC Decision Tree
              </button>
            </div>
          </div>

          <div className="p-6 bg-[#060913] text-left text-xs font-mono min-h-[260px]">
            {activeTerminalTab === 'log' && (
              <div className="space-y-2 text-slate-300">
                <p className="text-cyan-400 font-bold">$ siem-query --event-id 4625 --src 185.220.101.7 --tail 4</p>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1 text-slate-300">
                  <p><span className="text-red-400">[03:14:02]</span> EventID:4625 User:administrator SrcIP:185.220.101.7 Status:0xC000006A (Bad Password)</p>
                  <p><span className="text-red-400">[03:14:05]</span> EventID:4625 User:administrator SrcIP:185.220.101.7 Status:0xC000006A (Bad Password)</p>
                  <p><span className="text-red-400">[03:14:08]</span> EventID:4625 User:administrator SrcIP:185.220.101.7 Status:0xC000006A (Bad Password)</p>
                  <p><span className="text-emerald-400 font-bold">[03:14:18] EventID:4624 User:administrator SrcIP:185.220.101.7 LogonType:10 (RDP Breach Success!)</span></p>
                </div>
                <p className="text-amber-400">💡 SOC Cadets use real telemetry patterns to uncover password guessing and brute force attempts.</p>
              </div>
            )}

            {activeTerminalTab === 'alert' && (
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-red-400 font-bold">ALERT: Multiple Failed RDP Logons Followed by Elevated Logon</span>
                  <span className="badge-neon-red">SEVERITY: HIGH</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <p>Target Host: <span className="text-white">CORP-DC-01 (10.0.0.15)</span></p>
                  <p>MITRE Technique: <span className="text-cyan-300">T1110.001 (Brute Force)</span></p>
                  <p>Attacker IP: <span className="text-red-300 font-bold">185.220.101.7</span></p>
                  <p>SLA Target: <span className="text-amber-300">&lt; 30 Minutes</span></p>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  Action Required: Extract IOCs, verify authentication timeline, determine True/False Positive, and isolate endpoint.
                </p>
              </div>
            )}

            {activeTerminalTab === 'triage' && (
              <div className="space-y-2 text-slate-300">
                <p className="text-emerald-400 font-bold">✅ SOC L1 Analyst Triage Protocol:</p>
                <div className="space-y-1.5 pl-2 border-l-2 border-cyan-500/50">
                  <p className="text-cyan-300">1. Verification: Confirmed external IP 185.220.101.7 repeated unauthorized login attempts.</p>
                  <p className="text-purple-300">2. True Positive Decision: Attacker gained elevated RDP access and spawned powershell.exe.</p>
                  <p className="text-red-400">3. Containment: Isolated CORP-DC-01 from internal subnet; blocked IP 185.220.101.7 at perimeter firewall.</p>
                  <p className="text-amber-300">4. Report Writing: 13-section incident report submitted and evaluated automatically.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center mb-12">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white">
            Engineered for SOC Level 1 Excellence
          </h2>
          <p className="text-slate-400 font-sans text-sm mt-2">
            Bridging theoretical classroom cybersecurity with real industry operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card p-6">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
              100-Level Structured Curriculum
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              From Networking and Windows/Linux event IDs to SIEM correlation, EDR telemetry, and NIST incident response across 10 progressive zones.
            </p>
          </div>

          <div className="cyber-card p-6">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
              <Radio className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
              SOC Practical Arena & Log Triage
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Analyze realistic synthetic logs, investigate live alert feeds, detect indicators of compromise, and master True Positive vs False Positive decisions.
            </p>
          </div>

          <div className="cyber-card p-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
              Automated Report Grading & Credential
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Draft comprehensive 13-section incident reports scored with instant heuristic feedback and earn your verifiable digital SOC L1 certificate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
