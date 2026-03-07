import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Rice University — Stop Overpaying for Delivery',
  description: 'Rice students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Houston restaurants. Free Chrome extension.',
  keywords: ['Rice University food delivery', 'Rice DoorDash savings', 'cheap delivery Houston', 'Owls food savings'],
  alternates: { canonical: 'https://eddy.delivery/rice' },
  openGraph: {
    title: 'Eddy for Rice — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near Rice campus.',
    type: 'website', url: 'https://eddy.delivery/rice', siteName: 'Eddy',
  },
};

export default function RicePage() {
  return <CampusPage config={CAMPUS_CONFIGS['rice']} />;
}
