import React from 'react';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  Flame, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useSOC } from '../../context/SOCContext';
import { ATTACK_SCENARIOS } from '../../data/socData';

interface ScenarioSimulatorPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToReport: () => void;
}

export const ScenarioSimulatorPage: React.FC<ScenarioSimulatorPageProps> = ({
  onNavigateToDashboard,
  onNavigateToAlerts,
  onNavigateToReport
}) => {
  const { 
    activeScenario, 
    scenarioStep, 
    loadScenario, 
    advanceScenarioStep, 
    resetScenario 
  } = useSOC();

  return (
    <div className="space-y-6 font-mono">
      
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#090e1d] border border-cyan-500/20 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              REALISTIC SOC ATTACK SCENARIO SIMULATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inject full multi-stage adversary attacks into the live SIEM pipeline and practice end-to-end triage.
          </p>
        </div>

        {activeScenario && (
          <button
            onClick={resetScenario}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Active Scenario</span>
          </button>
        )}
      </div>

      {/* Active Scenario Guided Walkthrough Banner */}
      {activeScenario && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#0d162d] via-[#091530] to-[#070b16] border border-cyan-400/40 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold uppercase">
                  SIMULATION ACTIVE: {activeScenario.severity}
                </span>
                <span className="text-xs text-slate-400">Target: <strong className="text-slate-200">{activeScenario.target_asset}</strong></span>
              </div>
              <h2 className="text-base font-bold text-cyan-300 mt-1">{activeScenario.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={advanceScenarioStep}
                disabled={scenarioStep >= activeScenario.scenario_flow_steps.length}
                className="px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 disabled:opacity-40 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              >
                <span>Advance Step ({scenarioStep}/{activeScenario.scenario_flow_steps.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {activeScenario.scenario_flow_steps.map(step => {
              const isCurrent = step.step_number === scenarioStep;
              const isPassed = step.step_number < scenarioStep;

              return (
                <div
                  key={step.step_number}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : isPassed
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase">Step {step.step_number}</span>
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="font-bold">{step.phase}</span>}
                  </div>
                  <div className="font-bold text-slate-200 text-xs">{step.description}</div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <strong className="text-cyan-400">Analyst Action:</strong> {step.analyst_action}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={onNavigateToDashboard}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs"
            >
              1. View Injected Telemetry on Dashboard →
            </button>
            <button
              onClick={onNavigateToAlerts}
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs"
            >
              2. Investigate Triggered Alert →
            </button>
            <button
              onClick={onNavigateToReport}
              className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900 text-xs font-bold"
            >
              3. Generate 13-Section Incident Report →
            </button>
          </div>
        </div>
      )}

      {/* Scenario Catalog */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase">
          Available Attack Scenario Simulations ({ATTACK_SCENARIOS.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ATTACK_SCENARIOS.map(scenario => {
            const isRunning = activeScenario?.id === scenario.id;

            return (
              <div
                key={scenario.id}
                className={`p-5 rounded-xl border transition-all space-y-4 shadow-lg flex flex-col justify-between ${
                  isRunning
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-[#090e1d] border-slate-800 hover:border-cyan-500/40 text-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400">{scenario.category}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold ${
                      scenario.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      scenario.severity === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                      'bg-blue-950 text-blue-400'
                    }`}>
                      {scenario.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100">{scenario.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{scenario.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-slate-500">Target Asset:</span>
                    <span className="text-slate-200 font-semibold">{scenario.target_asset}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span className="text-slate-500">Attacker IP:</span>
                    <span className="text-cyan-400 truncate max-w-[180px]">{scenario.attacker_ip}</span>
                  </div>

                  <button
                    onClick={() => loadScenario(scenario.key)}
                    className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-2 ${
                      isRunning
                        ? 'bg-amber-950 border border-amber-500 text-amber-300'
                        : 'bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRunning ? 'Currently Simulating' : 'Inject & Run Scenario'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
