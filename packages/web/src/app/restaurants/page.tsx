'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
}

const METROS = [
  { id: 'dc', label: 'Washington, DC' },
  { id: 'austin', label: 'Austin, TX' },
];

export default function RestaurantsPage() {
  const [metro, setMetro] = useState('dc');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurants?metro=${metro}`)
      .then(r => r.json())
      .then(data => {
        setRestaurants(data.restaurants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [metro]);

  const withDirect = restaurants.filter(r => r.directUrl);
  const withoutDirect = restaurants.filter(r => !r.directUrl);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          🍔 <span className="text-green-600">Meal</span>Compare
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/install" className="text-green-600 font-medium hover:underline">Get Extension</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Restaurants with Direct Ordering</h1>
        <p className="text-gray-600 mb-8">
          Skip the delivery app markup. These restaurants let you order direct — saving you 15-30% on every order.
        </p>

        {/* Metro selector */}
        <div className="flex gap-3 mb-8">
          {METROS.map(m => (
            <button
              key={m.id}
              onClick={() => setMetro(m.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                metro === m.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading restaurants...</div>
        ) : (
          <>
            {/* Direct ordering restaurants */}
            {withDirect.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-green-500">✅</span> Order Direct — No Markup ({withDirect.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {withDirect.map(r => (
                    <a
                      key={r.name}
                      href={r.directUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-xl p-4 hover:shadow-md transition hover:border-green-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{r.name}</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : 'Direct'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{r.category}</p>
                      <p className="text-xs text-green-600 mt-2">Order direct → Save 15-30%</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Platform-only restaurants */}
            {withoutDirect.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-gray-400">📱</span> Delivery Apps Only ({withoutDirect.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {withoutDirect.map(r => (
                    <div
                      key={r.name}
                      className="border rounded-xl p-4 bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-700">{r.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{r.category}</p>
                      <p className="text-xs text-gray-400 mt-2">Use MealCompare to find the cheapest app</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 text-center text-sm text-gray-400">
              <p>{restaurants.length} restaurants in {METROS.find(m => m.id === metro)?.label}</p>
              <p className="mt-1">Know a restaurant with direct ordering? <a href="mailto:hello@projectgreenbelt.com" className="text-green-600 hover:underline">Let us know</a></p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
