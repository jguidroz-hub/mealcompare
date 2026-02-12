import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MealCompare — Stop Overpaying for Food Delivery',
  description: 'Compare total costs across DoorDash, Uber Eats, Grubhub & direct ordering. See delivery fees, service fees, and menu markups. Save $5-15 on every order.',
  openGraph: {
    title: 'MealCompare — Stop Overpaying for Food Delivery',
    description: 'The same order. Different prices. Find the cheapest way to get your food delivered.',
    type: 'website',
    url: 'https://mealcompare.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MealCompare — Stop Overpaying for Food Delivery',
    description: 'Compare total costs across DoorDash, Uber Eats, Grubhub & direct ordering.',
  },
};

const styles = {
  page: { background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh' } as const,
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' } as const,
  nav: { display: 'flex' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, padding: '20px 0' },
  badge: { display: 'inline-block', background: '#1e293b', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#10b981', fontWeight: 600 as const, marginBottom: '24px' },
  h1: { fontSize: '52px', fontWeight: 800 as const, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '19px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 40px' },
  greenBtn: { background: '#10b981', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' as const, fontWeight: 700 as const, fontSize: '16px', display: 'inline-flex' as const, alignItems: 'center' as const, gap: '8px', border: 'none', cursor: 'pointer' as const },
  outlineBtn: { background: '#1e293b', color: '#e2e8f0', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' as const, fontWeight: 600 as const, fontSize: '16px', border: '1px solid #334155' },
  card: { background: '#1e293b', borderRadius: '16px', padding: '28px', border: '1px solid #334155' },
  sectionTitle: { fontSize: '36px', fontWeight: 800 as const, textAlign: 'center' as const, marginBottom: '16px' },
  sectionSubtitle: { fontSize: '16px', color: '#94a3b8', textAlign: 'center' as const, maxWidth: '600px', margin: '0 auto 48px' },
};

function QuoteRow({ name, total, service, delivery, tag, tagColor, icon, isBest }: {
  name: string; total: string; service: string; delivery: string; tag: string; tagColor: string; icon: string; isBest?: boolean;
}) {
  return (
    <div style={{
      background: isBest ? 'rgba(16, 185, 129, 0.1)' : '#0f172a',
      borderRadius: '10px', padding: '14px 16px', marginBottom: '8px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      border: isBest ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Service: {service} · Delivery: {delivery}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' as const }}>
        <div style={{ fontWeight: 700, fontSize: '16px' }}>{total}</div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'white', background: tagColor, padding: '2px 6px', borderRadius: '4px' }}>{tag}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main style={styles.page}>
      {/* Nav */}
      <div style={styles.container}>
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>🍔</span>
            <span style={{ fontSize: '20px', fontWeight: 800 }}>MealCompare</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#how-it-works" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>How It Works</a>
            <a href="#savings" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Savings</a>
            <a href="#faq" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>FAQ</a>
            <Link href="/install" style={{ ...styles.greenBtn, padding: '8px 20px', fontSize: '14px' }}>
              Install Extension
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={styles.badge}>💰 Average savings: $5-15 per order</div>
        <h1 style={styles.h1}>
          Stop Overpaying for<br />Food Delivery
        </h1>
        <p style={styles.subtitle}>
          The same order costs different amounts on every platform.
          MealCompare shows you the cheapest option — including delivery fees,
          service fees, and direct ordering — in one click.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/install" style={styles.greenBtn}>
            🧩 Install Chrome Extension — Free
          </Link>
          <a href="#how-it-works" style={styles.outlineBtn}>See How It Works</a>
        </div>
        <p style={{ fontSize: '13px', color: '#475569', marginTop: '16px' }}>
          Available in Austin, TX and Washington, DC · More cities coming soon
        </p>
      </section>

      {/* Live Example */}
      <section id="savings" style={{ maxWidth: '640px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Real comparison — Chipotle family order</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>📍 Chipotle — 3 items</div>
            </div>
            <div style={{ background: '#10b981', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>$12.10</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>saved</div>
            </div>
          </div>
          <QuoteRow name="Direct Order" total="$46.08" service="$0.00" delivery="$4.99" tag="BEST PRICE" tagColor="#10b981" icon="🏪" isBest />
          <QuoteRow name="Grubhub" total="$55.12" service="$4.93" delivery="$4.99" tag="+$9.04" tagColor="#ef4444" icon="🟠" />
          <QuoteRow name="Uber Eats" total="$58.18" service="$6.38" delivery="$4.99" tag="+$12.10" tagColor="#ef4444" icon="🟢" />
          <QuoteRow name="DoorDash" total="$57.43" service="$5.87" delivery="$3.99" tag="+$11.35" tagColor="#ef4444" icon="🔴" />
          <p style={{ fontSize: '11px', color: '#475569', textAlign: 'center', marginTop: '12px' }}>
            ✅ = verified prices from Uber Eats API · 📊 = estimated from fee models
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionSubtitle}>
          MealCompare runs automatically while you browse delivery apps. No extra steps.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🛒', title: 'Add to Cart', desc: 'Browse DoorDash, Uber Eats, or Grubhub like normal. Add items to your cart.' },
            { icon: '⚡', title: 'Auto-Compare', desc: 'MealCompare detects your cart and instantly finds the same items on other platforms + direct ordering.' },
            { icon: '💰', title: 'See Total Costs', desc: 'Compare the FULL cost — food + delivery fee + service fee + tax. Not just menu prices.' },
            { icon: '🔗', title: 'One-Click Switch', desc: 'Found a better deal? Click to open the order on the cheaper platform. Deep links pre-fill your cart.' },
          ].map((step, i) => (
            <div key={i} style={{ ...styles.card, textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{step.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{step.title}</div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Hidden Fees */}
      <section style={{ padding: '80px 24px', background: '#1e293b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: '40px' }}>
            The Fees They Don&apos;t Want You to See
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              { label: 'Menu Markup', value: '15-20%', desc: 'Platforms charge restaurants 28-33% commission. Restaurants raise menu prices to compensate.' },
              { label: 'Service Fee', value: '$2-10', desc: 'Percentage of your subtotal. Goes to the platform, not your driver or restaurant.' },
              { label: 'Delivery Fee', value: '$2-8', desc: 'Varies by distance, demand, and whether you have a subscription. Surge pricing is real.' },
              { label: 'Small Order Fee', value: '$2-3', desc: 'Order under $12-15? You get surcharged. Ordering direct has no minimums.' },
            ].map((fee, i) => (
              <div key={i} style={{ background: '#0f172a', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', marginBottom: '4px' }}>{fee.value}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>{fee.label}</div>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{fee.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: '#e2e8f0' }}>
            <strong>Ordering direct saves 20-30% on average.</strong> MealCompare finds the direct ordering link for you.
          </p>
        </div>
      </section>

      {/* Real Savings Examples */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={styles.sectionTitle}>Real Savings, Real Orders</h2>
        <p style={styles.sectionSubtitle}>
          Actual price comparisons from Austin and DC restaurants.
        </p>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { restaurant: 'Chipotle (Family order, 3 items)', city: 'DC', savings: '$12.10', best: 'Direct', worst: 'Uber Eats' },
            { restaurant: 'Whataburger (#1 Combo)', city: 'Austin', savings: '$4.87', best: 'Direct', worst: 'DoorDash' },
            { restaurant: 'CAVA (Greens Bowl + Pita Chips)', city: 'DC', savings: '$6.23', best: 'Grubhub', worst: 'Uber Eats' },
            { restaurant: "Torchy's Tacos (2 tacos + queso)", city: 'Austin', savings: '$5.40', best: 'Direct', worst: 'Uber Eats' },
          ].map((ex, i) => (
            <div key={i} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{ex.restaurant}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {ex.city} · Best: {ex.best} · Worst: {ex.worst}</div>
              </div>
              <div style={{ background: '#10b981', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontWeight: 800, color: 'white' }}>{ex.savings} saved</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 24px', background: '#1e293b' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: '40px' }}>FAQ</h2>
          {[
            { q: 'Is MealCompare really free?', a: 'Yes, completely free. No premium tier, no hidden fees. We plan to monetize through affiliate partnerships with restaurants that offer direct ordering.' },
            { q: 'How do you get the prices?', a: 'We use public APIs and menu data from delivery platforms. Uber Eats prices come directly from their API. DoorDash and Grubhub prices are estimated based on known fee structures and verified with real orders.' },
            { q: 'What cities do you support?', a: 'Currently Austin, TX and Washington, DC. We\'re expanding to more cities — join the waitlist to get notified when we launch in yours.' },
            { q: 'Do you include ALL fees?', a: 'Yes! We compare total cost: food + service fee + delivery fee + small order fee + tax. This is the real number you pay, not just the menu price.' },
            { q: 'What is "direct ordering"?', a: 'Many restaurants let you order delivery directly through their website (often powered by Toast or Square). Since they don\'t pay a 28-33% platform commission, prices are typically 10-20% cheaper with no service fee.' },
            { q: 'Does it work with DashPass/Uber One/Grubhub+?', a: 'Not yet — subscriber pricing is coming soon. For now, comparisons use standard (non-subscriber) fees.' },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
          Start Saving on Every Order
        </h2>
        <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Install MealCompare and never overpay for food delivery again.
          Free forever. No account needed.
        </p>
        <Link href="/install" style={styles.greenBtn}>
          🧩 Install Chrome Extension — Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid #1e293b', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#475569' }}>
          © 2026 MealCompare · <a href="mailto:hello@mealcompare.app" style={{ color: '#64748b' }}>Contact</a> · Made in Austin, TX & Washington, DC
        </p>
      </footer>
    </main>
  );
}
