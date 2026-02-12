/**
 * Top restaurants in Austin, TX and Washington, DC.
 * 
 * Sources: Uber Eats top results, DoorDash popular, Yelp delivery rankings.
 * Each entry includes known direct ordering URLs where available.
 * 
 * Updated: Feb 2026
 */

export interface RestaurantData {
  name: string;
  slug: string; // Normalized for matching
  category: string;
  metros: string[]; // Which metros this chain/restaurant operates in
  toastUrl?: string; // Known Toast/direct ordering URL
  squareUrl?: string; // Known Square online ordering URL
  websiteOrderUrl?: string; // Restaurant's own ordering page
  ubereatsSlug?: string; // Known Uber Eats store slug
  doordashSlug?: string; // Known DoorDash store slug
}

// ─── DC Restaurants (Co-founder's market) ──────────────────────

export const DC_RESTAURANTS: RestaurantData[] = [
  // Co-founder's network (direct Toast URLs known)
  { name: 'Ometeo', slug: 'ometeo', category: 'mexican', metros: ['dc'], toastUrl: 'https://ometeo.toast.site/' },
  
  // National chains (both markets)
  { name: 'Chipotle', slug: 'chipotle', category: 'mexican', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.chipotle.com' },
  { name: 'Chick-fil-A', slug: 'chickfila', category: 'chicken', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.chick-fil-a.com' },
  { name: "McDonald's", slug: 'mcdonalds', category: 'burgers', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.mcdonalds.com/us/en-us/deals.html' },
  { name: 'Subway', slug: 'subway', category: 'sandwiches', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.subway.com' },
  { name: "Wendy's", slug: 'wendys', category: 'burgers', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.wendys.com' },
  { name: 'Taco Bell', slug: 'tacobell', category: 'mexican', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.tacobell.com/food' },
  { name: "Popeyes", slug: 'popeyes', category: 'chicken', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.popeyes.com' },
  { name: 'Panera Bread', slug: 'panera', category: 'bakery', metros: ['austin', 'dc'], websiteOrderUrl: 'https://delivery.panera.com' },
  { name: 'Panda Express', slug: 'pandaexpress', category: 'chinese', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.pandaexpress.com/order' },
  { name: 'Five Guys', slug: 'fiveguys', category: 'burgers', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.fiveguys.com' },
  { name: 'Wingstop', slug: 'wingstop', category: 'wings', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.wingstop.com/order' },
  { name: "Domino's", slug: 'dominos', category: 'pizza', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.dominos.com' },
  { name: 'Pizza Hut', slug: 'pizzahut', category: 'pizza', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.pizzahut.com/menu' },
  { name: "Papa John's", slug: 'papajohns', category: 'pizza', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.papajohns.com/order' },
  { name: 'KFC', slug: 'kfc', category: 'chicken', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.kfc.com/menu' },
  { name: 'Shake Shack', slug: 'shakeshack', category: 'burgers', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.shakeshack.com' },
  { name: 'CAVA', slug: 'cava', category: 'mediterranean', metros: ['austin', 'dc'], websiteOrderUrl: 'https://order.cava.com' },
  { name: 'Sweetgreen', slug: 'sweetgreen', category: 'salads', metros: ['dc'], websiteOrderUrl: 'https://order.sweetgreen.com' },
  { name: "Jersey Mike's", slug: 'jerseymikes', category: 'sandwiches', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.jerseymikes.com/order' },
  { name: "Jimmy John's", slug: 'jimmyjohns', category: 'sandwiches', metros: ['austin', 'dc'], websiteOrderUrl: 'https://online.jimmyjohns.com' },
  { name: 'Raising Canes', slug: 'raisingcanes', category: 'chicken', metros: ['austin', 'dc'], websiteOrderUrl: 'https://www.raisingcanes.com/order' },
  { name: 'Halal Guys', slug: 'halalguys', category: 'halal', metros: ['dc'], websiteOrderUrl: 'https://order.thehalalguys.com' },

  // DC-specific popular spots
  { name: 'Founding Farmers', slug: 'foundingfarmers', category: 'american', metros: ['dc'] },
  { name: 'Nandos Peri-Peri', slug: 'nandos', category: 'chicken', metros: ['dc'], websiteOrderUrl: 'https://www.nandosperiperi.com/order' },
  { name: 'Busboys and Poets', slug: 'busboysandpoets', category: 'american', metros: ['dc'] },
  { name: 'Bens Chili Bowl', slug: 'benschilibowl', category: 'american', metros: ['dc'] },
  { name: 'Fogo de Chao', slug: 'fogodechao', category: 'brazilian', metros: ['dc', 'austin'] },
  { name: 'Clyde\'s', slug: 'clydes', category: 'american', metros: ['dc'] },
  { name: 'Rasika', slug: 'rasika', category: 'indian', metros: ['dc'] },
  { name: 'Maketto', slug: 'maketto', category: 'asian', metros: ['dc'] },
  { name: 'Daikaya', slug: 'daikaya', category: 'japanese', metros: ['dc'] },
  { name: 'Bantam King', slug: 'bantamking', category: 'japanese', metros: ['dc'] },
  { name: 'Doi Moi', slug: 'doimoi', category: 'vietnamese', metros: ['dc'] },
  { name: 'Pho 75', slug: 'pho75', category: 'vietnamese', metros: ['dc'] },
  { name: 'District Taco', slug: 'districttaco', category: 'mexican', metros: ['dc'] },
  { name: 'Amsterdam Falafelshop', slug: 'amsterdamfalafel', category: 'falafel', metros: ['dc'] },
  { name: 'Bonchon', slug: 'bonchon', category: 'korean', metros: ['dc'] },
  { name: 'Good Stuff Eatery', slug: 'goodstuffeatery', category: 'burgers', metros: ['dc'] },
  { name: 'Le Diplomate', slug: 'lediplomate', category: 'french', metros: ['dc'] },
  { name: 'Compass Rose', slug: 'compassrose', category: 'international', metros: ['dc'] },
];

// ─── Austin Restaurants ────────────────────────────────────────

export const AUSTIN_RESTAURANTS: RestaurantData[] = [
  // Austin staples
  { name: 'Whataburger', slug: 'whataburger', category: 'burgers', metros: ['austin'], websiteOrderUrl: 'https://whataburger.com/order' },
  { name: 'Torchys Tacos', slug: 'torchystacos', category: 'mexican', metros: ['austin'], websiteOrderUrl: 'https://torchystacos.com/order-now' },
  { name: 'P. Terrys', slug: 'pterrys', category: 'burgers', metros: ['austin'], websiteOrderUrl: 'https://pterrys.com/order' },
  { name: 'In-N-Out Burger', slug: 'innout', category: 'burgers', metros: ['austin'] },
  { name: 'HEB Curbside', slug: 'heb', category: 'grocery', metros: ['austin'], websiteOrderUrl: 'https://www.heb.com/static-page/curbside' },
  { name: 'Freebirds World Burrito', slug: 'freebirds', category: 'mexican', metros: ['austin'], websiteOrderUrl: 'https://freebirds.com/order' },
  { name: 'Pluckers Wing Bar', slug: 'pluckers', category: 'wings', metros: ['austin'], websiteOrderUrl: 'https://pluckers.com/order-online' },
  { name: 'Kerbey Lane Cafe', slug: 'kerbeylane', category: 'cafe', metros: ['austin'] },
  { name: 'Via 313 Pizza', slug: 'via313', category: 'pizza', metros: ['austin'], websiteOrderUrl: 'https://via313.com/order-online' },
  { name: 'Hopdoddy', slug: 'hopdoddy', category: 'burgers', metros: ['austin'], websiteOrderUrl: 'https://www.hopdoddy.com/order-online' },
  { name: 'Hat Creek Burger', slug: 'hatcreek', category: 'burgers', metros: ['austin'] },
  { name: 'Cabo Bobs', slug: 'cabobobs', category: 'mexican', metros: ['austin'] },
  { name: 'Thai Kitchen', slug: 'thaikitchen', category: 'thai', metros: ['austin'] },
  { name: 'Chuy\'s', slug: 'chuys', category: 'mexican', metros: ['austin'], websiteOrderUrl: 'https://www.chuys.com/order-online' },
  { name: 'Tacodeli', slug: 'tacodeli', category: 'mexican', metros: ['austin'], websiteOrderUrl: 'https://www.tacodeli.com/order' },
  { name: 'Ramen Tatsu-Ya', slug: 'ramentatsuya', category: 'japanese', metros: ['austin'] },
  { name: 'Uchi', slug: 'uchi', category: 'japanese', metros: ['austin'] },
  { name: 'Suerte', slug: 'suerte', category: 'mexican', metros: ['austin'] },
  { name: 'Veracruz All Natural', slug: 'veracruz', category: 'mexican', metros: ['austin'] },
  { name: 'Flyrite Chicken', slug: 'flyrite', category: 'chicken', metros: ['austin'] },
  { name: 'Loro', slug: 'loro', category: 'bbq', metros: ['austin'] },
  { name: 'Franklin Barbecue', slug: 'franklin', category: 'bbq', metros: ['austin'] },
  { name: 'Terry Blacks BBQ', slug: 'terryblacks', category: 'bbq', metros: ['austin'] },
  { name: 'La Barbecue', slug: 'labarbecue', category: 'bbq', metros: ['austin'] },
  { name: 'Salvation Pizza', slug: 'salvationpizza', category: 'pizza', metros: ['austin'] },
  { name: 'Home Slice Pizza', slug: 'homeslice', category: 'pizza', metros: ['austin'] },
  { name: 'Pinthouse Pizza', slug: 'pinthouse', category: 'pizza', metros: ['austin'] },
  { name: 'The Picnic', slug: 'thepicnic', category: 'food-trucks', metros: ['austin'] },
  { name: 'Favor', slug: 'favor', category: 'delivery', metros: ['austin'] }, // platform, not restaurant
  { name: 'Halal Bros', slug: 'halalbros', category: 'halal', metros: ['austin'] },
  { name: 'Tso Chinese Delivery', slug: 'tso', category: 'chinese', metros: ['austin'], websiteOrderUrl: 'https://www.tsochinese.com/' },
  { name: 'Wasota African Cuisine', slug: 'wasota', category: 'african', metros: ['austin'] },
  { name: 'DeSano Pizza', slug: 'desano', category: 'pizza', metros: ['austin'] },
  { name: 'Mod Pizza', slug: 'modpizza', category: 'pizza', metros: ['austin', 'dc'] },
  { name: 'El Pollo Regio', slug: 'elpolloregio', category: 'chicken', metros: ['austin'] },
];

// ─── Combined Index ────────────────────────────────────────────

export const ALL_RESTAURANTS = [...DC_RESTAURANTS, ...AUSTIN_RESTAURANTS];

/**
 * Get restaurants for a specific metro area (includes national chains + local spots).
 */
export function getRestaurantsForMetro(metro: string): RestaurantData[] {
  return ALL_RESTAURANTS.filter(r => r.metros.includes(metro));
}

/**
 * Find a restaurant by name with fuzzy matching.
 * Returns the best match or null.
 */
export function findRestaurantData(name: string, metro?: string): RestaurantData | null {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const pool = metro ? getRestaurantsForMetro(metro) : ALL_RESTAURANTS;

  // Exact slug match
  const exact = pool.find(r => r.slug === normalized);
  if (exact) return exact;

  // Contains match
  const contains = pool.find(r =>
    normalized.includes(r.slug) || r.slug.includes(normalized)
  );
  if (contains) return contains;

  // Partial word match
  const words = name.toLowerCase().split(/\s+/);
  for (const r of pool) {
    if (words.some(w => r.slug.includes(w) || w.includes(r.slug))) {
      return r;
    }
  }

  return null;
}

/**
 * Get direct ordering URL for a restaurant (Toast, Square, or website).
 * Returns null if no direct ordering is known.
 */
export function getDirectOrderUrl(restaurant: RestaurantData): string | null {
  return restaurant.toastUrl ?? restaurant.squareUrl ?? restaurant.websiteOrderUrl ?? null;
}
