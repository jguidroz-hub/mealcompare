import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UT Dallas — Stop Overpaying for Delivery',
  description: 'UT Dallas students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Richardson restaurants. Free Chrome extension.',
  keywords: ['UT Dallas food delivery', 'UTD DoorDash savings', 'cheap delivery Richardson', 'Comets food savings'],
  alternates: { canonical: 'https://eddy.delivery/utd' },
  openGraph: {
    title: 'Eddy for UT Dallas — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near UTD campus.',
    type: 'website', url: 'https://eddy.delivery/utd', siteName: 'Eddy',
  },
};

export default function UtdPage() {
  return <CampusPage config={CAMPUS_CONFIGS['utd']} />;
}
