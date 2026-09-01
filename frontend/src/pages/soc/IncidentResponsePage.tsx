import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Clock, 
  CheckCircle2, 
  Ban, 
  UserX, 
  FileText, 
  ArrowRight,
  RotateCcw,
  Layers,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { SOCIncident, IncidentStatus } from '../../types/soc';

interface IncidentResponsePageProps {
  onDraftReport: (incident: SOCIncident) => void;
}

export const IncidentResponsePage: React.FC<IncidentResponsePageProps> = ({ onDraftReport }) => {
  const { 
    incidents, 
    updateIncidentStatus, 
    assignIncidentAnalyst, 
    performContainmentAction,
    toggleAssetQuarantine,
    assets
  } = useSOC();

  const [activeIncident, setActiveIncident] = useState<SOCIncident | null>(incidents[0] || null);
  const [containmentInput, setContainmentInput] = useState<string>('');

  const statusWorkflow: IncidentStatus[] = [
    'NEW',
    'TRIAGED',
    'INVESTIGATING',
    'CONTAINED',
    'ERADICATED',
    'RECOVERED',
    'CLOSED'
  ];

  const handleStatusChange = (newStatus: IncidentStatus) => {
    if (!activeIncident) return;
    updateIncidentStatus(activeIncident.id, newStatus);
    setActiveIncident(prev => prev ? { ...prev, current_status: newStatus } : null);
  };

  const handleAction = (type: 'host_isolated' | 'ip_blocked' | 'credentials_reset' | 'process_killed', desc: string) => {
    if (!activeIncident) return;
    performContainmentAction(activeIncident.id, type, desc);
    
    if (type === 'host_isolated') {
      const asset = assets.find(a => a.hostname === activeIncident.affected_host);
      if (asset && asset.status !== 'QUARANTINED') {
        toggleAssetQuarantine(asset.id);
      }
    }

    setActiveIncident(prev => {
      if (!prev) return null;
      return {
        ...prev,
        containment_status: {
          ...prev.containment_status,
          [type]: true
        },
        containment_actions_taken: [
          ...prev.containment_actions_taken,
          `[${new Date().toISOString().substring(11, 19)} UTC] ${desc}`
        ]
      };
    });
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              INCIDENT RESPONSE (IR) LIFECYCLE MANAGEMENT
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            SANS & NIST SP 800-61 Incident Handling: Triage → Containment → Eradication → Recovery → Post-Incident Report.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
            Active Incidents: {incidents.filter(i => i.current_status !== 'CLOSED').length}
          </span>
        </div>
      </div>

      {/* Main Grid: Incident List + Incident Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Incidents List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-bold text-slate-400 px-1 uppercase">
            Incidents Under Management ({incidents.length})
          </div>
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {incidents.map(inc => {
              const isSelected = activeIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setActiveIncident(inc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-[#090e1d] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-cyan-400">{inc.incident_id}</span>
                    <span className={`px-2 py-0.2 rounded font-bold uppercase ${
                      inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      inc.severity === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                      'bg-blue-950 text-blue-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-100 line-clamp-2">{inc.title}</h3>

                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                    <span>Host: <strong className="text-slate-200">{inc.affected_host}</strong></span>
                    <span className={`font-bold ${
                      inc.current_status === 'CLOSED' ? 'text-slate-500' :
                      inc.current_status === 'CONTAINED' ? 'text-emerald-400' :
                      'text-purple-400'
                    }`}>
                      {inc.current_status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Incident Workspace */}
        <div className="lg:col-span-2">
          {activeIncident ? (
            <div className="p-5 rounded-xl bg-[#090e1d] border border-cyan-500/30 shadow-xl space-y-6 text-xs">
              
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 text-sm">{activeIncident.incident_id}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      activeIncident.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-amber-950 text-amber-400'
                    }`}>
                      {activeIncident.severity}
                    </span>
                    <span className="text-[11px] text-slate-400">Detected: {activeIncident.detection_time}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-100 mt-1">
                    {activeIncident.title}
                  </h2>
                </div>

                <button
                  onClick={() => onDraftReport(activeIncident)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)] shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Draft SANS Incident Report</span>
                </button>
              </div>

              {/* Status Workflow Progression State Machine */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-bold uppercase">INCIDENT LIFECYCLE WORKFLOW</span>
                  <span className="text-cyan-400 font-bold">CURRENT: {activeIncident.current_status}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                  {statusWorkflow.map((st, idx) => {
                    const isCurrent = activeIncident.current_status === st;
                    const isPassed = statusWorkflow.indexOf(activeIncident.current_status) >= idx;

                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`p-2 rounded-lg text-[10px] font-bold transition-all border ${
                          isCurrent
                            ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                            : isPassed
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <div>#{idx + 1}</div>
                        <div className="truncate">{st}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AFFECTED HOST</div>
                  <div className="font-bold text-slate-200 mt-0.5">{activeIncident.affected_host}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AFFECTED USER</div>
                  <div className="font-bold text-slate-200 mt-0.5">{activeIncident.affected_user}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">ATTACKER SOURCE IP</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{activeIncident.source_ip}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">ASSIGNED ANALYST</div>
                  <div className="font-bold text-slate-200 mt-0.5">{activeIncident.assigned_analyst}</div>
                </div>
              </div>

              {/* Summary & Impact */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">INCIDENT SUMMARY</div>
                  <p className="text-slate-200 leading-relaxed">{activeIncident.summary}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">IMPACT ASSESSMENT</div>
                  <p className="text-slate-300 leading-relaxed">{activeIncident.impact_scope}</p>
                </div>
              </div>

              {/* Containment Checklist & Real-time Action Buttons */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-slate-400 text-xs font-bold uppercase">
                  CONTAINMENT & ERADICATION ACTIONS CHECKLIST
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleAction('host_isolated', `EDR Network Isolation applied to ${activeIncident.affected_host}`)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      activeIncident.containment_status.host_isolated
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 hover:border-cyan-400 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-400" />
                      <div>
                        <div className="font-bold">1. Isolate Host</div>
                        <div className="text-[10px] text-slate-400">Quarantine endpoint from LAN</div>
                      </div>
                    </div>
                    {activeIncident.containment_status.host_isolated && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleAction('ip_blocked', `Perimeter firewall rule deployed blocking IP ${activeIncident.source_ip}`)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      activeIncident.containment_status.ip_blocked
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 hover:border-cyan-400 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-bold">2. Block Attacker IP</div>
                        <div className="text-[10px] text-slate-400">Deploy perimeter drop ACL</div>
                      </div>
                    </div>
                    {activeIncident.containment_status.ip_blocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleAction('credentials_reset', `Forced password reset & token revocation for ${activeIncident.affected_user}`)}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      activeIncident.containment_status.credentials_reset
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 hover:border-cyan-400 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-bold">3. Reset Credentials</div>
                        <div className="text-[10px] text-slate-400">Revoke OAuth & Active Directory</div>
                      </div>
                    </div>
                    {activeIncident.containment_status.credentials_reset && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => handleAction('process_killed', 'Terminated malicious C2 dropper process tree & rundll32 threads')}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      activeIncident.containment_status.process_killed
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 hover:border-cyan-400 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-bold">4. Terminate Threat PID</div>
                        <div className="text-[10px] text-slate-400">Kill spawned memory processes</div>
                      </div>
                    </div>
                    {activeIncident.containment_status.process_killed && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Immutable Containment Action Log */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-[10px] uppercase font-bold">
                  INCIDENT CONTAINMENT & AUDIT LOG
                </div>
                <div className="space-y-1">
                  {activeIncident.containment_actions_taken.map((act, idx) => (
                    <div key={idx} className="text-emerald-400 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#090e1d] border border-slate-800 text-center text-slate-500 text-xs">
              Select an active incident from the queue to manage its containment workflow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
