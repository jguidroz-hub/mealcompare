'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CREDIT_CARDS,
  MEMBERSHIPS,
  getProfile,
  saveProfile,
  type BenefitsProfile,
  type CreditCard,
  type Membership,
} from '@/lib/benefits';

export default function MyBenefitsPage() {
  const [profile, setProfile] = useState<BenefitsProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) return null;

  const toggleCard = (cardId: string) => {
    const updated = { ...profile };
    if (updated.cards.includes(cardId)) {
      updated.cards = updated.cards.filter(id => id !== cardId);
    } else {
      updated.cards = [...updated.cards, cardId];
    }
    setProfile(updated);
    saveProfile(updated);
    flashSaved();
  };

  const toggleMembership = (memId: string) => {
    const updated = { ...profile };
    if (updated.memberships.includes(memId)) {
      updated.memberships = updated.memberships.filter(id => id !== memId);
    } else {
      updated.memberships = [...updated.memberships, memId];
    }
    setProfile(updated);
    saveProfile(updated);
    flashSaved();
  };

  const setTip = (pct: number) => {
    const updated = { ...profile, defaultTipPercent: pct };
    setProfile(updated);
    saveProfile(updated);
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const groupedCards = CREDIT_CARDS.reduce<Record<string, CreditCard[]>>((acc, card) => {
    if (!acc[card.issuer]) acc[card.issuer] = [];
    acc[card.issuer].push(card);
    return acc;
  }, {});

  const selectedCount = profile.cards.length + profile.memberships.length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,15,26,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          maxWidth: 640, margin: '0 auto', padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
            ← Back
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {saved && (
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Saved</span>
            )}
            <span style={{ fontSize: 20 }}>🌊</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: '#e2e8f0', marginBottom: 8 }}>
            My Benefits
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
            Tell Eddy about your credit cards and memberships. We&apos;ll calculate your <strong style={{ color: '#10b981' }}>true cost</strong> on every platform.
          </p>
        </div>

        {/* Summary badge */}
        {selectedCount > 0 && (
          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 24, textAlign: 'center',
          }}>
            <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>
              {profile.cards.length} card{profile.cards.length !== 1 ? 's' : ''} · {profile.memberships.length} membership{profile.memberships.length !== 1 ? 's' : ''} configured
            </span>
          </div>
        )}

        {/* Credit Cards */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
            Credit Cards
          </h2>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
            Select the cards you use for food delivery. We&apos;ll factor in rewards and monthly credits.
          </p>

          {Object.entries(groupedCards).map(([issuer, cards]) => (
            <div key={issuer} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 8 }}>
                {issuer}
              </div>
              {cards.map(card => {
                const selected = profile.cards.includes(card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      background: selected ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${selected ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 12, padding: '12px 16px', marginBottom: 8,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: selected ? '#10b981' : '#e2e8f0' }}>
                        {card.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {card.diningMultiplier}x dining ({(card.diningMultiplier * card.pointValueCents).toFixed(1)}% back)
                        {card.monthlyCredits && card.monthlyCredits.length > 0 && (
                          <> · {card.monthlyCredits.map(c => `$${(c.amountCents/100).toFixed(0)}/mo ${c.platform}`).join(', ')}</>
                        )}
                        {card.annualFee ? ` · $${card.annualFee}/yr fee` : ' · No fee'}
                      </div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      border: `2px solid ${selected ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
                      background: selected ? '#10b981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {selected && <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </section>

        {/* Memberships */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
            Delivery Memberships
          </h2>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
            Free delivery and reduced fees add up. Select the ones you have.
          </p>

          {MEMBERSHIPS.map(mem => {
            const selected = profile.memberships.includes(mem.id);
            return (
              <button
                key={mem.id}
                onClick={() => toggleMembership(mem.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  background: selected ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12, padding: '12px 16px', marginBottom: 8,
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: selected ? '#3b82f6' : '#e2e8f0' }}>
                    {mem.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    ${mem.monthlyCost}/mo · Free delivery on ${mem.freeDeliveryMinOrder}+ orders
                    {mem.orderDiscount > 0 && ` · ${(mem.orderDiscount * 100).toFixed(0)}% off orders`}
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${selected ? '#3b82f6' : 'rgba(255,255,255,0.15)'}`,
                  background: selected ? '#3b82f6' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {selected && <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>✓</span>}
                </div>
              </button>
            );
          })}
        </section>

        {/* Default Tip */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
            Default Tip
          </h2>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
            Used for cost estimates. You can always change it per order.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 10, 15, 18, 20, 25].map(pct => (
              <button
                key={pct}
                onClick={() => setTip(pct)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                  fontWeight: 700, fontSize: 14,
                  background: profile.defaultTipPercent === pct ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${profile.defaultTipPercent === pct ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: profile.defaultTipPercent === pct ? '#10b981' : '#64748b',
                  transition: 'all 0.15s',
                }}
              >
                {pct}%
              </button>
            ))}
          </div>
        </section>

        {/* Privacy note */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 16, textAlign: 'center', marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
            🔒 Your benefits are stored locally on this device. Nothing is sent to our servers. 
            Clear your browser data to reset.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/restaurants"
          style={{
            display: 'flex', justifyContent: 'center', width: '100%',
            padding: '16px 24px', fontSize: 16, fontWeight: 800,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', borderRadius: 14, textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          🔍 Compare Restaurants With My Benefits
        </Link>
      </div>
    </div>
  );
}
