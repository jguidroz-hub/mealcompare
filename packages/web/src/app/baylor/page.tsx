import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Baylor — Stop Overpaying for Delivery',
  description: 'Baylor students save $4-8 on every delivery order. Eddy finds the cheapest way to order from your favorite Waco restaurants. Free Chrome extension.',
  keywords: ['Baylor food delivery', 'Baylor DoorDash savings', 'cheap delivery Waco', 'Bears food savings'],
  alternates: { canonical: 'https://eddy.delivery/baylor' },
  openGraph: {
    title: 'Eddy for Baylor — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near Baylor campus.',
    type: 'website', url: 'https://eddy.delivery/baylor', siteName: 'Eddy',
  },
};

export default function BaylorPage() {
  return <CampusPage config={CAMPUS_CONFIGS['baylor']} />;
}
