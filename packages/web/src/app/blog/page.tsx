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
    slug: 'cheapest-food-delivery-austin',
    title: 'Cheapest Food Delivery in Austin (2026): Skip the Markup',
    description: 'We compared DoorDash, Uber Eats, Grubhub, and direct ordering for 20 popular Austin restaurants. Here\'s how to get the cheapest delivery every time.',
    date: 'March 7, 2026',
    tag: 'Austin',
    readTime: '8 min read',
  },
  {
    slug: 'cheapest-food-delivery-houston',
    title: 'Cheapest Food Delivery in Houston (2026): Real Price Comparisons',
    description: 'We compared DoorDash, Uber Eats, Grubhub, and direct ordering for popular Houston restaurants. Here\'s how to pay less every time.',
    date: 'March 7, 2026',
    tag: 'Houston',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-dallas',
    title: 'Cheapest Food Delivery in Dallas (2026): Stop Overpaying',
    description: 'DoorDash and Uber Eats charge 15-30% more than ordering direct. We compared real prices for popular DFW restaurants.',
    date: 'March 7, 2026',
    tag: 'Dallas',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-san-antonio',
    title: 'Cheapest Food Delivery in San Antonio (2026): Real Prices Compared',
    description: 'We compared DoorDash, Uber Eats, and direct ordering for popular San Antonio restaurants. Order direct and save 15-30%.',
    date: 'March 7, 2026',
    tag: 'San Antonio',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-chicago',
    title: 'Cheapest Food Delivery in Chicago (2026): Beat the Markup',
    description: 'Chicago delivery app prices are 20-35% higher than ordering direct — plus Chicago\'s delivery surcharge. Here\'s how to save.',
    date: 'March 7, 2026',
    tag: 'Chicago',
    readTime: '8 min read',
  },
  {
    slug: 'cheapest-food-delivery-nyc',
    title: 'Cheapest Food Delivery in NYC (2026): Dodge the App Fees',
    description: 'NYC food delivery app fees are the highest in the country. We compared real prices for popular NYC restaurants.',
    date: 'March 7, 2026',
    tag: 'NYC',
    readTime: '8 min read',
  },
  {
    slug: 'cheapest-food-delivery-la',
    title: 'Cheapest Food Delivery in Los Angeles (2026): Save on Every Order',
    description: 'LA food delivery markup averages 25-35%. We compared DoorDash, Uber Eats, and direct ordering for popular LA restaurants.',
    date: 'March 7, 2026',
    tag: 'Los Angeles',
    readTime: '8 min read',
  },
  {
    slug: 'cheapest-food-delivery-sf',
    title: 'Cheapest Food Delivery in San Francisco (2026): Skip the App Tax',
    description: 'SF food delivery fees are among the highest in the US. We compared DoorDash, Uber Eats, and direct ordering for popular Bay Area restaurants.',
    date: 'March 7, 2026',
    tag: 'San Francisco',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-miami',
    title: 'Cheapest Food Delivery in Miami (2026): Beat the Markup',
    description: 'Miami food delivery apps charge 20-35% more than ordering direct. Here\'s how to save on Pollo Tropical, Flanigan\'s, and more.',
    date: 'March 7, 2026',
    tag: 'Miami',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-atlanta',
    title: 'Cheapest Food Delivery in Atlanta (2026): Order Direct & Save',
    description: 'Atlanta delivery markup averages 20-30%. Real prices for Chick-fil-A, Wingstop, Zaxby\'s and more.',
    date: 'March 7, 2026',
    tag: 'Atlanta',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-boston',
    title: 'Cheapest Food Delivery in Boston (2026): Skip the App Markup',
    description: 'Boston delivery app prices are 20-30% higher than ordering direct. We compared real prices for popular Boston restaurants.',
    date: 'March 7, 2026',
    tag: 'Boston',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-seattle',
    title: 'Cheapest Food Delivery in Seattle (2026): Order Direct & Save',
    description: 'Seattle delivery app markup averages 25-35%. Plus the $0.75 delivery surcharge. Here\'s how to avoid it.',
    date: 'March 7, 2026',
    tag: 'Seattle',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-denver',
    title: 'Cheapest Food Delivery in Denver (2026): Ditch the App Fees',
    description: 'Denver delivery apps charge 20-30% more than ordering direct. We compared real prices for popular Denver restaurants.',
    date: 'March 7, 2026',
    tag: 'Denver',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-philly',
    title: 'Cheapest Food Delivery in Philadelphia (2026): Real Prices Compared',
    description: 'Philly delivery apps charge 20-35% more than ordering direct. We compared real prices for popular Philadelphia restaurants.',
    date: 'March 7, 2026',
    tag: 'Philadelphia',
    readTime: '7 min read',
  },
  {
    slug: 'cheapest-food-delivery-dc',
    title: 'Cheapest Food Delivery in Washington DC (2026): Cut the Fees',
    description: 'DC delivery apps charge 25-35% more than ordering direct despite the commission cap. Here\'s how to save.',
    date: 'March 7, 2026',
    tag: 'Washington DC',
    readTime: '7 min read',
  },
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
  Austin: { bg: '#f0fdf4', text: '#16a34a' },
  Houston: { bg: '#fef2f2', text: '#dc2626' },
  Dallas: { bg: '#f5f3ff', text: '#7c3aed' },
  'San Antonio': { bg: '#fef3c7', text: '#b45309' },
  Chicago: { bg: '#ecfdf5', text: '#047857' },
  NYC: { bg: '#fef2f2', text: '#dc2626' },
  'Los Angeles': { bg: '#fff7ed', text: '#c2410c' },
  'San Francisco': { bg: '#fdf4ff', text: '#a21caf' },
  Miami: { bg: '#ecfeff', text: '#0e7490' },
  Atlanta: { bg: '#fef9c3', text: '#a16207' },
  Boston: { bg: '#fef2f2', text: '#b91c1c' },
  Seattle: { bg: '#ecfdf5', text: '#065f46' },
  Denver: { bg: '#f0fdf4', text: '#166534' },
  Philadelphia: { bg: '#eff6ff', text: '#1d4ed8' },
  'Washington DC': { bg: '#f5f3ff', text: '#6d28d9' },
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
