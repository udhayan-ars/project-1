import React, { useState } from 'react';
import { FileText, Users, DollarSign, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const IpoLifecycleDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      name: 'Hire Investment Bankers',
      role: 'Underwriters',
      icon: Users,
      summary: 'The company hires financial experts called Investment Bankers (Underwriters).',
      detail: 'These bankers calculate how much the business is worth, manage legal rules, and organize the share sale.'
    },
    {
      num: 2,
      name: 'Draft Prospectus (DRHP)',
      role: 'Rulebook & Risks',
      icon: FileText,
      summary: 'The company writes a detailed disclosure book called the Draft Red Herring Prospectus (DRHP).',
      detail: 'This document explains every business secret, money record, and risk factor to the government regulator before public sale.'
    },
    {
      num: 3,
      name: 'Set Price Band',
      role: 'Bidding Range',
      icon: DollarSign,
      summary: 'The company sets a price range for bidding, called the Price Band (e.g. $100 to $120).',
      detail: 'Investors can place bids at any price between the minimum ($100 floor price) and maximum ($120 cap price).'
    },
    {
      num: 4,
      name: 'Book Building Window',
      role: '3-Day Bidding',
      icon: Layers,
      summary: 'The IPO opens for 3 to 5 business days for investors to submit bids.',
      detail: 'This process of collecting bids to find the best market price is called Book Building.'
    },
    {
      num: 5,
      name: 'Final Issue Price',
      role: 'Clearing Price',
      icon: CheckCircle2,
      summary: 'The company reviews demand and fixes one single Final Issue Price.',
      detail: 'If demand is high (oversubscribed), the final price is fixed at the top of the range ($120) and shares are distributed.'
    }
  ];

  const current = steps.find(s => s.num === activeStep) || steps[0];
  const Icon = current.icon;

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-white tracking-wide">
              The 5-Stage IPO Lifecycle
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Click any stage below to inspect how a company moves from planning to public market.
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold">
          STAGE {activeStep} OF 5
        </span>
      </div>

      {/* 5-Step Horizontal Progress Ribbon */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {steps.map(step => {
          const isActive = step.num === activeStep;
          const isPassed = step.num < activeStep;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => setActiveStep(step.num)}
              className={`p-2 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.25)]'
                  : isPassed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border border-current">
                {step.num}
              </div>
              <span className="text-[10px] font-mono font-bold hidden sm:block truncate w-full">
                {step.role}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep Dive Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              PHASE {current.num}: {current.role}
            </span>
            <h5 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white">
              {current.name}
            </h5>
          </div>
        </div>

        <p className="text-sm font-sans text-slate-200 leading-relaxed">
          {current.summary}
        </p>

        <div className="p-3 rounded-lg bg-[#090e1d] border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed">
          💡 <strong>What happens here:</strong> {current.detail}
        </div>

        <div className="flex items-center justify-between pt-2 text-xs font-mono text-slate-400">
          <span>Stage {activeStep} of 5</span>
          {activeStep < 5 ? (
            <button
              onClick={() => setActiveStep(prev => prev + 1)}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveStep(1)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>Restart Lifecycle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
