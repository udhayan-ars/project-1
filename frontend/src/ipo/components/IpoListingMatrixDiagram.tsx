import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, ShieldCheck, DollarSign, Bell, AlertTriangle } from 'lucide-react';

export const IpoListingMatrixDiagram: React.FC = () => {
  const [issuePrice, setIssuePrice] = useState<number>(100);
  const [listingPrice, setListingPrice] = useState<number>(140);
  const [selectedLockinDay, setSelectedLockinDay] = useState<number>(1);

  const priceDiff = listingPrice - issuePrice;
  const percentageReturn = ((priceDiff / issuePrice) * 100).toFixed(1);
  const isGain = priceDiff >= 0;

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#090e1d] border border-slate-800 shadow-xl space-y-4 sm:space-y-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-white tracking-wide">
              Listing Day & Market Dynamics Visualizer
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Test listing price scenarios and inspect insider lock-in period rules.
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/30 text-amber-300 font-bold text-[10px]">
          MARKET SIMULATOR
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Left Side: Price Controls */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Official Issue Price (IPO Allotment):</span>
              <strong className="text-white text-sm">${issuePrice}</strong>
            </div>
            <div className="text-[10px] text-slate-500">The fixed price you paid during the IPO bidding.</div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Day 1 Opening Bell Market Price:</span>
              <strong className={`text-sm ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                ${listingPrice} ({isGain ? '+' : ''}{percentageReturn}%)
              </strong>
            </div>
            <input
              type="range"
              min={50}
              max={200}
              step={5}
              value={listingPrice}
              onChange={(e) => setListingPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$50 (-50% Discount)</span>
              <span>$100 (Flat)</span>
              <span>$200 (+100% Pop)</span>
            </div>
          </div>

          {/* Outcome Card */}
          <div className={`p-4 rounded-xl border space-y-1.5 ${
            isGain ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-red-950/30 border-red-500/40 text-red-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isGain ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
              <span>{isGain ? `Listing Gain: +${percentageReturn}%` : `Listing Discount: ${percentageReturn}%`}</span>
            </div>
            <p className="text-[11px] font-sans text-slate-300">
              {isGain 
                ? `If you were allotted shares at $${issuePrice} and sell at market open for $${listingPrice}, you make $${priceDiff} profit per share immediately.`
                : `Market sentiment opened below issue price. Selling at open results in a $${Math.abs(priceDiff)} loss per share.`}
            </p>
          </div>
        </div>

        {/* Right Side: Lock-In Timeline Visualizer */}
        <div className="md:col-span-6 space-y-3">
          <h5 className="font-['Space_Grotesk'] text-white font-bold text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Insider Lock-in Period Tracker</span>
          </h5>

          <p className="text-[11px] text-slate-400 font-sans">
            To prevent founders and big institutions from dumping all their shares on Day 1, government regulators enforce mandatory holding periods.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => setSelectedLockinDay(1)}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedLockinDay === 1
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="block text-[10px] text-slate-500">DAY 1</span>
              <strong className="text-xs block">Public Trading</strong>
            </button>

            <button
              onClick={() => setSelectedLockinDay(90)}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedLockinDay === 90
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="block text-[10px] text-slate-500">DAY 90</span>
              <strong className="text-xs block">Anchor Expiry</strong>
            </button>

            <button
              onClick={() => setSelectedLockinDay(365)}
              className={`p-2 rounded-lg border text-left transition-all ${
                selectedLockinDay === 365
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="block text-[10px] text-slate-500">YEAR 1-3</span>
              <strong className="text-xs block">Promoter Lock</strong>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-sans text-slate-300 space-y-1">
            {selectedLockinDay === 1 && (
              <p>
                🔒 <strong>Day 1:</strong> Only retail and non-locked shares can be traded. Company founders cannot sell their majority shares.
              </p>
            )}
            {selectedLockinDay === 90 && (
              <p>
                ⏳ <strong>Day 90:</strong> Anchor institutional investors (mutual funds/banks) complete their mandatory 30-90 day lock-in.
              </p>
            )}
            {selectedLockinDay === 365 && (
              <p>
                🛡️ <strong>Years 1 to 3:</strong> Company founders (Promoters) must maintain minimum 20% equity locked for 18 to 36 months to guarantee commitment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
