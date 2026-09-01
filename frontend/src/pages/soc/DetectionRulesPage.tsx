import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Code, 
  Play, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { DetectionRule } from '../../types/soc';

export const DetectionRulesPage: React.FC = () => {
  const { detectionRules, toggleRuleStatus } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedRule, setSelectedRule] = useState<DetectionRule | null>(detectionRules[0] || null);
  const [copied, setCopied] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const filteredRules = detectionRules.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rule_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.mitre_technique.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleCopySigma = (yaml: string) => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestRule = (rule: DetectionRule) => {
    setTestResult(`Testing rule ${rule.rule_id} against live SIEM ingestion stream...\n✓ Syntax validation: SUCCESS\n✓ Evaluated 148,290 historical events\n✓ Triggered on ${rule.trigger_count} matching telemetry events (0 parse errors)`);
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              DETECTION ENGINEERING & SIGMA RULES REPOSITORY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            12+ Production SIEM correlation rules, threshold triggers, and Sigma/YAML detection definitions.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold">
          Active Rules: {detectionRules.filter(r => r.status === 'ENABLED').length} / {detectionRules.length}
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
            placeholder="Search Rule Name, ID, Logic, MITRE technique..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-[11px]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 focus:border-cyan-400"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="ENDPOINT">Endpoint / Sysmon</option>
            <option value="NETWORK">Network Flow</option>
            <option value="DNS">DNS Tunneling</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Rules List + Selected Rule YAML Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Rules List */}
        <div className="lg:col-span-1 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredRules.map(rule => {
            const isSelected = selectedRule?.id === rule.id;
            const isEnabled = rule.status === 'ENABLED';

            return (
              <div
                key={rule.id}
                onClick={() => {
                  setSelectedRule(rule);
                  setTestResult(null);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#090e1d] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-cyan-400">{rule.rule_id}</span>
                    <span className={`px-2 py-0.2 rounded font-bold uppercase ${
                      rule.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      rule.severity === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                      'bg-blue-950 text-blue-400'
                    }`}>
                      {rule.severity}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-100">{rule.name}</h3>
                  <div className="text-[10px] text-slate-500 mt-1">{rule.mitre_technique_id} • {rule.category}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Triggers: <strong className="text-emerald-400">{rule.trigger_count}</strong></span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRuleStatus(rule.id);
                    }}
                    className={`flex items-center gap-1 font-bold ${
                      isEnabled ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Selected Rule Detail & Sigma YAML Code */}
        <div className="lg:col-span-2">
          {selectedRule ? (
            <div className="p-5 rounded-xl bg-[#090e1d] border border-cyan-500/30 shadow-xl space-y-5 text-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 text-sm">{selectedRule.rule_id}</span>
                    <span className={`px-2 py-0.2 rounded font-bold uppercase text-[10px] ${
                      selectedRule.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-amber-950 text-amber-400'
                    }`}>
                      {selectedRule.severity}
                    </span>
                    <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                      FP Rate: {selectedRule.false_positive_rate}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-100 mt-1">
                    {selectedRule.name}
                  </h2>
                </div>

                <button
                  onClick={() => handleTestRule(selectedRule)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Rule Execution</span>
                </button>
              </div>

              {/* Test Simulation Banner */}
              {testResult && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 whitespace-pre-wrap leading-relaxed animate-fadeIn">
                  {testResult}
                </div>
              )}

              {/* Description & Logic */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">RULE DESCRIPTION</div>
                  <p className="text-slate-200 leading-relaxed">{selectedRule.description}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-cyan-400 text-[10px] uppercase font-bold">DETECTION LOGIC / PSEUDOCODE</div>
                  <p className="text-slate-200 text-[11px] leading-relaxed">{selectedRule.detection_logic}</p>
                </div>
              </div>

              {/* Sigma / YAML Rule Definition */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SIGMA RULE YAML SPECIFICATION</span>
                  </span>
                  <button
                    onClick={() => handleCopySigma(selectedRule.sigma_yaml)}
                    className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy YAML'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded bg-[#050811] text-emerald-400 text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedRule.sigma_yaml}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#090e1d] border border-slate-800 text-center text-slate-500 text-xs">
              Select a detection rule to view its Sigma YAML logic and test simulation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
