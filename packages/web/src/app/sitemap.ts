import { MetadataRoute } from 'next';
import { getRestaurantsForMetro, getDirectOrderUrl, ACTIVE_CHAINS } from '@mealcompare/engine';

const METROS = [
  'nyc','chicago','la','sf','boston','miami','dc','austin','houston','atlanta',
  'seattle','denver','philly','nashville','nola','dallas','phoenix','portland',
  'detroit','minneapolis','charlotte','tampa','sandiego','stlouis','pittsburgh',
  'columbus','indianapolis','milwaukee','raleigh','baltimore',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://eddy.delivery';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/ut`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/tamu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/txst`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/utd`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/utsa`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/uh`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tcu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/baylor`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/rice`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/nyu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/ucla`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/uchicago`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/osu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/asu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/gatech`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/bu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/northeastern`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/georgetown`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/gwu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/upenn`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/temple`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/tulane`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/vanderbilt`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/uw`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/usc`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/um`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/smu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/ucsd`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/umn`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/usf`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/cu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/pitt`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/ncstate`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/marquette`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/uncc`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/wayne`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/jhu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/butler`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/berkeley`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/washu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/psu`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/restaurants`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/savings`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/for-restaurants`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/install`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/doordash-markup-explained`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/college-food-delivery-savings`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/blog/credit-card-food-delivery-rewards`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/food-delivery-price-comparison`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/direct-ordering-saves-money`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/best-food-delivery-apps-compared`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/cheapest-food-delivery-austin`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-houston`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-dallas`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-san-antonio`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-chicago`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-nyc`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-la`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-boston`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-seattle`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-denver`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-philly`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-dc`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/how-to-save-on-doordash`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/how-to-save-on-uber-eats`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/dashpass-vs-uber-one-vs-grubhub-plus`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/cheapest-food-delivery-nashville`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-portland`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-phoenix`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-minneapolis`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-detroit`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-tampa`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-san-diego`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-new-orleans`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-st-louis`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-baltimore`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/metros`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/cheapest-food-delivery-indianapolis`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-pittsburgh`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-milwaukee`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-charlotte`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-columbus`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-raleigh`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/why-is-uber-eats-so-expensive`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/food-delivery-fees-explained`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/is-doordash-worth-it`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/blog/cheapest-food-delivery-sf`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-miami`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cheapest-food-delivery-atlanta`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
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

  // Chain menu comparison pages
  const chainPages: MetadataRoute.Sitemap = [
    { url: `${base}/chains`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...ACTIVE_CHAINS.map(chain => ({
      url: `${base}/chains/${chain.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...ACTIVE_CHAINS.map(chain => ({
      url: `${base}/order/${chain.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...metroPages, ...restaurantPages, ...chainPages];
}
