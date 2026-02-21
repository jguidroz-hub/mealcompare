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
  Alert,
} from 'react-native';
import { useShareIntent, ShareIntent } from 'expo-share-intent';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://eddy.app';

// ─── Types ─────────────────────────────────────────────────────
interface Restaurant {
  name: string;
  category: string;
  directUrl: string | null;
  hasToast: boolean;
  hasSquare: boolean;
  hasWebsite: boolean;
}

// ─── Metro geo-centers ─────────────────────────────────────────
const METRO_COORDS: Record<string, { lat: number; lng: number }> = {
  nyc: { lat: 40.7128, lng: -74.006 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  la: { lat: 34.0522, lng: -118.2437 },
  sf: { lat: 37.7749, lng: -122.4194 },
  boston: { lat: 42.3601, lng: -71.0589 },
  miami: { lat: 25.7617, lng: -80.1918 },
  dc: { lat: 38.9072, lng: -77.0369 },
  austin: { lat: 30.2672, lng: -97.7431 },
  houston: { lat: 29.7604, lng: -95.3698 },
  atlanta: { lat: 33.749, lng: -84.388 },
  seattle: { lat: 47.6062, lng: -122.3321 },
  denver: { lat: 39.7392, lng: -104.9903 },
  philly: { lat: 39.9526, lng: -75.1652 },
  nashville: { lat: 36.1627, lng: -86.7816 },
  nola: { lat: 29.9511, lng: -90.0715 },
  dallas: { lat: 32.7767, lng: -96.797 },
  phoenix: { lat: 33.4484, lng: -112.074 },
  portland: { lat: 45.5152, lng: -122.6784 },
  detroit: { lat: 42.3314, lng: -83.0458 },
  minneapolis: { lat: 44.9778, lng: -93.265 },
  charlotte: { lat: 35.2271, lng: -80.8431 },
  tampa: { lat: 27.9506, lng: -82.4572 },
  sandiego: { lat: 32.7157, lng: -117.1611 },
  stlouis: { lat: 38.627, lng: -90.1994 },
  pittsburgh: { lat: 40.4406, lng: -79.9959 },
  columbus: { lat: 39.9612, lng: -82.9988 },
  indianapolis: { lat: 39.7684, lng: -86.1581 },
  milwaukee: { lat: 43.0389, lng: -87.9065 },
  raleigh: { lat: 35.7796, lng: -78.6382 },
  baltimore: { lat: 39.2904, lng: -76.6122 },
};

function closestMetro(lat: number, lng: number): string {
  let best = 'nyc';
  let bestDist = Infinity;
  for (const [id, c] of Object.entries(METRO_COORDS)) {
    const d = Math.sqrt((lat - c.lat) ** 2 + (lng - c.lng) ** 2);
    if (d < bestDist) { bestDist = d; best = id; }
  }
  return best;
}

// ─── Helpers ───────────────────────────────────────────────────
function extractRestaurantFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('doordash')) {
      const match = u.pathname.match(/\/store\/([^/]+)/);
      if (match) return match[1].replace(/-\d+$/, '').replace(/-/g, ' ');
    }
    if (u.hostname.includes('ubereats')) {
      const match = u.pathname.match(/\/store\/([^/]+)/);
      if (match) return match[1].replace(/-/g, ' ');
    }
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
    u.searchParams.set('utm_source', 'eddy');
    u.searchParams.set('utm_medium', 'app');
    u.searchParams.set('ref', 'eddy');
    return u.toString();
  } catch { return url; }
}

