import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap } from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    sales: "...",
    cost: "...",
    gp: "...",
    labour: "...",
    profit: "..."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_SHEET_URL);
        const csv = await response.text();
        // Simple parser: assumes Row 1 is headers, Row 2 has your data
        const rows = csv.split('\n').map(row => row.split(','));
        const values = rows[1]; // Adjust index based on which row your totals are in

        setData({
          sales: values[9],   // Assuming Column A is Sales
          cost: values[10],    // Assuming Column B is Cost
          gp: values[11],      // Assuming Column C is GP%
          labour: values[12],  // Assuming Column D is Labour
          profit: values[13]   // Assuming Column E is Profit
        });
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      }
    };

    fetchData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { name: 'Total Net Sales', value: `£${data.sales}`, icon: DollarSign, color: '#60a5fa' },
    { name: 'Total Liquid Cost', value: `£${data.cost}`, icon: TrendingUp, color: '#fb923c' },
    { name: 'Nightly GP%', value: `${data.gp}%`, icon: Percent, color: '#00ff41' },
    { name: 'Total Labour Cost', value: `£${data.labour}`, icon: Users, color: '#c084fc' },
  ];

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 text-white font-mono">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#00ff41] tracking-tighter flex items-center uppercase italic">
            <Zap className="mr-2" size={24} fill="#00ff41" /> Matrix_v1.1
          </h1>
          <p className="text-zinc-500 text-[10px] mt-1 tracking-[0.3em]">LIVE_SHEET_FEED // SATURDAY_DISCO</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <item.icon color={item.color} size={28} className="mb-6" />
            <p className="text-zinc-500 text-[10px] mb-2 uppercase font-bold tracking-widest">{item.name}</p>
            <p className="text-3xl font-black tracking-tighter" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#00ff41]/5 border border-[#00ff41]/20 p-16 rounded-[3rem] flex flex-col items-center justify-center text-center">
        <h2 className="text-[#00ff41] text-xs font-bold uppercase tracking-[0.5em] mb-4">Net Operating Profit</h2>
        <p className="text-7xl md:text-9xl font-black text-[#00ff41] tracking-tighter">£{data.profit}</p>
        <div className="mt-8 flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-[#00ff41] animate-pulse"></div>
           <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold font-mono">Real-time Connection Established</span>
        </div>
      </div>
    </div>
  );
}