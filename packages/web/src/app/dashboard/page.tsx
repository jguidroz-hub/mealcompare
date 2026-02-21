'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  restaurant: string;
  period: string;
  totalComparisons: number;
  directOrderWins: number;
  directOrderClicks: number;
  estimatedCommissionSavedCents: number;
  avgSavingsForCustomerCents: number;
  metrosActive: number;
  dailyTrend: Array<{ day: string; comparisons: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
      loadDashboard(t);
    }
  }, []);

  const loadDashboard = async (t: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard?token=${t}`);
      if (!res.ok) throw new Error('Invalid token');
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const commissionSaved = data ? (data.estimatedCommissionSavedCents / 100).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="text-xl font-black text-black">Eddy</span>
            <span className="text-sm text-gray-400 ml-2">Restaurant Dashboard</span>
          </Link>
          <Link href="/for-restaurants" className="text-sm text-blue-600 font-semibold">
            Learn More →
          </Link>
        </div>
      </header>

      {!token && !data && (
        <section className="px-6 pt-20 pb-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-black text-black mb-4">Restaurant Dashboard</h1>
            <p className="text-gray-500 mb-8">
              Enter your dashboard token to see how Eddy is driving direct orders to your restaurant.
            </p>
            <form onSubmit={e => { e.preventDefault(); loadDashboard(token); }} className="space-y-4">
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Enter your dashboard token"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-center"
              />
              <button
                type="submit"
                disabled={!token || loading}
                className="w-full bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'View Dashboard'}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-200 text-left">
              <h3 className="font-bold text-black mb-2">Don&apos;t have a token?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Claim your restaurant on Eddy to get a free dashboard showing how many
                customers are finding your direct ordering link through our platform.
              </p>
              <Link href="/for-restaurants" className="text-blue-600 font-semibold text-sm">
                Claim your restaurant →
              </Link>
            </div>
          </div>
        </section>
      )}

      {data && (
        <section className="px-6 pt-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-black capitalize">{data.restaurant.replace(/([a-z])([A-Z])/g, '$1 $2')}</h1>
              <p className="text-sm text-gray-500">Last 30 days · {data.metrosActive} metro{data.metrosActive !== 1 ? 's' : ''}</p>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-3xl font-black text-black">{data.totalComparisons}</p>
                <p className="text-xs text-gray-500 mt-1">Price Comparisons</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Users who compared your prices</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-3xl font-black text-blue-600">{data.directOrderClicks}</p>
                <p className="text-xs text-gray-500 mt-1">Direct Order Clicks</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Sent to your ordering page</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-3xl font-black text-yellow-600">${commissionSaved}</p>
                <p className="text-xs text-gray-500 mt-1">Est. Commission Saved</p>
                <p className="text-[10px] text-gray-400 mt-0.5">vs delivery app fees (~25%)</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-3xl font-black text-black">{data.directOrderWins}</p>
                <p className="text-xs text-gray-500 mt-1">Direct Was Cheapest</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Times direct beat all apps</p>
              </div>
            </div>

            {/* Daily trend */}
            {data.dailyTrend.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
                <h3 className="font-bold text-black mb-4">Daily Comparisons</h3>
                <div className="flex items-end gap-1 h-32">
                  {data.dailyTrend.map((d, i) => {
                    const max = Math.max(...data.dailyTrend.map(x => x.comparisons), 1);
                    const height = Math.max((d.comparisons / max) * 100, 4);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-blue-500 rounded-t-sm min-w-[4px]"
                          style={{ height: `${height}%` }}
                          title={`${d.day}: ${d.comparisons} comparisons`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  <span>{data.dailyTrend[0]?.day ? new Date(data.dailyTrend[0].day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                  <span>{data.dailyTrend[data.dailyTrend.length - 1]?.day ? new Date(data.dailyTrend[data.dailyTrend.length - 1].day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                </div>
              </div>
            )}

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Want more direct orders?</h3>
              <p className="text-blue-200 mb-6">
                Upgrade to Featured Listing — get promoted placement when Eddy users search for food in your area.
              </p>
              <Link
                href="/for-restaurants"
                className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                View Plans →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
