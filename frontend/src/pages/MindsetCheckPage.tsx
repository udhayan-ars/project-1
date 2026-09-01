import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';

interface MindsetCheckPageProps {
  onComplete: () => void;
}

export const MindsetCheckPage: React.FC<MindsetCheckPageProps> = ({ onComplete }) => {
  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const { playClick, playSuccess } = useSound();

  const handleChoice = (choice: 'yes' | 'no') => {
    playClick();
    setSelectedResponse(choice);
  };

  const handleStartJourney = async () => {
    playSuccess();
    setLoading(true);

    try {
      const token = localStorage.getItem('lmcys_token');
      await fetch('/api/auth/mindset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      updateUser({ mindset_completed: 1 });
      onComplete();
    } catch (err) {
      console.error('Failed to update mindset status:', err);
      updateUser({ mindset_completed: 1 });
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="cyber-card max-w-2xl w-full p-8 md:p-12 text-center border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.2)] relative overflow-hidden">
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          <HelpCircle className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-400 mb-3">
          CADET MINDSET INITIALIZATION PROTOCOL
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          ARE YOU AN IDIOT?
        </h1>

        {!selectedResponse ? (
          <div className="mt-8 space-y-6">
            <p className="text-slate-300 font-sans text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Before entering the SOC Command Center, we must configure your learning mental model. Be honest with yourself.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleChoice('yes')}
                className="w-full sm:w-44 py-3.5 px-6 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 font-mono text-sm font-bold text-slate-200 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
              >
                YES
              </button>

              <button
                onClick={() => handleChoice('no')}
                className="w-full sm:w-44 py-3.5 px-6 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-400 font-mono text-sm font-bold text-slate-200 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all"
              >
                NO
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {selectedResponse === 'yes' ? (
              <div className="p-6 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-cyan-300">
                    Mindset Shift Activated
                  </h3>
                </div>
                <p className="text-slate-200 font-sans text-base leading-relaxed">
                  “You are <strong className="text-white">not an idiot</strong>. Cybersecurity is a practical skill, and all practical skills can be mastered through structured problem solving. Let’s change your mindset from memorization to frontline investigation.”
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-emerald-300">
                    Challenge Accepted
                  </h3>
                </div>
                <p className="text-slate-200 font-sans text-base leading-relaxed">
                  “<strong className="text-white">Good. Then let’s prove it.</strong> Don’t just read about cybersecurity — triage live alerts, dissect Windows event IDs, investigate intrusions, and solve real SOC incidents.”
                </p>
              </div>
            )}

            <button
              onClick={handleStartJourney}
              disabled={loading}
              className="cyber-btn-primary w-full py-3.5 text-sm uppercase tracking-wider font-mono flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,243,255,0.4)]"
            >
              <span>{loading ? 'Initializing Simulation Grid...' : 'START MY JOURNEY'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
