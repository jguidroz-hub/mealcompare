import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useShareIntent, ShareIntent } from 'expo-share-intent';

const API_BASE = 'https://skipthefee.vercel.app';

// ─── Types ─────────────────────────────────────────────────────
interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
}

interface ComparisonQuote {
  platform: string;
  total: number;
  savings: number;
  deepLink: string;
  fees: {
    subtotal: number;
    platformMarkup: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  };
  estimatedMinutes: number | null;
}

// ─── Helpers ───────────────────────────────────────────────────
function formatCents(cents: number): string {
  return `$${(Math.abs(cents) / 100).toFixed(2)}`;
}

function extractRestaurantFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // DoorDash: /store/restaurant-name-123456/
    if (u.hostname.includes('doordash')) {
      const match = u.pathname.match(/\/store\/([^/]+)/);
      if (match) return match[1].replace(/-\d+$/, '').replace(/-/g, ' ');
    }
    // Uber Eats: /store/restaurant-name/hash
    if (u.hostname.includes('ubereats')) {
      const match = u.pathname.match(/\/store\/([^/]+)/);
      if (match) return match[1].replace(/-/g, ' ');
    }
    // Grubhub: /restaurant/restaurant-name/hash
    if (u.hostname.includes('grubhub')) {
      const match = u.pathname.match(/\/restaurant\/([^/]+)/);
      if (match) return match[1].replace(/-/g, ' ');
    }
  } catch {}
  return null;
}

function addUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'skipthefee');
    u.searchParams.set('utm_medium', 'app');
    u.searchParams.set('ref', 'skipthefee');
    return u.toString();
  } catch {
    return url;
  }
}

