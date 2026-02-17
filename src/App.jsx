import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap } from 'lucide-react';

function App() {
  // Stats state - currently hardcoded with your BUSINESS(7) numbers
  // This is ready to be linked to your Google Sheets API
  const [stats, setStats] = useState([
    { name: 'Total Net Sales', value: '£1,046.25', icon: DollarSign, color: 'text-blue-400' },
    { name: 'Total Liquid Cost', value: '£178.40', icon: TrendingUp, color: 'text-orange-400' },
    { name: 'Nightly GP%', value: '82.9%', icon: Percent, color: 'text-matrix-green' },
    { name: 'Total Labour Cost', value: '£264.82', icon: Users, color: 'text-purple-400' },
  ]);

  const netProfit = "£488.74";

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 font-mono text-white">
      {/* Header Section */}
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-matrix-green tracking-tighter flex items-center uppercase italic">
            <Zap className="mr-2" size={24} fill="currentColor" /> Matrix_v1.0
          </h1>
          <p className="text-zinc-500 text-xs mt-1 tracking-[0.3em]">TABAC // SATURDAY_DISCO</p>
        </div>
        <div className="hidden md:block">
          <span className="bg-matrix-green/10 text-matrix-green border border-matrix-green/30 px-3 py-1 rounded-full text-[10px] font-bold">
            SYSTEM_STATUS: ONLINE
          </span>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm hover:border-zinc-700 transition-colors">
            <item.icon className={`${item.color} mb-6`} size={28} />
            <p className="text-zinc-500 text-[10px] mb-2 uppercase font-bold tracking-widest">{item.name}</p>
            <p className={`text-3xl font-black tracking-tighter ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Hero Profit Section */}
      <div className="mt-12 bg-matrix-green/5 border border-matrix-green/20 p-16 rounded-[3rem] flex flex-col items-center justify-center shadow-[0_0_50px_-12px_rgba(0,255,65,0.15)] text-center">
        <h2 className="text-matrix-green text-sm font-bold uppercase tracking-[0.5em] mb-4">
          Net Operating Profit
        </h2>
        <p className="text-7xl md:text-9xl font-black text-matrix-green tracking-tighter drop-shadow-2xl">
          {netProfit}
        </p>
        <div className="mt-8 flex gap-4">
           <div className="h-2 w-2 rounded-full bg-matrix-green animate-pulse"></div>
           <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Live Calculation Active</span>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 pt-8 border-t border-zinc-900 flex justify-between items-center text-zinc-600">
        <p className="text-[10px] uppercase tracking-widest">© 2026 Matrix Bar Systems</p>
        <p className="text-[10px] uppercase tracking-widest">Proprietary Consultant Tool</p>
      </footer>
    </div>
  );
}

export default App;