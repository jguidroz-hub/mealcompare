import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UTSA — Stop Overpaying for Delivery',
  description: 'UTSA students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite San Antonio restaurants. Free Chrome extension.',
  keywords: ['UTSA food delivery', 'UTSA DoorDash savings', 'cheap delivery San Antonio', 'Roadrunners food savings'],
  alternates: { canonical: 'https://eddy.delivery/utsa' },
  openGraph: {
    title: 'Eddy for UTSA — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near UTSA campus.',
    type: 'website', url: 'https://eddy.delivery/utsa', siteName: 'Eddy',
  },
};

export default function UtsaPage() {
  return <CampusPage config={CAMPUS_CONFIGS['utsa']} />;
}
