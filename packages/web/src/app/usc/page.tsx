import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for USC — Stop Overpaying for Delivery',
  description: 'USC students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['USC food delivery', 'USC DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/usc' },
  openGraph: { title: 'Eddy for USC — Stop Overpaying for Delivery', description: 'USC students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/usc', siteName: 'Eddy' },
};

export default function UscPage() {
  return <CampusPage config={CAMPUS_CONFIGS['usc']} />;
}
