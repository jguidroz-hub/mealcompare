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
  // Co-founder's network + Toast-discovered (direct ordering URLs)
  { name: 'Ometeo', slug: 'ometeo', category: 'mexican', metros: ['dc'], toastUrl: 'https://ometeo.toast.site/' },
  { name: 'DC Vegan', slug: 'dcvegan', category: 'vegan', metros: ['dc'], toastUrl: 'https://dcvegan.toast.site/' },
  { name: 'Your Only Friend', slug: 'youronlyfriend', category: 'bar', metros: ['dc'], toastUrl: 'https://youronlyfriend.toast.site/' },
  { name: 'GrillMarx Steakhouse', slug: 'grillmarx', category: 'steakhouse', metros: ['dc'], toastUrl: 'https://grillmarxsteakhouserawbar.toast.site/' },
  { name: 'Social Eats Café', slug: 'socialeats', category: 'cafe', metros: ['dc'], toastUrl: 'https://socialeatscafproject607.toast.site/' },
  { name: 'Central Bar & Restaurant', slug: 'centralbar', category: 'american', metros: ['dc'], toastUrl: 'https://centralbarrestaurant.toast.site/' },
  { name: 'WB Steakhouse', slug: 'wbsteakhouse', category: 'steakhouse', metros: ['dc'], toastUrl: 'https://wbsteaks.toast.site/' },
  { name: 'Portofino Restaurant', slug: 'portofino', category: 'italian', metros: ['dc'], toastUrl: 'https://portofinorestaurant.toast.site/' },
  { name: 'Northside Social', slug: 'northsidesocial', category: 'cafe', metros: ['dc'], toastUrl: 'https://northsidesocialfallschurch-slhmsdug.toast.site/' },
  { name: 'PLNT Burger', slug: 'plntburger', category: 'burgers', metros: ['dc'], toastUrl: 'https://www.toasttab.com/local/plnt-burger-fav/r-58793d11-6ce8-4b04-b57a-0230495343ba' },
  { name: 'On Toast', slug: 'ontoast', category: 'cafe', metros: ['dc'], toastUrl: 'https://www.toasttab.com/local/order/on-toast-1309-5th-street-northeast/r-a0ddb273-1308-4db6-8032-2b411510fb9f' },
  { name: 'Downtown Shawarma', slug: 'downtownshawarma', category: 'middle-eastern', metros: ['dc'], toastUrl: 'https://downtownshawarma.toast.site/' },
  { name: "Guapo's Restaurant", slug: 'guapos', category: 'mexican', metros: ['dc'], toastUrl: 'https://guaposmainpage.toast.site/' },
  { name: 'Tortas y Tacos La Chiquita', slug: 'tortasytacoslachiquita', category: 'mexican', metros: ['dc'], toastUrl: 'https://tortasytacoslachiquitaiii.toast.site/' },
  { name: 'Qui Qui', slug: 'quiqui', category: 'latin', metros: ['dc'], toastUrl: 'https://quiquinew.toast.site/' },
  { name: 'Kusshi Sushi', slug: 'kusshi', category: 'japanese', metros: ['dc'], toastUrl: 'https://kusshi.toast.site/' },
  { name: 'Cactus Cantina', slug: 'cactuscantina', category: 'mexican', metros: ['dc'], toastUrl: 'https://cactuscantina.toast.site/' },
  { name: 'Jack Rose Dining Saloon', slug: 'jackrose', category: 'american', metros: ['dc'], toastUrl: 'https://jackrosediningsaloon.toast.site/' },
  { name: 'DCity Smokehouse', slug: 'dcitysmokehouse', category: 'bbq', metros: ['dc'], toastUrl: 'https://dcitysmokehouseinwashingtondc.toast.site/' },
  { name: 'Sweet Crimes Bakery', slug: 'sweetcrimes', category: 'bakery', metros: ['dc'], toastUrl: 'https://sweetcrimesbakery.toast.site/' },
  { name: 'Sisters Sandwiches & Such', slug: 'sisterssandwiches', category: 'sandwiches', metros: ['dc'], toastUrl: 'https://sisterssandwichessuch.toast.site/' },
  { name: 'Tout de Sweet', slug: 'toutdesweet', category: 'bakery', metros: ['dc'], toastUrl: 'https://toutdesweet.toast.site/' },
  { name: 'BoBaPop Tea Bar', slug: 'bobapop', category: 'tea', metros: ['dc'], toastUrl: 'https://bobapopteabar.toast.site/' },
  { name: 'Flavor Hive', slug: 'flavorhive', category: 'asian', metros: ['dc'], toastUrl: 'https://flavorhiveannandale.toast.site/' },
  { name: 'The Morning Fork', slug: 'themorningfork', category: 'breakfast', metros: ['dc'], toastUrl: 'https://themorningfork.toast.site/' },
  { name: 'TipThai Thai Cuisine', slug: 'tipthai', category: 'thai', metros: ['dc'], toastUrl: 'https://tipthai.toast.site/' },
  { name: 'Baruch Cafe', slug: 'baruchcafe', category: 'cafe', metros: ['dc'], toastUrl: 'https://baruchcafe.toast.site/' },
  { name: 'No Tacos Amigo', slug: 'notacosamigo', category: 'mexican', metros: ['dc'], toastUrl: 'https://notacosamigo.toast.site/' },
  { name: 'Ladurée Bethesda', slug: 'laduree', category: 'bakery', metros: ['dc'], toastUrl: 'https://ladure-ssad58my.toast.site/' },
  { name: 'Rien Tong Thai & Sushi Bar', slug: 'rientong', category: 'thai', metros: ['dc'], toastUrl: 'https://rientongthaiasianrestaurantsushibararlington.toast.site/' },
  { name: 'Taco Rock', slug: 'tacorock', category: 'mexican', metros: ['dc'], toastUrl: 'https://tacorock.toast.site/' },
  { name: 'La Chiquita Taqueria DMV', slug: 'lachiquitadmv', category: 'mexican', metros: ['dc'], toastUrl: 'https://lachiquitataqueriadmv.toast.site/' },
  { name: "Burger Billy's Joint", slug: 'burgerbillys', category: 'burgers', metros: ['dc'], toastUrl: 'https://burgerbillysjoint.toast.site/' },
  { name: 'The Dabney', slug: 'thedabney', category: 'american', metros: ['dc'], toastUrl: 'https://thedabney.toast.site/' },
  { name: 'Rendezvous', slug: 'rendezvous', category: 'french', metros: ['dc'], toastUrl: 'https://rendezvous.toast.site/' },
  { name: 'Red Rocks', slug: 'redrocks', category: 'pizza', metros: ['dc'], toastUrl: 'https://redrocks.toast.site/' },
  { name: 'Rito Loco', slug: 'ritoloco', category: 'mexican', metros: ['dc'], toastUrl: 'https://ritoloco.toast.site/' },
  { name: 'Crisfield Seafood', slug: 'crisfieldseafood', category: 'seafood', metros: ['dc'], toastUrl: 'https://crisfieldseafood.toast.site/' },
  { name: 'Flavor After Ours', slug: 'flavorafterours', category: 'multicultural', metros: ['dc'], toastUrl: 'https://flavorafterours.toast.site/' },
  
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
  // Austin Toast-discovered (direct ordering URLs)
  { name: 'La Traviata', slug: 'latraviata', category: 'italian', metros: ['austin'], toastUrl: 'https://latraviataaustin.toast.site/' },
  { name: 'Casa Tulum', slug: 'casatulum', category: 'mexican', metros: ['austin'], toastUrl: 'https://casatulum.toast.site/' },
  { name: 'Cafe Largesse', slug: 'cafelargesse', category: 'cafe', metros: ['austin'], toastUrl: 'https://cafelargesse.toast.site/' },
  { name: 'Fire Bowl Cafe', slug: 'firebowlcafe', category: 'asian', metros: ['austin'], toastUrl: 'https://firebowlcafelima.toast.site/' },
  { name: 'Taqueria 10 de 10', slug: 'taqueria1010', category: 'mexican', metros: ['austin'], toastUrl: 'https://taqueria1010.toast.site/' },
  { name: 'Mr. Chingon', slug: 'mrchingon', category: 'mexican', metros: ['austin'], toastUrl: 'https://mrchingontaqueria.toast.site/' },
  { name: 'ATX Latin Food', slug: 'atxlatinfood', category: 'latin', metros: ['austin'], toastUrl: 'https://atxlatinfood.toast.site/' },
  { name: 'Tropicana Cuban', slug: 'tropicanacuban', category: 'cuban', metros: ['austin'], toastUrl: 'https://tropicanacubanrestaurant.toast.site/' },
  { name: 'Foreign & Domestic', slug: 'foreigndomestic', category: 'american', metros: ['austin'], toastUrl: 'https://foreigndomestic.toast.site/' },
  { name: 'Taco n Maíz', slug: 'taconmaiz', category: 'mexican', metros: ['austin'], toastUrl: 'https://taconmaiz.toast.site/' },
  { name: 'Ovenbird', slug: 'ovenbird', category: 'american', metros: ['austin'], toastUrl: 'https://ovenbird.toast.site/' },
  { name: "Donkey Mo's Korean Fried Chicken", slug: 'donkeymos', category: 'korean', metros: ['austin'], toastUrl: 'https://donkeymoskoreanfriedchicken.toast.site/' },
  { name: 'Om-Le Road', slug: 'omleroad', category: 'thai', metros: ['austin'], toastUrl: 'https://omleroad.toast.site/' },
  { name: "Buddy's Burger", slug: 'buddysburger', category: 'burgers', metros: ['austin'], toastUrl: 'https://buddysburger.toast.site/' },
  { name: 'Spread & Co.', slug: 'spreadco', category: 'cafe', metros: ['austin'], toastUrl: 'https://spreadcocherrywood.toast.site/' },
  { name: "Keso's Tacos", slug: 'kesostacos', category: 'mexican', metros: ['austin'], toastUrl: 'https://kesostacos.toast.site/' },
  { name: 'The Lokal Restaurant', slug: 'thelokal', category: 'american', metros: ['austin'], toastUrl: 'https://thelokalrestaurant.toast.site/' },
  { name: 'Relish Restaurant & Bar', slug: 'relish', category: 'american', metros: ['austin'], toastUrl: 'https://relishrestaurantbar.toast.site/' },
  { name: "Austin's Pizza", slug: 'austinspizza', category: 'pizza', metros: ['austin'], toastUrl: 'https://austinspizza.toast.site/' },
  { name: 'East Side Pies', slug: 'eastsidepies', category: 'pizza', metros: ['austin'], toastUrl: 'https://eastsidepies.toast.site/' },
  { name: 'The Front Page', slug: 'thefrontpage', category: 'sandwiches', metros: ['austin'], toastUrl: 'https://thefrontpage.toast.site/' },

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
