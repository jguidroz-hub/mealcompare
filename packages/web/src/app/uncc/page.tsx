import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UNC Charlotte — Stop Overpaying for Delivery',
  description: 'UNCC students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['UNCC food delivery', 'Charlotte DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/uncc' },
  openGraph: { title: 'Eddy for UNC Charlotte — Stop Overpaying for Delivery', description: 'UNCC students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/uncc', siteName: 'Eddy' },
};

export default function UnccPage() {
  return <CampusPage config={CAMPUS_CONFIGS['uncc']} />;
}
