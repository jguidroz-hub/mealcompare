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

export async function generateMetadata({ params }: { params: Promise<{ metro: string }> }): Promise<Metadata> {
  const { metro } = await params;
  const city = METRO_NAMES[metro] || metro;

  return {
    title: `Direct Ordering Restaurants in ${city} — SkipTheFee`,
    description: `Find restaurants in ${city} with direct ordering. Skip DoorDash and Uber Eats fees — save 15-30% on every order. Browse ${city} restaurants with direct ordering links.`,
    openGraph: {
      title: `Skip Delivery Fees in ${city} — Order Direct`,
      description: `${city} restaurants with direct ordering. Save $5-15 per order vs DoorDash/Uber Eats.`,
      type: 'website',
      url: `https://skipthefee.app/restaurants/${metro}`,
    },
  };
}

export default function MetroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
