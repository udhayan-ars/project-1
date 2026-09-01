import React, { useState } from 'react';
import { 
  Server, 
  Search, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Cpu, 
  Lock, 
  AlertOctagon, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { Asset } from '../../types/soc';

export const AssetManagementPage: React.FC = () => {
  const { assets, toggleAssetQuarantine, addAnalystNote } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('ALL');

  const filteredAssets = assets.filter(a => {
    const matchesSearch = 
      a.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCriticality = criticalityFilter === 'ALL' || a.criticality === criticalityFilter;

    return matchesSearch && matchesCriticality;
  });

  const handleToggleQuarantine = (asset: Asset) => {
    toggleAssetQuarantine(asset.id);
    const newStatus = asset.status === 'QUARANTINED' ? 'ONLINE' : 'QUARANTINED';
    addAnalystNote({
      title: `Host Status Updated: ${asset.hostname}`,
      category: 'CONTAINMENT',
      content: `Asset ${asset.hostname} (${asset.ip_address}) status changed to ${newStatus}.`,
      author: 'SOC L1 Analyst'
    });
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              ENTERPRISE ASSET INVENTORY & ENDPOINT POSTURE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time critical host monitoring, open port discovery, vulnerability counts, and EDR network isolation.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-bold">
          Quarantined Assets: {assets.filter(a => a.status === 'QUARANTINED').length}
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
            placeholder="Search Hostname, IP, OS, Owner..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Criticality:</span>
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Criticalities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map(asset => {
          const isQuarantined = asset.status === 'QUARANTINED';

          return (
            <div
              key={asset.id}
              className={`p-5 rounded-xl border transition-all space-y-4 shadow-lg ${
                isQuarantined
                  ? 'bg-red-950/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-[#090e1d] border-slate-800 hover:border-cyan-500/40 text-slate-300'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{asset.hostname}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                      asset.criticality === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      asset.criticality === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                      'bg-blue-950 text-blue-400'
                    }`}>
                      {asset.criticality}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-400 font-bold mt-0.5">{asset.ip_address}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isQuarantined ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                  asset.status === 'UNDER_INVESTIGATION' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-emerald-950 text-emerald-400'
                }`}>
                  {asset.status}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span className="text-slate-500">OS:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">{asset.os}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="text-slate-500">Owner:</span>
                  <span className="text-slate-200">{asset.owner}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="text-slate-500">Risk Score:</span>
                  <span className={`font-bold ${
                    asset.risk_score >= 80 ? 'text-red-400' :
                    asset.risk_score >= 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {asset.risk_score} / 100
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="text-slate-500">Active Alerts:</span>
                  <span className="font-bold text-amber-400">{asset.active_alerts_count}</span>
                </div>
              </div>

              {/* Open Ports */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold">DISCOVERED OPEN PORTS</span>
                <div className="flex flex-wrap gap-1">
                  {asset.open_ports.map(p => (
                    <span key={p} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300">
                      :{p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Running Services */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold">RUNNING SERVICES</span>
                <div className="flex flex-wrap gap-1">
                  {asset.services.map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleToggleQuarantine(asset)}
                  className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isQuarantined
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                      : 'bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isQuarantined ? 'Restore Network Connectivity' : 'Isolate Host from Subnet'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
