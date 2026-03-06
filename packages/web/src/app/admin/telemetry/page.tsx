'use client';

import { useState, useEffect } from 'react';

interface TelemetryData {
  period: string;
  activeUsers: { dau: number; wau: number; mau: number };
  installs: {
    total: number;
    unique_refs: number;
    attributed: number;
    byRef: Array<{ ref: string; installs: number }>;
  };
  engagement: {
    topMatches: Array<{ restaurant: string; impressions: number; unique_users: number }>;
    likelyOrders: { total_likely_orders: number; unique_converters: number; unique_restaurants: number };
    referralClicks: { total_clicks: number; unique_restaurants: number };
  };
  gaps: {
    noMatchRestaurants: Array<{ restaurant: string; metro: string; searches: number; unique_users: number }>;
    noMatchCount: number;
  };
  byCampus: Array<{ campus: string; users: number; events: number }>;
  dailyActivity: Array<{
    day: string;
    active_users: number;
    overlays: number;
    no_matches: number;
    likely_orders: number;
    installs: number;
  }>;
}

export default function TelemetryDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/telemetry?key=${encodeURIComponent(key)}&days=30`);
      if (!res.ok) {
        setError(`Error ${res.status}: ${res.statusText}`);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const s: React.CSSProperties = {
    background: '#0f172a', color: '#e2e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh', padding: '24px',
  };
  const card: React.CSSProperties = {
    background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '16px',
  };
  const metric: React.CSSProperties = {
    fontSize: '32px', fontWeight: 800, color: '#22c55e',
  };
  const label: React.CSSProperties = {
    fontSize: '12px', color: '#64748b', marginTop: '4px',
  };

  if (!data) {
    return (
      <div style={s}>
        <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>🔐 Eddy Telemetry</h1>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            style={{
              width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155',
              borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px',
            }}
          />
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'View Dashboard'}
          </button>
          {error && <p style={{ color: '#f87171', marginTop: '12px', fontSize: '13px' }}>{error}</p>}
        </div>
      </div>
    );
  }

  const au = data.activeUsers;
  const ins = data.installs;
  const eng = data.engagement;
  const gaps = data.gaps;

  return (
    <div style={s}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>📊 Eddy Telemetry Dashboard</h1>
          <button onClick={fetchData} style={{ background: '#334155', color: '#e2e8f0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Refresh
          </button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { val: au.dau, lbl: 'DAU', color: '#22c55e' },
            { val: au.wau, lbl: 'WAU', color: '#3b82f6' },
            { val: au.mau, lbl: 'MAU', color: '#8b5cf6' },
            { val: ins.total, lbl: 'Total Installs', color: '#f97316' },
            { val: eng.referralClicks.total_clicks, lbl: 'Direct Clicks (30d)', color: '#22c55e' },
            { val: eng.likelyOrders.total_likely_orders, lbl: 'Likely Orders (30d)', color: '#eab308' },
          ].map((m, i) => (
            <div key={i} style={card}>
              <div style={{ ...metric, color: m.color }}>{m.val}</div>
              <div style={label}>{m.lbl}</div>
            </div>
          ))}
        </div>

        {/* Ambassador Attribution */}
        {ins.byRef.length > 0 && (
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>🎓 Ambassador Installs</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', color: '#64748b' }}>Ref</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', color: '#64748b' }}>Installs</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', color: '#64748b' }}>Payout</th>
                </tr>
              </thead>
              <tbody>
                {ins.byRef.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '8px 0', fontSize: '14px' }}>{r.ref}</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right', fontWeight: 700 }}>{r.installs}</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right', color: '#f87171' }}>${Number(r.installs) * 5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              {ins.attributed} of {ins.total} installs attributed ({ins.total > 0 ? Math.round(Number(ins.attributed) / Number(ins.total) * 100) : 0}%)
            </div>
          </div>
        )}

        {/* Campus Breakdown */}
        {data.byCampus.length > 0 && (
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>🏫 By Campus</h2>
            {data.byCampus.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #0f172a' }}>
                <span style={{ fontSize: '14px' }}>{c.campus}</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{c.users} users</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Top Matched Restaurants */}
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>🏪 Top Restaurants (matched)</h2>
            {eng.topMatches.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span>{r.restaurant}</span>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>{r.impressions} hits</span>
              </div>
            ))}
          </div>

          {/* No-Match Restaurants (Toast Pitch) */}
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>⚠️ No Direct Ordering (Toast pitch)</h2>
            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
              Users searched but no direct link found — {gaps.noMatchCount} total searches
            </p>
            {gaps.noMatchRestaurants.slice(0, 15).map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                <span>{r.restaurant} <span style={{ color: '#64748b', fontSize: '11px' }}>({r.metro})</span></span>
                <span style={{ color: '#f97316', fontWeight: 600 }}>{r.searches}× / {r.unique_users} users</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activity */}
        {data.dailyActivity.length > 0 && (
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>📈 Daily Activity</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Date</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px' }}>Users</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px' }}>Overlays</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px' }}>No Match</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px' }}>Orders</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px' }}>Installs</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dailyActivity.slice(0, 14).map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #0f172a' }}>
                      <td style={{ padding: '6px 8px' }}>{d.day}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{d.active_users}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right' }}>{d.overlays}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#f97316' }}>{d.no_matches}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#22c55e' }}>{d.likely_orders}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#3b82f6' }}>{d.installs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#475569', padding: '24px' }}>
          Eddy Telemetry · Data refreshes on page load · {data.period}
        </div>
      </div>
    </div>
  );
}
