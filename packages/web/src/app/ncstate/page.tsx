import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for NC State — Stop Overpaying for Delivery',
  description: 'NC State students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['NC State food delivery', 'Wolfpack DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/ncstate' },
  openGraph: { title: 'Eddy for NC State — Stop Overpaying for Delivery', description: 'NC State students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/ncstate', siteName: 'Eddy' },
};

export default function NcstatePage() {
  return <CampusPage config={CAMPUS_CONFIGS['ncstate']} />;
}
