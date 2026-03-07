import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for GWU — Stop Overpaying for Delivery',
  description: 'GWU students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['GWU food delivery', 'George Washington University DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/gwu' },
  openGraph: { title: 'Eddy for GWU — Stop Overpaying for Delivery', description: 'GWU students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/gwu', siteName: 'Eddy' },
};

export default function GwuPage() {
  return <CampusPage config={CAMPUS_CONFIGS['gwu']} />;
}
