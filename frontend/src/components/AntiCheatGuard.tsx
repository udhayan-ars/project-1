import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, EyeOff } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface AntiCheatGuardProps {
  isActive: boolean;
  assessmentId: string;
  onViolation: (count: number) => void;
}

export const AntiCheatGuard: React.FC<AntiCheatGuardProps> = ({ isActive, assessmentId, onViolation }) => {
  const [violationCount, setViolationCount] = useState<number>(0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [lastWarningText, setLastWarningText] = useState<string>('');
  const { playWarning } = useSound();

  useEffect(() => {
    if (!isActive) return;

    const recordViolation = async (type: string, message: string) => {
      playWarning();
      setViolationCount(prev => {
        const next = prev + 1;
        onViolation(next);
        return next;
      });
      setLastWarningText(message);
      setShowWarningModal(true);

      try {
        const token = localStorage.getItem('lmcys_token');
        await fetch('/api/assessments/tab-switch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            assessmentId,
            eventType: type
          })
        });
      } catch (err) {
        console.error('Failed to log anti-cheat telemetry:', err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch', 'Tab switch or window minimization detected!');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('window_blur', 'Window focus lost. Please maintain focus on the assessment.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive, assessmentId, onViolation, playWarning]);

  if (!showWarningModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="cyber-card max-w-md w-full p-6 border-red-500/60 shadow-[0_0_30px_rgba(255,51,102,0.4)] text-center relative">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <ShieldAlert className="w-9 h-9 text-red-500" />
        </div>

        <h3 className="font-['Space_Grotesk'] text-xl font-bold text-red-400 mb-2">
          SECURITY MONITOR ALERT
        </h3>

        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg mb-4 text-left font-mono text-xs text-red-200">
          <p className="flex items-center gap-2 mb-1">
            <EyeOff className="w-4 h-4 text-red-400" />
            <strong>Violation #{violationCount}:</strong> {lastWarningText}
          </p>
          <p className="text-slate-400 text-[11px] mt-2">
            ⚠️ Anti-Cheating Protocol Active: Repeated focus shifts or tab-switching may apply a score penalty (-10 marks) and are permanently logged to the SOC audit trail.
          </p>
        </div>

        <button
          onClick={() => setShowWarningModal(false)}
          className="cyber-btn-danger w-full py-2.5 font-mono text-xs uppercase font-bold"
        >
          I Understand — Resume Assessment
        </button>
      </div>
    </div>
  );
};
