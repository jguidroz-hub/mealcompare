export default function OfflinePage() {
  return (
    <main style={{ background: '#fff', color: '#111', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You&apos;re offline</h1>
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Eddy needs an internet connection to search restaurants. Check your connection and try again.
        </p>
      </div>
    </main>
  );
}
