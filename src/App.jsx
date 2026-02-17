import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap } from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    sales: 0,
    cost: 0,
    gp: 0,
    labour: 0,
    profit: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_SHEET_URL);
        const csv = await response.text();
        
        // Split rows and filter out empties
        const rows = csv.split('\n').filter(row => row.trim() !== '');
        const dataRows = rows.map(row => row.split(','));

        // Target Row 2 (index 1)
        const totalsRow = dataRows[1]; 

        if (totalsRow) {
          setData({
            sales: Number(totalsRow[9]) || 0,   // Column J
            cost: Number(totalsRow[10]) || 0,  // Column K
            gp: Number(totalsRow[11]) || 0,    // Column L
            labour: Number(totalsRow[12]) || 0, // Column M
            profit: Number(totalsRow[13]) || 0  // Column N
          });
        }
      } catch (error) {
        console.error("Matrix Connection Error:", error);
      }
    };

    fetchData();
  }, []);

  // Format numbers for the UI
  const stats = [
    { name: 'Total Net Sales', value: `£${data.sales.toFixed(2)}`, icon: DollarSign, color: '#60a5fa' },
    { name: 'Total Liquid Cost', value: `£${data.cost.toFixed(2)}`, icon: TrendingUp, color: '#fb923c' },
    { name: 'Nightly GP%', value: `${(data.gp * 100).toFixed(1)}%`, icon: Percent, color: '#00ff41' },
    { name: 'Total Labour Cost', value: `£${data.labour.toFixed(2)}`, icon: Users, color: '#c084fc' },
  ];

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 text-white font-mono">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#00ff41] tracking-tighter flex items-center uppercase italic">
            <Zap className="mr-2" size={24} fill="#00ff41" /> Matrix_v1.2
          </h1>
          <p className="text-zinc-500 text-[10px] mt-1 tracking-[0.3em]">DATA_SOURCE: DASHBOARD_J_N</p>
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

      <div className="mt-12 bg-[#00ff41]/5 border border-[#00ff41]/20 p-16 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-[0_0_50px_-12px_rgba(0,255,65,0.2)]">
        <h2 className="text-[#00ff41] text-xs font-bold uppercase tracking-[0.5em] mb-4">Net Operating Profit</h2>
        <p className="text-7xl md:text-9xl font-black text-[#00ff41] tracking-tighter">
          £{data.profit.toFixed(2)}
        </p>
      </div>
    </div>
  );
}