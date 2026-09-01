import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Play, 
  History, 
  HelpCircle, 
  Bookmark, 
  RotateCcw, 
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { SOCEvent } from '../../types/soc';

interface SiemQuerySearchPageProps {
  onSelectEvent: (event: SOCEvent) => void;
  onPivotToIOC?: (ioc: string) => void;
}

export const SiemQuerySearchPage: React.FC<SiemQuerySearchPageProps> = ({
  onSelectEvent,
  onPivotToIOC
}) => {
  const { events } = useSOC();

  const [queryInput, setQueryInput] = useState<string>('severity="CRITICAL" OR event_type="powershell"');
  const [activeQuery, setActiveQuery] = useState<string>('severity="CRITICAL" OR event_type="powershell"');
  const [queryHistory, setQueryHistory] = useState<string[]>([
    'source_ip="203.0.113.195" AND destination_port=22',
    'severity="CRITICAL" OR event_type="powershell"',
    'category="AUTHENTICATION" AND action="FAILURE"',
    'domain="update-cdn-cloudsvc.com"'
  ]);

  const presetQueries = [
    { label: 'PowerShell / EDR Detections', query: 'event_type="powershell" OR category="ENDPOINT"' },
    { label: 'SSH Brute Force Attacks', query: 'source_ip="203.0.113.195" OR destination_port=22' },
    { label: 'All Critical Severity Events', query: 'severity="CRITICAL"' },
    { label: 'DNS Tunneling & C2 Exfiltration', query: 'protocol="DNS" OR domain="darknet.io"' },
    { label: 'Authentication Failures', query: 'category="AUTHENTICATION" AND action="FAILURE"' },
    { label: 'Workstation WIN-CLIENT-08 Logs', query: 'host="WIN-CLIENT-08" OR username="jdoe"' }
  ];

  // Evaluate query
  const executeSearch = (queryString: string) => {
    setActiveQuery(queryString);
    if (queryString && !queryHistory.includes(queryString)) {
      setQueryHistory(prev => [queryString, ...prev.slice(0, 7)]);
    }
  };

  const parseAndFilter = (q: string): SOCEvent[] => {
    if (!q.trim()) return events;

    const terms = q.split(/\s+AND\s+|\s+OR\s+/i);
    const isOr = /\s+OR\s+/i.test(q);

    return events.filter(evt => {
      const flat = JSON.stringify(evt).toLowerCase();
      
      const termMatches = terms.map(term => {
        const clean = term.replace(/["']/g, '').trim().toLowerCase();
        if (clean.includes('=')) {
          const [key, val] = clean.split('=');
          const eventVal = String((evt as any)[key] || '').toLowerCase();
          return eventVal.includes(val);
        }
        return flat.includes(clean);
      });

      return isOr ? termMatches.some(Boolean) : termMatches.every(Boolean);
    });
  };

  const results = parseAndFilter(activeQuery);

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              SIEM STRUCTURED LOG QUERY & CORRELATION ENGINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Query syntax parser supporting boolean filters (e.g. source_ip="192.168.10.45" AND destination_port=443).
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold">
          Results: {results.length} Events Matched
        </div>
      </div>

      {/* Query Builder Box */}
      <div className="p-5 rounded-xl bg-[#070b16] border border-cyan-500/30 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(queryInput);
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2"
        >
          <div className="relative flex-1">
            <Terminal className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder='e.g. source_ip="185.220.101.44" AND severity="CRITICAL"'
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black border border-slate-700 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400 shadow-inner font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Run Query</span>
          </button>
        </form>

        {/* Preset Queries Toolbar */}
        <div className="space-y-1.5 text-xs">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">
            PRE-CONFIGURED SOC INVESTIGATION QUERIES:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetQueries.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(p.query);
                  executeSearch(p.query);
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Query History */}
        {queryHistory.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 overflow-x-auto">
            <History className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="text-slate-500 shrink-0">Recent:</span>
            {queryHistory.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(q);
                  executeSearch(q);
                }}
                className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 hover:text-slate-200 truncate max-w-xs"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-slate-800 bg-[#090e1d] overflow-hidden shadow-lg">
        <div className="p-3 border-b border-slate-800 bg-[#050811] flex items-center justify-between text-xs text-slate-400">
          <div>
            Executed Query: <code className="text-cyan-400 font-bold">{activeQuery}</code>
          </div>
          <div>{results.length} records returned</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#050811] text-slate-400 border-b border-slate-800 text-[11px]">
                <th className="p-3">ID / TIME</th>
                <th className="p-3">SEV</th>
                <th className="p-3">EVENT TYPE</th>
                <th className="p-3">SRC IP → DEST IP</th>
                <th className="p-3">USER / HOST</th>
                <th className="p-3">RAW PAYLOAD SUMMARY</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {results.length > 0 ? (
                results.map(evt => (
                  <tr
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                  >
                    <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                      <div className="font-bold text-slate-300">{evt.id}</div>
                      <div>{evt.timestamp}</div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                        evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-blue-950 text-blue-400'
                      }`}>
                        {evt.severity}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-300">{evt.event_type}</div>
                      <div className="text-[10px] text-slate-500">{evt.category} • {evt.protocol}</div>
                    </td>

                    <td className="p-3 whitespace-nowrap text-slate-300">
                      <div>{evt.source_ip}</div>
                      <div className="text-slate-500">→ {evt.dest_ip}</div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div className="text-slate-200 font-semibold">{evt.username || 'N/A'}</div>
                      <div className="text-[10px] text-slate-500">{evt.host || 'N/A'}</div>
                    </td>

                    <td className="p-3 text-slate-400 max-w-sm truncate text-[11px]">
                      {evt.message}
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 group-hover:border-cyan-400 group-hover:text-cyan-300 text-[11px]">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                    No matching events for query "{activeQuery}". Try selecting a preset query above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
