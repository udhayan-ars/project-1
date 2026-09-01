import React, { useState } from 'react';
import { SOCEvent } from '../../types/soc';
import { Radio, Copy, Check, ExternalLink, ShieldAlert, Terminal } from 'lucide-react';

interface EventDetailModalProps {
  event: SOCEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onPivotToIOC?: (ioc: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onPivotToIOC
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !event) return null;

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#090e1c] border border-cyan-500/30 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#060913] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">{event.id}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                  event.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                  event.severity === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                  event.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400' :
                  'bg-blue-950 text-blue-400'
                }`}>
                  {event.severity}
                </span>
                <span className="text-slate-500">{event.category}</span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">{event.event_type}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Key Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">TIMESTAMP</span>
              <span className="text-slate-200">{event.timestamp}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SOURCE IP</span>
              <span 
                onClick={() => onPivotToIOC && onPivotToIOC(event.source_ip)}
                className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {event.source_ip}
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">DESTINATION IP</span>
              <span 
                onClick={() => onPivotToIOC && onPivotToIOC(event.dest_ip)}
                className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {event.dest_ip}
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">USER</span>
              <span className="text-slate-200">{event.username || 'N/A'}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">HOST</span>
              <span className="text-slate-200">{event.host || 'N/A'}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">PROTOCOL / PORT</span>
              <span className="text-slate-200">{event.protocol} : {event.port || 'N/A'}</span>
            </div>
          </div>

          {/* Message */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">EVENT SUMMARY</span>
            <p className="text-slate-200">{event.message}</p>
          </div>

          {/* Raw Log JSON */}
          <div className="p-3 rounded bg-black border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">RAW TELEMETRY PAYLOAD</span>
              <button
                onClick={copyJSON}
                className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded bg-[#050811] text-emerald-400 text-[11px] overflow-x-auto whitespace-pre-wrap">
              {event.raw_log || JSON.stringify(event, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#060913] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
