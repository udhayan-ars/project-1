import React, { useState } from 'react';
import { 
  Grid, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { MitreTechnique } from '../../types/soc';

interface MitreAttackPageProps {
  onPivotToAlerts?: (techniqueId: string) => void;
}

export const MitreAttackPage: React.FC<MitreAttackPageProps> = ({ onPivotToAlerts }) => {
  const { mitreTechniques, alerts } = useSOC();
  const [selectedTactic, setSelectedTactic] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTechnique, setActiveTechnique] = useState<MitreTechnique | null>(mitreTechniques[0] || null);

  const tacticsList = [
    'ALL',
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Defense Evasion',
    'Credential Access',
    'Discovery',
    'Command and Control',
    'Exfiltration'
  ];

  const attackChainSteps = [
    { num: 1, name: 'Initial Access', tech: 'T1566 / T1190' },
    { num: 2, name: 'Execution', tech: 'T1059.001 (PowerShell)' },
    { num: 3, name: 'Persistence', tech: 'T1053.005 (SchTasks)' },
    { num: 4, name: 'Privilege Escalation', tech: 'T1548.003 (Sudo)' },
    { num: 5, name: 'Credential Access', tech: 'T1003.001 (LSASS)' },
    { num: 6, name: 'Discovery', tech: 'T1046 (Port Scan)' },
    { num: 7, name: 'Command & Control', tech: 'T1071.001 (HTTPS C2)' },
    { num: 8, name: 'Exfiltration', tech: 'T1071.004 (DNS Exfil)' }
  ];

  const filteredTechniques = mitreTechniques.filter(t => {
    const matchesTactic = selectedTactic === 'ALL' || t.tactic.toLowerCase().includes(selectedTactic.toLowerCase());
    const matchesSearch = 
      t.technique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.technique_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTactic && matchesSearch;
  });

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              MITRE ATT&CK® ENTERPRISE FRAMEWORK ALIGNMENT
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Adversary Tactics, Techniques, and Common Knowledge (TTP) mapped directly to active SIEM detections.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
          Mapped Techniques: <strong>{mitreTechniques.length}</strong>
        </div>
      </div>

      {/* Visual Attack Chain Progression */}
      <div className="p-4 rounded-xl bg-[#070b16] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase">
            END-TO-END ADVERSARY ATTACK CHAIN EXECUTION LIFECYCLE
          </span>
          <span className="text-[10px] text-cyan-400">Cyber Kill Chain Correlation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {attackChainSteps.map(step => (
            <div
              key={step.num}
              onClick={() => {
                const matched = mitreTechniques.find(m => m.tactic.toLowerCase().includes(step.name.toLowerCase().split(' ')[0]));
                if (matched) setActiveTechnique(matched);
              }}
              className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-400 hover:bg-slate-900 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="text-[10px] text-cyan-400 font-bold">Phase {step.num}</div>
              <div className="text-xs font-bold text-slate-200 truncate mt-0.5">{step.name}</div>
              <div className="text-[10px] text-slate-500 truncate mt-1">{step.tech}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#070b16] border border-slate-800 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Technique ID, Name, or Description..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Tactic Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {tacticsList.map(tactic => (
            <button
              key={tactic}
              onClick={() => setSelectedTactic(tactic)}
              className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-all ${
                selectedTactic === tactic
                  ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tactic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Techniques Cards + Selected Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Matrix Technique Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTechniques.map(tech => {
            const isSelected = activeTechnique?.id === tech.id;
            return (
              <div
                key={tech.id}
                onClick={() => setActiveTechnique(tech)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[#090e1d] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-cyan-400">{tech.technique_id}</span>
                    <span className="px-2 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] uppercase font-semibold">
                      {tech.tactic}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-100 mt-1">{tech.technique_name}</h3>
                  <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-amber-400 font-bold">{tech.mapped_alerts_count} Active Alerts</span>
                  <span className="text-slate-500 flex items-center gap-0.5">Inspect →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Technique Deep Inspector */}
        <div className="lg:col-span-1">
          {activeTechnique ? (
            <div className="p-5 rounded-xl bg-[#090e1d] border border-cyan-500/30 shadow-xl space-y-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold text-[10px]">
                    {activeTechnique.tactic}
                  </span>
                  <span className="font-bold text-cyan-400">{activeTechnique.technique_id}</span>
                </div>
                <h2 className="text-sm font-bold text-slate-100 mt-2">
                  {activeTechnique.technique_name}
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold">TACTIC DESCRIPTION</span>
                <p className="text-slate-300 leading-relaxed">{activeTechnique.description}</p>
              </div>

              {/* Real World Evidence */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-amber-400 text-[10px] uppercase font-bold">OBSERVED EVIDENCE EXAMPLE</span>
                <p className="text-slate-200 font-mono text-[11px] leading-relaxed">{activeTechnique.evidence_example}</p>
              </div>

              {/* Detection Logic */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-cyan-400 text-[10px] uppercase font-bold">SIEM DETECTION LOGIC</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{activeTechnique.detection_logic}</p>
              </div>

              {/* Mitigation Hardening */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="text-emerald-400 text-[10px] uppercase font-bold">DEFENSIVE MITIGATION & HARDENING</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{activeTechnique.mitigation}</p>
              </div>

              {/* Action */}
              {onPivotToAlerts && (
                <button
                  onClick={() => onPivotToAlerts(activeTechnique.technique_id)}
                  className="w-full py-2 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900 font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                >
                  <span>Filter Alerts for {activeTechnique.technique_id}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#090e1d] border border-slate-800 text-center text-slate-500 text-xs">
              Select a MITRE technique to view detection logic and mitigation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
