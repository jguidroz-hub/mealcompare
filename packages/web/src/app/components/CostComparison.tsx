'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getProfile,
  hasProfile,
  calculateCosts,
  getSavingsSummary,
  type CostBreakdown,
} from '@/lib/benefits';

interface Props {
  restaurantName: string;
}

export default function CostComparison({ restaurantName }: Props) {
  const [orderAmount, setOrderAmount] = useState(25);
  const [hasBenefits, setHasBenefits] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasBenefits(hasProfile());
  }, []);

  const profile = useMemo(() => (mounted ? getProfile() : null), [mounted]);

  const costs = useMemo(() => {
    if (!profile) return [];
    return calculateCosts(orderAmount, profile);
  }, [orderAmount, profile]);

  const summary = useMemo(() => {
    if (costs.length === 0) return null;
    return getSavingsSummary(costs);
  }, [costs]);

  if (!mounted) return null;

  // If user has no benefits set up, show the setup prompt
  if (!hasBenefits) {
    return (
      <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
            What&apos;s your REAL cost?
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
            Add your credit cards and memberships to see personalized pricing across every platform.
          </p>
          <Link
            href="/my-benefits"
            style={{
              display: 'inline-block', padding: '10px 24px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Set Up My Benefits →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Your Real Cost
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
            Based on your cards & memberships
          </div>
        </div>
        <Link href="/my-benefits" style={{ fontSize: 11, color: '#64748b', textDecoration: 'none' }}>
          Edit ⚙️
        </Link>
      </div>

      {/* Order amount slider */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Order amount</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>${orderAmount}</span>
        </div>
        <input
          type="range"
          min={10}
          max={80}
          step={5}
          value={orderAmount}
          onChange={e => setOrderAmount(Number(e.target.value))}
          style={{
            width: '100%', height: 4, borderRadius: 2,
            appearance: 'none', background: 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 4 }}>
          <span>$10</span>
          <span>$80</span>
        </div>
      </div>

      {/* Platform comparison */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {costs.map((cost, i) => (
          <PlatformRow
            key={cost.platform}
            cost={cost}
            isBest={i === 0}
            isWorst={i === costs.length - 1}
            expanded={expanded === cost.platform}
            onToggle={() => setExpanded(expanded === cost.platform ? null : cost.platform)}
          />
        ))}
      </div>

      {/* Savings summary */}
      {summary && summary.savingsAmount > 0.5 && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>
            Save ${summary.savingsAmount.toFixed(2)} with {summary.bestPlatform.platformLabel} vs {summary.worstPlatform.platformLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function PlatformRow({ cost, isBest, isWorst, expanded, onToggle }: {
  cost: CostBreakdown;
  isBest: boolean;
  isWorst: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const platformEmoji: Record<string, string> = {
    doordash: '🔴',
    ubereats: '🟢',
    grubhub: '🟠',
    direct: '🏪',
  };

  const benefitsApplied = cost.creditCardReward + cost.membershipDeliverySaved + cost.membershipDiscountSaved + cost.creditApplied;

  return (
    <div
      style={{
        background: isBest ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isBest ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12, overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '12px 14px', cursor: 'pointer',
          background: 'transparent', border: 'none', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{platformEmoji[cost.platform] || '📦'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: isBest ? '#10b981' : '#e2e8f0' }}>
              {cost.platformLabel}
              {isBest && <span style={{ fontSize: 10, marginLeft: 6, color: '#10b981' }}>BEST DEAL</span>}
            </div>
            {benefitsApplied > 0.01 && (
              <div style={{ fontSize: 11, color: '#10b981', marginTop: 1 }}>
                ${benefitsApplied.toFixed(2)} in benefits applied
              </div>
            )}
            {cost.hasMembership && (
              <div style={{ fontSize: 10, color: '#3b82f6', marginTop: 1 }}>
                ✓ Membership active
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {benefitsApplied > 0.01 && (
            <div style={{ fontSize: 11, color: '#475569', textDecoration: 'line-through' }}>
              ${cost.totalBeforeBenefits.toFixed(2)}
            </div>
          )}
          <div style={{
            fontSize: 18, fontWeight: 900,
            color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#e2e8f0',
          }}>
            ${cost.effectiveTotal.toFixed(2)}
          </div>
        </div>
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div style={{ padding: '0 14px 12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ paddingTop: 10, fontSize: 12, color: '#64748b', lineHeight: 2 }}>
            <Row label="Menu price" value={cost.subtotal} />
            <Row label="Delivery fee" value={cost.deliveryFee} strike={cost.membershipDeliverySaved > 0} />
            {cost.serviceFee > 0 && <Row label="Service fee" value={cost.serviceFee} />}
            {cost.smallOrderFee > 0 && <Row label="Small order fee" value={cost.smallOrderFee} />}
            <Row label="Tax" value={cost.tax} />
            <Row label="Tip" value={cost.tip} />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
            {cost.creditCardReward > 0 && (
              <Row label={`${cost.bestCard?.issuer} ${cost.bestCard?.name} rewards`} value={-cost.creditCardReward} green />
            )}
            {cost.membershipDeliverySaved > 0 && (
              <Row label="Membership: free delivery" value={-cost.membershipDeliverySaved} green />
            )}
            {cost.membershipDiscountSaved > 0 && (
              <Row label="Membership: order discount" value={-cost.membershipDiscountSaved} green />
            )}
            {cost.creditApplied > 0 && (
              <Row label="Monthly credit applied" value={-cost.creditApplied} green />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, strike, green }: {
  label: string; value: number; strike?: boolean; green?: boolean;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{label}</span>
      <span style={{
        fontWeight: 600,
        textDecoration: strike ? 'line-through' : 'none',
        color: green ? '#10b981' : undefined,
      }}>
        {value < 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
