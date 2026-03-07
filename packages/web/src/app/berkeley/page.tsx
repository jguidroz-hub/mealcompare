import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UC Berkeley — Stop Overpaying for Delivery',
  description: 'Cal students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['UC Berkeley food delivery', 'Cal DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/berkeley' },
  openGraph: { title: 'Eddy for UC Berkeley — Stop Overpaying for Delivery', description: 'Cal students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/berkeley', siteName: 'Eddy' },
};

export default function BerkeleyPage() {
  return <CampusPage config={CAMPUS_CONFIGS['berkeley']} />;
}
