import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Pitt — Stop Overpaying for Delivery',
  description: 'Pitt students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Pitt food delivery', 'Pittsburgh DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/pitt' },
  openGraph: { title: 'Eddy for Pitt — Stop Overpaying for Delivery', description: 'Pitt students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/pitt', siteName: 'Eddy' },
};

export default function PittPage() {
  return <CampusPage config={CAMPUS_CONFIGS['pitt']} />;
}
