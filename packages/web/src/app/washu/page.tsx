import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for WashU — Stop Overpaying for Delivery',
  description: 'WashU students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['WashU food delivery', 'St Louis DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/washu' },
  openGraph: { title: 'Eddy for WashU — Stop Overpaying for Delivery', description: 'WashU students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/washu', siteName: 'Eddy' },
};

export default function WashuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['washu']} />;
}
