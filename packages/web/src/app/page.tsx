export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
        🍔 MealCompare
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', textAlign: 'center', lineHeight: 1.6 }}>
        The same order. Different prices. We find the cheapest way to get your food delivered — across DoorDash, Uber Eats, Grubhub, and direct restaurant ordering.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <a
          href="#"
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          Install Chrome Extension
        </a>
      </div>
      <p style={{ marginTop: '3rem', fontSize: '0.875rem', color: '#475569' }}>
        Currently available in Austin, TX and Washington, DC
      </p>
    </main>
  );
}
