import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Play, 
  Pause, 
  Bot, 
  FileText, 
  Zap, 
  Radio, 
  ChevronDown,
  Info,
  Server,
  Lock,
  Globe
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { ATTACK_SCENARIOS } from '../../data/socData';

interface SOCHeaderProps {
  onOpenMentor: () => void;
  onOpenNotes: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const SOCHeader: React.FC<SOCHeaderProps> = ({ 
  onOpenMentor, 
  onOpenNotes,
  activeTab,
  onSelectTab 
}) => {
  const { 
    healthMetrics, 
    isStreaming, 
    toggleStreaming, 
    alerts, 
    activeScenario, 
    loadScenario, 
    resetScenario 
  } = useSOC();

  const [utcTime, setUtcTime] = useState<string>('');
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalAlertCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;
  const highAlertCount = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED' && a.status !== 'FALSE_POSITIVE').length;

  return (
    <header className="sticky top-0 z-40 bg-[#070b16]/95 border-b border-cyan-500/20 backdrop-blur-md px-4 py-2.5 transition-all">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Shield className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b16] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider text-slate-100 uppercase">
                SOC SECURITY OPERATIONS CENTER
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/30 text-[10px] font-mono font-semibold text-cyan-300 tracking-wider">
                SOC L1 ANALYST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
              <span>Threat Detection</span>
              <span className="text-cyan-500">•</span>
              <span>Incident Response</span>
              <span className="text-cyan-500">•</span>
              <span>Security Analytics</span>
            </p>
          </div>
        </div>

        {/* Center: Live Alert Ticker & Scenario Selector */}
        <div className="flex items-center gap-3">
          
          {/* Attack Scenario Injector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowScenarioMenu(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border transition-all ${
                activeScenario
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeScenario ? `Active: ${activeScenario.title.split(':')[0]}` : 'Simulate Attack Scenario'}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
            </button>

            {showScenarioMenu && (
              <div className="absolute left-0 mt-1.5 w-72 bg-[#0a0f1e] border border-cyan-500/30 rounded-lg shadow-2xl p-2 z-50 backdrop-blur-xl">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
                  Select Incident Scenario to Inject
                </div>
                <div className="py-1 space-y-1">
                  {ATTACK_SCENARIOS.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        loadScenario(sc.key);
                        setShowScenarioMenu(false);
                        onSelectTab('scenarios');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs font-mono hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{sc.title}</span>
                      <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                        sc.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {sc.severity}
                      </span>
                    </button>
                  ))}
                </div>
                {activeScenario && (
                  <button
                    onClick={() => {
                      resetScenario();
                      setShowScenarioMenu(false);
                    }}
                    className="w-full mt-1 pt-1 border-t border-slate-800 text-[10px] font-mono text-red-400 hover:text-red-300 text-center"
                  >
                    Clear Active Scenario
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Alert Ticker Indicator */}
          <div 
            onClick={() => onSelectTab('alerts')}
            className="hidden lg:flex items-center gap-2 px-3 py-1 rounded bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-mono"
          >
            <Radio className="w-3.5 h-3.5 text-red-500 animate-ping" />
            <span className="text-slate-400">Queue:</span>
            <span className="text-red-400 font-bold">{criticalAlertCount} Critical</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-bold">{highAlertCount} High</span>
          </div>

          {/* Real-time Telemetry Stream Status */}
          <button
            onClick={toggleStreaming}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              isStreaming
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
            }`}
            title={isStreaming ? 'Pause live telemetry stream' : 'Resume live telemetry stream'}
          >
            {isStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>STREAM: LIVE</span>
                <Pause className="w-3 h-3 ml-1 opacity-70" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>STREAM: PAUSED</span>
                <Play className="w-3 h-3 ml-1 opacity-70" />
              </>
            )}
          </button>
        </div>

        {/* Right: Security Health Pill, Clock, Notes, AI Mentor */}
        <div className="flex items-center gap-3">
          
          {/* Security Health Score Dial */}
          <button
            onClick={() => setShowHealthModal(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono transition-all group"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400">HEALTH:</span>
            <span className={`font-bold ${
              healthMetrics.overall_score >= 80 ? 'text-emerald-400' :
              healthMetrics.overall_score >= 60 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {healthMetrics.overall_score}/100
            </span>
            <span className="text-[10px] text-slate-500 hidden xl:inline">({healthMetrics.active_threat_level.split(' - ')[0]})</span>
          </button>

          {/* Clock UTC */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{utcTime || 'UTC 00:00:00'}</span>
          </div>

          {/* SOC Analyst Notes Button */}
          <button
            onClick={onOpenNotes}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors"
            title="Open SOC Analyst Case Notes"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Notes</span>
          </button>

          {/* AI SOC Mentor */}
          <button
            onClick={onOpenMentor}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono font-medium shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Global Health Score Breakdown Modal */}
      {showHealthModal && (
        <div className="absolute top-14 right-4 w-80 bg-[#0a0f20]/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-2xl z-50">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h4 className="font-mono font-bold text-xs text-slate-100 uppercase">
                Threat Posture Breakdown
              </h4>
            </div>
            <button
              onClick={() => setShowHealthModal(false)}
              className="text-slate-400 hover:text-slate-200 text-xs font-mono"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Overall Security Posture:</span>
                <span className="font-bold text-cyan-400">{healthMetrics.overall_score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${healthMetrics.overall_score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Endpoint Sec</div>
                <div className="font-bold text-slate-200 text-sm mt-0.5">{healthMetrics.endpoint_security}%</div>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Network Sec</div>
                <div className="font-bold text-slate-200 text-sm mt-0.5">{healthMetrics.network_security}%</div>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Identity Sec</div>
                <div className="font-bold text-slate-200 text-sm mt-0.5">{healthMetrics.identity_security}%</div>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400">Detection Cov</div>
                <div className="font-bold text-cyan-400 text-sm mt-0.5">{healthMetrics.detection_coverage}%</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="text-cyan-400 font-bold">Threat Level: </span>
              {healthMetrics.active_threat_level}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
