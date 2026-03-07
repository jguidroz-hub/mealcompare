import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Johns Hopkins — Stop Overpaying for Delivery',
  description: 'Hopkins students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Johns Hopkins food delivery', 'Hopkins DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/jhu' },
  openGraph: { title: 'Eddy for Johns Hopkins — Stop Overpaying for Delivery', description: 'Hopkins students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/jhu', siteName: 'Eddy' },
};

export default function JhuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['jhu']} />;
}
