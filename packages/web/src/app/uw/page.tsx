import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UW — Stop Overpaying for Delivery',
  description: 'UW students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['UW food delivery', 'University of Washington DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/uw' },
  openGraph: { title: 'Eddy for UW — Stop Overpaying for Delivery', description: 'UW students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/uw', siteName: 'Eddy' },
};

export default function UwPage() {
  return <CampusPage config={CAMPUS_CONFIGS['uw']} />;
}
