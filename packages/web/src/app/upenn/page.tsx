import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for UPenn — Stop Overpaying for Delivery',
  description: 'UPenn students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['UPenn food delivery', 'Penn DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/upenn' },
  openGraph: { title: 'Eddy for UPenn — Stop Overpaying for Delivery', description: 'UPenn students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/upenn', siteName: 'Eddy' },
};

export default function UpennPage() {
  return <CampusPage config={CAMPUS_CONFIGS['upenn']} />;
}
