import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Shield, Sparkles, ArrowRight, Compass, Check, ArrowDown } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface BeforeMindsetPageProps {
  onContinue: () => void;
}

export const BeforeMindsetPage: React.FC<BeforeMindsetPageProps> = ({ onContinue }) => {
  const { playClick, playSuccess } = useSound();
  const [isChecked, setIsChecked] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content is scrollable or if user reached the bottom
  const checkScrollPosition = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    // If the content fits entirely without scrolling (tolerance of 15px)
    const isNotScrollable = el.scrollHeight <= el.clientHeight + 15;
    if (isNotScrollable) {
      setHasScrolledToBottom(true);
      return;
    }

    // If user scrolled to (or within 25px of) the bottom
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 25;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  }, []);

  useEffect(() => {
    // Initial check on mount and on window resize
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition]);

  const handleCheckboxToggle = () => {
    if (!hasScrolledToBottom) return;
    playClick();
    setIsChecked(prev => !prev);
  };

  const handleContinue = () => {
    if (!isChecked) return;
    playSuccess();
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

        {/* Scrollable Plain Language Explanation Paragraphs */}
        <div
          ref={contentRef}
          onScroll={checkScrollPosition}
          className="space-y-4 font-sans text-sm sm:text-base text-slate-200 leading-relaxed max-h-[320px] sm:max-h-[360px] overflow-y-auto pr-2 custom-scrollbar border-y border-slate-800/80 py-4"
        >
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

        {/* Scroll Indicator Prompt (Visible only if more content is available to scroll) */}
        {!hasScrolledToBottom && (
          <div className="flex items-center justify-center gap-1.5 text-cyan-400/80 font-mono text-xs animate-bounce">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Scroll down to read all guidelines</span>
          </div>
        )}

        {/* Required Confirmation Checkbox */}
        <div className="pt-1">
          <label
            onClick={handleCheckboxToggle}
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all select-none ${
              !hasScrolledToBottom
                ? 'bg-slate-950/40 border-slate-800/60 text-slate-500 cursor-not-allowed opacity-60'
                : isChecked
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 cursor-pointer'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                !hasScrolledToBottom
                  ? 'border-slate-700 bg-slate-900 text-transparent'
                  : isChecked
                  ? 'border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,243,255,0.5)]'
                  : 'border-slate-600 bg-slate-900 text-transparent hover:border-cyan-400'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>

            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-semibold tracking-wide block">
                I have read and understood the above.
              </span>
              {!hasScrolledToBottom && (
                <span className="text-[11px] font-mono text-slate-500 block">
                  (Scroll through all guidelines above to unlock confirmation)
                </span>
              )}
            </div>
          </label>
        </div>

        {/* Continue Action Button */}
        <div>
          <button
            onClick={handleContinue}
            disabled={!isChecked}
            className={`w-full py-3.5 px-8 text-sm uppercase tracking-wider font-mono font-bold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
              isChecked
                ? 'cyber-btn-primary shadow-[0_0_25px_rgba(0,243,255,0.4)] cursor-pointer'
                : 'bg-slate-900/80 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50 shadow-none'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isChecked ? 'group-hover:translate-x-1' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
