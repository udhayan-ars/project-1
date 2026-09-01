import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Flame, 
  Radio, 
  CheckCircle2, 
  AlertOctagon, 
  Search, 
  ArrowUpRight, 
  Cpu, 
  Server, 
  Users, 
  Zap,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useSOC } from '../../context/SOCContext';
import { SOCAlert } from '../../types/soc';

interface SOCDashboardPageProps {
  onSelectAlert: (alert: SOCAlert) => void;
  onNavigate: (tab: string) => void;
}

export const SOCDashboardPage: React.FC<SOCDashboardPageProps> = ({ onSelectAlert, onNavigate }) => {
  const { 
    events, 
    alerts, 
    incidents, 
    assets, 
    healthMetrics,
    loadScenario 
  } = useSOC();

  // Metrics
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
  const mediumCount = alerts.filter(a => a.severity === 'MEDIUM' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
  const lowCount = alerts.filter(a => a.severity === 'LOW' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;

  const activeIncidentsCount = incidents.filter(i => i.current_status !== 'CLOSED').length;
  const investigatingCount = incidents.filter(i => i.current_status === 'INVESTIGATING' || i.current_status === 'TRIAGED').length;
  const resolvedCount = incidents.filter(i => i.current_status === 'CLOSED' || i.current_status === 'RECOVERED').length;

  // Chart Data: Events Over Time
  const eventsTimeData = [
    { time: '19:00', total: 1240, anomalous: 40 },
    { time: '19:10', total: 1450, anomalous: 65 },
    { time: '19:20', total: 1320, anomalous: 50 },
    { time: '19:30', total: 2890, anomalous: 340 }, // Spike 1: Impossible travel & Recon
    { time: '19:40', total: 4950, anomalous: 890 }, // Spike 2: SSH Brute force & DNS Exfil
    { time: '19:50', total: 6120, anomalous: 1420 }, // Spike 3: Macro & Cobalt Strike
    { time: '20:00', total: 2400, anomalous: 180 }
  ];

  // Chart Data: Severity Breakdown
  const severityPieData = [
    { name: 'Critical', value: Math.max(1, criticalCount), color: '#ef4444' },
    { name: 'High', value: Math.max(1, highCount), color: '#f59e0b' },
    { name: 'Medium', value: Math.max(1, mediumCount), color: '#eab308' },
    { name: 'Low', value: Math.max(1, lowCount), color: '#3b82f6' }
  ];

  // Chart Data: Source Categories
  const categoryBarData = [
    { name: 'Endpoint EDR', alerts: 6 },
    { name: 'Network IDS', alerts: 5 },
    { name: 'Auth & AD', alerts: 7 },
    { name: 'DNS Security', alerts: 3 },
    { name: 'Cloud/SaaS', alerts: 2 }
  ];

  // Chart Data: Top Attacked Assets
  const attackedHostsData = [
    { host: 'WIN-CLIENT-08', attacks: 14 },
    { host: 'LINUX-SRV-02', attacks: 12 },
    { host: 'DB-SRV-01', attacks: 8 },
    { host: 'WEB-SRV-01', attacks: 7 },
    { host: 'DC-PROD-01', attacks: 3 }
  ];

  // Top Malicious Source IPs
  const topAttackerIPs = [
    { ip: '185.220.101.44', location: 'Netherlands', hits: 1420, threat: 'Cobalt Strike C2', risk: 98 },
    { ip: '203.0.113.195', location: 'Hong Kong', hits: 890, threat: 'SSH Brute Force', risk: 91 },
    { ip: '91.240.118.82', location: 'Russia', hits: 450, threat: 'Impossible Travel VPN', risk: 76 },
    { ip: '45.142.214.99', location: 'Russia', hits: 850, threat: 'Nmap SYN Sweep', risk: 65 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#0a1226] via-[#091530] to-[#070b16] border border-cyan-500/30 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-wide">
              SOC OPERATIONS & THREAT MONITORING DASHBOARD
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
              SYSTEM STATUS: ARMED
            </span>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Real-time SIEM ingestion, EDR threat correlation, and multi-vector incident response console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('stream')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Open Live SIEM Stream</span>
          </button>
          <button
            onClick={() => onNavigate('incidents')}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs font-mono font-medium flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Active Incidents ({activeIncidentsCount})</span>
          </button>
        </div>
      </div>

      {/* 8 Primary SOC KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono">
        
        {/* Total Events */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>TOTAL EVENTS</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 mt-1">148,290</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>+14.2% / hr</span>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 hover:border-red-400 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <div className="flex items-center justify-between text-red-400 text-[10px]">
            <span className="font-bold">CRITICAL</span>
            <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          </div>
          <div className="text-lg font-bold text-red-400 mt-1">{criticalCount}</div>
          <div className="text-[10px] text-red-300 mt-0.5">Requires Immediate Action</div>
        </div>

        {/* High Alerts */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-amber-400 text-[10px]">
            <span className="font-bold">HIGH</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-amber-400 mt-1">{highCount}</div>
          <div className="text-[10px] text-amber-300 mt-0.5">Active Investigation</div>
        </div>

        {/* Medium Alerts */}
        <div className="p-3.5 rounded-xl bg-yellow-950/20 border border-yellow-500/30 hover:border-yellow-400 transition-all">
          <div className="flex items-center justify-between text-yellow-400 text-[10px]">
            <span className="font-bold">MEDIUM</span>
            <Activity className="w-3.5 h-3.5 text-yellow-500" />
          </div>
          <div className="text-lg font-bold text-yellow-400 mt-1">{mediumCount || 8}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Queue Review</div>
        </div>

        {/* Low Alerts */}
        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between text-blue-400 text-[10px]">
            <span className="font-bold">LOW</span>
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400 mt-1">{lowCount || 15}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Automated Rules</div>
        </div>

        {/* Active Incidents */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between text-purple-400 text-[10px]">
            <span className="font-bold">INCIDENTS</span>
            <Flame className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-300 mt-1">{activeIncidentsCount}</div>
          <div className="text-[10px] text-purple-400 mt-0.5">In Lifecycle</div>
        </div>

        {/* Investigating */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>TRIAGED</span>
            <Search className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400 mt-1">{investigatingCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Under Forensics</div>
        </div>

        {/* Resolved */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-emerald-400 text-[10px]">
            <span className="font-bold">RESOLVED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{resolvedCount || 19}</div>
          <div className="text-[10px] text-emerald-300 mt-0.5">SANS Standard</div>
        </div>
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Events Over Time (Spike Anomaly Visualization) */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                SECURITY INGESTION TELEMETRY & ATTACK SPIKES
              </h3>
              <p className="font-mono text-[11px] text-slate-400">
                Log volume vs. anomalous attack traffic over time (Time-series)
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              WINDOW: LAST 1 HOUR
            </span>
          </div>

          <div className="h-64 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eventsTimeData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAnomalous" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3366" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff3366" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070b16', borderColor: '#00f3ff', borderRadius: '8px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="total" name="Baseline Ingestion" stroke="#00f3ff" fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="anomalous" name="Anomalous / Attack Traffic" stroke="#ff3366" fillOpacity={1} fill="url(#colorAnomalous)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Alerts by Severity Donut */}
        <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                ALERTS BY SEVERITY
              </h3>
              <p className="font-mono text-[11px] text-slate-400">
                Proportion of active queue
              </p>
            </div>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-48 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070b16', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t border-slate-800">
            {severityPieData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300">{s.name}:</span>
                <span className="font-bold text-slate-100">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Attacked Systems & Top Threat IPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Attacked Hosts */}
        <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                TOP TARGETED ASSETS
              </h3>
              <p className="font-mono text-[11px] text-slate-400">
                Most targeted hostnames in the internal subnet
              </p>
            </div>
            <button
              onClick={() => onNavigate('assets')}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-0.5"
            >
              <span>Asset Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackedHostsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="host" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070b16', borderColor: '#00f3ff', borderRadius: '8px' }}
                />
                <Bar dataKey="attacks" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Attacker IPs */}
        <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                TOP MALICIOUS SOURCE IPS
              </h3>
              <p className="font-mono text-[11px] text-slate-400">
                Threat intelligence indicators & active intrusion attempts
              </p>
            </div>
            <button
              onClick={() => onNavigate('ioc')}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-0.5"
            >
              <span>IOC Lookup</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {topAttackerIPs.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-cyan-300">{item.ip}</div>
                    <div className="text-[11px] text-slate-400">{item.threat} • {item.location}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-red-400 font-bold text-xs">{item.hits} Probes</div>
                  <div className="text-[10px] text-slate-500">Risk: {item.risk}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Active Threat Triage Feed */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-mono text-sm font-bold text-slate-100">
              ACTIVE ALERTS AWAITING SOC L1 INVESTIGATION
            </h3>
            <p className="font-mono text-[11px] text-slate-400">
              Click any alert to launch the deep investigation timeline & execute containment
            </p>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono flex items-center gap-1"
          >
            <span>View All ({alerts.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {alerts.slice(0, 4).map(alert => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-400 hover:bg-slate-900/90 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                  alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400'
                }`}>
                  {alert.severity}
                </span>
                <div>
                  <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {alert.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap gap-2">
                    <span>Host: <strong className="text-slate-200">{alert.hostname}</strong></span>
                    <span>•</span>
                    <span>User: <strong className="text-slate-200">{alert.username}</strong></span>
                    <span>•</span>
                    <span>Rule: <strong className="text-cyan-400">{alert.rule_id}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-500">{alert.timestamp}</span>
                <button className="px-3 py-1 rounded bg-slate-900 border border-slate-700 group-hover:border-cyan-400 group-hover:text-cyan-300 text-slate-300 text-xs">
                  Investigate →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
