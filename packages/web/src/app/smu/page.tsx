import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for SMU — Stop Overpaying for Delivery',
  description: 'SMU students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['SMU food delivery', 'SMU DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/smu' },
  openGraph: { title: 'Eddy for SMU — Stop Overpaying for Delivery', description: 'SMU students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/smu', siteName: 'Eddy' },
};

export default function SmuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['smu']} />;
}
