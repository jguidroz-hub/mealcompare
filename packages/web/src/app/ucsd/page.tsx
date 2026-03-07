import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UC San Diego — Stop Overpaying for Delivery',
  description: 'UCSD students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['UCSD food delivery', 'UC San Diego DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/ucsd' },
  openGraph: { title: 'Eddy for UC San Diego — Stop Overpaying for Delivery', description: 'UCSD students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/ucsd', siteName: 'Eddy' },
};

export default function UcsdPage() {
  return <CampusPage config={CAMPUS_CONFIGS['ucsd']} />;
}
