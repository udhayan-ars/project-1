import React, { useState } from 'react';
import { Smartphone, Lock, CheckCircle2, RefreshCw, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

export const IpoBiddingJourneyDiagram: React.FC = () => {
  const [lotCount, setLotCount] = useState<number>(1);
  const [allotmentOutcome, setAllotmentOutcome] = useState<'pending' | 'allotted' | 'not_allotted'>('pending');

  const sharesPerLot = 50;
  const pricePerShare = 100;
  const totalShares = lotCount * sharesPerLot;
  const totalBlockedAmount = totalShares * pricePerShare;

  const handleSimulateLottery = () => {
    // 50% random chance to simulate high-demand oversubscribed IPO allotment
    const won = Math.random() > 0.4;
    setAllotmentOutcome(won ? 'allotted' : 'not_allotted');
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4 sm:space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-white tracking-wide">
              The Application-to-Allotment Journey
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Simulate submitting an IPO bid with ASBA bank fund-blocking and test the allotment draw.
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-emerald-300 font-bold text-[10px]">
          INTERACTIVE BIDDER
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Left Side: Bid Configuration */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Select Lot Size (1 Lot = 50 Shares):</span>
              <strong className="text-cyan-400 text-sm">{lotCount} Lot ({totalShares} Shares)</strong>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={lotCount}
              onChange={(e) => {
                setLotCount(Number(e.target.value));
                setAllotmentOutcome('pending');
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 Lot (50 sh.)</span>
              <span>2 Lots (100 sh.)</span>
              <span>3 Lots (150 sh.)</span>
              <span>4 Lots (200 sh.)</span>
            </div>
          </div>

          {/* ASBA Blocked Funds Explainer Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Issue Price per Share:</span>
              <span className="text-white font-bold">${pricePerShare}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Total Application Value:</span>
              <span className="text-cyan-300 font-bold">${totalBlockedAmount}</span>
            </div>
            <div className="flex items-center justify-between text-amber-300 border-t border-slate-900 pt-1.5">
              <span>ASBA Bank Account Status:</span>
              <span className="font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>${totalBlockedAmount} Blocked (Not Deducted)</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleSimulateLottery}
            className="cyber-btn-primary w-full py-3 text-xs uppercase font-bold tracking-wider"
          >
            <span>Run Allotment Lottery Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Visual Result Card */}
        <div className="md:col-span-6">
          {allotmentOutcome === 'pending' ? (
            <div className="p-6 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Layers className="w-6 h-6" />
              </div>
              <h5 className="font-['Space_Grotesk'] text-white font-bold text-sm">
                Bid Submitted & Bank Funds Blocked
              </h5>
              <p className="text-xs text-slate-400 font-sans">
                Your ${totalBlockedAmount} remains safe in your bank account. Click the button above to simulate the computerized allotment draw.
              </p>
            </div>
          ) : allotmentOutcome === 'allotted' ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h5 className="font-['Space_Grotesk'] text-emerald-300 font-bold text-base">
                🎉 Allotment Successful!
              </h5>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                You were awarded <strong>{totalShares} shares</strong>. Your <strong>${totalBlockedAmount}</strong> is now transferred, and the shares are deposited safely into your electronic <strong>Demat Account</strong>.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h5 className="font-['Space_Grotesk'] text-cyan-300 font-bold text-base">
                🛡️ Not Allotted • 100% Refund Unblocked
              </h5>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                The IPO was heavily oversubscribed. Because of ASBA protection, your <strong>${totalBlockedAmount}</strong> was never deducted and has been completely unblocked in your bank account.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
