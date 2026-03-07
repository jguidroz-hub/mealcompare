import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Boston University — Stop Overpaying for Delivery',
  description: 'BU students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['BU food delivery', 'Boston University DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/bu' },
  openGraph: { title: 'Eddy for Boston University — Stop Overpaying for Delivery', description: 'BU students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/bu', siteName: 'Eddy' },
};

export default function BuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['bu']} />;
}
