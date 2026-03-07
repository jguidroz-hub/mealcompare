import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UChicago — Stop Overpaying for Delivery',
  description: 'UChicago students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite Hyde Park restaurants. Free Chrome extension.',
  keywords: ['UChicago food delivery', 'University of Chicago DoorDash savings', 'cheap delivery Hyde Park', 'Chicago college food savings'],
  alternates: { canonical: 'https://eddy.delivery/uchicago' },
  openGraph: { title: 'Eddy for UChicago — Save on Every Delivery Order', description: 'Stop paying DoorDash markup on Giordano\'s, Portillo\'s, Harold\'s and 429+ Chicago restaurants.', type: 'website', url: 'https://eddy.delivery/uchicago', siteName: 'Eddy' },
};
export default function UchicagoPage() { return <CampusPage config={CAMPUS_CONFIGS['uchicago']} />; }
