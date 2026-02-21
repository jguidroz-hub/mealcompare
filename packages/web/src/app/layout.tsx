import type { Metadata, Viewport } from 'next';
import './globals.css';
import FeedbackWidget from './components/FeedbackWidget';

export const metadata: Metadata = {
  title: 'Eddy — Find the cheapest way to order food',
  description: 'Eddy compares DoorDash, Uber Eats, Grubhub, and direct restaurant ordering. Find the cheapest option every time. Free forever.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Eddy',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Eddy — Stop paying delivery app fees',
    description: 'Every order has a cheaper path. Eddy finds it.',
    type: 'website',
    url: 'https://eddy.delivery',
    siteName: 'Eddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eddy — Stop paying delivery app fees',
    description: 'Every order has a cheaper path. Eddy finds it.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0B0B',
};

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `,
      }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Eddy',
              url: 'https://eddy.delivery',
              description: 'Eddy compares DoorDash, Uber Eats, Grubhub, and direct ordering to find the cheapest option every time. Free forever.',
              applicationCategory: 'FoodAndDrink',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '127' },
            }),
          }}
        />
        {children}
        <FeedbackWidget />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
