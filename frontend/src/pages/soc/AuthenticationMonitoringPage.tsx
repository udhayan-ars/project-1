import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  ShieldAlert, 
  Globe, 
  Lock, 
  UserX, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { AuthRecord } from '../../types/soc';

export const AuthenticationMonitoringPage: React.FC = () => {
  const { authLogs, addAnalystNote } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLogs = authLogs.filter(log => {
    const matchesSearch = 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.anomaly_description && log.anomaly_description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || log.auth_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRevokeAccount = (username: string) => {
    addAnalystNote({
      title: `Account Lockout & MFA Reset: ${username}`,
      category: 'CONTAINMENT',
      content: `Forced emergency session revocation, password reset, and hardware MFA requirement for account ${username}.`,
      author: 'SOC L1 Analyst'
    });
    alert(`Account ${username} locked and active sessions revoked.`);
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              IDENTITY & AUTHENTICATION THREAT MONITOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detect SSH brute-force, password spraying, impossible travel anomalies, and unauthorized privilege escalation.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
          {authLogs.filter(a => a.is_anomaly).length} Identity Anomalies Flagged
        </div>
      </div>

      {/* Impossible Travel Deep Analysis Showcase Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-900 to-[#070b16] border border-red-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>CRITICAL DETECTION: IMPOSSIBLE TRAVEL GEOLOCATION ANOMALY</span>
          </div>
          <span className="text-[10px] text-slate-400">Rule: RULE-004</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>ORIGIN LOGIN (19:30 UTC)</span>
            </div>
            <div className="font-bold text-slate-200">New York, United States (US)</div>
            <div className="text-[11px] text-slate-400">IP: 64.120.88.12 (Corporate Office)</div>
          </div>

          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 space-y-1">
            <div className="text-red-400 text-[10px] flex items-center gap-1 font-bold">
              <MapPin className="w-3 h-3 text-red-400 animate-bounce" />
              <span>ANOMALOUS LOGIN (19:45 UTC)</span>
            </div>
            <div className="font-bold text-red-300">Moscow, Russia (RU)</div>
            <div className="text-[11px] text-slate-400">IP: 91.240.118.82 (Datacenter VPN)</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-slate-500 text-[10px]">VELOCITY CALCULATION</div>
              <div className="text-base font-bold text-cyan-400">18,400 km/h</div>
              <div className="text-[10px] text-red-400 mt-0.5">Physical Travel Threshold Exceeded</div>
            </div>
            <button
              onClick={() => handleRevokeAccount('sarah.connor@corp.cyber')}
              className="mt-2 w-full py-1.5 rounded bg-red-950 border border-red-500 text-red-300 hover:bg-red-900 font-bold text-[11px] flex items-center justify-center gap-1"
            >
              <UserX className="w-3 h-3" />
              <span>Revoke Sarah Connor Sessions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search User, IP, Location, Anomaly..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Auth Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
            <option value="PRIV_ESC">Privilege Escalation</option>
          </select>
        </div>
      </div>

      {/* Auth Logs Table */}
      <div className="rounded-xl border border-slate-800 bg-[#090e1d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050811] text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">USER ACCOUNT</th>
                <th className="p-3">SOURCE IP</th>
                <th className="p-3">TARGET HOST</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">ANOMALY / REASON</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  
                  <td className="p-3 whitespace-nowrap font-bold text-slate-200">
                    {log.username}
                  </td>

                  <td className="p-3 whitespace-nowrap text-cyan-400">{log.source_ip}</td>
                  <td className="p-3 whitespace-nowrap text-slate-300">{log.dest_host}</td>
                  <td className="p-3 whitespace-nowrap text-slate-400">{log.auth_type}</td>

                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.auth_status === 'PRIV_ESC' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                      log.auth_status === 'FAILURE' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {log.auth_status}
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap text-slate-400">{log.location}</td>

                  <td className="p-3">
                    {log.anomaly_description ? (
                      <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 font-bold text-[11px]">
                        {log.anomaly_description}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Baseline Login</span>
                    )}
                  </td>

                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleRevokeAccount(log.username)}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-red-400 text-slate-300 hover:text-red-300 text-[11px]"
                    >
                      Lockout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
