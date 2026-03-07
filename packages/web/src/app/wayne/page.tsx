import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Wayne State — Stop Overpaying for Delivery',
  description: 'Wayne State students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Wayne State food delivery', 'Detroit DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/wayne' },
  openGraph: { title: 'Eddy for Wayne State — Stop Overpaying for Delivery', description: 'Wayne State students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/wayne', siteName: 'Eddy' },
};

export default function WaynePage() {
  return <CampusPage config={CAMPUS_CONFIGS['wayne']} />;
}
