import React from 'react';
import { IOCItem } from '../../types/soc';
import { Crosshair, ShieldAlert, Globe, Server, User, Tag, ExternalLink, Ban } from 'lucide-react';
import { useSOC } from '../../context/SOCContext';

interface IOCDetailModalProps {
  ioc: IOCItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPivotToSIEM?: (query: string) => void;
}

export const IOCDetailModal: React.FC<IOCDetailModalProps> = ({
  ioc,
  isOpen,
  onClose,
  onPivotToSIEM
}) => {
  const { addAnalystNote } = useSOC();

  if (!isOpen || !ioc) return null;

  const handleAddToBlocklist = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#090e1c] border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#060913] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 uppercase">{ioc.type}</span>
                <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold ${
                  ioc.reputation === 'MALICIOUS' ? 'bg-red-950 text-red-400 border border-red-800' :
                  ioc.reputation === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-400' :
                  'bg-emerald-950 text-emerald-400'
                }`}>
                  {ioc.reputation}
                </span>
                <span className="text-slate-500">Risk Score: {ioc.risk_score}/100</span>
              </div>
              <h3 className="text-sm font-bold text-cyan-300 break-all mt-0.5">{ioc.value}</h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">GEOLOCATION / ASN</span>
              <span className="text-slate-200">{ioc.country || 'N/A'} {ioc.asn ? `• ${ioc.asn}` : ''}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">ATTRIBUTED THREAT ACTOR</span>
              <span className="text-amber-400 font-bold">{ioc.threat_actor || 'Unknown / Unattributed'}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">FIRST SEEN</span>
              <span className="text-slate-300">{ioc.first_seen}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">LAST OBSERVED</span>
              <span className="text-slate-300">{ioc.last_seen}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block font-bold">THREAT INTELLIGENCE TAGS</span>
            <div className="flex flex-wrap gap-1.5">
              {ioc.tags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 text-[11px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Threat Intel Notes */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">INTEL ANALYSIS SUMMARY</span>
            <p className="text-slate-200 leading-relaxed">{ioc.detection_notes}</p>
          </div>

          {/* Related Entities */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block mb-1">AFFECTED INTERNAL HOSTS</span>
              <div className="flex flex-wrap gap-1">
                {ioc.related_hosts.length > 0 ? (
                  ioc.related_hosts.map((h, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">
                      {h}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">None detected</span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block mb-1">TARGETED USERS</span>
              <div className="flex flex-wrap gap-1">
                {ioc.related_users.length > 0 ? (
                  ioc.related_users.map((u, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">
                      {u}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">None recorded</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#060913] flex items-center justify-between">
          <button
            onClick={handleAddToBlocklist}
            className="px-3 py-1.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 flex items-center gap-1.5"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Add to Blocklist</span>
          </button>

          <div className="flex items-center gap-2">
            {onPivotToSIEM && (
              <button
                onClick={() => {
                  onClose();
                  onPivotToSIEM(ioc.value);
                }}
                className="px-3.5 py-1.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900 flex items-center gap-1.5"
              >
                <span>Pivot to SIEM Logs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
