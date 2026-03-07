import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Vanderbilt — Stop Overpaying for Delivery',
  description: 'Vanderbilt students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Vanderbilt food delivery', 'Vandy DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/vanderbilt' },
  openGraph: { title: 'Eddy for Vanderbilt — Stop Overpaying for Delivery', description: 'Vanderbilt students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/vanderbilt', siteName: 'Eddy' },
};

export default function VanderbiltPage() {
  return <CampusPage config={CAMPUS_CONFIGS['vanderbilt']} />;
}
