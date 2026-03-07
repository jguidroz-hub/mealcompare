import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for USF — Stop Overpaying for Delivery',
  description: 'USF students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['USF food delivery', 'South Florida DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/usf' },
  openGraph: { title: 'Eddy for USF — Stop Overpaying for Delivery', description: 'USF students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/usf', siteName: 'Eddy' },
};

export default function UsfPage() {
  return <CampusPage config={CAMPUS_CONFIGS['usf']} />;
}
