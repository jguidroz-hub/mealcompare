import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Marquette — Stop Overpaying for Delivery',
  description: 'Marquette students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Marquette food delivery', 'Marquette DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/marquette' },
  openGraph: { title: 'Eddy for Marquette — Stop Overpaying for Delivery', description: 'Marquette students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/marquette', siteName: 'Eddy' },
};

export default function MarquettePage() {
  return <CampusPage config={CAMPUS_CONFIGS['marquette']} />;
}
