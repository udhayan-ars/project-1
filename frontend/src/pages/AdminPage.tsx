import React, { useEffect, useState } from 'react';
import { Terminal, Users, ShieldAlert, FileText, Activity, Search, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { playClick } = useSound();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audits' | 'reports'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('lmcys_token');
        const [ovRes, usrRes, audRes, repRes] = await Promise.all([
          fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/audit-logs?limit=50', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (ovRes.ok && usrRes.ok && audRes.ok && repRes.ok) {
          const ovData = await ovRes.json();
          const usrData = await usrRes.json();
          const audData = await audRes.json();
          const repData = await repRes.json();

          setMetrics(ovData.metrics);
          setUsersList(usrData.users || []);
          setAuditLogs(audData.logs || []);
          setReportsList(repData.reports || []);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-mono">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">ACCESS RESTRICTED</h2>
        <p className="text-xs text-slate-400">
          This command center requires SOC Administrator clearance.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="cyber-card p-6 mb-8 border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-neon-amber text-[10px]">SOC ADMIN COMMAND CENTER</span>
            <span className="text-xs font-mono text-slate-400">• SYSTEM MONITORING & AUDIT</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-extrabold text-white">
            Directorate Administration Ops
          </h1>
          <p className="text-xs font-sans text-slate-300 mt-1 max-w-2xl">
            Real-time cadet tracking, anti-cheat detection flags, NIST incident report reviews, and immutable audit logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <button
            onClick={() => { playClick(); setActiveTab('overview'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'overview' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('users'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'users' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadets ({usersList.length})
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('audits'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'audits' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('reports'); }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'reports' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reports ({reportsList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cyber-card p-4 border-amber-500/20">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">ENROLLED CADETS</span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-amber-400">{metrics?.totalUsers || 0}</span>
            </div>
            <div className="cyber-card p-4 border-cyan-500/20">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">ASSESSMENT ATTEMPTS</span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-cyan-400">{metrics?.totalAttempts || 0}</span>
            </div>
            <div className="cyber-card p-4 border-emerald-500/20">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">SUBMITTED INCIDENT REPORTS</span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-emerald-400">{metrics?.totalReports || 0}</span>
            </div>
            <div className="cyber-card p-4 border-red-500/20">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">ANTI-CHEAT TAB SWITCH FLAGS</span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-red-400">{metrics?.tabSwitchEvents || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CADETS LIST */}
      {activeTab === 'users' && (
        <div className="cyber-card p-5 border-slate-800 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="p-2">Cadet</th>
                <th className="p-2">Role</th>
                <th className="p-2">Current Level</th>
                <th className="p-2">XP Score</th>
                <th className="p-2">SOC Readiness</th>
                <th className="p-2">Focus Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/60">
                  <td className="p-2">
                    <span className="font-bold text-white block">{u.full_name}</span>
                    <span className="text-slate-500 text-[10px]">@{u.username} • {u.email}</span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-2 text-cyan-400">Level {u.current_level}</td>
                  <td className="p-2 text-amber-400">{u.xp} XP</td>
                  <td className="p-2 text-emerald-400 font-bold">{u.soc_readiness}%</td>
                  <td className="p-2">
                    {u.cheating_flags_count > 0 ? (
                      <span className="text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded">
                        ⚠️ {u.cheating_flags_count}
                      </span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audits' && (
        <div className="terminal-window border-slate-800">
          <div className="terminal-header bg-slate-950 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">IMMUTABLE SOC AUDIT TRAIL</span>
            <span className="text-cyan-400">Live Telemetry Recorder Active</span>
          </div>
          <div className="p-4 bg-[#050811] space-y-2 font-mono text-xs max-h-[550px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold mr-2">[{log.action}]</span>
                  <span className="text-slate-300 font-sans text-xs">Target: {log.resource}</span>
                  <span className="text-slate-500 text-[10px] block">Actor: @{log.username || 'Anonymous'} • IP: {log.ip_address}</span>
                </div>
                <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS REVIEW */}
      {activeTab === 'reports' && (
        <div className="space-y-3 font-mono text-xs">
          {reportsList.map((r) => (
            <div key={r.id} className="cyber-card p-4 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-400">Author: <strong className="text-white">@{r.username}</strong></span>
                  <span className="badge-neon-cyan text-[10px]">{r.severity}</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white">{r.title}</h4>
                <p className="text-slate-400 text-[11px] font-sans mt-1 line-clamp-1">{r.findings}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-emerald-400 font-bold text-sm block">Rubric Score: {r.total_score || 0}/5.0</span>
                <span className="text-slate-500 text-[10px]">{new Date(r.submitted_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
