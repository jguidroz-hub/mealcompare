export default function OfflinePage() {
  return (
    <main style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You&apos;re offline</h1>
        <p style={{ fontSize: 14, color: '#94a3b8' }}>
          Eddy needs an internet connection to compare prices. Check your connection and try again.
        </p>
      </div>
    </main>
  );
}
