/**
 * Client-side favorites using localStorage
 * No auth required — works immediately
 */

const STORAGE_KEY = 'stf_favorites';

export interface Favorite {
  slug: string;
  name: string;
  metro: string;
  directUrl: string | null;
  addedAt: number;
}

function getFavorites(): Favorite[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favs: Favorite[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function isFavorite(slug: string, metro: string): boolean {
  return getFavorites().some(f => f.slug === slug && f.metro === metro);
}

export function toggleFavorite(slug: string, name: string, metro: string, directUrl: string | null): boolean {
  const favs = getFavorites();
  const idx = favs.findIndex(f => f.slug === slug && f.metro === metro);
  if (idx >= 0) {
    favs.splice(idx, 1);
    saveFavorites(favs);
    return false; // removed
  } else {
    favs.unshift({ slug, name, metro, directUrl, addedAt: Date.now() });
    saveFavorites(favs);
    return true; // added
  }
}

export function getAllFavorites(): Favorite[] {
  return getFavorites();
}

export function getFavoritesForMetro(metro: string): Favorite[] {
  return getFavorites().filter(f => f.metro === metro);
}

export function getFavoriteCount(): number {
  return getFavorites().length;
}
