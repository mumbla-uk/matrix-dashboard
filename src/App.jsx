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

          <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 p-20 rounded-[3rem] text-center shadow-[0_0_100px_-30px_rgba(0,255,65,0.3)] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-[#00ff41] text-xs font-bold uppercase tracking-[0.6em] mb-6 opacity-80">Total Net Operating Profit</h2>
              <p className="text-8xl md:text-9xl font-black text-[#00ff41] tracking-tighter drop-shadow-[0_0_35px_rgba(0,255,65,0.5)]">
                £{data.profit.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00ff41] animate-pulse"></div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.3em]">Encrypted Data Stream Active</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto py-10">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-[#00ff41] italic tracking-widest uppercase">Terminal_POS_v1.7</h1>
            <p className="text-zinc-500 text-[10px] mt-2 tracking-widest font-bold">AUTHENTICATED_STAFF_ONLY</p>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            <POSButton name="Margarita" onClick={() => handleSale('Margarita')} />
            <POSButton name="Negroni" onClick={() => handleSale('Negroni')} />
            <POSButton name="Waste / Tasters" onClick={() => handleSale('WASTE / TASTERS')} />
          </div>

          <div className="mt-16 p-6 border border-zinc-800 rounded-2xl bg-zinc-900/30">
            <h3 className="text-[10px] text-zinc-500 uppercase font-bold mb-4 tracking-widest">System Instructions</h3>
            <ul className="text-[10px] text-zinc-600 space-y-2 uppercase leading-relaxed font-bold">
              <li>• Tap drink to increment BUSINESS.xlsx</li>
              <li>• Update is optimistic (Instant locally)</li>
              <li>• Final values sync on Dashboard refresh</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
      <Icon className={`${color} mb-6`} size={24} />
      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function POSButton({ name, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="w-full py-10 border-2 border-[#00ff41] text-[#00ff41] text-2xl font-black rounded-3xl active:bg-[#00ff41] active:text-black transition-none uppercase shadow-[0_0_25px_-10px_rgba(0,255,65,0.4)]"
    >
      {name}
    </button>
  );
}