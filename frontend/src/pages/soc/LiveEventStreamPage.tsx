import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Download, 
  RotateCcw, 
  Terminal, 
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { SOCEvent, SeverityLevel } from '../../types/soc';

interface LiveEventStreamPageProps {
  onSelectEvent: (event: SOCEvent) => void;
  onPivotToIOC?: (ioc: string) => void;
}

export const LiveEventStreamPage: React.FC<LiveEventStreamPageProps> = ({ 
  onSelectEvent,
  onPivotToIOC
}) => {
  const { 
    events, 
    isStreaming, 
    toggleStreaming, 
    streamSpeed, 
    setStreamSpeed,
    clearEvents 
  } = useSOC();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Filter events
  const filteredEvents = events.filter(evt => {
    const matchesSearch = 
      evt.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.source_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.dest_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.detection_rule && evt.detection_rule.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = selectedSeverity === 'ALL' || evt.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchesProtocol = selectedProtocol === 'ALL' || evt.protocol === selectedProtocol;

    return matchesSearch && matchesSeverity && matchesCategory && matchesProtocol;
  });

  const paginatedEvents = filteredEvents.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const exportCSV = () => {
    const headers = 'ID,Timestamp,Severity,Category,EventType,SourceIP,DestIP,Protocol,Port,User,Host,Message\n';
    const rows = filteredEvents.map(e => 
      `"${e.id}","${e.timestamp}","${e.severity}","${e.category}","${e.event_type}","${e.source_ip}","${e.dest_ip}","${e.protocol}","${e.port || ''}","${e.username}","${e.host}","${e.message.replace(/"/g, '""')}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-siem-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 font-mono">
      
      {/* Header Bar */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              REAL-TIME SIEM EVENT INGESTION STREAM
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized Syslog, Windows Event IDs, Sysmon, EDR signals, and network flow telemetry.
          </p>
        </div>

        {/* Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleStreaming}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isStreaming
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Live Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <select
            value={streamSpeed}
            onChange={(e) => setStreamSpeed(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value={1500}>Speed: Fast (1.5s)</option>
            <option value={3500}>Speed: Normal (3.5s)</option>
            <option value={7000}>Speed: Slow (7.0s)</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={clearEvents}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200"
            title="Reset telemetry stream"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-xl bg-[#070b16] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search IP, Host, User, Rule, Event Type, or Raw Payload..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => {
              setSelectedSeverity(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFO">Info</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="ENDPOINT">Endpoint / EDR</option>
            <option value="NETWORK">Network Flow</option>
            <option value="DNS">DNS</option>
            <option value="PROCESS">Process</option>
          </select>
        </div>

        {/* Total results */}
        <div className="text-[11px] text-slate-400">
          Showing <span className="text-cyan-400 font-bold">{filteredEvents.length}</span> matching events
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-slate-800 bg-[#090e1d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050811] text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">SEVERITY</th>
                <th className="p-3">EVENT TYPE</th>
                <th className="p-3">SRC IP → DEST IP</th>
                <th className="p-3">USER / HOST</th>
                <th className="p-3">PROTO</th>
                <th className="p-3">DETECTION RULE</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map(evt => (
                  <tr
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                  >
                    {/* Timestamp */}
                    <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                      {evt.timestamp}
                    </td>

                    {/* Severity */}
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                        evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        evt.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400' :
                        evt.severity === 'LOW' ? 'bg-blue-950 text-blue-400' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {evt.severity}
                      </span>
                    </td>

                    {/* Event Type */}
                    <td className="p-3">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {evt.event_type}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{evt.message}</div>
                    </td>

                    {/* IP Tuple */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-200">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            onPivotToIOC && onPivotToIOC(evt.source_ip);
                          }}
                          className="hover:text-cyan-400 hover:underline cursor-pointer"
                        >
                          {evt.source_ip}
                        </span>
                        <span className="text-slate-600">→</span>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            onPivotToIOC && onPivotToIOC(evt.dest_ip);
                          }}
                          className="hover:text-cyan-400 hover:underline cursor-pointer"
                        >
                          {evt.dest_ip}
                        </span>
                      </div>
                    </td>

                    {/* User / Host */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-slate-200 font-semibold">{evt.username || 'N/A'}</div>
                      <div className="text-[10px] text-slate-500">{evt.host || 'N/A'}</div>
                    </td>

                    {/* Protocol */}
                    <td className="p-3 whitespace-nowrap text-slate-400">
                      {evt.protocol} {evt.port ? `:${evt.port}` : ''}
                    </td>

                    {/* Detection Rule */}
                    <td className="p-3 whitespace-nowrap">
                      {evt.rule_id ? (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                          {evt.rule_id}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">Standard Log</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 group-hover:border-cyan-400 group-hover:text-cyan-300 text-[11px]">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No matching security telemetry found. Try adjusting your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-800 bg-[#050811] flex items-center justify-between text-xs text-slate-400">
            <div>
              Page <span className="text-slate-200 font-bold">{page}</span> of {totalPages}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
