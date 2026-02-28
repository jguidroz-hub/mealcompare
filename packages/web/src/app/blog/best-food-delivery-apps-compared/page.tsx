import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Food Delivery Apps in 2026: DoorDash, Uber Eats, Grubhub Compared — Eddy',
  description: 'Honest comparison of DoorDash, Uber Eats, and Grubhub in 2026. Coverage, fees, subscriptions, driver pay, and which app is best for different situations.',
  openGraph: {
    title: 'Best Food Delivery Apps in 2026: Honest Comparison',
    description: 'DoorDash vs Uber Eats vs Grubhub — which app is actually best?',
    type: 'article',
  },
};

export default function BestDeliveryAppsPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-4">
          <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 text-sm">← All Posts</Link>
        </div>
        <header className="mb-12">
          <div className="flex gap-3 mb-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Comparison</span>
            <span className="text-xs text-gray-400">February 28, 2026</span>
            <span className="text-xs text-gray-400">· 10 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Best Food Delivery Apps in 2026: DoorDash, Uber Eats, Grubhub Compared
          </h1>
          <p className="text-xl text-gray-500">
            Each app has strengths depending on where you live, what you order, and how often. Here&apos;s an honest breakdown.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Market Share in 2026</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The US food delivery market has consolidated into three major players:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li><strong className="text-gray-900">DoorDash:</strong> ~67% market share — the clear leader</li>
            <li><strong className="text-gray-900">Uber Eats:</strong> ~23% — strong in urban areas</li>
            <li><strong className="text-gray-900">Grubhub (Wonder):</strong> ~8% — shrinking but still relevant in NYC and Chicago</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">DoorDash: Best Overall Coverage</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Coverage:</span> <span className="text-gray-900 font-medium">900+ cities, suburbs included</span></div>
              <div><span className="text-gray-500">Delivery fee:</span> <span className="text-gray-900 font-medium">$1.99-$5.99</span></div>
              <div><span className="text-gray-500">Service fee:</span> <span className="text-gray-900 font-medium">10-15%</span></div>
              <div><span className="text-gray-500">Subscription:</span> <span className="text-gray-900 font-medium">DashPass $9.99/mo</span></div>
              <div><span className="text-gray-500">Minimum order:</span> <span className="text-gray-900 font-medium">None ($2 small order fee under $12)</span></div>
              <div><span className="text-gray-500">Best for:</span> <span className="text-emerald-600 font-medium">Suburbs, variety, grocery delivery</span></div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong className="text-gray-900">Strengths:</strong> Biggest restaurant selection, best suburban coverage, grocery/convenience delivery, most reliable ETAs. DashPass is the best subscription value if you order 4+ times/month from one platform.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Weaknesses:</strong> Higher menu markups than Uber Eats in some markets, service fees can be opaque, driver quality varies.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Uber Eats: Best for Urban Areas</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Coverage:</span> <span className="text-gray-900 font-medium">6,000+ cities (global)</span></div>
              <div><span className="text-gray-500">Delivery fee:</span> <span className="text-gray-900 font-medium">$0.49-$7.99</span></div>
              <div><span className="text-gray-500">Service fee:</span> <span className="text-gray-900 font-medium">15-18%</span></div>
              <div><span className="text-gray-500">Subscription:</span> <span className="text-gray-900 font-medium">Uber One $9.99/mo</span></div>
              <div><span className="text-gray-500">Minimum order:</span> <span className="text-gray-900 font-medium">None ($2 small order fee under $10)</span></div>
              <div><span className="text-gray-500">Best for:</span> <span className="text-emerald-600 font-medium">Cities, international, Uber riders</span></div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong className="text-gray-900">Strengths:</strong> Uber One bundles rides + delivery, strong international presence, fast delivery in dense urban areas, good restaurant partnerships for exclusive items.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Weaknesses:</strong> Highest service fees, aggressive menu markups (restaurants report 20-30% commission), weaker suburban coverage than DoorDash.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Grubhub: Best Loyalty Perks</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Coverage:</span> <span className="text-gray-900 font-medium">4,000+ cities (US only)</span></div>
              <div><span className="text-gray-500">Delivery fee:</span> <span className="text-gray-900 font-medium">$0.99-$7.99</span></div>
              <div><span className="text-gray-500">Service fee:</span> <span className="text-gray-900 font-medium">5-15%</span></div>
              <div><span className="text-gray-500">Subscription:</span> <span className="text-gray-900 font-medium">Grubhub+ $9.99/mo</span></div>
              <div><span className="text-gray-500">Minimum order:</span> <span className="text-gray-900 font-medium">Varies by restaurant</span></div>
              <div><span className="text-gray-500">Best for:</span> <span className="text-emerald-600 font-medium">NYC/Chicago, loyalty rewards, corporate</span></div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong className="text-gray-900">Strengths:</strong> Lower service fees than competitors, loyalty points program, strong corporate catering, good in its core markets (NYC, Chicago, Boston).
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Weaknesses:</strong> Shrinking market share, limited coverage outside major cities, slower feature development since Wonder acquisition.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Hidden Winner: Direct Ordering</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            None of the above apps are the cheapest option for most orders. Restaurants that offer their own delivery through Toast, Square, ChowNow, or their website typically charge:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Menu prices at in-store rates (no 15-30% markup)</li>
            <li>Lower or no service fee</li>
            <li>Comparable delivery fees ($3-6)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            The catch: discovering which restaurants offer direct ordering is a pain. That&apos;s exactly what <Link href="/" className="text-emerald-600 hover:text-emerald-700">Eddy</Link> solves — we index direct ordering links for 19,000+ restaurants across 30 cities.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Which App Should You Use?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3 mb-6">
            <li><strong className="text-gray-900">Live in the suburbs?</strong> DoorDash — widest coverage, most restaurants</li>
            <li><strong className="text-gray-900">Live in a big city + use Uber?</strong> Uber Eats — Uber One bundles save money</li>
            <li><strong className="text-gray-900">In NYC or Chicago?</strong> Compare Grubhub and DoorDash — Grubhub often has lower fees in its strongholds</li>
            <li><strong className="text-gray-900">Order 4+ times/month?</strong> Get a subscription on your most-used platform</li>
            <li><strong className="text-gray-900">Want the lowest price?</strong> Check for direct ordering first — use Eddy to compare automatically</li>
          </ul>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 my-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Always get the cheapest price</h3>
            <p className="text-gray-500 mb-6">Eddy compares all delivery platforms + direct ordering for every restaurant. Free Chrome extension.</p>
            <Link href="/install" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Install Eddy Free →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
