import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Tulane — Stop Overpaying for Delivery',
  description: 'Tulane students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Tulane food delivery', 'Tulane DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/tulane' },
  openGraph: { title: 'Eddy for Tulane — Stop Overpaying for Delivery', description: 'Tulane students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/tulane', siteName: 'Eddy' },
};

export default function TulanePage() {
  return <CampusPage config={CAMPUS_CONFIGS['tulane']} />;
}
