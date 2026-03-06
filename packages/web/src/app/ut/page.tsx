import type { Metadata } from 'next';
import RefCookie from './RefCookie';

const CWS_URL = 'https://chromewebstore.google.com/detail/eddy-%E2%80%94-save-on-food-deliv/nogipmchmfjhmnjcmeppmmngeokhaoob';

export const metadata: Metadata = {
  title: 'Eddy for UT Austin — Stop Overpaying for Delivery',
  description: 'UT students save $5-10 on every delivery order. Eddy finds the cheapest way to order from your favorite campus restaurants. Free Chrome extension.',
  keywords: ['UT Austin food delivery', 'UT Austin DoorDash savings', 'cheap delivery near UT', 'UT Austin restaurant deals', 'college food delivery savings', 'DoorDash alternative UT Austin'],
  alternates: {
    canonical: 'https://eddy.delivery/ut',
  },
  openGraph: {
    title: 'Eddy for UT Austin — Save on Every Delivery Order',
    description: 'Stop paying DoorDash\'s 30% markup. Eddy finds direct ordering links for Via 313, Torchy\'s, Pluckers, and 60+ restaurants near campus.',
    type: 'website',
    url: 'https://eddy.delivery/ut',
    siteName: 'Eddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eddy for UT Austin — Save $240/semester on Food Delivery',
    description: 'Free Chrome extension that finds cheaper ways to order from your favorite campus restaurants. No account needed.',
  },
};

const CAMPUS_RESTAURANTS = [
  { name: "Via 313", category: "Pizza", savings: "$4-7" },
  { name: "Torchy's Tacos", category: "Tex-Mex", savings: "$3-6" },
  { name: "Pluckers", category: "Wings", savings: "$5-8" },
  { name: "Raising Cane's", category: "Chicken", savings: "$3-5" },
  { name: "Chick-fil-A", category: "Chicken", savings: "$2-4" },
  { name: "Kerbey Lane Cafe", category: "Breakfast", savings: "$4-7" },
  { name: "Chipotle", category: "Mexican", savings: "$2-4" },
  { name: "Whataburger", category: "Burgers", savings: "$3-5" },
  { name: "Insomnia Cookies", category: "Late Night", savings: "$2-4" },
  { name: "DeSano Pizza", category: "Pizza", savings: "$4-6" },
  { name: "Wingstop", category: "Wings", savings: "$3-6" },
  { name: "Home Slice", category: "Pizza", savings: "$4-7" },
  { name: "Cabo Bob's", category: "Burritos", savings: "$3-5" },
  { name: "Halal Bros", category: "Halal", savings: "$3-5" },
  { name: "Ramen Tatsu-Ya", category: "Ramen", savings: "$4-6" },
  { name: "Five Guys", category: "Burgers", savings: "$3-5" },
];

const SAVINGS_MATH = {
  ordersPerWeek: 3,
  avgSavings: 5,
  weeksPerSemester: 16,
};

const semesterSavings = SAVINGS_MATH.ordersPerWeek * SAVINGS_MATH.avgSavings * SAVINGS_MATH.weeksPerSemester;

