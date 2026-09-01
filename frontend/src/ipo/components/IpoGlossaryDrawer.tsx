import React, { useState } from 'react';
import { BookOpen, Search, X, Sparkles, HelpCircle } from 'lucide-react';
import { JargonTerm } from '../types';

interface IpoGlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allTerms: JargonTerm[];
}

export const IpoGlossaryDrawer: React.FC<IpoGlossaryDrawerProps> = ({
  isOpen,
  onClose,
  allTerms
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = allTerms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.simpleDefinition.toLowerCase().includes(search.toLowerCase()) ||
    t.lemonadeAnalogy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-mono">
      <div className="cyber-card max-w-2xl w-full h-[650px] flex flex-col border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-cyan-950/40 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">
                IPO & Finance Plain-Language Glossary
              </h3>
              <p className="text-[11px] text-cyan-400/80">
                Zero-jargon definitions with real-world lemonade analogies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 bg-slate-950 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search financial terms (e.g. Dividend, Equity, IPO, Capital)..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Term Cards List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-['Space_Grotesk'] text-sm font-bold text-cyan-300">
                    {item.term}
                  </h4>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    PLAIN ENGLISH
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-200 leading-relaxed">
                  {item.simpleDefinition}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-amber-300/90 font-sans flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Lemonade Stand Analogy:</strong> {item.lemonadeAnalogy}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              No matching financial terms found for "{search}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
