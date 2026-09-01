import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  ExternalLink,
  ChevronRight,
  Shield,
  Radio,
  FileText
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { SOCAlert } from '../../types/soc';

interface AlertsInvestigationPageProps {
  onSelectAlert: (alert: SOCAlert) => void;
  onNavigateToReport?: (alert: SOCAlert) => void;
  onNavigateToIOC?: (ioc: string) => void;
}

export const AlertsInvestigationPage: React.FC<AlertsInvestigationPageProps> = ({
  onSelectAlert,
  onNavigateToReport,
  onNavigateToIOC
}) => {
  const { alerts, updateAlertStatus } = useSOC();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.alert_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.dest_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.detection_rule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-5 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              ALERT TRIAGE & INCIDENT INVESTIGATION QUEUE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate high-fidelity threat detections, review pre/post attack timelines, and execute containment.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-bold">
            {alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length} Critical Unresolved
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Alert ID, Host, User, Rule, IP..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Severity */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="CONTAINED">Contained</option>
            <option value="RESOLVED">Resolved</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-[#090e1d] border border-slate-800 hover:border-cyan-400 transition-all shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400">{alert.alert_id}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                    alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-blue-950 text-blue-400'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                    Risk: {alert.risk_score}/100
                  </span>
                  <span className="px-2 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px]">
                    {alert.mitre_technique_id}
                  </span>
                  <span className="text-slate-500 text-[11px] ml-auto">{alert.timestamp}</span>
                </div>

                <h3 
                  onClick={() => onSelectAlert(alert)}
                  className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 cursor-pointer transition-colors"
                >
                  {alert.title}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500 text-[10px] block">HOST</span>
                    <strong className="text-slate-200">{alert.hostname}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">USER</span>
                    <strong className="text-slate-200">{alert.username}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">ATTACKER IP</span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToIOC && onNavigateToIOC(alert.dest_ip);
                      }}
                      className="text-cyan-400 font-semibold cursor-pointer hover:underline flex items-center gap-1"
                    >
                      {alert.dest_ip}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">STATUS</span>
                    <span className={`font-semibold ${
                      alert.status === 'CONTAINED' ? 'text-emerald-400' :
                      alert.status === 'INVESTIGATING' ? 'text-blue-400' :
                      alert.status === 'RESOLVED' ? 'text-slate-400' :
                      'text-amber-400'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800 w-full lg:w-auto justify-end">
                <button
                  onClick={() => onSelectAlert(alert)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                >
                  <span>Launch Forensics Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {onNavigateToReport && (
                  <button
                    onClick={() => onNavigateToReport(alert)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200"
                    title="Draft Incident Report"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-xl bg-[#090e1d] border border-slate-800 text-center text-slate-500 text-xs">
            No alerts match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};
