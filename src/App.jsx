import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Users, TrendingUp, Zap } from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    sales: 0, cost: 0, gp: 0, labour: 0, profit: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_SHEET_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '');
        const dataRows = rows.map(row => row.split(','));

        // Helper to clean symbols and force numeric values
        const clean = (val) => {
          if (!val) return 0;
          const sanitized = val.toString().replace(/[£%, ]/g, '');
          return parseFloat(sanitized) || 0;
        };

        // Option A: Map by exact Index (Row 2, Columns J-N)
        const totalsRow = dataRows[1]; 
        
        // Option B: Safety Search (If Row 2 is empty, find the row containing "Net Profit")
        const profitRow = dataRows.find(r => r.includes('Net Profit')) || totalsRow;

        if (totalsRow) {
          setData({
            sales: clean(totalsRow[9]),   // Column J
            cost: clean(totalsRow[10]),  // Column K
            gp: clean(totalsRow[11]),    // Column L
            labour: clean(totalsRow[12]), // Column M
            // We use totalsRow[13] for Column N (Net Profit)
            profit: clean(totalsRow[13])  
          });
        }
      } catch (error) {
        console.error("Matrix Connection Error:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      name: 'Total Net Sales', 
      value: `£${data.sales.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 
      icon: DollarSign, color: '#60a5fa' 
    },
    { 
      name: 'Total Liquid Cost', 
      value: `£${data.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 
      icon: TrendingUp, color: '#fb923c' 
    },
    { 
      name: 'Nightly GP%', 
      value: `${(data.gp * 100).toFixed(1)}%`, 
      icon: Percent, color: '#00ff41' 
    },
    { 
      name: 'Total Labour Cost', 
      value: `£${data.labour.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 
      icon: Users, color: '#c084fc' 
    },
  ];

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 text-white font-mono">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#00ff41] tracking-tighter flex items-center uppercase italic">
            <Zap className="mr-2" size={24} fill="#00ff41" /> Matrix_v1.2
          </h1>
          <p className="text-zinc-500 text-[10px] mt-1 tracking-[0.3em]">TABAC // SATURDAY_DISCO</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-[#00ff41] animate-pulse"></div>
           <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">System_Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-lg">
            <item.icon color={item.color} size={28} className="mb-6" />
            <p className="text-zinc-500 text-[10px] mb-2 uppercase font-bold tracking-widest">{item.name}</p>
            <p className="text-3xl font-black tracking-tighter" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#00ff41]/5 border border-[#00ff41]/20 p-16 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-[0_0_60px_-15px_rgba(0,255,65,0.3)]">
        <h2 className="text-[#00ff41] text-xs font-bold uppercase tracking-[0.5em] mb-4">Net Operating Profit</h2>
        <p className="text-7xl md:text-9xl font-black text-[#00ff41] tracking-tighter drop-shadow-2xl">
          £{data.profit > 0 ? data.profit.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
        </p>
      </div>
    </div>
  );
}