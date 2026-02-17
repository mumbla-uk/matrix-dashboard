import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap, Loader2, LayoutDashboard, Calculator } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'pos'
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
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

  const handleSale = async (cocktail) => {
    setSending(true);
    try {
      await fetch(import.meta.env.VITE_POS_URL, {
        method: 'POST',
        body: JSON.stringify({ cocktail: cocktail })
      });
      fetchData(); // Refresh numbers immediately
    } catch (e) { alert("Matrix Connection Failed"); }
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-[#00ff41]">
      <Loader2 className="animate-spin mb-4" size={48} />
      <div className="text-xl font-bold tracking-[0.5em] animate-pulse uppercase italic">Initialising_Matrix_v1.5...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      {/* View Switcher */}
      <div className="fixed bottom-6 right-6 flex gap-2 z-50">
        <button onClick={() => setView('dashboard')} className={`p-4 rounded-full border ${view === 'dashboard' ? 'bg-[#00ff41] text-black' : 'bg-zinc-900 border-zinc-700'}`}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setView('pos')} className={`p-4 rounded-full border ${view === 'pos' ? 'bg-[#00ff41] text-black' : 'bg-zinc-900 border-zinc-700'}`}>
          <Calculator size={24} />
        </button>
      </div>

      {view === 'dashboard' ? (
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-center">
             <h1 className="text-3xl font-bold text-[#00ff41] italic flex items-center gap-2"><Zap /> MATRIX_DASH</h1>
             <div className="text-right text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Glasgow // Tabac // Saturday</div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard label="Net Sales" value={`£${data.sales.toFixed(2)}`} color="text-blue-400" icon={DollarSign} />
            <StatCard label="Liquid Cost" value={`£${data.cost.toFixed(2)}`} color="text-orange-400" icon={TrendingUp} />
            <StatCard label="Nightly GP" value={`${(data.gp * 100).toFixed(1)}%`} color="text-[#00ff41]" icon={Percent} />
            <StatCard label="Labour Cost" value={`£${data.labour.toFixed(2)}`} color="text-purple-400" icon={Users} />
          </div>

          <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 p-20 rounded-[3rem] text-center shadow-[0_0_80px_-20px_rgba(0,255,65,0.3)]">
            <h2 className="text-[#00ff41] text-xs font-bold uppercase tracking-[0.5em] mb-4">Total Net Profit</h2>
            <p className="text-8xl md:text-9xl font-black text-[#00ff41]">£{data.profit.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#00ff41] mb-10 italic">TERMINAL_POS_v1.0</h1>
          {sending && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-[#00ff41] font-bold">TRANSMITTING...</div>}
          <div className="grid grid-cols-1 gap-4">
            <POSButton name="Margarita" onClick={() => handleSale('Margarita')} />
            <POSButton name="Negroni" onClick={() => handleSale('Negroni')} />
            <POSButton name="Waste/Tasters" onClick={() => handleSale('WASTE / TASTERS')} />
          </div>
          <p className="mt-12 text-zinc-600 text-[10px] uppercase">Tap to increment quantity in BUSINESS(9).xlsx</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
      <Icon className={`${color} mb-4`} size={20} />
      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function POSButton({ name, onClick }) {
  return (
    <button onClick={onClick} className="w-full py-8 border-2 border-[#00ff41] text-[#00ff41] text-xl font-black rounded-2xl hover:bg-[#00ff41] hover:text-black transition-all active:scale-95 uppercase tracking-tighter">
      {name}
    </button>
  );
}