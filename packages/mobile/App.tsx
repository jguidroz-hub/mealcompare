import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking,
  TextInput, ActivityIndicator, SafeAreaView, StatusBar, Share,
} from 'react-native';
import { useShareIntent, ShareIntent } from 'expo-share-intent';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'https://eddy.delivery';

// ─── Brand Colors ──────────────────────────────────────────────
const C = {
  blue: '#2563EB',
  blueDark: '#1D4ED8',
  blueLight: '#EFF6FF',
  yellow: '#FACC15',
  yellowLight: '#FEF9C3',
  yellowDark: '#92400E',
  white: '#FFFFFF',
  bg: '#FFFFFF',
  black: '#111111',
  grey: '#6B7280',
  greyLight: '#F3F4F6',
  greyBorder: '#E5E7EB',
  red: '#DC2626',
};

// ─── Types ─────────────────────────────────────────────────────
interface Restaurant { name: string; category: string; directUrl: string | null; hasToast: boolean; hasSquare: boolean; hasWebsite: boolean; }
interface ComparisonQuote { platform: string; fees: { total: number; subtotal: number; serviceFee: number; deliveryFee: number; tax: number; discount: number }; deepLink: string; confidence: number; }
interface ComparisonResult { restaurantName: string; quotes: ComparisonQuote[]; savings: number; bestDeal: ComparisonQuote | null; promoCodes?: Array<{ platform: string; code: string; description: string; savingsCents: number }>; }
interface PromoCode { platform: string; code: string; description: string; discountType: string; firstOrderOnly: boolean; }

// ─── Metro data ────────────────────────────────────────────────
const METRO_COORDS: Record<string, { lat: number; lng: number }> = {
  nyc: { lat: 40.7128, lng: -74.006 }, chicago: { lat: 41.8781, lng: -87.6298 },
  la: { lat: 34.0522, lng: -118.2437 }, sf: { lat: 37.7749, lng: -122.4194 },
  boston: { lat: 42.3601, lng: -71.0589 }, miami: { lat: 25.7617, lng: -80.1918 },
  dc: { lat: 38.9072, lng: -77.0369 }, austin: { lat: 30.2672, lng: -97.7431 },
  houston: { lat: 29.7604, lng: -95.3698 }, atlanta: { lat: 33.749, lng: -84.388 },
  seattle: { lat: 47.6062, lng: -122.3321 }, denver: { lat: 39.7392, lng: -104.9903 },
  philly: { lat: 39.9526, lng: -75.1652 }, nashville: { lat: 36.1627, lng: -86.7816 },
  nola: { lat: 29.9511, lng: -90.0715 }, dallas: { lat: 32.7767, lng: -96.797 },
  phoenix: { lat: 33.4484, lng: -112.074 }, portland: { lat: 45.5152, lng: -122.6784 },
  detroit: { lat: 42.3314, lng: -83.0458 }, minneapolis: { lat: 44.9778, lng: -93.265 },
  charlotte: { lat: 35.2271, lng: -80.8431 }, tampa: { lat: 27.9506, lng: -82.4572 },
  sandiego: { lat: 32.7157, lng: -117.1611 }, stlouis: { lat: 38.627, lng: -90.1994 },
  pittsburgh: { lat: 40.4406, lng: -79.9959 }, columbus: { lat: 39.9612, lng: -82.9988 },
  indianapolis: { lat: 39.7684, lng: -86.1581 }, milwaukee: { lat: 43.0389, lng: -87.9065 },
  raleigh: { lat: 35.7796, lng: -78.6382 }, baltimore: { lat: 39.2904, lng: -76.6122 },
};

