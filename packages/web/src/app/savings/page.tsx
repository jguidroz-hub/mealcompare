'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavingsData {
  totalComparisons: number;
  totalSavingsCents: number;
  avgSavingsCents: number;
  bestSavingsCents: number;
  recentSavings: Array<{
    restaurantName: string;
    savingsCents: number;
    chosenPlatform: string;
    metro: string;
    date: string;
  }>;
}

export default function SavingsPage() {
  const [data, setData] = useState<SavingsData | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [shareText, setShareText] = useState('');

  useEffect(() => {
    // Try to get session ID from URL or generate one
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session') || localStorage.getItem('eddy_session') || '';
    setSessionId(sid);

    if (sid) {
      fetch(`/api/savings?session=${sid}`)
        .then(r => r.json())
        .then(d => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const totalDollars = data ? (data.totalSavingsCents / 100).toFixed(2) : '0.00';
  const avgDollars = data ? (data.avgSavingsCents / 100).toFixed(2) : '0.00';
  const bestDollars = data ? (data.bestSavingsCents / 100).toFixed(2) : '0.00';

  const handleShare = () => {
    const text = `I've saved $${totalDollars} on food delivery with Eddy 🌊\n\nEddy compares prices across every delivery app and finds direct ordering to save you 15-25%.\n\nhttps://eddy.delivery`;
    setShareText(text);
    if (navigator.share) {
      navigator.share({ title: 'My Eddy Savings', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShareText('Copied to clipboard!');
        setTimeout(() => setShareText(''), 2000);
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="text-xl font-black text-black">Eddy</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/search" className="hover:text-black">Search</Link>
            <Link href="/restaurants" className="hover:text-black">Restaurants</Link>
          </nav>
        </div>
      </header>

      <section className="px-6 pt-16 pb-8">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-black text-black mb-2">Your Savings</h1>
          <p className="text-gray-500">Track how much Eddy has saved you on food delivery</p>
        </div>
      </section>

      {/* Stats cards */}
      <section className="px-6 pb-12">
        <div className="max-w-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-black">${totalDollars}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Total Saved</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-black">{data?.totalComparisons ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Comparisons</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-black">${avgDollars}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Avg per Order</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <p className="text-3xl font-black text-black">${bestDollars}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Best Save</p>
          </div>
        </div>
      </section>

      {/* Share card */}
      <section className="px-6 pb-8">
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-center text-white">
            <p className="text-lg font-bold mb-1">🌊 Share your savings</p>
            <p className="text-blue-200 text-sm mb-4">Let friends know how much you&apos;re saving</p>
            <button
              onClick={handleShare}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {shareText || 'Share My Savings 📤'}
            </button>
          </div>
        </div>
      </section>

      {/* Recent savings */}
      {data && data.recentSavings.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-black text-black mb-4">Recent Savings</h2>
            <div className="space-y-3">
              {data.recentSavings.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-bold text-black">{s.restaurantName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      via {s.chosenPlatform} · {new Date(s.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-black text-yellow-600">
                    -${(s.savingsCents / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {(!data || data.totalComparisons === 0) && !loading && (
        <section className="px-6 pb-16">
          <div className="max-w-xl mx-auto text-center py-8">
            <p className="text-5xl mb-4">🌊</p>
            <h2 className="text-xl font-black text-black mb-2">No savings yet</h2>
            <p className="text-gray-500 mb-6">
              Install the Eddy extension and start comparing prices on your next delivery order.
            </p>
            <Link
              href="/install"
              className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Get Eddy Extension →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
