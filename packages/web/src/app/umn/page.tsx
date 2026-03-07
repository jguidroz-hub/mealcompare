import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for University of Minnesota — Stop Overpaying for Delivery',
  description: 'UMN students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['UMN food delivery', 'Minnesota DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/umn' },
  openGraph: { title: 'Eddy for University of Minnesota — Stop Overpaying for Delivery', description: 'UMN students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/umn', siteName: 'Eddy' },
};

export default function UmnPage() {
  return <CampusPage config={CAMPUS_CONFIGS['umn']} />;
}