const METROS = [
  { id: 'nyc', label: 'NYC' }, { id: 'chicago', label: 'Chicago' },
  { id: 'la', label: 'LA' }, { id: 'sf', label: 'SF' },
  { id: 'austin', label: 'Austin' }, { id: 'houston', label: 'Houston' },
  { id: 'dallas', label: 'Dallas' }, { id: 'miami', label: 'Miami' },
  { id: 'dc', label: 'DC' }, { id: 'boston', label: 'Boston' },
  { id: 'seattle', label: 'Seattle' }, { id: 'denver', label: 'Denver' },
  { id: 'atlanta', label: 'Atlanta' }, { id: 'philly', label: 'Philly' },
  { id: 'nashville', label: 'Nashville' }, { id: 'portland', label: 'Portland' },
  { id: 'phoenix', label: 'Phoenix' }, { id: 'tampa', label: 'Tampa' },
  { id: 'charlotte', label: 'Charlotte' }, { id: 'detroit', label: 'Detroit' },
  { id: 'minneapolis', label: 'Mpls' }, { id: 'nola', label: 'NOLA' },
  { id: 'sandiego', label: 'SD' }, { id: 'stlouis', label: 'STL' },
  { id: 'pittsburgh', label: 'PGH' }, { id: 'columbus', label: 'Columbus' },
  { id: 'indianapolis', label: 'Indy' }, { id: 'milwaukee', label: 'MKE' },
  { id: 'raleigh', label: 'Raleigh' }, { id: 'baltimore', label: 'Baltimore' },
];

const SUGGESTIONS = ['🌮 Tacos', '🍕 Pizza', '🍔 Burgers', '🍣 Sushi', '🥗 Healthy', '🍜 Ramen', '🔥 Thai', '☕ Brunch'];

function closestMetro(lat: number, lng: number): string {
  let best = 'nyc'; let bestDist = Infinity;
  for (const [id, c] of Object.entries(METRO_COORDS)) {
    const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2);
    if (d < bestDist) { bestDist = d; best = id; }
  }
  return best;
}

function extractRestaurantFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('doordash')) { const m = u.pathname.match(/\/store\/([^/]+)/); if (m) return m[1].replace(/-\d+$/, '').replace(/-/g, ' '); }
    if (u.hostname.includes('ubereats')) { const m = u.pathname.match(/\/store\/([^/]+)/); if (m) return m[1].replace(/-/g, ' '); }
    if (u.hostname.includes('grubhub')) { const m = u.pathname.match(/\/restaurant\/([^/]+)/); if (m) return m[1].replace(/-/g, ' '); }
  } catch {}
  return null;
}

function detectPlatformFromUrl(url: string): string | null {
  if (url.includes('doordash')) return 'doordash';
  if (url.includes('ubereats')) return 'ubereats';
  if (url.includes('grubhub')) return 'grubhub';
  return null;
}

function cents(n: number): string { return '$' + (n / 100).toFixed(2); }

function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => { AsyncStorage.getItem('favorites').then(v => { if (v) setFavs(JSON.parse(v)); }); }, []);
  const toggle = useCallback(async (name: string) => {
    setFavs(prev => { const next = prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]; AsyncStorage.setItem('favorites', JSON.stringify(next)); return next; });
  }, []);
  return { favs, toggle, isFav: (name: string) => favs.includes(name) };
}

// ─── Main App ──────────────────────────────────────────────────
type Screen = 'home' | 'search' | 'compare' | 'savings' | 'promos';

