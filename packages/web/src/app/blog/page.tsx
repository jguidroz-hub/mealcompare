import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Eddy',
  description: 'Tips, research, and guides on saving money on food delivery. Compare DoorDash, Uber Eats, Grubhub, and direct ordering.',
  openGraph: {
    title: 'Eddy Blog — Save on Food Delivery',
    description: 'Research-backed tips on cutting delivery app costs.',
  },
};

const posts = [
  {
    slug: 'doordash-markup-explained',
    title: 'DoorDash Markup Explained: Why Your Food Costs 30% More',
    description: 'DoorDash charges restaurants 15-30% commission, and restaurants raise menu prices to cover it. Here\'s exactly how much more you\'re paying.',
    date: 'March 6, 2026',
    tag: 'Research',
    readTime: '7 min read',
  },
  {
    slug: 'college-food-delivery-savings',
    title: 'How College Students Can Save $240/Semester on Food Delivery',
    description: 'The average college student spends $2,400/year on delivery apps. Here\'s the math on how to cut that by 30%.',
    date: 'March 6, 2026',
    tag: 'Student Guide',
    readTime: '6 min read',
  },
  {
    slug: 'credit-card-food-delivery-rewards',
    title: 'Best Credit Cards for Food Delivery in 2026: Maximize Your Rewards',
    description: 'Chase Sapphire, Amex Gold, Capital One Savor — which card saves you the most on DoorDash, Uber Eats, and Grubhub?',
    date: 'February 28, 2026',
    tag: 'Savings',
    readTime: '10 min read',
  },
  {
    slug: 'food-delivery-price-comparison',
    title: 'DoorDash vs Uber Eats vs Grubhub: Real Price Comparison (2026)',
    description: 'We compared actual prices across delivery platforms for the same orders. The results might change how you order food.',
    date: 'February 28, 2026',
    tag: 'Research',
    readTime: '8 min read',
  },
  {
    slug: 'direct-ordering-saves-money',
    title: 'Why Ordering Directly From Restaurants Saves You 15-30%',
    description: 'Delivery apps charge restaurants up to 30% commission — and that cost gets passed to you. Here\'s how direct ordering works.',
    date: 'February 28, 2026',
    tag: 'Guide',
    readTime: '6 min read',
  },
  {
    slug: 'best-food-delivery-apps-compared',
    title: 'Best Food Delivery Apps in 2026: DoorDash, Uber Eats, Grubhub Compared',
    description: 'Honest comparison of coverage, fees, subscriptions, and which app is best for different situations.',
    date: 'February 28, 2026',
    tag: 'Comparison',
    readTime: '10 min read',
  },
];

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-4">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm">← Back to Eddy</Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-500 text-lg mb-12">Research, tips, and guides on saving money on food delivery.</p>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{post.tag}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
                <span className="text-xs text-gray-400">· {post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-500">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
