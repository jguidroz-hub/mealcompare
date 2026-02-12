import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://skipthefee.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://skipthefee.vercel.app/install', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://skipthefee.vercel.app/restaurants', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://skipthefee.vercel.app/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
