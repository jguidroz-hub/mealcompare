import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Georgetown — Stop Overpaying for Delivery',
  description: 'Georgetown students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Georgetown food delivery', 'Georgetown DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/georgetown' },
  openGraph: { title: 'Eddy for Georgetown — Stop Overpaying for Delivery', description: 'Georgetown students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/georgetown', siteName: 'Eddy' },
};

export default function GeorgetownPage() {
  return <CampusPage config={CAMPUS_CONFIGS['georgetown']} />;
}
