import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Ordering Directly From Restaurants Saves You 15-30% — Eddy',
  description: 'Delivery apps charge restaurants 15-30% commission, which gets passed to you as higher menu prices. Here\'s how direct ordering works and how much you can save.',
  openGraph: {
    title: 'Why Ordering Directly From Restaurants Saves You 15-30%',
    description: 'The hidden markup on delivery apps and how to avoid it.',
    type: 'article',
  },
};

export default function DirectOrderingPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-4">
          <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 text-sm">← All Posts</Link>
        </div>
        <header className="mb-12">
          <div className="flex gap-3 mb-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Guide</span>
            <span className="text-xs text-gray-400">February 28, 2026</span>
            <span className="text-xs text-gray-400">· 6 min read</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Why Ordering Directly From Restaurants Saves You 15-30%
          </h1>
          <p className="text-xl text-gray-500">
            Every delivery app order has a hidden tax. Here&apos;s where it comes from and how to avoid it.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Commission Problem</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When you order through DoorDash, Uber Eats, or Grubhub, the platform charges the restaurant a commission on every order. These commissions range from <strong className="text-gray-900">15% to 30%</strong> of the order total.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Restaurants operate on thin margins — typically 3-9% profit. A 30% commission would put most restaurants out of business. So what do they do? They raise menu prices on delivery apps to compensate.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            That $12 burger at the restaurant becomes a $14-16 burger on DoorDash. The $8 pad thai becomes $10-11 on Uber Eats. You&apos;re paying the platform&apos;s commission without realizing it.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How Direct Ordering Works</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Many restaurants have their own online ordering through platforms like Toast, Square, ChowNow, or their own website. These systems charge restaurants much less — typically 0-5% per order instead of 15-30%.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Because the restaurant keeps more of each dollar, they can afford to list <strong className="text-gray-900">in-store menu prices</strong> on their direct ordering page. That means:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Same food, same restaurant, same delivery — lower price</li>
            <li>No service fee markup (or much smaller fees)</li>
            <li>Restaurant keeps more profit, making their business more sustainable</li>
            <li>Delivery is handled by the same drivers in many cases</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Real Example: A $40 Order</h2>
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">DoorDash</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Direct Order</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Menu subtotal</td>
                  <td className="px-4 py-3 text-sm">$48.00 (+20% markup)</td>
                  <td className="px-4 py-3 text-sm">$40.00</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Service fee</td>
                  <td className="px-4 py-3 text-sm">$6.24 (13%)</td>
                  <td className="px-4 py-3 text-sm">$0.00</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Delivery fee</td>
                  <td className="px-4 py-3 text-sm">$3.99</td>
                  <td className="px-4 py-3 text-sm">$4.99</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-3 text-sm">Tax (8.25%)</td>
                  <td className="px-4 py-3 text-sm">$4.81</td>
                  <td className="px-4 py-3 text-sm">$3.71</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm font-bold text-red-600">$63.04</td>
                  <td className="px-4 py-3 text-sm font-bold text-emerald-600">$48.70</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            That&apos;s <strong className="text-gray-900">$14.34 in savings</strong> on a single order — 23% less. Order twice a week and you&apos;re saving $115/month.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How to Find Direct Ordering Options</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The challenge is that direct ordering options are fragmented. Unlike DoorDash where everything is in one app, direct ordering lives across dozens of different platforms:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li><strong className="text-gray-900">Toast</strong> — used by 100,000+ restaurants</li>
            <li><strong className="text-gray-900">Square Online</strong> — popular with smaller restaurants</li>
            <li><strong className="text-gray-900">ChowNow</strong> — commission-free ordering for restaurants</li>
            <li><strong className="text-gray-900">Olo</strong> — used by larger chains</li>
            <li><strong className="text-gray-900">Restaurant&apos;s own website</strong> — custom ordering pages</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-6">
            This is the main reason people stick with delivery apps — it&apos;s easier to use one app than to find each restaurant&apos;s direct ordering page. But the price difference is significant enough to be worth the effort.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Or Let Eddy Do It For You</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700">Eddy</Link> solves the discovery problem. We&apos;ve indexed direct ordering links for <strong className="text-gray-900">19,000+ restaurants</strong> across 30 US cities. When you&apos;re browsing DoorDash or Uber Eats, Eddy automatically checks if that restaurant has a cheaper direct ordering option — and shows you the link.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            No more Googling &quot;[restaurant name] order online.&quot; No more wondering if Toast or Square has a better price. Eddy does the comparison instantly, for free.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 my-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Save on every delivery order</h3>
            <p className="text-gray-500 mb-6">Eddy finds direct ordering options so you don&apos;t have to. Free Chrome extension.</p>
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
