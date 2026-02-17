// This is a simplified version of how the app will "Talk" to your sheet
const [data, setData] = useState({
  sales: "Loading...",
  profit: "Loading..."
});

useEffect(() => {
  // Logic to pull cell D1 (Net Sales) and D5 (Net Profit)
  // using the Sheet ID from your .env file
}, []);

import React from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap } from 'lucide-react';

function App() {
  const stats = [
    { name: 'Total Net Sales', value: '£1,046.25', icon: DollarSign, color: 'text-blue-400' },
    { name: 'Total Liquid Cost', value: '£178.40', icon: TrendingUp, color: 'text-orange-400' },
    { name: 'Nightly GP%', value: '82.9%', icon: Percent, color: 'text-matrix-green' },
    { name: 'Total Labour Cost', value: '£264.82', icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-black p-8 font-mono text-white">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#00ff41] tracking-tighter flex items-center uppercase italic">
            <Zap className="mr-2" size={24} fill="currentColor" /> Matrix_v1.0
          </h1>
          <p className="text-zinc-500 text-xs mt-1 tracking-[0.3em]">TABAC // SATURDAY_DISCO</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <item.icon className={`${item.color} mb-6`} size={28} />
            <p className="text-zinc-500 text-[10px] mb-2 uppercase font-bold tracking-widest">{item.name}</p>
            <p className={`text-3xl font-black tracking-tighter ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#00ff41]/5 border border-[#00ff41]/20 p-16 rounded-[3rem] flex flex-col items-center justify-center">
        <h2 className="text-[#00ff41] text-xs font-bold uppercase tracking-[0.5em] mb-4 text-center">Net Operating Profit</h2>
        <p className="text-8xl font-black text-[#00ff41] tracking-tighter drop-shadow-2xl">£488.74</p>
      </div>
    </div>
  );
}

export default App;