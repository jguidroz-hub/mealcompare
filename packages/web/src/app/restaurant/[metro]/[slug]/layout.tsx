import type { Metadata } from 'next';

const METRO_NAMES: Record<string, string> = {
  nyc: 'New York', chicago: 'Chicago', la: 'Los Angeles', sf: 'San Francisco',
  boston: 'Boston', miami: 'Miami', dc: 'Washington DC', austin: 'Austin',
  houston: 'Houston', atlanta: 'Atlanta', seattle: 'Seattle', denver: 'Denver',
  philly: 'Philadelphia', nashville: 'Nashville', nola: 'New Orleans', dallas: 'Dallas',
  phoenix: 'Phoenix', portland: 'Portland', detroit: 'Detroit', minneapolis: 'Minneapolis',
  charlotte: 'Charlotte', tampa: 'Tampa', sandiego: 'San Diego', stlouis: 'St Louis',
  pittsburgh: 'Pittsburgh', columbus: 'Columbus', indianapolis: 'Indianapolis',
  milwaukee: 'Milwaukee', raleigh: 'Raleigh', baltimore: 'Baltimore',
};

export async function generateMetadata({ params }: { params: Promise<{ metro: string; slug: string }> }): Promise<Metadata> {
  const { metro, slug } = await params;
  const city = METRO_NAMES[metro] || metro;
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `Order Direct from ${name} in ${city} — SkipTheFee`,
    description: `Skip delivery app fees and order directly from ${name} in ${city}. Save $5-15 per order vs DoorDash, Uber Eats, and Grubhub.`,
    openGraph: {
      title: `${name} — Order Direct & Save | SkipTheFee`,
      description: `Skip delivery fees at ${name}. Order direct and save $5-15 per order.`,
      url: `https://skipthefee.app/restaurant/${metro}/${slug}`,
    },
  };
}

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
