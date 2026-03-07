import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

const config = CAMPUS_CONFIGS['tamu'];

export const metadata: Metadata = {
  title: 'Eddy for Texas A&M — Stop Overpaying for Delivery',
  description: 'Texas A&M students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite College Station restaurants. Free Chrome extension.',
  keywords: ['Texas A&M food delivery', 'A&M DoorDash savings', 'cheap delivery College Station', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/tamu' },
  openGraph: {
    title: 'Eddy for Texas A&M — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for Layne\'s, Torchy\'s, Fuego, and 45+ restaurants near A&M campus.',
    type: 'website',
    url: 'https://eddy.delivery/tamu',
    siteName: 'Eddy',
  },
};

export default function TamuPage() {
  return <CampusPage config={config} />;
}
