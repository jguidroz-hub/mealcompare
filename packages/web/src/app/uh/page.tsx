import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for University of Houston — Stop Overpaying for Delivery',
  description: 'UH students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Houston restaurants. Free Chrome extension.',
  keywords: ['University of Houston food delivery', 'UH DoorDash savings', 'cheap delivery Houston', 'Cougars food savings'],
  alternates: { canonical: 'https://eddy.delivery/uh' },
  openGraph: {
    title: 'Eddy for UH — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near UH campus.',
    type: 'website', url: 'https://eddy.delivery/uh', siteName: 'Eddy',
  },
};

export default function UhPage() {
  return <CampusPage config={CAMPUS_CONFIGS['uh']} />;
}
