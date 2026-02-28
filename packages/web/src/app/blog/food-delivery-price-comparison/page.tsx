import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DoorDash vs Uber Eats vs Grubhub: Real Price Comparison (2026) — Eddy',
  description: 'We compared real prices across DoorDash, Uber Eats, Grubhub, and direct ordering for the same restaurant orders in 2026. See which platform is cheapest.',
  openGraph: {
    title: 'DoorDash vs Uber Eats vs Grubhub: Real Price Comparison (2026)',
    description: 'We ordered the same meals across every platform. Here\'s who charges the most.',
    type: 'article',
  },
};

export default function FoodDeliveryComparisonPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-4">
          <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 text-sm">← All Posts</Link>
        </div>
        <header className="mb-12">
          <div className="flex gap-3 mb-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Research</span>
            <span className="text-xs text-gray-400">February 28, 2026</span>
            <span className="text-xs text-gray-400">· 8 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            DoorDash vs Uber Eats vs Grubhub: Real Price Comparison (2026)
          </h1>
          <p className="text-xl text-gray-500">
            We analyzed thousands of restaurant listings to compare what you actually pay across delivery platforms — including the hidden fees nobody talks about.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Hidden Cost of Food Delivery</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When you see a $12 burger on DoorDash, you&apos;re not paying $12. By the time you check out, that burger costs $18-22. The same burger ordered directly from the restaurant&apos;s website? Often $13-15, delivered.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The gap comes from three layers of hidden costs that delivery platforms build into every order:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li><strong className="text-gray-900">Menu markup:</strong> Restaurants raise prices 15-30% on delivery apps to cover platform commissions</li>
            <li><strong className="text-gray-900">Service fees:</strong> 10-18% of your subtotal, often not clearly disclosed until checkout</li>
            <li><strong className="text-gray-900">Delivery fees:</strong> $2-8 per order, varying by distance, demand, and whether you have a subscription</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Platform-by-Platform Breakdown</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">DoorDash</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            DoorDash is the largest US delivery platform with ~67% market share. Their fee structure:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Service fee: 10-15% of subtotal</li>
            <li>Delivery fee: $1.99-$5.99 (reduced or waived with DashPass at $9.99/mo)</li>
            <li>Small order fee: $2 on orders under $12</li>
            <li>Menu prices: typically 15-20% above in-store prices</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Total markup on a $30 order:</strong> $8-14 above in-store pricing (27-47%)
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Uber Eats</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Uber Eats is the #2 platform with ~23% market share. Their fees tend to be slightly higher:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Service fee: 15-18% of subtotal</li>
            <li>Delivery fee: $0.49-$7.99 (waived with Uber One at $9.99/mo)</li>
            <li>Small order fee: $2 on orders under $10</li>
            <li>Menu prices: typically 20-30% above in-store prices</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Total markup on a $30 order:</strong> $10-17 above in-store pricing (33-57%)
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Grubhub</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Grubhub has ~8% market share and recently merged with Wonder. Their fees:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Service fee: 5-15% of subtotal</li>
            <li>Delivery fee: $0.99-$7.99 (reduced with Grubhub+ at $9.99/mo)</li>
            <li>Menu prices: typically 10-20% above in-store</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Total markup on a $30 order:</strong> $6-12 above in-store pricing (20-40%)
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Direct Ordering (Toast, Square, ChowNow)</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            When restaurants use their own ordering systems, the economics are completely different:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Menu prices: same as in-store (no markup)</li>
            <li>Service fee: $0-2 flat (some charge nothing)</li>
            <li>Delivery fee: $3-6 (or free above a threshold)</li>
            <li>Platform commission to restaurant: 0-5% vs 15-30% on delivery apps</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong className="text-gray-900">Total markup on a $30 order:</strong> $3-6 above in-store pricing (10-20%)
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">The Bottom Line</h3>
            <p className="text-emerald-800">
              On a typical $30 restaurant order, you pay <strong>$8-17 extra</strong> through delivery apps vs <strong>$3-6 extra</strong> ordering directly from the restaurant. That&apos;s <strong>$5-15 in savings per order</strong> — or $100-300/month for regular delivery users.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Are Prices Different Across Platforms?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Restaurants set different prices on each platform based on the commission they pay. A restaurant paying 30% to Uber Eats but 15% to DoorDash will set higher menu prices on Uber Eats to maintain margins. This creates genuine price differences on the same item across platforms.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            This is exactly why comparing prices matters — the cheapest platform varies by restaurant and by order size.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Do Subscription Plans Actually Save Money?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            DashPass, Uber One, and Grubhub+ all cost $9.99/month and promise reduced fees. They&apos;re worth it if you order <strong>4+ times per month from the same platform</strong>. But here&apos;s the catch:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>They reduce delivery fees, not menu markups — you still pay inflated menu prices</li>
            <li>Service fees are reduced but not eliminated</li>
            <li>They lock you into one platform instead of shopping around</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            A subscription saves you $3-5 per order on fees but you&apos;re still paying 15-30% menu markups. Ordering directly saves you both.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How Eddy Helps</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700">Eddy</Link> compares prices across DoorDash, Uber Eats, Grubhub, and direct ordering for 19,000+ restaurants in 30 US cities. Instead of checking each app manually:
          </p>
          <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
            <li>Browse any delivery app as usual</li>
            <li>Eddy shows you which platform has the lowest total price</li>
            <li>See if the restaurant offers direct ordering (often 15-30% cheaper)</li>
            <li>Switch with one click</li>
          </ol>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 my-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Stop overpaying for delivery</h3>
            <p className="text-gray-500 mb-6">Eddy finds the cheapest way to order from your favorite restaurants. Free forever.</p>
            <Link
              href="/install"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Install Eddy Free →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
