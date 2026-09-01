import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, Users, TrendingUp, PieChart as PieIcon } from 'lucide-react';

export const IpoOwnershipPieDiagram: React.FC = () => {
  const [totalValuation, setTotalValuation] = useState<number>(100);
  const [profitMade, setProfitMade] = useState<number>(20);

  const data = [
    { name: 'You (Founder A)', shares: 45, color: '#00f3ff', fill: '#00f3ff' },
    { name: 'Maya (Founder B)', shares: 45, color: '#10b981', fill: '#10b981' },
    { name: 'Neighbour Sam (Early Investor)', shares: 10, color: '#f59e0b', fill: '#f59e0b' }
  ];

  const pricePerShare = (totalValuation / 100).toFixed(2);
  const yourShareValue = (45 * (totalValuation / 100)).toFixed(2);
  const yourDividendShare = (profitMade * 0.45).toFixed(2);

  return (
    <div className="p-6 rounded-2xl bg-[#090e1d] border border-cyan-500/30 shadow-xl font-mono text-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider">
              Interactive Ownership Simulator: The 100-Share Pie
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Adjust company valuation and profits to see how share value and dividends change.
            </p>
          </div>
        </div>
        <span className="badge-neon-cyan text-[10px] self-start sm:self-auto">100 TOTAL SHARES</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Interactive Controls */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Company Valuation:</span>
              <strong className="text-cyan-400 text-sm font-bold">${totalValuation} Total</strong>
            </div>
            <input
              type="range"
              min={100}
              max={1000}
              step={50}
              value={totalValuation}
              onChange={(e) => setTotalValuation(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$100 (Launch)</span>
              <span>$500 (Expansion)</span>
              <span>$1,000 (City Famous)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Annual Profit to Distribute (Dividends):</span>
              <strong className="text-emerald-400 text-sm font-bold">${profitMade} Cash</strong>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={10}
              value={profitMade}
              onChange={(e) => setProfitMade(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Real-time Math Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>1 Share Market Price:</span>
              <span className="text-cyan-300 font-bold">${pricePerShare}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Your 45 Shares Value (Capital):</span>
              <span className="text-emerald-400 font-bold">${yourShareValue}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Your Cash Dividend (45% of profit):</span>
              <span className="text-amber-400 font-bold">${yourDividendShare}</span>
            </div>
          </div>
        </div>

        {/* Recharts Pie Chart Visual */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="shares"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value}% Ownership (${value} Shares)`, name]}
                  contentStyle={{ backgroundColor: '#060913', borderColor: '#00f3ff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] w-full text-center mt-2">
            {data.map((item, idx) => (
              <div key={idx} className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-bold">{item.name}</span>
                <span className="text-slate-500 block">{item.shares}% ({item.shares} shares)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
