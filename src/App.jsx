import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap, Loader2, LayoutDashboard, Calculator, RefreshCw } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sales: 0, cost: 0, gp: 0, labour: 0, profit: 0 });

  const fetchData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SHEET_URL);
      const csv = await response.text();
      const rows = csv.split('\n').filter(r => r.trim() !== '');
      const dataRows = rows.map(r => r.split(','));
      const totalsRow = dataRows[1]; 
      if (totalsRow) {
        const clean = (v) => parseFloat(v.toString().replace(/[^0-9.-]/g, '')) || 0;
        setData({
          sales: clean(totalsRow[9]), cost: clean(totalsRow[10]),
          gp: clean(totalsRow[11]), labour: clean(totalsRow[12]), profit: clean(totalsRow[13])
        });
        setLoading(false);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSale = (cocktail) => {
    setData(prev => ({
      ...prev,
      sales: prev.sales + 10,
      profit: prev.profit + 8.33 
    }));

    fetch(import.meta.env.VITE_POS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ cocktail: cocktail })
    }).catch(e => console.error(e));
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-mono text-black">
      <Loader2 className="animate-spin mb-4" size={32} />
      <div className="text-sm tracking-widest uppercase font-bold">Initialising System...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans selection:bg-black selection:text-white p-6 md:p-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .font-sans { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      `}</style>

      {/* Navigation Switcher */}
      <div className="fixed bottom-8 right-8 flex gap-3 z-50">
        <button 
          onClick={() => setView('dashboard')} 
          className={`p-4 rounded-full border transition-all shadow-sm ${view === 'dashboard' ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-200'}`}
        >
          <LayoutDashboard size={24} />
        </button>
        <button 
          onClick={() => setView('pos')} 
          className={`p-4 rounded-full border transition-all shadow-sm ${view === 'pos' ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-200'}`}
        >
          <Calculator size={24} />
        </button>
      </div>

      {view === 'dashboard' ? (
        <div className="max-w-5xl mx-auto">
          <header className="mb-16 flex justify-between items-end border-b border-black pb-6">
             <div>
               <h1 className="text-2xl font-bold tracking-tighter uppercase italic flex items-center gap-2">
                 <Zap size={20} fill="black" /> Tabac Dashboard
               </h1>
               <p className="text-[10px] font-mono text-zinc-500 uppercase mt-1 tracking-tighter">Verified Stream // {new Date().toLocaleDateString()}</p>
             </div>
             <button 
               onClick={fetchData}
               className="flex items-center gap-2 bg-white border border-black px-3 py-1.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white transition-all"
             >
               <RefreshCw size={10} /> Refresh Data
             </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black border border-black overflow-hidden rounded-sm">
            <StatCard label="Net Sales" value={`£${data.sales.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={DollarSign} />
            <StatCard label="Liquid Cost" value={`£${data.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={TrendingUp} />
            <StatCard label="GP Margin" value={`${(data.gp * 100).toFixed(1)}%`} icon={Percent} />
            <StatCard label="Labour" value={`£${data.labour.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={Users} />
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] mb-4 text-zinc-400">Net Operating Profit</h2>
            <p className="text-8xl md:text-[12rem] font-bold tracking-tighter leading-none mb-8">
              £{data.profit.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-black rounded-full text-[10px] font-bold uppercase tracking-widest">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
              Live Feed Connected
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto py-12">
          <div className="mb-16">
            <h1 className="text-xl font-bold uppercase tracking-tight mb-1">Terminal POS</h1>
            <p className="font-mono text-[10px] text-zinc-500 uppercase">Input sales to BUSINESS.xlsx</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <POSButton name="Margarita" onClick={() => handleSale('Margarita')} />
            <POSButton name="Negroni" onClick={() => handleSale('Negroni')} />
            <POSButton name="Waste / Tasters" onClick={() => handleSale('WASTE / TASTERS')} />
          </div>

          <div className="mt-20 pt-8 border-t border-zinc-200 font-mono text-[9px] text-zinc-400 uppercase leading-relaxed">
            Automatic background synchronization enabled.<br/>
            Optimistic UI active for zero-latency entry.
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white p-8">
      <Icon size={16} className="mb-6 text-zinc-400" />
      <p className="text-zinc-400 text-[9px] font-mono uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold tracking-tight uppercase">{value}</p>
    </div>
  );
}

function POSButton({ name, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="w-full py-10 border border-black text-black text-xl font-bold rounded-sm active:bg-black active:text-white transition-none uppercase tracking-tighter hover:bg-zinc-50"
    >
      {name}
    </button>
  );
}