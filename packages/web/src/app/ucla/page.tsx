import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UCLA — Stop Overpaying for Delivery',
  description: 'UCLA students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Westwood restaurants. Free Chrome extension.',
  keywords: ['UCLA food delivery', 'UCLA DoorDash savings', 'cheap delivery Westwood', 'Bruins food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/ucla' },
  openGraph: { title: 'Eddy for UCLA — Save on Every Delivery Order', description: 'Stop paying DoorDash markup on Fat Sal\'s, Zankou, and 446+ LA restaurants.', type: 'website', url: 'https://eddy.delivery/ucla', siteName: 'Eddy' },
};
export default function UclaPage() { return <CampusPage config={CAMPUS_CONFIGS['ucla']} />; }
