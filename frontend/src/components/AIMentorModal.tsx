import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { useSound } from '../context/SoundContext';

interface AIMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextType?: 'general' | 'assessment' | 'alert' | 'lab';
  contextId?: string | number;
}

interface Message {
  sender: 'user' | 'mentor';
  text: string;
  hintTier?: number;
  antiCheatEnforced?: boolean;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({
  isOpen,
  onClose,
  contextType = 'general',
  contextId
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'mentor',
      text: "👋 Greetings Cadet! I am your AI SOC Mentor. Ask me anything about networking, Windows security logs, Event IDs (4624/4625), alert triage playbooks, or report writing. I'll guide you through concepts with structured hints!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [hintTier, setHintTier] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { playClick, playSuccess } = useSound();

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim()) return;

    playClick();
    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('lmcys_token');
      const res = await fetch('/api/mentor/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question: textToSend,
          contextType,
          contextId,
          hintLevel: hintTier
        })
      });

      if (res.ok) {
        const data = await res.json();
        playSuccess();
        setMessages(prev => [
          ...prev,
          {
            sender: 'mentor',
            text: data.answer,
            hintTier: data.hintLevel,
            antiCheatEnforced: data.antiCheatEnforced
          }
        ]);
        if (data.hintLevel) {
          setHintTier(data.hintLevel);
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          text: '⚠️ Mentor comms link degraded. Please verify backend connectivity.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How do I identify a brute force attack in Event Viewer?',
    'What is the difference between TCP and UDP?',
    'Explain the 13 sections of a SOC Incident Report',
    'Give me a hint for this investigation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="cyber-card max-w-2xl w-full h-[600px] flex flex-col border-cyan-500/40 shadow-[0_0_40px_rgba(0,243,255,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                  SOC AI MENTOR
                </h3>
                <span className="badge-neon-green text-[10px] py-0.5">ACTIVE COACH</span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400/80">
                Socratic Scaffolding Engine • Anti-Cheat Compliant
              </p>
            </div>
          </div>
          <button
            onClick={() => { playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  m.sender === 'user'
                    ? 'bg-cyan-600/30 border border-cyan-500/40 text-cyan-100'
                    : 'bg-slate-900/90 border border-slate-700/60 text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono mb-1 text-slate-400 flex items-center gap-1.5">
                  {m.sender === 'user' ? 'CADET' : 'SOC MENTOR'}
                  {m.antiCheatEnforced && (
                    <span className="text-amber-400 bg-amber-950/40 px-1 rounded text-[9px]">
                      Anti-Spoiler Mode
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 font-mono text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                Analyzing telemetry & formulating hint...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 shrink-0">Quick Queries:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="bg-slate-900 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 text-slate-300 px-2 py-1 rounded whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-cyan-500/20 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask mentor a concept or request a hint..."
            className="flex-1 bg-slate-900/80 border border-slate-700/60 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="cyber-btn-primary py-2 px-3 text-xs disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
