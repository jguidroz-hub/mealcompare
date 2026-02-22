'use client';

import { useState, useEffect } from 'react';

interface SavingsData {
  totalComparisons: number;
  totalSavingsCents: number;
  avgSavingsCents: number;
  recentSavings: Array<{
    restaurantName: string;
    savingsCents: number;
    chosenPlatform: string;
    metro: string;
    date: string;
  }>;
}

export default function SavingsReportPage() {
  const [data, setData] = useState<SavingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session') || localStorage.getItem('eddy_session') || '';
    
    if (sid) {
      fetch(`/api/savings?session=${sid}`)
        .then(r => r.json())
        .then(d => {
          setData(d);
          setLoading(false);
          // Auto-print after a brief delay to ensure rendering
          setTimeout(() => window.print(), 500);
        })
        .catch(() => setLoading(false));
    }
  }, []);

  if (loading) return <div className="p-8">Generating report...</div>;
  if (!data) return <div className="p-8">No data found.</div>;

  const total = (data.totalSavingsCents / 100).toFixed(2);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans max-w-4xl mx-auto print:max-w-none print:p-0">
      {/* Print Controls - Hidden when printing */}
      <div className="mb-8 flex justify-end gap-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-blue-600 mb-2">eddy.</h1>
          <p className="text-gray-500 font-medium">Delivery Savings Report</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg mb-1">Report Date</p>
          <p className="text-gray-600">{date}</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Saved</p>
            <p className="text-4xl font-black text-green-600">${total}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Orders Compared</p>
            <p className="text-4xl font-black text-black">{data.totalComparisons}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Avg per Order</p>
            <p className="text-4xl font-black text-black">${(data.avgSavingsCents / 100).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Savings Breakdown Table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">Savings Breakdown</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-wider">Date</th>
              <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-wider">Restaurant</th>
              <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-wider">Platform</th>
              <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-wider text-right">Saved</th>
            </tr>
          </thead>
          <tbody>
            {data.recentSavings.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-4 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                <td className="py-4 font-bold">{item.restaurantName}</td>
                <td className="py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">
                    {item.chosenPlatform}
                  </span>
                </td>
                <td className="py-4 text-right font-bold text-green-600">
                  ${(item.savingsCents / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100">
              <td colSpan={3} className="pt-6 font-bold text-right text-gray-600">Total Savings</td>
              <td className="pt-6 font-black text-right text-xl">${total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-100">
        <p>Generated by Eddy · The price comparison engine for food delivery</p>
        <p className="mt-1">https://eddy.delivery</p>
      </div>
    </div>
  );
}
