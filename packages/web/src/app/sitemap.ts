import { MetadataRoute } from 'next';

const METROS = [
  'nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta',
  'seattle','denver','philly','nashville','nola','dallas','phoenix','portland',
  'detroit','minneapolis','charlotte','tampa','sandiego','stlouis','pittsburgh',
  'columbus','indianapolis','milwaukee','raleigh','baltimore',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://skipthefee.app';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/restaurants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/savings`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/for-restaurants`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ...METROS.map(metro => ({
      url: `${base}/restaurants/${metro}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