export default function App() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();
  const [screen, setScreen] = useState<Screen>('home');
  const [metro, setMetro] = useState('austin');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [searchIntent, setSearchIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [savingsTotal, setSavingsTotal] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);
  const favorites = useFavorites();

  // Auto-detect location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setMetro(closestMetro(loc.coords.latitude, loc.coords.longitude));
        }
      } catch {}
    })();
    // Load savings
    AsyncStorage.getItem('savings').then(v => {
      if (v) { const s = JSON.parse(v); setSavingsTotal(s.total || 0); setSavingsCount(s.count || 0); }
    });
    // Load promos
    fetch(`${API}/api/promos`).then(r => r.json()).then(d => setPromos(d.promos || [])).catch(() => {});
  }, []);

  // Handle share intent (DoorDash/UberEats/Grubhub link shared to Eddy)
  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      const url = shareIntent.webUrl || shareIntent.text || '';
      const name = extractRestaurantFromUrl(url);
      const platform = detectPlatformFromUrl(url);
      if (name && platform) {
        runComparison(name, platform);
      } else if (name) {
        setQuery(name);
        setScreen('search');
        runSearch(name);
      }
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

  const runSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setScreen('search');
    try {
      const res = await fetch(`${API}/api/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, metro }),
      });
      const data = await res.json();
      setSearchResults(data.restaurants || []);
      setSearchIntent(data.intent?.understood || '');
    } catch { setSearchResults([]); }
    finally { setLoading(false); }
  };

  const runComparison = async (restaurantName: string, sourcePlatform: string = 'doordash') => {
    setCompareLoading(true);
    setScreen('compare');
    setComparison(null);
    try {
      const res = await fetch(`${API}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePlatform,
          restaurantName,
          items: [{ name: 'Order', normalizedName: 'order', price: 2000, quantity: 1 }],
          metro,
        }),
      });
      setComparison(await res.json());
    } catch {}
    finally { setCompareLoading(false); }
  };

  const recordSavings = async (amount: number) => {
    const newTotal = savingsTotal + amount;
    const newCount = savingsCount + 1;
    setSavingsTotal(newTotal);
    setSavingsCount(newCount);
    await AsyncStorage.setItem('savings', JSON.stringify({ total: newTotal, count: newCount }));
  };

  const shareSavings = () => {
    Share.share({
      message: `I've saved ${cents(savingsTotal)} on food delivery with Eddy 🌊\n\nEddy compares prices across every delivery app and finds direct ordering to save you 15-25%.\n\nhttps://eddy.delivery`,
    });
  };

  return (
    <SafeAreaView style={S.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => { setScreen('home'); setQuery(''); setComparison(null); }}>
          <Text style={S.logo}>🌊 <Text style={S.logoText}>Eddy</Text></Text>
        </TouchableOpacity>
      </View>

      {/* Metro pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.pillScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}>
        {METROS.map(m => (
          <TouchableOpacity key={m.id} onPress={() => setMetro(m.id)} style={metro === m.id ? S.pillActive : S.pill}>
            <Text style={metro === m.id ? S.pillActiveText : S.pillText}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Screens */}
      {screen === 'home' && <HomeScreen onSearch={(q) => { setQuery(q); runSearch(q); }} onCompare={runComparison} onNav={setScreen} savingsTotal={savingsTotal} savingsCount={savingsCount} />}
      {screen === 'search' && <SearchScreen query={query} onQueryChange={setQuery} onSearch={runSearch} loading={loading} results={searchResults} intent={searchIntent} favorites={favorites} onCompare={runComparison} />}
      {screen === 'compare' && <CompareScreen comparison={comparison} loading={compareLoading} onSave={recordSavings} promos={promos} />}
      {screen === 'savings' && <SavingsScreen total={savingsTotal} count={savingsCount} onShare={shareSavings} />}
      {screen === 'promos' && <PromosScreen promos={promos} />}

      {/* Bottom nav */}
      <View style={S.bottomNav}>
        {[
          { id: 'home' as Screen, icon: '🏠', label: 'Home' },
          { id: 'search' as Screen, icon: '🔍', label: 'Search' },
          { id: 'promos' as Screen, icon: '🏷️', label: 'Promos' },
          { id: 'savings' as Screen, icon: '💰', label: 'Savings' },
        ].map(tab => (
          <TouchableOpacity key={tab.id} style={S.navItem} onPress={() => setScreen(tab.id)}>
            <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
            <Text style={[S.navLabel, screen === tab.id && S.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── Home Screen ───────────────────────────────────────────────
function HomeScreen({ onSearch, onCompare, onNav, savingsTotal, savingsCount }: {
  onSearch: (q: string) => void; onCompare: (name: string, platform: string) => void;
  onNav: (s: Screen) => void; savingsTotal: number; savingsCount: number;
}) {
  const [q, setQ] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Hero */}
      <View style={S.hero}>
        <Text style={S.heroTitle}>What are you{'\n'}craving? 🌊</Text>
        <Text style={S.heroSub}>Compare prices across every delivery app.{'\n'}Find the cheapest way to order.</Text>

        <View style={S.searchBarHome}>
          <Text style={{ fontSize: 18 }}>🔍</Text>
          <TextInput
            style={S.searchInputHome}
            placeholder="Spicy Thai, cheap pizza, sushi..."
            placeholderTextColor={C.grey}
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => onSearch(q)}
            returnKeyType="search"
          />
        </View>

        {/* Suggestion chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 8 }}>
          {SUGGESTIONS.map(s => (
            <TouchableOpacity key={s} onPress={() => onSearch(s.replace(/^[^\s]+\s/, ''))} style={S.chip}>
              <Text style={S.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Savings card */}
      {savingsCount > 0 && (
        <TouchableOpacity style={S.savingsCard} onPress={() => onNav('savings')}>
          <Text style={S.savingsCardTitle}>💰 Your Savings</Text>
          <Text style={S.savingsCardAmount}>{cents(savingsTotal)}</Text>
          <Text style={S.savingsCardSub}>{savingsCount} comparisons</Text>
        </TouchableOpacity>
      )}

      {/* Share feature */}
      <View style={S.section}>
        <Text style={S.sectionTitle}>How it works</Text>
        {[
          { icon: '📱', title: 'Share a restaurant link', desc: 'From DoorDash, Uber Eats, or Grubhub — tap Share → Eddy' },
          { icon: '⚡', title: 'Instant price comparison', desc: 'See every platform side by side + direct ordering price' },
          { icon: '💰', title: 'Order the cheapest way', desc: 'Tap to order. Typically save $5-15 per delivery' },
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

      {/* Promos teaser */}
      <TouchableOpacity style={S.promoTeaser} onPress={() => onNav('promos')}>
        <Text style={S.promoTeaserIcon}>🏷️</Text>
        <View style={{ flex: 1 }}>
          <Text style={S.promoTeaserTitle}>Active Promo Codes</Text>
          <Text style={S.promoTeaserSub}>DoorDash, Uber Eats & Grubhub codes updated daily</Text>
        </View>
        <Text style={{ color: C.grey }}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Search Screen ─────────────────────────────────────────────
function SearchScreen({ query, onQueryChange, onSearch, loading, results, intent, favorites, onCompare }: {
  query: string; onQueryChange: (q: string) => void; onSearch: (q: string) => void;
  loading: boolean; results: Restaurant[]; intent: string;
  favorites: ReturnType<typeof useFavorites>; onCompare: (name: string, platform: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={S.searchBar}>
        <TextInput
          style={S.searchInput}
          placeholder="Search restaurants, cuisines..."
          placeholderTextColor={C.grey}
          value={query}
          onChangeText={onQueryChange}
          onSubmitEditing={() => onSearch(query)}
          returnKeyType="search"
          autoFocus
        />
      </View>

      {intent ? <Text style={S.intentLabel}>🔍 {intent}</Text> : null}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color={C.blue} style={{ marginTop: 40 }} />
        ) : results.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={{ color: C.grey, marginTop: 8 }}>Search for restaurants or cuisines</Text>
          </View>
        ) : (
          results.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} favorites={favorites}
              onCompare={() => onCompare(r.name, 'doordash')} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ─── Compare Screen ────────────────────────────────────────────
function CompareScreen({ comparison, loading, onSave, promos }: {
  comparison: ComparisonResult | null; loading: boolean;
  onSave: (amount: number) => void; promos: PromoCode[];
}) {
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={C.blue} />
        <Text style={{ color: C.grey, marginTop: 12 }}>Comparing prices...</Text>
      </View>
    );
  }

  if (!comparison) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: C.grey }}>No comparison data</Text></View>;

  const platformEmoji: Record<string, string> = {
    pickup: '🚶', direct: '🏪', doordash: '🔴', ubereats: '🟢', grubhub: '🟠',
  };
  const platformName: Record<string, string> = {
    pickup: 'Pickup', direct: 'Direct Order', doordash: 'DoorDash', ubereats: 'Uber Eats', grubhub: 'Grubhub',
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={S.compareTitle}>{comparison.restaurantName}</Text>

      {comparison.savings > 100 && (
        <View style={S.savingsBanner}>
          <Text style={S.savingsBannerText}>💰 Save up to {cents(comparison.savings)}</Text>
        </View>
      )}

      {/* Promo codes applied */}
      {comparison.promoCodes && comparison.promoCodes.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.black, marginBottom: 6 }}>🏷️ Promo codes applied:</Text>
          {comparison.promoCodes.map((p, i) => (
            <View key={i} style={S.promoApplied}>
              <Text style={S.promoCode}>{p.code}</Text>
              <Text style={S.promoDesc}>{p.description} (-{cents(p.savingsCents)})</Text>
            </View>
          ))}
        </View>
      )}

      {/* Quotes */}
      {comparison.quotes.map((q, i) => {
        const isBest = i === 0;
        return (
          <TouchableOpacity
            key={i}
            style={[S.quoteCard, isBest && S.quoteCardBest]}
            onPress={() => {
              if (q.deepLink) {
                if (isBest && comparison.savings > 0) onSave(comparison.savings);
                Linking.openURL(q.deepLink);
              }
            }}
          >
            <View style={S.quoteTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>{platformEmoji[q.platform] || '📱'}</Text>
                <View>
                  <Text style={S.quotePlatform}>{platformName[q.platform] || q.platform}</Text>
                  {isBest && <Text style={S.bestLabel}>CHEAPEST</Text>}
                </View>
              </View>
              <Text style={[S.quoteTotal, isBest && { color: C.blue }]}>{cents(q.fees.total)}</Text>
            </View>

            {/* Fee breakdown */}
            <View style={S.feeRow}>
              <Text style={S.feeLabel}>Subtotal</Text>
              <Text style={S.feeValue}>{cents(q.fees.subtotal)}</Text>
            </View>
            {q.fees.serviceFee > 0 && <View style={S.feeRow}><Text style={S.feeLabel}>Service fee</Text><Text style={[S.feeValue, { color: C.red }]}>{cents(q.fees.serviceFee)}</Text></View>}
            {q.fees.deliveryFee > 0 && <View style={S.feeRow}><Text style={S.feeLabel}>Delivery</Text><Text style={[S.feeValue, { color: C.red }]}>{cents(q.fees.deliveryFee)}</Text></View>}
            {q.fees.discount > 0 && <View style={S.feeRow}><Text style={S.feeLabel}>Discount</Text><Text style={[S.feeValue, { color: '#059669' }]}>-{cents(q.fees.discount)}</Text></View>}
            <View style={S.feeRow}><Text style={S.feeLabel}>Tax</Text><Text style={S.feeValue}>{cents(q.fees.tax)}</Text></View>

            {q.deepLink ? (
              <View style={[S.quoteBtn, isBest && { backgroundColor: C.blue }]}>
                <Text style={[S.quoteBtnText, isBest && { color: C.white }]}>
                  {isBest ? 'Order Here — Best Price →' : 'Order →'}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Savings Screen ────────────────────────────────────────────
function SavingsScreen({ total, count, onShare }: { total: number; count: number; onShare: () => void }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100, alignItems: 'center' }}>
      <Text style={{ fontSize: 60, marginTop: 40 }}>🌊</Text>
      <Text style={S.savingsTotal}>{cents(total)}</Text>
      <Text style={{ color: C.grey, fontSize: 16, marginBottom: 8 }}>Total Saved</Text>
      <Text style={{ color: C.grey, fontSize: 14, marginBottom: 32 }}>{count} comparisons</Text>

      <TouchableOpacity style={S.shareBtn} onPress={onShare}>
        <Text style={S.shareBtnText}>Share My Savings 📤</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 40, width: '100%' }}>
        <Text style={S.sectionTitle}>How savings are calculated</Text>
        <Text style={{ color: C.grey, lineHeight: 22, marginTop: 8 }}>
          Every time you use Eddy to find a cheaper option and order through it, we track the difference between the most expensive and cheapest quote. Your savings add up over time!
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Promos Screen ─────────────────────────────────────────────
function PromosScreen({ promos }: { promos: PromoCode[] }) {
  const platforms = ['doordash', 'ubereats', 'grubhub'];
  const platformName: Record<string, string> = { doordash: 'DoorDash', ubereats: 'Uber Eats', grubhub: 'Grubhub' };
  const platformEmoji: Record<string, string> = { doordash: '🔴', ubereats: '🟢', grubhub: '🟠' };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={S.sectionTitle}>🏷️ Active Promo Codes</Text>
      <Text style={{ color: C.grey, marginBottom: 16 }}>Updated daily from coupon aggregators. Tap to copy.</Text>

      {platforms.map(platform => {
        const codes = promos.filter(p => p.platform === platform);
        if (codes.length === 0) return null;
        return (
          <View key={platform} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.black, marginBottom: 8 }}>
              {platformEmoji[platform]} {platformName[platform]} ({codes.length})
            </Text>
            {codes.map((code, i) => (
              <TouchableOpacity key={i} style={S.promoCard} onPress={() => {
                // Copy to clipboard would go here
              }}>
                <View style={S.promoCardLeft}>
                  <Text style={S.promoCardCode}>{code.code}</Text>
                  <Text style={S.promoCardDesc}>{code.description}</Text>
                  {code.firstOrderOnly && <Text style={S.promoFirstOrder}>First order only</Text>}
                </View>
                <Text style={{ color: C.blue, fontWeight: '700', fontSize: 12 }}>COPY</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─── Restaurant Card ───────────────────────────────────────────
function RestaurantCard({ restaurant: r, favorites, onCompare }: {
  restaurant: Restaurant; favorites: ReturnType<typeof useFavorites>; onCompare: () => void;
}) {
  const platform = r.hasToast ? 'Toast' : r.hasSquare ? 'Square' : r.hasWebsite ? 'Website' : null;

  return (
    <View style={S.card}>
      <View style={S.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={S.cardName}>{r.name}</Text>
          <Text style={S.cardCategory}>{r.category}</Text>
        </View>
        <TouchableOpacity onPress={() => favorites.toggle(r.name)} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18 }}>{favorites.isFav(r.name) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {r.directUrl && (
        <View style={S.directTag}>
          <Text style={S.directTagText}>✓ Direct ordering via {platform}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        {r.directUrl && (
          <TouchableOpacity style={S.orderBtn} onPress={() => Linking.openURL(r.directUrl!)}>
            <Text style={S.orderBtnText}>Order Direct →</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={S.compareBtn} onPress={onCompare}>
          <Text style={S.compareBtnText}>Compare Prices</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.greyBorder },
  logo: { fontSize: 22 },
  logoText: { fontSize: 18, fontWeight: '800', color: C.black, letterSpacing: -0.3 },

  pillScroll: { paddingTop: 8, paddingBottom: 8, maxHeight: 44, borderBottomWidth: 1, borderBottomColor: C.greyBorder },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, backgroundColor: C.greyLight, marginRight: 6 },
  pillActive: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, backgroundColor: C.blue, marginRight: 6 },
  pillText: { fontSize: 12, color: C.grey, fontWeight: '500' },
  pillActiveText: { fontSize: 12, color: C.white, fontWeight: '600' },

  hero: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: C.black, letterSpacing: -0.5, lineHeight: 38, marginBottom: 8 },
  heroSub: { fontSize: 15, color: C.grey, lineHeight: 22, marginBottom: 20 },

  searchBarHome: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderWidth: 2, borderColor: C.greyBorder, borderRadius: 14, paddingHorizontal: 14, gap: 8 },
  searchInputHome: { flex: 1, paddingVertical: 14, fontSize: 15, color: C.black },

  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: C.greyLight, borderWidth: 1, borderColor: C.greyBorder },
  chipText: { fontSize: 13, color: C.grey },

  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: C.black, marginBottom: 4 },
  stepCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: C.greyLight, borderRadius: 14, padding: 16, marginTop: 10 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: C.black, marginBottom: 2 },
  stepDesc: { fontSize: 13, color: C.grey, lineHeight: 19 },

  savingsCard: { marginHorizontal: 20, marginTop: 16, backgroundColor: C.yellowLight, borderRadius: 16, padding: 20, alignItems: 'center' },
  savingsCardTitle: { fontSize: 13, fontWeight: '700', color: C.yellowDark },
  savingsCardAmount: { fontSize: 36, fontWeight: '900', color: C.black, marginVertical: 4 },
  savingsCardSub: { fontSize: 13, color: C.grey },

  promoTeaser: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 20, backgroundColor: C.blueLight, borderRadius: 14, padding: 16 },
  promoTeaserIcon: { fontSize: 28 },
  promoTeaserTitle: { fontSize: 14, fontWeight: '700', color: C.black },
  promoTeaserSub: { fontSize: 12, color: C.grey },

  searchBar: { paddingHorizontal: 16, paddingTop: 8 },
  searchInput: { backgroundColor: C.greyLight, borderWidth: 1, borderColor: C.greyBorder, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: C.black, fontSize: 15 },
  intentLabel: { paddingHorizontal: 16, paddingTop: 8, fontSize: 12, color: C.grey },

  card: { backgroundColor: C.white, borderWidth: 1, borderColor: C.greyBorder, borderRadius: 14, padding: 16, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: C.black },
  cardCategory: { fontSize: 12, color: C.grey, textTransform: 'capitalize', marginTop: 2 },
  directTag: { backgroundColor: C.yellowLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 6 },
  directTagText: { fontSize: 11, fontWeight: '700', color: C.yellowDark },
  orderBtn: { flex: 1, backgroundColor: C.blue, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  orderBtnText: { color: C.white, fontSize: 14, fontWeight: '700' },
  compareBtn: { flex: 1, backgroundColor: C.greyLight, borderRadius: 10, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: C.greyBorder },
  compareBtnText: { color: C.black, fontSize: 14, fontWeight: '600' },

  // Compare
  compareTitle: { fontSize: 24, fontWeight: '900', color: C.black, marginBottom: 12 },
  savingsBanner: { backgroundColor: C.yellowLight, borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 16 },
  savingsBannerText: { fontSize: 16, fontWeight: '800', color: C.yellowDark },
  promoApplied: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  promoCode: { backgroundColor: C.blueLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: '800', color: C.blue },
  promoDesc: { fontSize: 12, color: C.grey },
  quoteCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.greyBorder, borderRadius: 14, padding: 16, marginBottom: 10 },
  quoteCardBest: { borderColor: C.blue, borderWidth: 2 },
  quoteTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  quotePlatform: { fontSize: 15, fontWeight: '700', color: C.black },
  bestLabel: { fontSize: 9, fontWeight: '900', color: C.blue, letterSpacing: 0.5, marginTop: 2 },
  quoteTotal: { fontSize: 24, fontWeight: '900', color: C.black },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  feeLabel: { fontSize: 13, color: C.grey },
  feeValue: { fontSize: 13, color: C.black, fontWeight: '500' },
  quoteBtn: { backgroundColor: C.greyLight, borderRadius: 10, paddingVertical: 11, alignItems: 'center', marginTop: 12 },
  quoteBtnText: { fontSize: 14, fontWeight: '700', color: C.black },

  // Savings
  savingsTotal: { fontSize: 48, fontWeight: '900', color: C.black, marginTop: 16 },
  shareBtn: { backgroundColor: C.blue, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  shareBtnText: { color: C.white, fontSize: 16, fontWeight: '700' },

  // Promos
  promoCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.greyLight, borderRadius: 12, padding: 14, marginBottom: 8 },
  promoCardLeft: { flex: 1 },
  promoCardCode: { fontSize: 16, fontWeight: '900', color: C.black, letterSpacing: 0.5 },
  promoCardDesc: { fontSize: 12, color: C.grey, marginTop: 2 },
  promoFirstOrder: { fontSize: 10, color: C.blue, fontWeight: '600', marginTop: 2 },

  // Nav
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8, paddingBottom: 20, borderTopWidth: 1, borderTopColor: C.greyBorder, backgroundColor: C.white },
  navItem: { alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 10, color: C.grey, marginTop: 2 },
  navLabelActive: { color: C.blue, fontWeight: '600' },
});
