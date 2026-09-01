import React, { useState } from 'react';
import { 
  Crosshair, 
  Search, 
  ShieldAlert, 
  Globe, 
  Server, 
  User, 
  Tag, 
  ExternalLink, 
  Ban, 
  Plus,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { IOCItem, IOCType } from '../../types/soc';

interface IOCInvestigationPageProps {
  onSelectIOC?: (ioc: IOCItem) => void;
  onPivotToSIEM?: (query: string) => void;
}

export const IOCInvestigationPage: React.FC<IOCInvestigationPageProps> = ({
  onSelectIOC,
  onPivotToSIEM
}) => {
  const { iocs, addIOC, addAnalystNote } = useSOC();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedReputation, setSelectedReputation] = useState<string>('ALL');
  const [activeIOC, setActiveIOC] = useState<IOCItem | null>(iocs[0] || null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New IOC Form State
  const [newType, setNewType] = useState<IOCType>('IP');
  const [newValue, setNewValue] = useState<string>('');
  const [newReputation, setNewReputation] = useState<IOCItem['reputation']>('MALICIOUS');
  const [newRisk, setNewRisk] = useState<number>(85);
  const [newNotes, setNewNotes] = useState<string>('');

  const filteredIOCs = iocs.filter(item => {
    const matchesSearch = 
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.threat_actor && item.threat_actor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.country && item.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesReputation = selectedReputation === 'ALL' || item.reputation === selectedReputation;

    return matchesSearch && matchesType && matchesReputation;
  });

  const handleAddNewIOC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    const item: IOCItem = {
      id: `IOC-${Date.now().toString().slice(-4)}`,
      type: newType,
      value: newValue.trim(),
      reputation: newReputation,
      risk_score: newRisk,
      first_seen: `${new Date().toISOString().substring(0, 10)} 00:00:00 UTC`,
      last_seen: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`,
      associated_alerts: [],
      related_hosts: [],
      related_users: [],
      tags: ['Manual Analyst Submission', newType],
      detection_notes: newNotes || 'Manually cataloged indicator of compromise.'
    };

    addIOC(item);
    setActiveIOC(item);
    setShowAddModal(false);
    setNewValue('');
    setNewNotes('');
  };

  const handleBlocklist = (ioc: IOCItem) => {
    addAnalystNote({
      title: `Blocklist Request: ${ioc.value}`,
      category: 'CONTAINMENT',
      content: `Submitted threat intelligence IOC (${ioc.type}: ${ioc.value}) for global enterprise blocklisting. Risk score: ${ioc.risk_score}/100.`,
      related_entity_id: ioc.id,
      author: 'SOC L1 Analyst'
    });
    alert(`IOC ${ioc.value} added to firewall/EDR blacklist.`);
  };

  return (
    <div className="space-y-5 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              IOC THREAT INTELLIGENCE & REPUTATION ENGINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Query malicious IP addresses, C2 domains, malware file hashes, and adversary infrastructure.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom IOC</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IP, Domain, Hash, URL, Actor, or Tag..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Types</option>
            <option value="IP">IP Address</option>
            <option value="DOMAIN">Domain</option>
            <option value="HASH">File Hash</option>
            <option value="URL">URL</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Reputation:</span>
          <select
            value={selectedReputation}
            onChange={(e) => setSelectedReputation(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Reputations</option>
            <option value="MALICIOUS">Malicious</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="CLEAN">Clean</option>
          </select>
        </div>
      </div>

      {/* Main Grid: IOC List + Selected Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: IOC Table / List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-bold text-slate-400 px-1 uppercase">
            Threat Indicators ({filteredIOCs.length})
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredIOCs.map(ioc => {
              const isSelected = activeIOC?.id === ioc.id;
              return (
                <div
                  key={ioc.id}
                  onClick={() => setActiveIOC(ioc)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'bg-[#090e1d] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold uppercase text-slate-400">{ioc.type}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                      ioc.reputation === 'MALICIOUS' ? 'bg-red-950 text-red-400 border border-red-800' :
                      ioc.reputation === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-400' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {ioc.reputation}
                    </span>
                  </div>
                  <div className="font-bold text-xs truncate text-slate-100">{ioc.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                    <span>Risk: {ioc.risk_score}/100</span>
                    <span>{ioc.country || 'Global'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Intelligence Dossier */}
        <div className="lg:col-span-2">
          {activeIOC ? (
            <div className="p-5 rounded-xl bg-[#090e1d] border border-cyan-500/30 shadow-xl space-y-5">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-bold text-slate-300">
                      {activeIOC.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      activeIOC.reputation === 'MALICIOUS' ? 'bg-red-950 text-red-400 border border-red-800' :
                      activeIOC.reputation === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-400' :
                      'bg-emerald-950 text-emerald-400'
                    }`}>
                      {activeIOC.reputation}
                    </span>
                    <span className="text-xs text-slate-400">Risk Score: <strong className="text-cyan-400">{activeIOC.risk_score}/100</strong></span>
                  </div>
                  <h2 className="text-base font-bold text-cyan-300 break-all mt-1">
                    {activeIOC.value}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBlocklist(activeIOC)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-semibold flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Blocklist</span>
                  </button>

                  {onPivotToSIEM && (
                    <button
                      onClick={() => onPivotToSIEM(activeIOC.value)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Pivot to SIEM</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Enrichment Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">GEOLOCATION</div>
                  <div className="font-bold text-slate-200 mt-0.5">{activeIOC.country || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AUTONOMOUS SYSTEM (ASN)</div>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">{activeIOC.asn || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">ATTRIBUTED ACTOR</div>
                  <div className="font-bold text-amber-400 mt-0.5">{activeIOC.threat_actor || 'Unattributed'}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">FIRST OBSERVED</div>
                  <div className="text-slate-300 mt-0.5 text-[11px]">{activeIOC.first_seen}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">LAST OBSERVED</div>
                  <div className="text-slate-300 mt-0.5 text-[11px]">{activeIOC.last_seen}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">REGISTRAR / CA</div>
                  <div className="text-slate-300 mt-0.5 truncate">{activeIOC.registrar || 'N/A'}</div>
                </div>
              </div>

              {/* Threat Tags */}
              <div className="space-y-1.5">
                <div className="text-slate-400 text-xs font-bold uppercase">THREAT INTELLIGENCE TAGS</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeIOC.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400 text-xs">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analyst Intelligence Notes */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400 text-xs font-bold uppercase">SOC THREAT INTEL ASSESSMENT</div>
                <p className="text-slate-300 text-xs leading-relaxed">{activeIOC.detection_notes}</p>
              </div>

              {/* Related Internal Assets & Users */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-xs font-bold uppercase">ASSOCIATED INTERNAL ASSETS</div>
                  {activeIOC.related_hosts.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeIOC.related_hosts.map((h, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-bold">
                          {h}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs">No local hosts directly linked</div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-slate-400 text-xs font-bold uppercase">TARGETED USER ACCOUNTS</div>
                  {activeIOC.related_users.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeIOC.related_users.map((u, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-bold">
                          {u}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs">No user accounts directly targeted</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#090e1d] border border-slate-800 text-center text-slate-500 text-xs">
              Select an indicator from the list to view its complete threat intelligence dossier.
            </div>
          )}
        </div>
      </div>

      {/* Add Custom IOC Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddNewIOC}
            className="bg-[#090e1c] border border-cyan-500/40 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 uppercase">Add Threat Indicator (IOC)</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">IOC TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
                >
                  <option value="IP">IP Address</option>
                  <option value="DOMAIN">Domain Name</option>
                  <option value="HASH">SHA-256 / MD5 Hash</option>
                  <option value="URL">URL</option>
                  <option value="EMAIL">Email Address</option>
                  <option value="USERNAME">Username</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">IOC VALUE</label>
                <input
                  type="text"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. 185.220.101.44 or update-cdn.com"
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">REPUTATION</label>
                  <select
                    value={newReputation}
                    onChange={(e) => setNewReputation(e.target.value as any)}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
                  >
                    <option value="MALICIOUS">Malicious</option>
                    <option value="SUSPICIOUS">Suspicious</option>
                    <option value="CLEAN">Clean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">RISK (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newRisk}
                    onChange={(e) => setNewRisk(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ANALYST INTEL NOTES</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Observed C2 activity, associated campaign..."
                  className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold"
              >
                Save Indicator
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
