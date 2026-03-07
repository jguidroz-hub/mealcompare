import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Portland State — Stop Overpaying for Delivery',
  description: 'PSU students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Portland State food delivery', 'Portland DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/psu' },
  openGraph: { title: 'Eddy for Portland State — Stop Overpaying for Delivery', description: 'PSU students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/psu', siteName: 'Eddy' },
};

export default function PsuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['psu']} />;
}
