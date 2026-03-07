import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Butler — Stop Overpaying for Delivery',
  description: 'Butler students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Butler food delivery', 'Indianapolis DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/butler' },
  openGraph: { title: 'Eddy for Butler — Stop Overpaying for Delivery', description: 'Butler students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/butler', siteName: 'Eddy' },
};

export default function ButlerPage() {
  return <CampusPage config={CAMPUS_CONFIGS['butler']} />;
}
