import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Temple — Stop Overpaying for Delivery',
  description: 'Temple students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Temple food delivery', 'Temple University DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/temple' },
  openGraph: { title: 'Eddy for Temple — Stop Overpaying for Delivery', description: 'Temple students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/temple', siteName: 'Eddy' },
};

export default function TemplePage() {
  return <CampusPage config={CAMPUS_CONFIGS['temple']} />;
}
