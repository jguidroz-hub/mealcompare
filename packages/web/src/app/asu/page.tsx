import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for ASU — Stop Overpaying for Delivery',
  description: 'ASU students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Tempe restaurants. Free Chrome extension.',
  keywords: ['ASU food delivery', 'Arizona State DoorDash savings', 'cheap delivery Tempe', 'Sun Devils food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/asu' },
  openGraph: { title: 'Eddy for ASU — Save on Every Delivery Order', description: 'Stop paying DoorDash markup on In-N-Out, Pedal Haus, and 305+ Phoenix restaurants.', type: 'website', url: 'https://eddy.delivery/asu', siteName: 'Eddy' },
};
export default function AsuPage() { return <CampusPage config={CAMPUS_CONFIGS['asu']} />; }
