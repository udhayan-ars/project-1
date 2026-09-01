import React, { useEffect, useState } from 'react';
import { Map, Lock, CheckCircle, Target, Shield, Network, Cpu, Terminal, Radio, Database, Search, Activity, Flame, Crosshair, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Level, Module } from '../types';

interface WorldMapPageProps {
  onSelectLevel: (levelId: number) => void;
}

export const WorldMapPage: React.FC<WorldMapPageProps> = ({ onSelectLevel }) => {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [modules, setModules] = useState<Module[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('lmcys_token');
        const [modRes, lvlRes] = await Promise.all([
          fetch('/api/levels/modules', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/levels', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (modRes.ok && lvlRes.ok) {
          const modData = await modRes.json();
          const lvlData = await lvlRes.json();
          setModules(modData.modules || []);
          setLevels(lvlData.levels || []);

          // Find current active module based on user's current level
          const userLvl = user?.current_level || 1;
          const currentMod = modData.modules.find((m: Module) => userLvl >= m.level_start && userLvl <= m.level_end);
          if (currentMod) {
            setSelectedModuleId(currentMod.id);
          }
        }
      } catch (err) {
        console.error('Failed to load cyber map data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [user?.current_level]);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Network': return <Network className="w-5 h-5 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-green-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'Radio': return <Radio className="w-5 h-5 text-amber-400" />;
      case 'Database': return <Database className="w-5 h-5 text-purple-400" />;
      case 'Search': return <Search className="w-5 h-5 text-rose-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      default: return <Crosshair className="w-5 h-5 text-red-400" />;
    }
  };

  const activeModule = modules.find(m => m.id === selectedModuleId);
  const activeLevels = levels.filter(l => l.module_id === selectedModuleId);
  const totalCompleted = levels.filter(l => l.user_status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Cyber Command Banner */}
      <div className="cyber-card p-6 mb-8 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-neon-cyan text-[10px]">CYBER CITY SECTOR MAP</span>
            <span className="text-xs font-mono text-slate-400">• 10 ZONES • 100 OPERATIONAL LEVELS</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-extrabold text-white">
            SOC Level 1 Mission World
          </h1>
          <p className="text-xs font-sans text-slate-300 mt-1 max-w-2xl">
            Traverse through the cybersecurity grid. Unlock real SOC skills one node at a time.
          </p>
        </div>

        {/* Progress Metrics */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">CURRENT RANK</span>
            <span className="text-cyan-400 font-bold">LVL {user?.current_level || 1}</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">UNLOCKED / TOTAL</span>
            <span className="text-emerald-400 font-bold">{totalCompleted} / 100</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">XP HARVEST</span>
            <span className="text-amber-400 font-bold">{user?.xp || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Zone Nav + Right Level Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 10 Operational Zones */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              OPERATIONAL SECTORS
            </span>
            <span className="text-[11px] font-mono text-cyan-400">{modules.length} Zones</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[650px] pr-1">
            {modules.map(mod => {
              const isSelected = mod.id === selectedModuleId;
              const isZoneAccessible = (user?.current_level || 1) >= mod.level_start;
              const completedInZone = levels.filter(l => l.module_id === mod.id && l.user_status === 'completed').length;
              const totalInZone = mod.level_end - mod.level_start + 1;

              return (
                <div
                  key={mod.id}
                  onClick={() => { playClick(); setSelectedModuleId(mod.id); }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                        isSelected ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-800/60 border-slate-700'
                      }`}>
                        {getModuleIcon(mod.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-['Space_Grotesk'] font-bold text-sm text-white">
                            {mod.zone_name}
                          </span>
                          {completedInZone === totalInZone && totalInZone > 0 && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          Levels {mod.level_start} – {mod.level_end} • {completedInZone}/{totalInZone} Cleared
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Zone Level Map Nodes */}
        <div className="lg:col-span-8">
          {activeModule && (
            <div className="cyber-card p-6 border-cyan-500/20">
              {/* Zone Header */}
              <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge-neon-cyan text-[10px]">ZONE {activeModule.order_index}</span>
                    <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                      {activeModule.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-1">
                    {activeModule.description}
                  </p>
                </div>
                <span className="badge-neon-amber text-[11px] self-start sm:self-auto">
                  Levels {activeModule.level_start} - {activeModule.level_end}
                </span>
              </div>

              {/* Levels Flow Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeLevels.map((lvl) => {
                  const isCompleted = lvl.user_status === 'completed';
                  const isCurrent = lvl.user_status === 'current' || (!isCompleted && lvl.level_number === (user?.current_level || 1));
                  const isLocked = !isCompleted && !isCurrent && (lvl.level_number > (user?.current_level || 1));

                  return (
                    <div
                      key={lvl.id}
                      onClick={() => {
                        if (!isLocked) {
                          playClick();
                          onSelectLevel(lvl.level_number);
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                        isCompleted
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.1)]'
                          : isCurrent
                          ? 'bg-cyan-950/40 border-cyan-400 hover:border-cyan-300 cursor-pointer shadow-[0_0_20px_rgba(0,243,255,0.25)] animate-cyber-pulse'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isCompleted ? 'bg-emerald-500/20 text-emerald-300' :
                            isCurrent ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            LEVEL {lvl.level_number < 10 ? `0${lvl.level_number}` : lvl.level_number}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {lvl.difficulty}
                          </span>
                        </div>

                        {/* Status Icon */}
                        {isCompleted && (
                          <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                            <CheckCircle className="w-4 h-4" />
                            <span>CLEARED</span>
                          </div>
                        )}
                        {isCurrent && (
                          <div className="flex items-center gap-1 text-cyan-400 text-xs font-mono font-bold animate-pulse">
                            <Target className="w-4 h-4" />
                            <span>ACTIVE 🎯</span>
                          </div>
                        )}
                        {isLocked && (
                          <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                            <Lock className="w-4 h-4" />
                            <span>LOCKED</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Summary */}
                      <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white mb-1 line-clamp-1">
                        {lvl.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mb-3">
                        {lvl.summary}
                      </p>

                      {/* Footer Badge Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                        <span className="text-amber-400/90">+{lvl.xp_reward} XP</span>
                        <span>~{lvl.estimated_minutes} mins</span>
                        {lvl.highest_score ? (
                          <span className="text-emerald-400 font-bold">Best: {lvl.highest_score}%</span>
                        ) : (
                          <span className="text-cyan-400">Learn &rarr; Lab &rarr; Quiz</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
