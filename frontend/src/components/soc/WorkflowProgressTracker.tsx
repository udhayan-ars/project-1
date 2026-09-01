import React from 'react';
import { 
  Radio, 
  AlertTriangle, 
  Search, 
  Crosshair, 
  Grid, 
  ShieldCheck, 
  Wrench, 
  HelpCircle, 
  FileCheck,
  ArrowRight
} from 'lucide-react';

interface WorkflowProgressTrackerProps {
  currentStage: number; // 1 to 9
  onSelectStage?: (stage: number) => void;
}

export const WorkflowProgressTracker: React.FC<WorkflowProgressTrackerProps> = ({ 
  currentStage, 
  onSelectStage 
}) => {
  const steps = [
    { num: 1, label: 'EVENT', icon: Radio, desc: 'Telemetry' },
    { num: 2, label: 'ALERT', icon: AlertTriangle, desc: 'Detection' },
    { num: 3, label: 'TRIAGE', icon: Search, desc: 'Scope' },
    { num: 4, label: 'INVESTIGATION', icon: Crosshair, desc: 'Forensics' },
    { num: 5, label: 'IOC ANALYSIS', icon: Search, desc: 'Threat Intel' },
    { num: 6, label: 'MITRE MAPPING', icon: Grid, desc: 'TTP Alignment' },
    { num: 7, label: 'CONTAINMENT', icon: ShieldCheck, desc: 'Isolation' },
    { num: 8, label: 'REMEDIATION', icon: Wrench, desc: 'Eradication' },
    { num: 9, label: 'INCIDENT REPORT', icon: FileCheck, desc: 'NIST/SANS' }
  ];

  return (
    <div className="bg-[#070c18] border border-cyan-500/20 rounded-xl p-3.5 shadow-lg backdrop-blur-md mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-wider text-cyan-400 uppercase">
            SOC ANALYST OPERATIONAL PIPELINE
          </span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            (End-to-End SOC L1 Workflow Execution)
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-300">
          Stage <span className="text-cyan-400 font-bold">{currentStage}</span> of 9:{' '}
          <span className="text-emerald-400 font-semibold">{steps[currentStage - 1]?.label}</span>
        </div>
      </div>

      {/* Pipeline Chain */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 font-mono">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.num < currentStage;
          const isCurrent = step.num === currentStage;

          return (
            <div
              key={step.num}
              onClick={() => onSelectStage && onSelectStage(step.num)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : isCompleted
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold opacity-75">#{step.num}</span>
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse text-cyan-400' : ''}`} />
              </div>
              <div className="font-bold text-[11px] truncate leading-tight">
                {step.label}
              </div>
              <div className="text-[9px] opacity-75 truncate mt-0.5">
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