// ─── Favorites hook ────────────────────────────────────────────
function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then(v => {
      if (v) setFavs(JSON.parse(v));
    });
  }, []);

  const toggle = useCallback(async (name: string) => {
    setFavs(prev => {
      const next = prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name];
      AsyncStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  return { favs, toggle, isFav: (name: string) => favs.includes(name) };
}

// ─── Main App ──────────────────────────────────────────────────
export default function App() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();
  const [screen, setScreen] = useState<'home' | 'search' | 'favorites'>('home');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [selectedMetro, setSelectedMetro] = useState('nyc');
  const [sharedRestaurant, setSharedRestaurant] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const favorites = useFavorites();

  // Auto-detect location on mount
  useEffect(() => {
    (async () => {
      setLocating(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const metro = closestMetro(loc.coords.latitude, loc.coords.longitude);
          setSelectedMetro(metro);
        }
      } catch {}
      setLocating(false);
    })();
  }, []);

  // Load restaurants when metro changes
  useEffect(() => {
    loadRestaurants(selectedMetro);
  }, [selectedMetro]);

  // Handle incoming share intent
  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      handleShareIntent(shareIntent);
    }
  }, [hasShareIntent, shareIntent]);

  const handleShareIntent = useCallback((intent: ShareIntent) => {
    const text = intent.text || '';
    const url = intent.webUrl || '';
    let restaurantName = extractRestaurantFromUrl(url) || extractRestaurantFromUrl(text);
    if (!restaurantName && text) restaurantName = text.trim();
    if (restaurantName) {
      setSharedRestaurant(restaurantName);
      setQuery(restaurantName);
      setScreen('search');
    }
    resetShareIntent();
  }, []);

  const loadRestaurants = async (metro: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/restaurants?metro=${metro}`);
      const data = await res.json();
      setAllRestaurants(data.restaurants || []);
    } catch {
      setAllRestaurants([]);
    }
  };

  const searchRestaurants = useCallback((q: string) => {
    if (q.length < 2) { setRestaurants([]); return; }
    setLoading(true);
    const filtered = allRestaurants.filter(r =>
      r.name.toLowerCase().includes(q.toLowerCase())
    );
    // Show direct-ordering restaurants first
    filtered.sort((a, b) => (b.directUrl ? 1 : 0) - (a.directUrl ? 1 : 0));
    setRestaurants(filtered.length > 0 ? filtered : allRestaurants.filter(r => r.directUrl).slice(0, 20));
    setLoading(false);
  }, [allRestaurants]);

  useEffect(() => {
    if (query.length >= 2) searchRestaurants(query);
  }, [query, searchRestaurants]);

  const trackClick = (restaurant: Restaurant) => {
    const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant: restaurant.name, slug,
        metro: selectedMetro, source: 'ios-app',
        directUrl: restaurant.directUrl,
      }),
    }).catch(() => {});
  };

  const favRestaurants = allRestaurants.filter(r => favorites.isFav(r.name));

  return (
    <SafeAreaView style={S.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => { setScreen('home'); setQuery(''); setRestaurants([]); }}>
          <Text style={S.logo}>💰 <Text style={S.logoText}>Eddy</Text></Text>
        </TouchableOpacity>
        <View style={S.headerRight}>
          <TouchableOpacity onPress={() => setScreen('favorites')} style={S.headerBtn}>
            <Text style={{ fontSize: 20 }}>❤️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Metro pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.pillScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {locating && <ActivityIndicator size="small" color="#10b981" style={{ marginRight: 8 }} />}
        {METROS.map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelectedMetro(m.id)}
            style={selectedMetro === m.id ? S.pillActive : S.pill}
          >
            <Text style={selectedMetro === m.id ? S.pillActiveText : S.pillText}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {screen === 'home' ? (
        <HomeScreen
          onSearch={() => setScreen('search')}
          allRestaurants={allRestaurants}
          selectedMetro={selectedMetro}
          onTrack={trackClick}
          favorites={favorites}
        />
      ) : screen === 'favorites' ? (
        <FavoritesScreen
          restaurants={favRestaurants}
          onTrack={trackClick}
          favorites={favorites}
        />
      ) : (
        <SearchScreen
          query={query}
          onQueryChange={setQuery}
          loading={loading}
          restaurants={restaurants}
          sharedRestaurant={sharedRestaurant}
          onTrack={trackClick}
          favorites={favorites}
        />
      )}

      {/* Bottom nav */}
      <View style={S.bottomNav}>
        <TouchableOpacity style={S.navItem} onPress={() => { setScreen('home'); setQuery(''); }}>
          <Text style={{ fontSize: 20 }}>🏠</Text>
          <Text style={[S.navLabel, screen === 'home' && S.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.navItem} onPress={() => setScreen('search')}>
          <Text style={{ fontSize: 20 }}>🔍</Text>
          <Text style={[S.navLabel, screen === 'search' && S.navLabelActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.navItem} onPress={() => setScreen('favorites')}>
          <Text style={{ fontSize: 20 }}>❤️</Text>
          <Text style={[S.navLabel, screen === 'favorites' && S.navLabelActive]}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Home Screen ───────────────────────────────────────────────
function HomeScreen({ onSearch, allRestaurants, selectedMetro, onTrack, favorites }: {
  onSearch: () => void;
  allRestaurants: Restaurant[];
  selectedMetro: string;
  onTrack: (r: Restaurant) => void;
  favorites: ReturnType<typeof useFavorites>;
}) {
  const directRestaurants = allRestaurants.filter(r => r.directUrl);
  const totalInMetro = allRestaurants.length;
  const directCount = directRestaurants.length;

  return (
    <ScrollView style={S.content} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Hero */}
      <View style={S.hero}>
        <Text style={S.heroBadge}>💰 Save $5–15 per order</Text>
        <Text style={S.heroTitle}>
          Stop overpaying for{'\n'}
          <Text style={S.gradientText}>food delivery</Text>
        </Text>
        <Text style={S.heroSub}>
          Find direct ordering links and skip DoorDash, Uber Eats, and Grubhub markup fees.
        </Text>
        <TouchableOpacity style={S.primaryBtn} onPress={onSearch}>
          <Text style={S.primaryBtnText}>🔍 Search Restaurants</Text>
        </TouchableOpacity>
      </View>

      {/* Quick stats */}
      <View style={S.statsRow}>
        <View style={S.statCard}>
          <Text style={S.statValue}>30</Text>
          <Text style={S.statLabel}>Cities</Text>
        </View>
        <View style={S.statCard}>
          <Text style={S.statValue}>{totalInMetro}</Text>
          <Text style={S.statLabel}>Near You</Text>
        </View>
        <View style={S.statCard}>
          <Text style={S.statValue}>{directCount}</Text>
          <Text style={S.statLabel}>Direct Links</Text>
        </View>
      </View>

      {/* Featured direct-order restaurants */}
      {directCount > 0 && (
        <View style={S.section}>
          <Text style={S.sectionTitle}>🔥 Order Direct & Save</Text>
          <Text style={S.sectionSub}>These restaurants let you skip delivery app fees</Text>
          {directRestaurants.slice(0, 8).map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} onTrack={onTrack} favorites={favorites} />
          ))}
          {directCount > 8 && (
            <TouchableOpacity onPress={onSearch} style={S.seeAllBtn}>
              <Text style={S.seeAllText}>See all {directCount} restaurants →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* How it works */}
      <View style={S.section}>
        <Text style={S.sectionTitle}>How it works</Text>
        {[
          { icon: '📱', title: 'Share from any app', desc: 'Share a restaurant link from DoorDash/UberEats/Grubhub and select Eddy' },
          { icon: '⚡', title: 'Find direct ordering', desc: 'We check if the restaurant has their own ordering (Toast, Square, website)' },
          { icon: '💰', title: 'Save 15-30%', desc: 'Order direct — no platform markups, lower delivery fees, more money for you' },
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
    </ScrollView>
  );
}

// ─── Favorites Screen ──────────────────────────────────────────
function FavoritesScreen({ restaurants, onTrack, favorites }: {
  restaurants: Restaurant[];
  onTrack: (r: Restaurant) => void;
  favorites: ReturnType<typeof useFavorites>;
}) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text style={S.sectionTitle}>❤️ Favorites</Text>
      {restaurants.length === 0 ? (
        <View style={{ alignItems: 'center', paddingTop: 60 }}>
          <Text style={{ fontSize: 48 }}>🍽️</Text>
          <Text style={{ color: '#64748b', marginTop: 12, fontSize: 15, textAlign: 'center' }}>
            No favorites yet.{'\n'}Tap the heart on any restaurant to save it.
          </Text>
        </View>
      ) : (
        restaurants.map((r, i) => (
          <RestaurantCard key={`${r.name}-${i}`} restaurant={r} onTrack={onTrack} favorites={favorites} />
        ))
      )}
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
  { id: 'nola', label: 'NOLA' }, { id: 'dallas', label: 'Dallas' },
  { id: 'phoenix', label: 'Phoenix' }, { id: 'portland', label: 'Portland' },
  { id: 'detroit', label: 'Detroit' }, { id: 'minneapolis', label: 'Mpls' },
  { id: 'charlotte', label: 'Charlotte' }, { id: 'tampa', label: 'Tampa' },
  { id: 'sandiego', label: 'SD' }, { id: 'stlouis', label: 'STL' },
  { id: 'pittsburgh', label: 'PGH' }, { id: 'columbus', label: 'Columbus' },
  { id: 'indianapolis', label: 'Indy' }, { id: 'milwaukee', label: 'MKE' },
  { id: 'raleigh', label: 'Raleigh' }, { id: 'baltimore', label: 'Baltimore' },
];

function SearchScreen({ query, onQueryChange, loading, restaurants, sharedRestaurant, onTrack, favorites }: {
  query: string;
  onQueryChange: (q: string) => void;
  loading: boolean;
  restaurants: Restaurant[];
  sharedRestaurant: string | null;
  onTrack: (r: Restaurant) => void;
  favorites: ReturnType<typeof useFavorites>;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={S.searchBar}>
        <TextInput
          style={S.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor="#475569"
          value={query}
          onChangeText={onQueryChange}
          autoFocus={!sharedRestaurant}
          returnKeyType="search"
        />
      </View>

      {sharedRestaurant && (
        <View style={S.sharedBanner}>
          <Text style={S.sharedBannerText}>
            🔗 Shared: <Text style={{ fontWeight: '700' }}>{sharedRestaurant}</Text>
          </Text>
        </View>
      )}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {loading ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : restaurants.length === 0 && query.length > 2 ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
            <Text style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>No results for "{query}"</Text>
          </View>
        ) : query.length < 2 ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontSize: 36 }}>🔍</Text>
            <Text style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>Type to search restaurants</Text>
          </View>
        ) : (
          restaurants.map((r, i) => (
            <RestaurantCard key={`${r.name}-${i}`} restaurant={r} onTrack={onTrack} favorites={favorites} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ─── Restaurant Card ───────────────────────────────────────────
function RestaurantCard({ restaurant: r, onTrack, favorites }: {
  restaurant: Restaurant;
  onTrack: (r: Restaurant) => void;
  favorites: ReturnType<typeof useFavorites>;
}) {
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
        <TouchableOpacity onPress={() => favorites.toggle(r.name)} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18 }}>{favorites.isFav(r.name) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        {hasDirect && (
          <View style={S.directBadge}>
            <Text style={S.directBadgeText}>💰 {platform || 'Direct'}</Text>
          </View>
        )}
      </View>
      {hasDirect ? (
        <TouchableOpacity style={S.directBtn} onPress={handlePress} activeOpacity={0.8}>
          <Text style={S.directBtnText}>Order Direct — Skip the Fees →</Text>
        </TouchableOpacity>
      ) : (
        <View style={S.noDirectRow}>
          <Text style={S.noDirectText}>No direct ordering found yet</Text>
        </View>
      )}
      {hasDirect && (
        <Text style={S.savingsHint}>💡 Save an estimated $5-15 vs delivery apps</Text>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerBtn: { padding: 4 },
  logo: { fontSize: 22 },
  logoText: { fontSize: 18, fontWeight: '800', color: '#e2e8f0', letterSpacing: -0.3 },
  content: { flex: 1 },

  // Pills
  pillScroll: { paddingTop: 8, paddingBottom: 8, maxHeight: 48 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', marginRight: 8,
  },
  pillActive: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
    borderWidth: 1, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)', marginRight: 8,
  },
  pillText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  pillActiveText: { fontSize: 13, color: '#10b981', fontWeight: '600' },

  // Hero
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 36, paddingBottom: 32 },
  heroBadge: {
    backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.15)',
    borderRadius: 100, paddingHorizontal: 16, paddingVertical: 6,
    fontSize: 13, color: '#10b981', fontWeight: '600', marginBottom: 20, overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 32, fontWeight: '900', color: '#e2e8f0', textAlign: 'center',
    letterSpacing: -0.5, lineHeight: 38, marginBottom: 12,
  },
  gradientText: { color: '#10b981' },
  heroSub: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, maxWidth: 320, marginBottom: 28 },
  primaryBtn: {
    backgroundColor: '#10b981', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12,
    shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  // Stats
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12, padding: 14, alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#10b981' },
  statLabel: { fontSize: 11, color: '#475569', marginTop: 2 },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 28 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#e2e8f0', marginBottom: 4, letterSpacing: -0.3 },
  sectionSub: { fontSize: 13, color: '#475569', marginBottom: 16 },
  seeAllBtn: { alignItems: 'center', paddingVertical: 12 },
  seeAllText: { color: '#10b981', fontWeight: '600', fontSize: 14 },
  stepCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: 'rgba(15,23,42,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14, padding: 16, marginBottom: 10,
  },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', marginBottom: 2 },
  stepDesc: { fontSize: 13, color: '#64748b', lineHeight: 19 },

  // Search
  searchBar: { paddingHorizontal: 16, paddingTop: 8 },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#e2e8f0', fontSize: 15,
  },
  sharedBanner: {
    marginHorizontal: 16, marginTop: 10, backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1, borderColor: 'rgba(59,130,246,0.2)', borderRadius: 10, padding: 10,
  },
  sharedBannerText: { fontSize: 13, color: '#93c5fd' },

  // Cards
  card: {
    backgroundColor: 'rgba(15,23,42,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14, padding: 16, marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#e2e8f0' },
  cardCategory: { fontSize: 12, color: '#475569', textTransform: 'capitalize', marginTop: 2 },
  directBadge: {
    backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.15)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3,
  },
  directBadgeText: { fontSize: 11, fontWeight: '600', color: '#10b981' },
  directBtn: { backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  directBtnText: { color: 'white', fontSize: 14, fontWeight: '700' },
  noDirectRow: { paddingVertical: 4 },
  noDirectText: { fontSize: 12, color: '#334155', fontStyle: 'italic' },
  savingsHint: { fontSize: 11, color: '#475569', marginTop: 8, textAlign: 'center' },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 8, paddingBottom: 20,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', backgroundColor: '#0a0f1a',
  },
  navItem: { alignItems: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 10, color: '#475569', marginTop: 2 },
  navLabelActive: { color: '#10b981' },
});
