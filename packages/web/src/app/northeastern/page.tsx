import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Northeastern — Stop Overpaying for Delivery',
  description: 'Northeastern students save $5-10 on every delivery order. Free Chrome extension.',
  keywords: ['Northeastern food delivery', 'NEU DoorDash savings', 'college food delivery savings'],
  alternates: { canonical: 'https://eddy.delivery/northeastern' },
  openGraph: { title: 'Eddy for Northeastern — Stop Overpaying for Delivery', description: 'Northeastern students save $5-10 on every delivery order. Free Chrome extension.', type: 'website', url: 'https://eddy.delivery/northeastern', siteName: 'Eddy' },
};

export default function NortheasternPage() {
  return <CampusPage config={CAMPUS_CONFIGS['northeastern']} />;
}
