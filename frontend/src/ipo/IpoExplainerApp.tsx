import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Layers, 
  ArrowLeft,
  Award,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import { IPO_LEVELS } from './data/curriculumData';
import { IpoOwnershipPieDiagram } from './components/IpoOwnershipPieDiagram';
import { IpoPrivateVsPublicDiagram } from './components/IpoPrivateVsPublicDiagram';
import { IpoLifecycleDiagram } from './components/IpoLifecycleDiagram';
import { IpoBiddingJourneyDiagram } from './components/IpoBiddingJourneyDiagram';
import { IpoListingMatrixDiagram } from './components/IpoListingMatrixDiagram';
import { IpoQuizCard } from './components/IpoQuizCard';
import { IpoGlossaryDrawer } from './components/IpoGlossaryDrawer';
import { JargonTerm } from './types';
import { useSound } from '../context/SoundContext';

interface IpoExplainerAppProps {
  onBackToMain?: () => void;
}

export const IpoExplainerApp: React.FC<IpoExplainerAppProps> = ({ onBackToMain }) => {
  const { playClick, playSuccess } = useSound();
  
  // State: Current Active Level
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  
  // State: Completed Levels (Set of Level Numbers)
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  // State: Glossary Drawer
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);

  const activeLevel = IPO_LEVELS.find(l => l.id === activeLevelId) || IPO_LEVELS[0];
  const maxUnlockedLevel = Math.max(1, ...completedLevels.map(lvl => lvl + 1));

  // Extract all glossary terms across levels
  const allGlossaryTerms: JargonTerm[] = IPO_LEVELS.flatMap(l => 
    l.keyConcepts.flatMap(c => c.jargonTerms)
  );

  const handlePassLevel = (lvlId: number) => {
    if (!completedLevels.includes(lvlId)) {
      setCompletedLevels(prev => [...prev, lvlId]);
      playSuccess();
    }
  };

  const handleSelectLevel = (lvlId: number) => {
    if (lvlId <= maxUnlockedLevel) {
      playClick();
      setActiveLevelId(lvlId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLevelCompleted = completedLevels.includes(activeLevel.id);
  const isMasteryAchieved = completedLevels.length === 5;
  const progressPercentage = Math.round((completedLevels.length / 5) * 100);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-[#060913]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                title="Return to Main Hub"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.25)] shrink-0">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Space_Grotesk'] text-base sm:text-lg font-extrabold text-white tracking-wide">
                    IPO Explained
                  </h1>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    LEVEL 0 TO 100
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                  A high-school level interactive guide to Initial Public Offerings
                </p>
              </div>
            </div>
          </div>

          {/* Progress Tracker & Glossary CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase">Progress:</span>
              <span className="text-cyan-400 font-bold">{completedLevels.length}/5</span>
              <div className="w-16 bg-slate-900 h-2 rounded-full overflow-hidden ml-1 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => { playClick(); setGlossaryOpen(true); }}
              className="flex items-center gap-1.5 cyber-btn-secondary py-1.5 px-3 text-xs font-mono"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Plain Jargon</span>
              <span>Glossary</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Single Centered Max-Width Column */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Level Navigation Selector Tabs */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              CURRICULUM LEVEL PROGRESSION
            </span>
            <span className="text-cyan-400 font-bold">
              Level {activeLevel.levelNumber} of 5 ({progressPercentage}% Complete)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvlNum) => {
              const isCurrent = activeLevelId === lvlNum;
              const isCompleted = completedLevels.includes(lvlNum);
              const isUnlocked = lvlNum <= maxUnlockedLevel;

              return (
                <button
                  key={lvlNum}
                  onClick={() => isUnlocked && handleSelectLevel(lvlNum)}
                  disabled={!isUnlocked}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[68px] ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                      : isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                      : isUnlocked
                      ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold">LVL {lvlNum}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isUnlocked ? (
                      <Unlock className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                  <div className="font-bold text-xs truncate">
                    {lvlNum === 1 ? '1. What is a Share?' :
                     lvlNum === 2 ? '2. Why Go Public?' :
                     lvlNum === 3 ? '3. The IPO Process' :
                     lvlNum === 4 ? '4. How to Apply' : '5. Listing & GMP'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Header Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1d] border border-cyan-500/30 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-neon-cyan text-[10px] font-mono">{activeLevel.badge}</span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeLevel.estimatedMinutes} Mins Read</span>
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {activeLevel.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            {activeLevel.subtitle}
          </p>
        </div>

        {/* Continuous Running Analogy Hero Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>THE RUNNING STORY: {activeLevel.runningAnalogyTitle.toUpperCase()}</span>
          </div>
          <p className="text-sm font-sans text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            {activeLevel.runningAnalogyText}
          </p>
        </div>

        {/* Key Concepts with Plain Definitions & In-Short Recaps */}
        <div className="space-y-6">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Core Concepts Explained</span>
          </h3>

          <div className="space-y-6">
            {activeLevel.keyConcepts.map((concept, cIdx) => (
              <div key={cIdx} className="p-6 rounded-2xl bg-[#090e1d] border border-slate-800 space-y-4 shadow-md">
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  {concept.heading}
                </h4>
                <p className="text-sm font-sans text-slate-300 leading-relaxed">
                  {concept.body}
                </p>

                {/* Highlighted Jargon Term Cards */}
                {concept.jargonTerms && concept.jargonTerms.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {concept.jargonTerms.map((term, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-cyan-300 font-bold">
                          <span>📖 {term.term}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                            TERM
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-slate-300">
                          {term.simpleDefinition}
                        </p>
                        <div className="text-[10px] text-amber-400/90 font-sans border-t border-slate-900 pt-1">
                          🍋 <strong>Story link:</strong> {term.lemonadeAnalogy}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* "In Short" One-Line Skimmable Recap */}
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  💡 {concept.inShortRecap}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Interactive Visual Diagram */}
        <div className="space-y-3">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Interactive Concept Visualizer</span>
          </h3>

          {activeLevel.diagramType === 'ownership_pie' && <IpoOwnershipPieDiagram />}
          {activeLevel.diagramType === 'private_vs_public' && <IpoPrivateVsPublicDiagram />}
          {activeLevel.diagramType === 'ipo_lifecycle' && <IpoLifecycleDiagram />}
          {activeLevel.diagramType === 'bidding_journey' && <IpoBiddingJourneyDiagram />}
          {activeLevel.diagramType === 'listing_day_matrix' && <IpoListingMatrixDiagram />}
        </div>

        {/* Real-World Case Study Box */}
        <div className="p-6 rounded-2xl bg-[#090e1d] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>{activeLevel.realWorldExampleTitle.toUpperCase()}</span>
          </div>
          <p className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
            {activeLevel.realWorldExampleText}
          </p>
        </div>

        {/* End-of-Level Quick Recap Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCheck className="w-4 h-4" />
            <span>LEVEL {activeLevel.levelNumber} QUICK RECAP</span>
          </div>
          <ul className="space-y-2 text-slate-200 font-sans text-xs sm:text-sm">
            {activeLevel.quickRecapBullets.map((bullet, bIdx) => (
              <li key={bIdx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3-Question Comprehension Check Quiz */}
        <IpoQuizCard
          levelNumber={activeLevel.levelNumber}
          questions={activeLevel.quiz}
          isCompleted={isLevelCompleted}
          onPassQuiz={() => handlePassLevel(activeLevel.id)}
          onNextLevel={() => handleSelectLevel(activeLevel.id + 1)}
          hasNextLevel={activeLevel.id < 5}
        />

        {/* Final Mastery Celebration Banner (When all 5 levels are passed) */}
        {isMasteryAchieved && (
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#060913] via-emerald-950/40 to-[#040710] border-2 border-emerald-500/50 text-center space-y-4 shadow-[0_0_50px_rgba(0,255,102,0.2)] animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(0,255,102,0.4)]">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="badge-neon-green text-[10px] font-mono">100% CURRICULUM MASTERY</span>
              <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white mt-1">
                🎉 Congratulations! You Mastered IPOs From Level 0 to 100
              </h3>
              <p className="text-sm font-sans text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
                You now understand what shares are, why companies go public, how investment bankers file a DRHP, how to apply with ASBA, and how listing day market dynamics and lock-in periods operate.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => handleSelectLevel(1)}
                className="cyber-btn-secondary py-2.5 px-5 text-xs font-mono flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Review from Level 1</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Plain-Language Glossary Drawer */}
      <IpoGlossaryDrawer
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        allTerms={allGlossaryTerms}
      />
    </div>
  );
};
