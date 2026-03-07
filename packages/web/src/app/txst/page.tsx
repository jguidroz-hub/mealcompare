import type { Metadata } from 'next';
import CampusPage from '../campus/CampusPage';
import { CAMPUS_CONFIGS } from '../campus/configs';

export const metadata: Metadata = {
  title: 'Eddy for Texas State — Stop Overpaying for Delivery',
  description: 'Texas State students save $4-8 on every delivery order. Eddy finds the cheapest way to order from your favorite San Marcos restaurants. Free Chrome extension.',
  keywords: ['Texas State food delivery', 'TXST DoorDash savings', 'cheap delivery San Marcos', 'Bobcats food savings'],
  alternates: { canonical: 'https://eddy.delivery/txst' },
  openGraph: {
    title: 'Eddy for Texas State — Save on Every Delivery Order',
    description: 'Stop paying DoorDash markup. Eddy finds direct ordering links for restaurants near Texas State campus.',
    type: 'website', url: 'https://eddy.delivery/txst', siteName: 'Eddy',
  },
};

export default function TxstPage() {
  return <CampusPage config={CAMPUS_CONFIGS['txst']} />;
}