export default function UTPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Eddy — Save on Food Delivery',
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Chrome',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    description: 'Free Chrome extension that compares prices across food delivery apps and finds cheaper direct ordering options for UT Austin students.',
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <RefCookie />
    <main style={{
      background: '#0f172a',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      minHeight: '100vh',
    }}>
      {/* Hero */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 24px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '999px',
          padding: '6px 16px',
          fontSize: '14px',
          color: '#94a3b8',
          marginBottom: '24px',
        }}>
          🤘 Built for UT Austin students
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '20px',
        }}>
          Stop overpaying for
          <span style={{ color: '#f97316' }}> delivery</span>
        </h1>

        <p style={{
          fontSize: '20px',
          color: '#94a3b8',
          maxWidth: '600px',
          margin: '0 auto 12px',
          lineHeight: 1.6,
        }}>
          Eddy finds the cheapest way to order from your favorite restaurants near campus.
          Same food, lower price — every time.
        </p>

        <p style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#22c55e',
          marginBottom: '32px',
        }}>
          Save ${semesterSavings}+ per semester
        </p>

        <a
          href={CWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f97316',
            color: '#fff',
            fontWeight: 700,
            fontSize: '18px',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          Add to Chrome — Free
        </a>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
          No account needed. No data collected. Just savings.
        </p>
      </section>

      {/* How it works */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>
          How it works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          {[
            { step: '1', title: 'Browse DoorDash', desc: 'Search for food on DoorDash, Uber Eats, or Grubhub like you normally would.' },
            { step: '2', title: 'Eddy pops up', desc: 'When there\'s a cheaper direct ordering option, Eddy shows you the price difference.' },
            { step: '3', title: 'Order direct', desc: 'One click takes you to the restaurant\'s own ordering page. Same food, less money.' },
          ].map((item) => (
            <div key={item.step} style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f97316',
                color: '#fff',
                fontWeight: 800,
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                {item.step}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Savings math */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
            The math is simple
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#f97316' }}>{SAVINGS_MATH.ordersPerWeek}×</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>orders per week</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#f97316' }}>${SAVINGS_MATH.avgSavings}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>avg savings per order</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>${semesterSavings}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>saved per semester</div>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            DoorDash charges restaurants 15-30% commission. That markup goes straight to your bill.
            <br />Order direct = restaurant prices. No middleman.
          </p>
        </div>
      </section>

      {/* Campus restaurants */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
          60+ restaurants near campus
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '15px', marginBottom: '24px' }}>
          Your favorites — with direct ordering links that save you money
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}>
          {CAMPUS_RESTAURANTS.map((r) => (
            <div key={r.name} style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '16px',
            }}>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{r.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>{r.category}</div>
              <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600 }}>Save {r.savings}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '16px' }}>
          ...and 44 more. Eddy works on any restaurant page on DoorDash, Uber Eats, or Grubhub.
        </p>

        <div style={{
          marginTop: '40px',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc', marginBottom: '8px' }}>
            Missing your favorite spot?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '16px' }}>
            Tell us what restaurants or features we should add to Eddy.
          </p>
          <a
            href="mailto:jon@eddy.delivery?subject=Eddy%20UT%20Feature%20Request"
            style={{
              display: 'inline-block',
              background: '#334155',
              color: '#f8fafc',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'background 0.2s',
            }}
          >
            Send Feedback
          </a>
        </div>
      </section>

      {/* Social proof / FAQ */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px',
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '24px' }}>
          FAQ
        </h2>
        {[
          { q: 'Is it really free?', a: 'Yes. Free forever. No account, no data collection, no catch. We make money from restaurant partnerships, not from you.' },
          { q: 'Does it work for all restaurants?', a: 'Eddy covers 60+ restaurants near UT campus and 665+ across Austin. If a restaurant has its own ordering system, Eddy will find it.' },
          { q: 'Is the food the same?', a: 'Identical. Same restaurant, same kitchen, same menu. You\'re just ordering through the restaurant\'s own website instead of a delivery app.' },
          { q: 'What about delivery?', a: 'Many restaurants offer their own delivery. For pickup orders, the savings are even bigger. Eddy shows you all your options.' },
          { q: 'How much will I actually save?', a: 'Delivery apps mark up prices 15-30% and add service fees. Most students save $3-8 per order. At 3 orders/week, that\'s $240/semester.' },
        ].map((item) => (
          <details key={item.q} style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '8px',
            cursor: 'pointer',
          }}>
            <summary style={{ fontWeight: 600, fontSize: '15px', listStyle: 'none' }}>
              {item.q}
            </summary>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '12px', lineHeight: 1.6 }}>
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* Final CTA */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>
          Your wallet will thank you
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '16px' }}>
          Takes 10 seconds to install. Saves you money on literally every order.
        </p>
        <a
          href={CWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f97316',
            color: '#fff',
            fontWeight: 700,
            fontSize: '18px',
            padding: '16px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
          }}
        >
          Add to Chrome — Free
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#475569',
      }}>
        <a href="https://eddy.delivery" style={{ color: '#64748b', textDecoration: 'none' }}>
          eddy.delivery
        </a>
        {' · '}
        Hook &apos;em 🤘
      </footer>
    </main>
    </>
  );
}
