'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface SearchResult {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
  score: number;
}

const METROS = [
  { id: 'nyc', label: 'New York' }, { id: 'chicago', label: 'Chicago' },
  { id: 'la', label: 'Los Angeles' }, { id: 'sf', label: 'San Francisco' },
  { id: 'austin', label: 'Austin' }, { id: 'houston', label: 'Houston' },
  { id: 'dallas', label: 'Dallas' }, { id: 'miami', label: 'Miami' },
  { id: 'dc', label: 'Washington DC' }, { id: 'boston', label: 'Boston' },
  { id: 'seattle', label: 'Seattle' }, { id: 'denver', label: 'Denver' },
  { id: 'atlanta', label: 'Atlanta' }, { id: 'philly', label: 'Philadelphia' },
  { id: 'nashville', label: 'Nashville' }, { id: 'portland', label: 'Portland' },
  { id: 'phoenix', label: 'Phoenix' }, { id: 'tampa', label: 'Tampa' },
  { id: 'charlotte', label: 'Charlotte' }, { id: 'detroit', label: 'Detroit' },
  { id: 'minneapolis', label: 'Minneapolis' }, { id: 'nola', label: 'New Orleans' },
  { id: 'sandiego', label: 'San Diego' }, { id: 'stlouis', label: 'St. Louis' },
  { id: 'pittsburgh', label: 'Pittsburgh' }, { id: 'columbus', label: 'Columbus' },
  { id: 'indianapolis', label: 'Indianapolis' }, { id: 'milwaukee', label: 'Milwaukee' },
  { id: 'raleigh', label: 'Raleigh' }, { id: 'baltimore', label: 'Baltimore' },
];

const SUGGESTIONS = [
  '🌮 Spicy tacos near me',
  '🍕 Best pizza for delivery',
  '🍔 Late night burgers',
  '🥗 Healthy bowls',
  '🍣 Sushi date night',
  '🍜 Comfort ramen',
  '☕ Brunch spots',
  '🔥 Thai food with kick',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [metro, setMetro] = useState('austin');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [intent, setIntent] = useState('');

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, metro }),
      });
      const data = await res.json();
      setResults(data.restaurants || []);
      setIntent(data.intent?.understood || '');
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [metro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="text-xl font-black text-black">Eddy</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/restaurants" className="hover:text-black">Restaurants</Link>
            <Link href="/savings" className="hover:text-black">My Savings</Link>
            <Link href="/install" className="text-blue-600 font-semibold hover:text-blue-700">Get Extension</Link>
          </nav>
        </div>
      </header>

      {/* Hero Search */}
      <section className="px-6 pt-16 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
            What are you craving?
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Search restaurants, compare prices across every delivery app, find the cheapest way to order.
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg focus-within:border-blue-500 transition-colors">
              <span className="pl-5 text-2xl">🔍</span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Spicy Thai food, cheap pizza, sushi date night..."
                className="flex-1 px-4 py-5 text-lg outline-none text-black placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white font-bold px-8 py-5 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Metro selector */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-400">📍</span>
            <select
              value={metro}
              onChange={e => setMetro(e.target.value)}
              className="text-gray-600 bg-transparent border-none outline-none cursor-pointer font-medium"
            >
              {METROS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Suggestion chips (pre-search) */}
      {!searched && (
        <section className="px-6 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s.replace(/^[^\s]+\s/, '')); search(s); }}
                  className="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {searched && (
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto">
            {intent && (
              <p className="text-sm text-gray-400 mb-4">
                Searching for: <span className="text-gray-600 font-medium">{intent}</span>
              </p>
            )}

            {results.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400 mb-2">No restaurants found</p>
                <p className="text-sm text-gray-400">Try a different search or metro area</p>
              </div>
            )}

            <div className="space-y-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-black">{r.name}</h3>
                      {r.directUrl && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded">
                          Direct ordering ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 capitalize mt-0.5">{r.category}</p>
                    {r.directUrl && (
                      <p className="text-xs text-blue-600 mt-1">
                        {r.hasToast ? '🍞 Toast' : r.hasSquare ? '◻️ Square' : '🌐 Website'} — skip delivery app markup
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {r.directUrl ? (
                      <a
                        href={r.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Order Direct →
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 py-2">Platform only</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value prop */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-black mb-4">Why search on Eddy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-black">See all prices</h3>
              <p className="text-sm text-gray-500 mt-1">Compare DoorDash, Uber Eats, Grubhub, and direct ordering side by side</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-bold text-black">AI-powered search</h3>
              <p className="text-sm text-gray-500 mt-1">"Spicy Thai", "cheap comfort food", "date night sushi" — we get it</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌊</div>
              <h3 className="font-bold text-black">Find the current</h3>
              <p className="text-sm text-gray-500 mt-1">19,000+ restaurants, 30 metros, always finding you the best deal</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
