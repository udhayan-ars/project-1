import React from 'react';
import { Shield, Sparkles, ArrowRight, HelpCircle, Eye, Compass, Lock } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface BeforeMindsetPageProps {
  onContinue: () => void;
}

export const BeforeMindsetPage: React.FC<BeforeMindsetPageProps> = ({ onContinue }) => {
  const { playClick } = useSound();

  const handleContinue = () => {
    playClick();
    onContinue();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
      <div className="cyber-card max-w-2xl w-full p-6 sm:p-10 md:p-12 border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.2)] relative overflow-hidden space-y-6 sm:space-y-8">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Icon & Protocol Tag */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,243,255,0.3)]">
            <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 font-mono text-[11px] text-cyan-400 font-bold tracking-wider uppercase">
            ORIENTATION • BEFORE WE BEGIN
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Before We Begin...
          </h1>
        </div>

        {/* Plain Language Explanation Paragraphs */}
        <div className="space-y-4 font-sans text-sm sm:text-base text-slate-200 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <p className="font-semibold text-white">
              In a moment we’re going to ask you a strange question: <span className="text-cyan-400 font-bold">are you an idiot?</span>
            </p>
            <p className="text-slate-300 text-xs sm:text-sm">
              Don’t worry — this isn’t really about intelligence. It’s about mindset.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>THE CYBERSECURITY MINDSET</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              Cybersecurity is a field where the people who do best aren’t the ones who already know everything. They’re the ones who stay curious, ask <em>“why did this happen?”</em>, and aren’t afraid to say <em>“I don’t know yet.”</em>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WHAT IS A SOC?</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              A <strong>SOC (Security Operations Center)</strong> is basically a team of people who watch over computer systems and networks, looking for anything suspicious — like security guards, but for digital systems instead of buildings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200">
            💡 So when we ask if you’re an idiot, we really mean: <strong>are you ready to learn from zero, without pretending you already know it all?</strong>
          </div>
        </div>

        {/* Continue Action Button */}
        <div className="pt-2">
          <button
            onClick={handleContinue}
            className="cyber-btn-primary w-full py-3.5 px-8 text-sm uppercase tracking-wider font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,243,255,0.4)]"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
