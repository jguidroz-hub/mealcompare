import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_RESTAURANTS, getDirectOrderUrl, getRestaurantsForMetro } from '@mealcompare/engine/src/data/top-restaurants';

export const metadata: Metadata = {
  title: 'Direct Ordering Coverage by City — Eddy',
  description: 'See how many restaurants in your city offer direct ordering. Skip DoorDash fees in 30+ metros.',
  alternates: { canonical: 'https://eddy.delivery/metros' },
};

const METRO_INFO: { key: string; name: string; blogSlug?: string }[] = [
  { key: 'austin', name: 'Austin', blogSlug: 'cheapest-food-delivery-austin' },
  { key: 'nyc', name: 'New York City', blogSlug: 'cheapest-food-delivery-nyc' },
  { key: 'chicago', name: 'Chicago', blogSlug: 'cheapest-food-delivery-chicago' },
  { key: 'la', name: 'Los Angeles', blogSlug: 'cheapest-food-delivery-la' },
  { key: 'houston', name: 'Houston', blogSlug: 'cheapest-food-delivery-houston' },
  { key: 'dallas', name: 'Dallas-Fort Worth', blogSlug: 'cheapest-food-delivery-dallas' },
  { key: 'sf', name: 'San Francisco', blogSlug: 'cheapest-food-delivery-sf' },
  { key: 'dc', name: 'Washington DC', blogSlug: 'cheapest-food-delivery-dc' },
  { key: 'miami', name: 'Miami', blogSlug: 'cheapest-food-delivery-miami' },
  { key: 'atlanta', name: 'Atlanta', blogSlug: 'cheapest-food-delivery-atlanta' },
  { key: 'boston', name: 'Boston', blogSlug: 'cheapest-food-delivery-boston' },
  { key: 'seattle', name: 'Seattle', blogSlug: 'cheapest-food-delivery-seattle' },
  { key: 'denver', name: 'Denver', blogSlug: 'cheapest-food-delivery-denver' },
  { key: 'philly', name: 'Philadelphia', blogSlug: 'cheapest-food-delivery-philly' },
  { key: 'phoenix', name: 'Phoenix', blogSlug: 'cheapest-food-delivery-phoenix' },
  { key: 'nashville', name: 'Nashville', blogSlug: 'cheapest-food-delivery-nashville' },
  { key: 'portland', name: 'Portland', blogSlug: 'cheapest-food-delivery-portland' },
  { key: 'minneapolis', name: 'Minneapolis', blogSlug: 'cheapest-food-delivery-minneapolis' },
  { key: 'detroit', name: 'Detroit', blogSlug: 'cheapest-food-delivery-detroit' },
  { key: 'tampa', name: 'Tampa Bay', blogSlug: 'cheapest-food-delivery-tampa' },
  { key: 'charlotte', name: 'Charlotte', blogSlug: 'cheapest-food-delivery-charlotte' },
  { key: 'sandiego', name: 'San Diego', blogSlug: 'cheapest-food-delivery-san-diego' },
  { key: 'nola', name: 'New Orleans', blogSlug: 'cheapest-food-delivery-new-orleans' },
  { key: 'raleigh', name: 'Raleigh-Durham', blogSlug: 'cheapest-food-delivery-raleigh' },
  { key: 'columbus', name: 'Columbus', blogSlug: 'cheapest-food-delivery-columbus' },
  { key: 'indianapolis', name: 'Indianapolis', blogSlug: 'cheapest-food-delivery-indianapolis' },
  { key: 'pittsburgh', name: 'Pittsburgh', blogSlug: 'cheapest-food-delivery-pittsburgh' },
  { key: 'milwaukee', name: 'Milwaukee', blogSlug: 'cheapest-food-delivery-milwaukee' },
  { key: 'stlouis', name: 'St. Louis' },
  { key: 'baltimore', name: 'Baltimore' },
  { key: 'san_antonio', name: 'San Antonio', blogSlug: 'cheapest-food-delivery-san-antonio' },
];

export default function MetrosPage() {
  const totalRestaurants = ALL_RESTAURANTS.length;
  const totalDirect = ALL_RESTAURANTS.filter(r => getDirectOrderUrl(r)).length;
  const overallCoverage = Math.round((totalDirect / totalRestaurants) * 100);

  const metroStats = METRO_INFO.map(m => {
    const restaurants = getRestaurantsForMetro(m.key);
    const direct = restaurants.filter(r => getDirectOrderUrl(r));
    const toast = restaurants.filter(r => r.toastUrl);
    return {
      ...m,
      total: restaurants.length,
      direct: direct.length,
      toast: toast.length,
      coverage: restaurants.length > 0 ? Math.round((direct.length / restaurants.length) * 100) : 0,
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <main style={{ background: '#fff', color: '#111', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb', lineHeight: 1, letterSpacing: '-0.05em', marginRight: 2 }}>~</span>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: '#111' }}>eddy</span>
            <span style={{ fontSize: 13, color: '#9ca3af', marginLeft: 1, fontWeight: 500 }}>.delivery</span>
          </Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/search" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Search</Link>
            <Link href="/blog" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
            <Link href="https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob" style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Add to Chrome</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero Stats */}
        <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>Direct Ordering Coverage by City</h1>
          <p style={{ fontSize: 18, color: '#6b7280', marginBottom: 32 }}>
            How many restaurants in your city let you skip DoorDash?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#2563eb' }}>{totalRestaurants.toLocaleString()}</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Restaurants</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#16a34a' }}>{totalDirect.toLocaleString()}</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Direct Ordering</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b' }}>{overallCoverage}%</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Coverage</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#8b5cf6' }}>30</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Metros</div>
            </div>
          </div>
        </div>

        {/* Metro Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {metroStats.map(m => (
            <div key={m.key} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, transition: 'box-shadow 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{m.name}</h2>
                <span style={{ background: m.coverage >= 80 ? '#f0fdf4' : m.coverage >= 60 ? '#fffbeb' : '#fef2f2', color: m.coverage >= 80 ? '#16a34a' : m.coverage >= 60 ? '#d97706' : '#dc2626', padding: '2px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                  {m.coverage}%
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
                <span>{m.total} restaurants</span>
                <span>{m.direct} direct</span>
                {m.toast > 0 && <span>🍞 {m.toast} Toast</span>}
              </div>
              {/* Coverage bar */}
              <div style={{ background: '#f3f4f6', borderRadius: 4, height: 6, marginBottom: 12 }}>
                <div style={{ background: '#16a34a', borderRadius: 4, height: 6, width: `${m.coverage}%` }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/search?metro=${m.key}`} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Search restaurants →</Link>
                {m.blogSlug && (
                  <Link href={`/blog/${m.blogSlug}`} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Price guide</Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Partnership CTA */}
        <div style={{ background: '#f9fafb', borderRadius: 16, padding: 40, textAlign: 'center' as const, marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Restaurant or Platform Partner?</h2>
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 24, maxWidth: 520, margin: '0 auto 24px' }}>
            Eddy drives consumers toward direct ordering — away from third-party delivery apps. If you&apos;re a restaurant, ordering platform, or technology partner, let&apos;s talk.
          </p>
          <Link href="mailto:jon@projectgreenbelt.com" style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Partner With Us</Link>
        </div>
      </div>
    </main>
  );
}
