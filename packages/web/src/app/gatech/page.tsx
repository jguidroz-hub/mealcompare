import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Georgia Tech — Stop Overpaying for Delivery',
  description: 'Georgia Tech students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Atlanta restaurants. Free Chrome extension.',
  keywords: ['Georgia Tech food delivery', 'GT DoorDash savings', 'cheap delivery Atlanta', 'Yellow Jackets food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/gatech' },
  openGraph: { title: 'Eddy for Georgia Tech — Save on Every Delivery Order', description: 'Stop paying DoorDash markup on The Varsity, Antico, and 261+ Atlanta restaurants.', type: 'website', url: 'https://eddy.delivery/gatech', siteName: 'Eddy' },
};
export default function GatechPage() { return <CampusPage config={CAMPUS_CONFIGS['gatech']} />; }
