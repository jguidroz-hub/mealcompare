'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const METRO_INFO: Record<string, { label: string; emoji: string }> = {
  nyc: { label: 'New York', emoji: '🗽' }, chicago: { label: 'Chicago', emoji: '🌆' },
  la: { label: 'Los Angeles', emoji: '🌴' }, sf: { label: 'San Francisco', emoji: '🌉' },
  boston: { label: 'Boston', emoji: '🏛️' }, miami: { label: 'Miami', emoji: '🌊' },
  dc: { label: 'Washington DC', emoji: '🏛️' }, austin: { label: 'Austin', emoji: '🤘' },
  houston: { label: 'Houston', emoji: '🚀' }, atlanta: { label: 'Atlanta', emoji: '🍑' },
  seattle: { label: 'Seattle', emoji: '☕' }, denver: { label: 'Denver', emoji: '🏔️' },
  philly: { label: 'Philadelphia', emoji: '🔔' }, nashville: { label: 'Nashville', emoji: '🎸' },
  nola: { label: 'New Orleans', emoji: '⚜️' }, dallas: { label: 'Dallas', emoji: '⛳' },
  phoenix: { label: 'Phoenix', emoji: '🌵' }, portland: { label: 'Portland', emoji: '🌲' },
  detroit: { label: 'Detroit', emoji: '🚗' }, minneapolis: { label: 'Minneapolis', emoji: '❄️' },
  charlotte: { label: 'Charlotte', emoji: '👑' }, tampa: { label: 'Tampa', emoji: '🌞' },
  sandiego: { label: 'San Diego', emoji: '🏖️' }, stlouis: { label: 'St Louis', emoji: '🏗️' },
  pittsburgh: { label: 'Pittsburgh', emoji: '🌉' }, columbus: { label: 'Columbus', emoji: '🏈' },
  indianapolis: { label: 'Indianapolis', emoji: '🏎️' }, milwaukee: { label: 'Milwaukee', emoji: '🍺' },
  raleigh: { label: 'Raleigh', emoji: '🌳' }, baltimore: { label: 'Baltimore', emoji: '🦀' },
};

const METRO_ORDER = ['nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta','seattle','denver','philly','nashville','nola','dallas','phoenix','portland','detroit','minneapolis','charlotte','tampa','sandiego','stlouis','pittsburgh','columbus','indianapolis','milwaukee','raleigh','baltimore'];

interface MetroStats { total: number; direct: number }

export default function RestaurantsCityPicker() {
  const [stats, setStats] = useState<Record<string, MetroStats> | null>(null);
  const [totals, setTotals] = useState({ totalRestaurants: 0, totalDirect: 0, metros: 30 });

  useEffect(() => {
    fetch('/api/metro-stats')
      .then(r => r.json())
      .then(data => {
        setStats(data.stats);
        setTotals({ totalRestaurants: data.totalRestaurants, totalDirect: data.totalDirect, metros: data.metros });
      })
      .catch(() => {});
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 800 }}>Eddy</span>
          </Link>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Link href="/how-it-works" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>How It Works</Link>
            <Link href="/savings" style={{ fontSize: 13, color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>💰 Calculator</Link>
            <Link href="/for-restaurants" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>For Restaurants</Link>
          </div>
        </div>
      </header>

      <div className="bg-glow" style={{ position: 'relative', textAlign: 'center', padding: '48px 16px 32px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Choose your <span className="gradient-text">city</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>
            {totals.totalRestaurants > 0 ? `${totals.totalRestaurants.toLocaleString()} restaurants · ${totals.totalDirect.toLocaleString()} direct ordering links · ${totals.metros} cities` : '30 cities · Thousands of restaurants'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10 }}>
          {METRO_ORDER.map(id => {
            const info = METRO_INFO[id];
            const s = stats?.[id];
            return (
              <Link
                key={id}
                href={`/restaurants/${id}`}
                className="glass-card glass-card-hover"
                style={{ padding: '16px 14px', textDecoration: 'none', color: '#e2e8f0', display: 'block' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{info.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{info.label}</span>
                </div>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                  {s ? `${s.direct} direct · ${s.total} total` : 'Loading...'}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
          Don&apos;t see your city? We&apos;re expanding fast.
        </p>
        <Link href="/install" className="btn-glow" style={{ padding: '12px 28px', fontSize: 14 }}>
          🧩 Install Extension — Works Everywhere
        </Link>
      </div>
    </main>
  );
}
