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

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Research: { bg: '#fef2f2', text: '#dc2626' },
  'Student Guide': { bg: '#eff6ff', text: '#2563eb' },
  Savings: { bg: '#f0fdf4', text: '#16a34a' },
  Guide: { bg: '#fefce8', text: '#ca8a04' },
  Comparison: { bg: '#f5f3ff', text: '#7c3aed' },
};

export default function BlogIndex() {
  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Back to Eddy</Link>
        
        <h1 style={{ fontSize: 40, fontWeight: 800, marginTop: 24, marginBottom: 8, letterSpacing: '-0.03em' }}>Blog</h1>
        <p style={{ color: '#6b7280', fontSize: 18, marginBottom: 48, lineHeight: 1.5 }}>
          Research, tips, and guides on saving money on food delivery.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {posts.map((post) => {
            const tagColor = TAG_COLORS[post.tag] || TAG_COLORS.Guide;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: 'block',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                  padding: '28px 28px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    padding: '3px 10px', borderRadius: 999,
                    background: tagColor.bg, color: tagColor.text,
                  }}>{post.tag}</span>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>{post.date}</span>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>· {post.readTime}</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{post.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
