import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for TCU — Stop Overpaying for Delivery',
  description: 'TCU students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Fort Worth restaurants. Free Chrome extension.',
  keywords: ['TCU food delivery', 'TCU DoorDash savings', 'cheap delivery Fort Worth', 'Horned Frogs food savings'],
  alternates: { canonical: 'https://eddy.delivery/tcu' },
  openGraph: {
    title: 'Eddy for TCU — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near TCU campus.',
    type: 'website', url: 'https://eddy.delivery/tcu', siteName: 'Eddy',
  },
};

export default function TcuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['tcu']} />;
}
