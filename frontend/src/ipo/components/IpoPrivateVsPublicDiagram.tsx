import React, { useState } from 'react';
import { Store, Building2, Users, ArrowRight, ShieldCheck, DollarSign, Lock, Unlock } from 'lucide-react';

export const IpoPrivateVsPublicDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private');

  return (
    <div className="p-6 rounded-2xl bg-[#090e1d] border border-cyan-500/30 shadow-xl font-mono text-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider">
              Interactive Comparison: Private vs. Public Company
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Switch between stages to understand why companies make the leap to an IPO.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('private')}
            className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
              activeTab === 'private'
                ? 'bg-amber-950 border border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stage 1: Private Shop
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
              activeTab === 'public'
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stage 2: Public IPO
          </button>
        </div>
      </div>

      {/* Dynamic Content Display */}
      {activeTab === 'private' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Store className="w-4 h-4" />
              <span>Scale & Scope</span>
            </div>
            <h5 className="font-['Space_Grotesk'] text-white text-sm font-bold">1 Local Tea Shop</h5>
            <p className="text-slate-400 text-[11px] font-sans">
              Serves 500 cups a day. Maximum capacity reached. Cannot grow without millions in new funding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Investor Base & Liquidity</span>
            </div>
            <h5 className="font-['Space_Grotesk'] text-white text-sm font-bold">2 Private Founders</h5>
            <p className="text-slate-400 text-[11px] font-sans">
              Shares cannot be bought by the public. Selling shares requires months of private legal contracts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <DollarSign className="w-4 h-4" />
              <span>Fundraising Barrier</span>
            </div>
            <h5 className="font-['Space_Grotesk'] text-white text-sm font-bold">Bank Loans Only</h5>
            <p className="text-slate-400 text-[11px] font-sans">
              Banks demand personal property as collateral and charge mandatory monthly interest payments.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Building2 className="w-4 h-4" />
              <span>Scale & Scope</span>
            </div>
            <h5 className="font-['Space_Grotesk'] text-white text-sm font-bold">50 Nationwide Outlets</h5>
            <p className="text-slate-300 text-[11px] font-sans">
              Raised $5,000,000 through the IPO to build automated tea brewers, central warehouses, and brand stores.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Unlock className="w-4 h-4" />
              <span>Investor Base & Liquidity</span>
            </div>
            <h5 className="font-['Space_Grotesk'] text-white text-sm font-bold">100,000+ Public Owners</h5>
            <p className="text-slate-300 text-[11px] font-sans">
              Shares trade freely on the stock exchange. Anyone can buy 1 share for $10 or sell it for instant cash.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Debt-Free Growth</span>
            </div>
            <h5 className="font-['Space_Grotesk'] text-white text-sm font-bold">Shared Equity Capital</h5>
            <p className="text-slate-300 text-[11px] font-sans">
              No mandatory loan interest. Shareholders share in future profits through dividends and stock price appreciation.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Bottom Callout */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">
          💡 <strong>Key Takeaway:</strong> An IPO transforms a private business into a public market powerhouse.
        </span>
        <button
          onClick={() => setActiveTab(activeTab === 'private' ? 'public' : 'private')}
          className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Switch to {activeTab === 'private' ? 'Public Stage' : 'Private Stage'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
