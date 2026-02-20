import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Direct Ordering for Your Restaurant | SkipTheFee',
  description: 'Stop paying 28-33% commissions to DoorDash and Uber Eats. Set up your own direct ordering system and keep more of every sale.',
  openGraph: {
    title: 'Get Direct Ordering for Your Restaurant | SkipTheFee',
    description: 'Stop paying 28-33% commissions to DoorDash and Uber Eats.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
