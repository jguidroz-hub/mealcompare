import { MetadataRoute } from 'next';
import { getRestaurantsForMetro, getDirectOrderUrl } from '@mealcompare/engine';

const METROS = [
  'nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta',
  'seattle','denver','philly','nashville','nola','dallas','phoenix','portland',
  'detroit','minneapolis','charlotte','tampa','sandiego','stlouis','pittsburgh',
  'columbus','indianapolis','milwaukee','raleigh','baltimore',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://skipthefee.app';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/restaurants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/savings`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/for-restaurants`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const metroPages: MetadataRoute.Sitemap = METROS.map(metro => ({
    url: `${base}/restaurants/${metro}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Restaurant detail pages — only those with direct ordering URLs (high value)
  const restaurantPages: MetadataRoute.Sitemap = [];
  for (const metro of METROS) {
    const restaurants = getRestaurantsForMetro(metro);
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
