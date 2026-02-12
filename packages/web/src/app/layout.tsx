import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'SkipTheFee — Find the Cheapest Food Delivery',
  description: 'Compare prices across DoorDash, Uber Eats, Grubhub, and direct ordering. Save $5-15 on every order.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SkipTheFee',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'SkipTheFee — Stop Overpaying for Food Delivery',
    description: 'Compare total costs across DoorDash, Uber Eats, Grubhub & direct ordering.',
    type: 'website',
    url: 'https://skipthefee.app',
    siteName: 'SkipTheFee',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkipTheFee — Stop Overpaying for Food Delivery',
    description: 'Compare total costs across DoorDash, Uber Eats, Grubhub & direct ordering.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
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
      <body style={{ margin: 0 }}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
