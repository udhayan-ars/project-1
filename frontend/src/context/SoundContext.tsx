import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playFailure: () => void;
  playWarning: () => void;
  playLevelUp: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('lmcys_sound') !== 'disabled';
  });

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('lmcys_sound', next ? 'enabled' : 'disabled');
      return next;
    });
  };

  const playSynth = (frequency: number, type: OscillatorType, duration: number, gainValue = 0.1) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const playClick = () => playSynth(800, 'sine', 0.05, 0.05);
  const playSuccess = () => {
    playSynth(523.25, 'sine', 0.1, 0.08);
    setTimeout(() => playSynth(659.25, 'sine', 0.1, 0.08), 80);
    setTimeout(() => playSynth(783.99, 'sine', 0.2, 0.1), 160);
  };
  const playFailure = () => {
    playSynth(220, 'sawtooth', 0.15, 0.1);
    setTimeout(() => playSynth(164.81, 'sawtooth', 0.25, 0.1), 100);
  };
  const playWarning = () => {
    playSynth(440, 'triangle', 0.1, 0.12);
    setTimeout(() => playSynth(440, 'triangle', 0.1, 0.12), 120);
  };
  const playLevelUp = () => {
    playSynth(440, 'square', 0.1, 0.05);
    setTimeout(() => playSynth(554.37, 'square', 0.1, 0.05), 100);
    setTimeout(() => playSynth(659.25, 'square', 0.1, 0.05), 200);
    setTimeout(() => playSynth(880, 'square', 0.3, 0.08), 300);
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick, playSuccess, playFailure, playWarning, playLevelUp }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};
