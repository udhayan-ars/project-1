import React, { useEffect, useState } from 'react';
import { Activity, Award, AlertTriangle, ShieldCheck, Shield, Zap, TrendingUp, CheckCircle2, Clock, Map, FileText, ChevronRight, Sparkles, UserCheck, X, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { WeakTopic, Badge } from '../types';

interface DashboardPageProps {
  onNavigateToMap: () => void;
  onNavigateToArena: () => void;
  onOpenCert: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToMap, onNavigateToArena, onOpenCert }) => {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [stats, setStats] = useState<any>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [badges, setBadges] = useState<{ earned: Badge[]; all: Badge[] }>({ earned: [], all: [] });
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileBannerDismissed, setIsProfileBannerDismissed] = useState<boolean>(false);

  // Check if optional profile fields are at default values
  const hasDefaultProfile = Boolean(
    user && (
      user.college_name === 'Cyber Defense Academy' ||
      !user.college_name ||
      user.studying === 'Cyber Security' ||
      !user.studying ||
      user.referred_by === 'Direct'
    )
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('lmcys_token');
        const res = await fetch('/api/progress/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setWeakTopics(data.weakTopics || []);
          setBadges(data.badges || { earned: [], all: [] });
          setRecentAttempts(data.recentAttempts || []);
        }
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 95) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (percentage >= 80) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';
    if (percentage >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-red-400 border-red-500/40 bg-red-950/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="cyber-card p-6 mb-8 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.3)]">
            <Activity className="w-9 h-9 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-neon-cyan text-[10px]">CADET HUD TELEMETRY</span>
              <span className="text-xs font-mono text-slate-400">ID: {user?.id}</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-extrabold text-white">
              {user?.full_name || 'Cadet Udhayan'}
            </h1>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">
              Handle: @{user?.username} • Current Rank: Level {user?.current_level || 1}
            </p>
          </div>
        </div>

        {/* SOC Readiness Dial */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/30 flex items-center gap-5">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">SOC L1 READINESS</span>
            <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-emerald-400">
              {user?.soc_readiness || 0}%
            </span>
          </div>
          <button
            onClick={() => { playClick(); onOpenCert(); }}
            className="cyber-btn-primary py-2 px-3 text-xs"
          >
            <Award className="w-4 h-4" />
            <span>Credential</span>
          </button>
        </div>
      </div>

      {/* Dismissible "Complete your profile" Prompt */}
      {hasDefaultProfile && !isProfileBannerDismissed && (
        <div className="mb-8 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-sm font-bold text-white">Complete Your Cadet Profile</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Optional</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Add your College Name, Academic Year, and Field of Study to customize your verified training credentials and campus leaderboard standing.
              </p>
            </div>
          </div>

          <button
            onClick={() => { playClick(); setIsProfileBannerDismissed(true); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="cyber-card p-4">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">TOTAL HARVESTED XP</span>
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-amber-400">
            {stats?.xp || 0} XP
          </span>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Streaks: {user?.streak_days || 1} Day(s)</p>
        </div>

        <div className="cyber-card p-4">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">CURRICULUM PROGRESS</span>
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-cyan-400">
            {stats?.completedLevels || 0} / 100
          </span>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Completed Levels</p>
        </div>

        <div className="cyber-card p-4">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">ARENA INVESTIGATIONS</span>
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-emerald-400">
            {stats?.investigationsCount || 0}
          </span>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Alert Triages Completed</p>
        </div>

        <div className="cyber-card p-4">
          <span className="text-[10px] font-mono text-slate-500 block uppercase">INCIDENT REPORTS</span>
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-purple-400">
            {stats?.reportsCount || 0}
          </span>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Avg Score: {stats?.avgReportScore || 0}/5.0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Adaptive Weak Topics & Assessment History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weak Topics Engine */}
          <div className="cyber-card p-5 border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  Adaptive Learning & Topic Mastery Radar
                </h3>
              </div>
              <span className="badge-neon-amber text-[10px]">AI ANALYSIS</span>
            </div>

            {weakTopics.length > 0 ? (
              <div className="space-y-3">
                {weakTopics.map((wt, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border font-mono text-xs flex items-center justify-between ${getStatusColor(wt.accuracy_percentage)}`}
                  >
                    <div>
                      <span className="font-bold block text-slate-200">{wt.topic_tag}</span>
                      <span className="text-[10px] text-slate-400">Attempts: {wt.attempts_count}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold block">{Math.round(wt.accuracy_percentage)}%</span>
                      <span className="text-[10px] uppercase">{wt.statusLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 font-mono text-xs text-slate-500">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                Complete Level assessments to populate your adaptive weak-topic profile.
              </div>
            )}
          </div>

          {/* Recent Assessment Attempts */}
          <div className="cyber-card p-5 border-slate-800">
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Assessment Submissions
            </h3>

            {recentAttempts.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {recentAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">Level {att.level_number}: {att.level_title}</span>
                      <span className="text-[10px] text-slate-500">{new Date(att.started_at).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${att.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {att.score}% ({att.passed ? 'PASSED' : 'FAILED'})
                      </span>
                      {att.tab_violations_count > 0 && (
                        <span className="text-[10px] text-amber-400 block">
                          ⚠️ {att.tab_violations_count} Focus Shift(s)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-500 text-center py-4">No recent attempts recorded.</p>
            )}
          </div>
        </div>

        {/* Right Column: 9 Achievement Badges Showcase & Profile Record */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cadet Academic Profile Record Card */}
          <div className="cyber-card p-5 border-cyan-500/30">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  Academy Enrollment Profile
                </h3>
              </div>
              <span className="badge-neon-cyan text-[10px]">VERIFIED CADET</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Full Name:</span>
                <span className="text-white font-bold">{user?.full_name || 'Murali'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Email ID:</span>
                <span className="text-cyan-300">{user?.email || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">AGE</span>
                  <span className="text-white font-bold">{user?.age || '20'} Years</span>
                </div>
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">REFERRED BY</span>
                  <span className="text-emerald-400 font-bold truncate">{user?.referred_by || 'Direct'}</span>
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PROGRAM / COURSE</span>
                <span className="text-white font-bold">{user?.studying || 'B.E Cyber Security'}</span>
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">ACADEMIC YEAR</span>
                <span className="text-amber-300 font-bold">{user?.academic_year || '3rd Year'}</span>
              </div>
              <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">COLLEGE / INSTITUTION</span>
                <span className="text-purple-300 font-bold">{user?.college_name || 'ABC Engineering College'}</span>
              </div>
              {user?.profile_file && (
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300">
                  <span>📁 Database Record: </span>
                  <span className="font-bold text-white">database/{user.profile_file}</span>
                </div>
              )}
            </div>
          </div>

          <div className="cyber-card p-5 border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  SOC Cadet Badges ({badges.earned.length} / {badges.all.length})
                </h3>
              </div>
              <span className="badge-neon-cyan text-[10px]">ACHIEVEMENTS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.all.map((b) => {
                const isEarned = badges.earned.some(eb => eb.id === b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isEarned
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        isEarned ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-['Space_Grotesk'] text-xs font-bold text-white">
                          {b.name}
                        </h4>
                        <span className="text-[9px] font-mono text-cyan-400">
                          {isEarned ? 'UNLOCKED ✓' : 'LOCKED 🔒'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] font-sans text-slate-400 leading-tight">
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
