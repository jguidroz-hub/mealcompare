import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for University of Miami — Stop Overpaying for Delivery',
  description: 'UM students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Miami food delivery', 'UM DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/um' },
  openGraph: { title: 'Eddy for University of Miami — Stop Overpaying for Delivery', description: 'UM students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/um', siteName: 'Eddy' },
};

export default function UmPage() {
  return <CampusPage config={CAMPUS_CONFIGS['um']} />;
}
