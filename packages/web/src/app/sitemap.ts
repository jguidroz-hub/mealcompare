import { MetadataRoute } from 'next';
import { getRestaurantsForMetro, getDirectOrderUrl, getAllMetros } from '@/lib/restaurants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://eddy.delivery';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/restaurants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/savings`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/for-restaurants`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/food-delivery-price-comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/direct-ordering-saves-money`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/best-food-delivery-apps-compared`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  const metros = await getAllMetros();

  const metroPages: MetadataRoute.Sitemap = metros.map(metro => ({
    url: `${base}/restaurants/${metro}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Restaurant detail pages — only those with direct ordering URLs (high value)
  const restaurantPages: MetadataRoute.Sitemap = [];
  for (const metro of metros) {
    const restaurants = await getRestaurantsForMetro(metro);
    for (const r of restaurants) {
      if (getDirectOrderUrl(r)) {
        const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        restaurantPages.push({
          url: `${base}/restaurant/${metro}/${slug}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        });
      }
    }
  }

  return [...staticPages, ...metroPages, ...restaurantPages];
}
