import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for NYU — Stop Overpaying for Delivery',
  description: 'NYU students save $6-12 on every delivery order. Eddy finds the cheapest way to order from your favorite NYC restaurants. Free Chrome extension.',
  keywords: ['NYU food delivery', 'NYU DoorDash savings', 'cheap delivery Greenwich Village', 'college food delivery NYC'],
  alternates: { canonical: 'https://eddy.delivery/nyu' },
  openGraph: { title: 'Eddy for NYU — Save on Every Delivery Order', description: 'Stop paying DoorDash markup on Joe\'s Pizza, Mamoun\'s, Xi\'an Famous Foods and 559+ NYC restaurants.', type: 'website', url: 'https://eddy.delivery/nyu', siteName: 'Eddy' },
};
export default function NyuPage() { return <CampusPage config={CAMPUS_CONFIGS['nyu']} />; }
