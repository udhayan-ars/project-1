import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  ShieldAlert, 
  Filter, 
  Activity, 
  Globe, 
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { NetworkFlow } from '../../types/soc';

interface NetworkSecurityPageProps {
  onPivotToIOC?: (ioc: string) => void;
}

export const NetworkSecurityPage: React.FC<NetworkSecurityPageProps> = ({ onPivotToIOC }) => {
  const { networkFlows } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredFlows = networkFlows.filter(flow => {
    const matchesSearch = 
      flow.source_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.dest_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (flow.anomaly_flag && flow.anomaly_flag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      flow.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProtocol = protocolFilter === 'ALL' || flow.protocol === protocolFilter;
    const matchesAction = actionFilter === 'ALL' || flow.action === actionFilter;

    return matchesSearch && matchesProtocol && matchesAction;
  });

  const anomalousFlowsCount = networkFlows.filter(f => f.action === 'ALERT' || f.anomaly_flag).length;

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              NETWORK FLOW TELEMETRY & TRAFFIC ANOMALY MONITOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep packet flow inspection across TCP, UDP, ICMP, DNS, HTTP, HTTPS, SSH, and RDP.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-bold">
          {anomalousFlowsCount} Threat Anomalies Flagged
        </div>
      </div>

      {/* Network Anomaly Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="text-red-400 text-[10px] font-bold uppercase">C2 BEACONING PROFILE</div>
          <div className="text-sm font-bold text-slate-100 mt-1">185.220.101.44:443</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Jitter: 15% • JA3 Hash Match</div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="text-amber-400 text-[10px] font-bold uppercase">SYN PORT SCAN SWEEP</div>
          <div className="text-sm font-bold text-slate-100 mt-1">45.142.214.99 → WEB-SRV-01</div>
          <div className="text-[10px] text-slate-400 mt-0.5">850 Ports probed in 10s</div>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
          <div className="text-purple-400 text-[10px] font-bold uppercase">DNS TUNNELING EXFIL</div>
          <div className="text-sm font-bold text-slate-100 mt-1">*.c2-exfil-ns1.darknet.io</div>
          <div className="text-[10px] text-slate-400 mt-0.5">2,400 TXT Queries • Entropy 4.8</div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30">
          <div className="text-blue-400 text-[10px] font-bold uppercase">SSH BRUTE FORCE FLOW</div>
          <div className="text-sm font-bold text-slate-100 mt-1">203.0.113.195:54180 → :22</div>
          <div className="text-[10px] text-slate-400 mt-0.5">24 Auth Failures then Accepted</div>
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
            placeholder="Search IP, Country, Anomaly Flag..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Protocol:</span>
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Protocols</option>
            <option value="HTTPS">HTTPS (443)</option>
            <option value="SSH">SSH (22)</option>
            <option value="DNS">DNS (53)</option>
            <option value="TCP">TCP / Raw</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Actions</option>
            <option value="ALERT">ALERT</option>
            <option value="ALLOW">ALLOW</option>
            <option value="DROP">DROP</option>
          </select>
        </div>
      </div>

      {/* Network Flows Table */}
      <div className="rounded-xl border border-slate-800 bg-[#090e1d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050811] text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">SOURCE IP : PORT</th>
                <th className="p-3">DESTINATION IP : PORT</th>
                <th className="p-3">PROTO</th>
                <th className="p-3">BYTES / PKTS</th>
                <th className="p-3">ACTION</th>
                <th className="p-3">GEO</th>
                <th className="p-3">ANOMALY / THREAT DETECTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredFlows.map(flow => (
                <tr key={flow.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{flow.timestamp}</td>
                  
                  <td className="p-3 whitespace-nowrap">
                    <span 
                      onClick={() => onPivotToIOC && onPivotToIOC(flow.source_ip)}
                      className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                    >
                      {flow.source_ip}
                    </span>
                    <span className="text-slate-500">:{flow.source_port}</span>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span 
                      onClick={() => onPivotToIOC && onPivotToIOC(flow.dest_ip)}
                      className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                    >
                      {flow.dest_ip}
                    </span>
                    <span className="text-slate-500">:{flow.dest_port}</span>
                  </td>

                  <td className="p-3 whitespace-nowrap font-bold text-slate-300">{flow.protocol}</td>
                  
                  <td className="p-3 whitespace-nowrap text-slate-400">
                    {flow.bytes.toLocaleString()} B ({flow.packets} pkts)
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      flow.action === 'ALERT' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                      flow.action === 'DROP' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {flow.action}
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap text-slate-400">{flow.country}</td>

                  <td className="p-3">
                    {flow.anomaly_flag ? (
                      <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 font-bold text-[11px]">
                        {flow.anomaly_flag}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Normal Flow</span>
                    )}
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
