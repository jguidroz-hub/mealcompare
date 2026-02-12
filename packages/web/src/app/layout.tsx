import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkipTheFee — Find the Cheapest Food Delivery',
  description: 'Compare prices across DoorDash, Uber Eats, Grubhub, and direct ordering. Save $5-15 on every order.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
