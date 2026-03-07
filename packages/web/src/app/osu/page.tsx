import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Ohio State — Stop Overpaying for Delivery',
  description: 'Ohio State students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite campus restaurants. Free Chrome extension.',
  keywords: ['Ohio State food delivery', 'OSU DoorDash savings', 'cheap delivery Columbus Ohio', 'Buckeyes food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/osu' },
  openGraph: { title: 'Eddy for Ohio State — Save on Every Delivery Order', description: 'Stop paying DoorDash markup on Adriatico\'s, Condado, and 215+ Columbus restaurants.', type: 'website', url: 'https://eddy.delivery/osu', siteName: 'Eddy' },
};
export default function OsuPage() { return <CampusPage config={CAMPUS_CONFIGS['osu']} />; }
