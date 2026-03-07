import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for CU Boulder — Stop Overpaying for Delivery',
  description: 'CU students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['CU Boulder food delivery', 'Colorado DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/cu' },
  openGraph: { title: 'Eddy for CU Boulder — Stop Overpaying for Delivery', description: 'CU students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/cu', siteName: 'Eddy' },
};

export default function CuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['cu']} />;
}
