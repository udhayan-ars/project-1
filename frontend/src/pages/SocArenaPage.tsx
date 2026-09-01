import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  Database, 
  Eye, 
  Terminal,
  Lock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Alert, SyntheticLog } from '../types';

interface SocArenaPageProps {
  onWriteReport: (alertData: any) => void;
  onBackToMap?: () => void;
}

export const SocArenaPage: React.FC<SocArenaPageProps> = ({ onWriteReport, onBackToMap }) => {
  const { user } = useAuth();
  const { playClick, playSuccess, playFailure } = useSound();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [logs, setLogs] = useState<SyntheticLog[]>([]);
  const [logFilterCategory, setLogFilterCategory] = useState<string>('');
  const [logFilterSeverity, setLogFilterSeverity] = useState<string>('');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  // Lock status
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [completedLevelsCount, setCompletedLevelsCount] = useState<number>(user?.current_level ? user.current_level - 1 : 0);
  const [lockMessage, setLockMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Investigation Workflow Form
  const [selectedDecision, setSelectedDecision] = useState<'True Positive' | 'False Positive' | ''>('');
  const [reasoning, setReasoning] = useState<string>('');
  const [recommendedAction, setRecommendedAction] = useState<string>('Isolate host from network, block source IP on edge firewall, rotate credentials');
  const [investigationResult, setInvestigationResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);

  useEffect(() => {
    const fetchArenaData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('lmcys_token');
        const [alertRes, logRes] = await Promise.all([
          fetch('/api/alerts', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/alerts/data/logs?limit=50', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (alertRes.status === 403 || logRes.status === 403) {
          const errData = await alertRes.json().catch(() => ({}));
          setIsLocked(true);
          setCompletedLevelsCount(errData.completedCount || (user?.current_level ? user.current_level - 1 : 0));
          setLockMessage(errData.message || 'Complete all 100 levels to unlock.');
          setLoading(false);
          return;
        }

        if (alertRes.ok && logRes.ok) {
          const alertData = await alertRes.json();
          const logData = await logRes.json();
          setAlerts(alertData.alerts || []);
          setLogs(logData.logs || []);
          setIsLocked(false);
          if (alertData.alerts && alertData.alerts.length > 0) {
            setSelectedAlert(alertData.alerts[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load SOC arena telemetry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArenaData();
  }, [user]);

  const handleFetchFilteredLogs = async () => {
    try {
      const token = localStorage.getItem('lmcys_token');
      const params = new URLSearchParams();
      if (logFilterCategory) params.append('category', logFilterCategory);
      if (logFilterSeverity) params.append('severity', logFilterSeverity);
      if (logSearchQuery) params.append('search', logSearchQuery);

      const res = await fetch(`/api/alerts/data/logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to filter logs:', err);
    }
  };

  const handleSubmitInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert || !selectedDecision || !reasoning.trim()) return;

    setSubmitting(true);
    playClick();

    try {
      const token = localStorage.getItem('lmcys_token');
      const res = await fetch('/api/alerts/investigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          decision: selectedDecision,
          reasoning,
          recommendedAction,
          evidenceSelected: ['Event ID 4625 x 4', 'Event ID 4624 LogonType 10', selectedAlert.source_ip]
        })
      });

      const data = await res.json();
      setInvestigationResult(data);

      if (data.isCorrect) {
        playSuccess();
      } else {
        playFailure();
      }
    } catch (err) {
      console.error('Investigation submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-cyan-400">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Verifying Security Clearance & SOC Arena Telemetry...</p>
        </div>
      </div>
    );
  }

  // Gated Screen when student has not completed all 100 levels
  if (isLocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="cyber-card p-8 md:p-12 border-red-500/50 shadow-[0_0_50px_rgba(255,51,102,0.25)] text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-2xl bg-red-950/70 border border-red-500/60 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,51,102,0.4)] animate-pulse">
            <Lock className="w-10 h-10 text-red-400" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-400 mb-3">
              SIMULATION CLEARANCE GATED
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-4xl font-extrabold text-white">
              🔒 PRACTICAL SOC SIMULATION LOCKED
            </h1>
            <p className="text-sm font-sans text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
              Per the LMCYS SOC L1 training specification, the <strong className="text-white">Let's Defend Practical Arena</strong> and its 1000+ simulated security logs unlock only after completing all <strong className="text-cyan-400">100 learning levels</strong>.
            </p>
          </div>

          {/* Progress Breakdown */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-3 max-w-md mx-auto">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 uppercase text-[10px]">Curriculum Completion Progress</span>
              <span className="text-cyan-400 font-bold">{completedLevelsCount} / 100 Levels</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                style={{ width: `${Math.min(100, Math.max(5, (completedLevelsCount / 100) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Remaining: <strong className="text-amber-400">{Math.max(0, 100 - completedLevelsCount)} levels</strong></span>
              <span>Status: <strong className="text-red-400">In Training</strong></span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={onBackToMap}
              className="cyber-btn-primary py-3 px-8 text-xs uppercase font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to 100 Levels Map</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="cyber-card p-6 mb-8 border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-neon-red text-[10px]">LIVE SOC PRACTICAL ARENA</span>
            <span className="text-xs font-mono text-slate-400">• SYNTHETIC SIEM LOG TRIAGE • 1000+ LOG REPOSITORY</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-extrabold text-white">
            Security Operations Center (SOC) Triage Arena
          </h1>
          <p className="text-xs font-sans text-slate-300 mt-1 max-w-2xl">
            Analyze live synthetic alerts, search the raw SIEM log database, extract evidence, determine True/False Positives, and generate NIST-compliant incident reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onWriteReport(selectedAlert)}
            className="cyber-btn-primary py-2 px-4 text-xs font-mono flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Draft Incident Report</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Alert Queue & Investigation, Right Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Alert Queue & Forensic Workflow (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Alert Card */}
          {selectedAlert && (
            <div className="cyber-card p-5 border-cyan-500/40">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-neon-cyan text-[10px] font-mono">{selectedAlert.alert_code}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  selectedAlert.severity === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {selectedAlert.severity} SEVERITY
                </span>
              </div>

              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white mb-2">
                {selectedAlert.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                {selectedAlert.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800 mb-4">
                <div>
                  <span className="text-slate-500 text-[10px] block">SOURCE IP</span>
                  <span className="text-red-400 font-bold">{selectedAlert.source_ip}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DESTINATION HOST</span>
                  <span className="text-cyan-400 font-bold">{selectedAlert.dest_ip}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MITRE TTP</span>
                  <span className="text-purple-400">{selectedAlert.mitre_technique}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">CATEGORY</span>
                  <span className="text-slate-300">{selectedAlert.category}</span>
                </div>
              </div>

              {/* Investigation Form */}
              <form onSubmit={handleSubmitInvestigation} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">1. VERDICT DECISION</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('True Positive')}
                      className={`p-2.5 rounded-lg border font-bold transition-all ${
                        selectedDecision === 'True Positive'
                          ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_10px_rgba(255,51,102,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      TRUE POSITIVE (MALICIOUS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('False Positive')}
                      className={`p-2.5 rounded-lg border font-bold transition-all ${
                        selectedDecision === 'False Positive'
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      FALSE POSITIVE (BENIGN)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">2. ANALYST REASONING & EVIDENCE</label>
                  <textarea
                    rows={3}
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="Document evidence findings (e.g. repeated Event ID 4625 failures followed by Event ID 4624 LogonType 10 from external IP)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">3. RECOMMENDED CONTAINMENT ACTION</label>
                  <input
                    type="text"
                    value={recommendedAction}
                    onChange={(e) => setRecommendedAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedDecision || !reasoning.trim()}
                  className="cyber-btn-primary w-full py-2.5 text-xs uppercase tracking-wider font-bold disabled:opacity-50"
                >
                  {submitting ? 'Evaluating Investigation...' : 'Submit Triage Verdict'}
                </button>
              </form>

              {/* Investigation Feedback Result */}
              {investigationResult && (
                <div className={`mt-4 p-4 rounded-xl border font-mono text-xs space-y-2 animate-fadeIn ${
                  investigationResult.isCorrect ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-red-950/40 border-red-500/50 text-red-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {investigationResult.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span>{investigationResult.isCorrect ? 'TRIAGE VERDICT ACCURATE!' : 'INCORRECT VERDICT DECISION'}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {investigationResult.conceptExplanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: SIEM Log Streamer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="cyber-card p-5 border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider">
                  Raw SIEM Log Stream (Filterable)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Showing {logs.length} events</span>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 font-mono text-xs">
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchFilteredLogs()}
                placeholder="Search IP, host, user, or msg..."
                className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />

              <select
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="Authentication">Authentication</option>
                <option value="Network">Network</option>
                <option value="Process">Process</option>
                <option value="DNS">DNS</option>
              </select>

              <button
                type="button"
                onClick={handleFetchFilteredLogs}
                className="cyber-btn-secondary py-2 px-3 text-xs"
              >
                Apply Filters
              </button>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Severity</th>
                    <th className="p-2">Event ID</th>
                    <th className="p-2">Source IP</th>
                    <th className="p-2">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-900/60">
                      <td className="p-2 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          log.severity === 'CRITICAL' ? 'bg-red-950 text-red-300' :
                          log.severity === 'HIGH' ? 'bg-orange-950 text-orange-300' :
                          log.severity === 'MEDIUM' ? 'bg-amber-950 text-amber-300' : 'bg-blue-950 text-blue-300'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-2 text-cyan-400 font-bold">{log.event_id || 'N/A'}</td>
                      <td className="p-2 text-slate-300 whitespace-nowrap">{log.source_ip || 'Internal'}</td>
                      <td className="p-2 text-slate-300 max-w-xs truncate">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