// ─── Main App ──────────────────────────────────────────────────
export default function App() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();
  const [screen, setScreen] = useState<'home' | 'search' | 'result'>('home');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedMetro, setSelectedMetro] = useState('nyc');
  const [sharedRestaurant, setSharedRestaurant] = useState<string | null>(null);

  // Handle incoming share intent
  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      handleShareIntent(shareIntent);
    }
  }, [hasShareIntent, shareIntent]);

  const handleShareIntent = useCallback((intent: ShareIntent) => {
    const text = intent.text || '';
    const url = intent.webUrl || '';

    // Try to extract restaurant name from URL
    let restaurantName = extractRestaurantFromUrl(url) || extractRestaurantFromUrl(text);

    // If no URL, try the shared text directly
    if (!restaurantName && text) {
      restaurantName = text.trim();
    }

    if (restaurantName) {
      setSharedRestaurant(restaurantName);
      setQuery(restaurantName);
      setScreen('search');
      searchRestaurants(restaurantName);
    }

    resetShareIntent();
  }, []);

  const searchRestaurants = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/restaurants?metro=${selectedMetro}`);
      const data = await res.json();
      const all: Restaurant[] = data.restaurants || [];

      const filtered = all.filter(r =>
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        q.toLowerCase().includes(r.name.toLowerCase())
      );

      setRestaurants(filtered.length > 0 ? filtered : all.slice(0, 20));
    } catch {
      setRestaurants([]);
    }
    setLoading(false);
  };

  const trackClick = (restaurant: Restaurant) => {
    const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: restaurant.name,
        slug,
        metro: selectedMetro,
        source: 'app',
        directUrl: restaurant.directUrl,
      }),
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={S.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => { setScreen('home'); setQuery(''); setRestaurants([]); }}>
          <Text style={S.logo}>💰 <Text style={S.logoText}>SkipTheFee</Text></Text>
        </TouchableOpacity>
      </View>

      {screen === 'home' ? (
        <HomeScreen
          onSearch={() => setScreen('search')}
          selectedMetro={selectedMetro}
          onMetroChange={setSelectedMetro}
        />
      ) : (
        <SearchScreen
          query={query}
          onQueryChange={(q) => { setQuery(q); if (q.length > 2) searchRestaurants(q); }}
          loading={loading}
          restaurants={restaurants}
          onSearch={() => searchRestaurants(query)}
          sharedRestaurant={sharedRestaurant}
          onTrack={trackClick}
          selectedMetro={selectedMetro}
          onMetroChange={(m) => { setSelectedMetro(m); }}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Home Screen ───────────────────────────────────────────────
function HomeScreen({ onSearch, selectedMetro, onMetroChange }: {
  onSearch: () => void;
  selectedMetro: string;
  onMetroChange: (m: string) => void;
}) {
  return (
    <ScrollView style={S.content} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Hero */}
      <View style={S.hero}>
        <Text style={S.heroBadge}>💰 Save $5–15 per order</Text>
        <Text style={S.heroTitle}>
          Stop overpaying for{'\n'}
          <Text style={S.gradientText}>food delivery</Text>
        </Text>
        <Text style={S.heroSub}>
          Share a restaurant link from DoorDash, Uber Eats, or Grubhub — we'll find the cheapest way to order.
        </Text>

        <TouchableOpacity style={S.primaryBtn} onPress={onSearch}>
          <Text style={S.primaryBtnText}>🔍 Search Restaurants</Text>
        </TouchableOpacity>
      </View>

      {/* How it works */}
      <View style={S.section}>
        <Text style={S.sectionTitle}>How it works</Text>
        {[
          { icon: '📱', title: 'Share from any app', desc: 'Tap Share on a DoorDash/UberEats/Grubhub restaurant page and select SkipTheFee' },
          { icon: '⚡', title: 'Instant comparison', desc: 'We check prices across all platforms + direct ordering in seconds' },
          { icon: '💰', title: 'Order cheaper', desc: 'Tap the cheapest option to open it directly — skip the middleman fees' },
        ].map((step, i) => (
          <View key={i} style={S.stepCard}>
            <Text style={{ fontSize: 28 }}>{step.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={S.stepTitle}>{step.title}</Text>
              <Text style={S.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={S.statsRow}>
        <View style={S.statCard}>
          <Text style={S.statValue}>15</Text>
          <Text style={S.statLabel}>Cities</Text>
        </View>
        <View style={S.statCard}>
          <Text style={S.statValue}>1,154+</Text>
          <Text style={S.statLabel}>Restaurants</Text>
        </View>
        <View style={S.statCard}>
          <Text style={S.statValue}>200+</Text>
          <Text style={S.statLabel}>Direct links</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Search Screen ─────────────────────────────────────────────
const METROS = [
  { id: 'nyc', label: 'NYC' }, { id: 'chicago', label: 'Chicago' },
  { id: 'la', label: 'LA' }, { id: 'sf', label: 'SF' },
  { id: 'boston', label: 'Boston' }, { id: 'miami', label: 'Miami' },
  { id: 'dc', label: 'DC' }, { id: 'austin', label: 'Austin' },
  { id: 'houston', label: 'Houston' }, { id: 'atlanta', label: 'Atlanta' },
  { id: 'seattle', label: 'Seattle' }, { id: 'denver', label: 'Denver' },
  { id: 'philly', label: 'Philly' }, { id: 'nashville', label: 'Nashville' },
  { id: 'nola', label: 'NOLA' },
];

function SearchScreen({ query, onQueryChange, loading, restaurants, onSearch, sharedRestaurant, onTrack, selectedMetro, onMetroChange }: {
  query: string;
  onQueryChange: (q: string) => void;
  loading: boolean;
  restaurants: Restaurant[];
  onSearch: () => void;
  sharedRestaurant: string | null;
  onTrack: (r: Restaurant) => void;
  selectedMetro: string;
  onMetroChange: (m: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* Search bar */}
      <View style={S.searchBar}>
        <TextInput
          style={S.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor="#475569"
          value={query}
          onChangeText={onQueryChange}
          onSubmitEditing={onSearch}
          autoFocus={!sharedRestaurant}
          returnKeyType="search"
        />
      </View>

      {/* Metro pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.pillScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {METROS.map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => onMetroChange(m.id)}
            style={selectedMetro === m.id ? S.pillActive : S.pill}
          >
            <Text style={selectedMetro === m.id ? S.pillActiveText : S.pillText}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Shared context banner */}
      {sharedRestaurant && (
        <View style={S.sharedBanner}>
          <Text style={S.sharedBannerText}>
            🔗 Shared: <Text style={{ fontWeight: '700' }}>{sharedRestaurant}</Text>
          </Text>
        </View>
      )}

      {/* Results */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {loading ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={{ color: '#64748b', marginTop: 12, fontSize: 14 }}>Searching restaurants...</Text>
          </View>
        ) : restaurants.length === 0 && query.length > 2 ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
            <Text style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>No results for &quot;{query}&quot;</Text>
          </View>
        ) : (
          restaurants.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} onTrack={onTrack} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ─── Restaurant Card ───────────────────────────────────────────
function RestaurantCard({ restaurant: r, onTrack }: { restaurant: Restaurant; onTrack: (r: Restaurant) => void }) {
  const hasDirect = !!r.directUrl;
  const platform = r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : r.hasWebsite ? 'Website' : null;

  const handlePress = () => {
    if (r.directUrl) {
      onTrack(r);
      Linking.openURL(addUtm(r.directUrl));
    }
  };

  return (
    <View style={S.card}>
      <View style={S.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={S.cardName}>{r.name}</Text>
          <Text style={S.cardCategory}>{r.category}</Text>
        </View>
        {hasDirect && (
          <View style={S.directBadge}>
            <Text style={S.directBadgeText}>{platform || 'Direct'}</Text>
          </View>
        )}
      </View>
      {hasDirect ? (
        <TouchableOpacity style={S.directBtn} onPress={handlePress} activeOpacity={0.8}>
          <Text style={S.directBtnText}>Order Direct — Skip the Fees →</Text>
        </TouchableOpacity>
      ) : (
        <Text style={S.noDirectText}>Compare prices with the Chrome extension</Text>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const S = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  logo: {
    fontSize: 22,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e2e8f0',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  heroBadge: {
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#e2e8f0',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 16,
  },
  gradientText: {
    color: '#10b981',
  },
  heroSub: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e2e8f0',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },

  // Search
  searchBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#e2e8f0',
    fontSize: 15,
  },
  pillScroll: {
    paddingTop: 12,
    maxHeight: 48,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginRight: 8,
  },
  pillActive: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#10b981',
    backgroundColor: 'rgba(16,185,129,0.12)',
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  pillActiveText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
  },

  // Shared banner
  sharedBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  sharedBannerText: {
    fontSize: 13,
    color: '#93c5fd',
  },

  // Cards
  card: {
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  cardCategory: {
    fontSize: 12,
    color: '#475569',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  directBadge: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  directBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10b981',
  },
  directBtn: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  directBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  noDirectText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
  },
});
