import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap, Loader2, LayoutDashboard, Calculator, RefreshCw } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'pos'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sales: 0, cost: 0, gp: 0, labour: 0, profit: 0 });

  const fetchData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SHEET_URL);
      const csv = await response.text();
      const rows = csv.split('\n').filter(r => r.trim() !== '');
      const dataRows = rows.map(r => r.split(','));
      
      // Index 1 is Row 2 in the Spreadsheet
      const totalsRow = dataRows[1]; 
      if (totalsRow) {
        // Bulletproof cleaner for currency and percentage symbols
        const clean = (v) => parseFloat(v.toString().replace(/[^0-9.-]/g, '')) || 0;
        
        setData({
          sales: clean(totalsRow[9]),   // Column J
          cost: clean(totalsRow[10]),  // Column K
          gp: clean(totalsRow[11]),    // Column L
          labour: clean(totalsRow[12]), // Column M
          profit: clean(totalsRow[13])  // Column N
        });
        setLoading(false);
      }
    } catch (e) { 
      console.error("Fetch Error:", e); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleSale = (cocktail) => {
    // 1. OPTIMISTIC UI: Update the screen instantly
    // We estimate £8.33 net profit per click to keep the dashboard moving
    setData(prev => ({
      ...prev,
      sales: prev.sales + 10,
      profit: prev.profit + 8.33 
    }));

    // 2. BACKGROUND SYNC: Send to Google without blocking the UI
    // mode: 'no-cors' allows for a faster "fire and forget" request
    fetch(import.meta.env.VITE_POS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ cocktail: cocktail })
    }).catch(e => console.error("Sync failed", e));
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-[#00ff41]">
      <Loader2 className="animate-spin mb-4" size={48} />
      <div className="text-xl font-bold tracking-[0.5em] animate-pulse uppercase italic">Initialising_Matrix_v1.7...</div>
      <div className="text-[10px] text-zinc-600 mt-2 uppercase tracking-widest">Establishing Secure Link to BUSINESS.xlsx</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 md:p-12">
      {/* View Switcher Controls */}
      <div className="fixed bottom-8 right-8 flex gap-3 z-50">
        <button 
          onClick={() => setView('dashboard')} 
          className={`p-5 rounded-full border-2 transition-all shadow-2xl ${view === 'dashboard' ? 'bg-[#00ff41] border-[#00ff41] text-black scale-110' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}
        >
          <LayoutDashboard size={28} />
        </button>
        <button 
          onClick={() => setView('pos')} 
          className={`p-5 rounded-full border-2 transition-all shadow-2xl ${view === 'pos' ? 'bg-[#00ff41] border-[#00ff41] text-black scale-110' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}
        >
          <Calculator size={28} />
        </button>
      </div>

      {view === 'dashboard' ? (
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-end">
             <div>
               <h1 className="text-4xl font-black text-[#00ff41] italic flex items-center gap-2 tracking-tighter">
                 <Zap fill="#00ff41" /> MATRIX_DASH
               </h1>
               <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-1 font-bold">Glasgow // Tabac // Live_Feed</p>
             </div>
             <button 
               onClick={fetchData}
               className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors"
             >
               <RefreshCw size={12} /> Sync Truth
             </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard label="Net Sales" value={`£${data.sales.toLocaleString(undefined, {minimumFractionDigits: 2})}`} color="text-blue-400" icon={DollarSign} />
            <StatCard label="Liquid Cost" value={`£${data.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}`} color="text-orange-400" icon={TrendingUp} />
            <StatCard label="Nightly GP" value={`${(data.gp * 100).toFixed(1)}%`} color="text-[#00ff41]" icon={Percent} />
            <StatCard label="Labour Cost" value={`£${data.labour.toLocaleString(undefined, {minimumFractionDigits: 2})}`} color="text-purple-400" icon={Users} />
          </div>

          <div