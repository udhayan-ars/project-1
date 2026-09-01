import React from 'react';
import { 
  Shield, 
  Radio, 
  Map, 
  Award, 
  FileText, 
  LayoutDashboard,
  LogOut, 
  Volume2, 
  VolumeX, 
  Bot, 
  Terminal, 
  Activity,
  Crosshair,
  Flame,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenMentor: () => void;
  onOpenCert: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenMentor, onOpenCert }) => {
  const { user, logout } = useAuth();
  const { soundEnabled, toggleSound, playClick } = useSound();

  const handleNav = (page: string) => {
    playClick();
    onNavigate(page);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#060913]/95 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-4 py-2.5">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav(user ? 'map' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] transition-all">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] font-bold text-lg tracking-wider text-white">
                LM<span className="text-cyan-400">CYS</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-400/40 font-mono text-[9px] text-cyan-300 font-bold tracking-wider">
                SOC L1 PLATFORM
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-tight hidden sm:block">
              Let's Make Cyber Security Simple
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        {user ? (
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full">
            
            {/* 1. Cyber Map (100 Levels) */}
            <button
              onClick={() => handleNav('map')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                currentPage === 'map' || currentPage === 'level'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              <span>100 Levels Map</span>
            </button>

            {/* 2. Let's Defend (SOC Arena) */}
            {(() => {
              const isArenaUnlocked = user.role === 'admin' || (user.current_level && user.current_level > 100);
              const completedCount = user.role === 'admin' ? 100 : Math.max(0, (user.current_level ? user.current_level - 1 : 0));

              return (
                <button
                  onClick={() => handleNav('arena')}
                  title={
                    isArenaUnlocked
                      ? "Enter Practical SOC Arena (Let's Defend)"
                      : `🔒 Practical SOC Simulation — Unlocks after completing all 100 levels (${completedCount}/100 done)`
                  }
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                    currentPage === 'arena'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_10px_rgba(255,51,102,0.2)]'
                      : isArenaUnlocked
                      ? 'text-slate-300 hover:bg-slate-800/60 hover:text-red-400'
                      : 'text-slate-500 hover:text-slate-400 bg-slate-900/40 border border-slate-800/60 opacity-70'
                  }`}
                >
                  {isArenaUnlocked ? (
                    <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  ) : (
                    <span className="text-[11px]">🔒</span>
                  )}
                  <span>Let's Defend</span>
                  {!isArenaUnlocked && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {completedCount}/100
                    </span>
                  )}
                </button>
              );
            })()}

            {/* 3. SOC SIEM Operations Suite */}
            <button
              onClick={() => handleNav('soc_suite')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                currentPage === 'soc_suite'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-blue-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>SOC SIEM Console</span>
            </button>

            {/* 4. Incident Reports Studio */}
            <button
              onClick={() => handleNav('reports')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                currentPage === 'reports'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(157,78,221,0.2)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-purple-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">13-Sec Reports</span>
            </button>

            {/* 5. Cadet HUD Profile */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                currentPage === 'dashboard'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(0,255,102,0.2)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Cadet HUD</span>
            </button>

            {/* 6. IPO Explained Interactive App */}
            <button
              onClick={() => handleNav('ipo')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                currentPage === 'ipo'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,243,255,0.3)]'
                  : 'text-cyan-300/90 hover:bg-cyan-950/50 hover:text-cyan-200 border border-cyan-500/20'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>IPO Level 0-100</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all shrink-0 ${
                  currentPage === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-300'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">Admin Ops</span>
              </button>
            )}

            {/* Quick Action Tools */}
            <div className="h-5 w-[1px] bg-slate-800 mx-1 hidden sm:block shrink-0" />

            {/* AI SOC Mentor */}
            <button
              onClick={() => { playClick(); onOpenMentor(); }}
              title="Ask Socratic AI SOC Mentor"
              className="flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 px-2 py-1 rounded-md font-mono text-xs font-semibold shadow-[0_0_10px_rgba(0,243,255,0.15)] transition-all shrink-0"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span className="hidden lg:inline">AI Mentor</span>
            </button>

            <button
              onClick={() => { playClick(); onOpenCert(); }}
              title="View Verifiable SOC L1 Certificate"
              className="flex items-center gap-1 bg-emerald-950/50 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 px-2 py-1 rounded-md font-mono text-xs font-semibold transition-all shrink-0"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Certificate</span>
            </button>

            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Audio' : 'Enable Cyber Audio'}
              className="p-1 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 shrink-0">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold font-mono text-slate-200">{user.username}</span>
                <span className="text-[10px] font-mono text-cyan-400">{user.xp} XP • LVL {user.current_level}</span>
              </div>
              <button
                onClick={() => { playClick(); logout(); }}
                title="Sign Out"
                className="p-1.5 rounded-md bg-red-950/30 text-red-400 hover:bg-red-900/50 border border-red-500/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleNav('ipo')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,243,255,0.2)] hover:border-cyan-400 hover:bg-cyan-900/60 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>IPO Explained</span>
            </button>
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber Audio'}
              className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleNav('login')}
              className="cyber-btn-secondary py-1 px-3 text-xs"
            >
              Cadet Login
            </button>
            <button
              onClick={() => handleNav('register')}
              className="cyber-btn-primary py-1 px-3.5 text-xs"
            >
              Join Academy
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
