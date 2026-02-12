import { Platform } from '@mealcompare/shared';

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttlMs: number;
}

/**
 * In-memory cache for menu data.
 * Menus don't change frequently — cache for 1 hour by default.
 * Restaurant search results cache for 15 minutes.
 */
export class MenuCache {
  private store = new Map<string, CacheEntry<any>>();

  private static MENU_TTL = 60 * 60 * 1000; // 1 hour
  private static SEARCH_TTL = 15 * 60 * 1000; // 15 min
  private static FEE_TTL = 5 * 60 * 1000; // 5 min (fees can change with demand)

  private key(platform: Platform, type: string, id: string): string {
    return `${platform}:${type}:${id}`;
  }

  getMenu(platform: Platform, restaurantId: string): any | null {
    return this.get(this.key(platform, 'menu', restaurantId));
  }

  setMenu(platform: Platform, restaurantId: string, data: any): void {
    this.set(this.key(platform, 'menu', restaurantId), data, MenuCache.MENU_TTL);
  }

  getSearch(platform: Platform, query: string): any | null {
    return this.get(this.key(platform, 'search', query));
  }

  setSearch(platform: Platform, query: string, data: any): void {
    this.set(this.key(platform, 'search', query), data, MenuCache.SEARCH_TTL);
  }

  private get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > entry.ttlMs) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  private set(key: string, data: any, ttlMs: number): void {
    this.store.set(key, { data, cachedAt: Date.now(), ttlMs });

    // Evict old entries periodically
    if (this.store.size > 500) {
      const now = Date.now();
      this.store.forEach((entry, k) => {
        if (now - entry.cachedAt > entry.ttlMs) this.store.delete(k);
      });
    }
  }

  clear(): void {
    this.store.clear();
  }
}

export const menuCache = new MenuCache();
