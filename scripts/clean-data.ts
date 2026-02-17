#!/usr/bin/env npx tsx
/**
 * Clean restaurant data: remove junk entries, fix categories, filter bad URLs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';

interface Restaurant {
  name: string; slug: string; category: string; metros: string[];
  toastUrl?: string; squareUrl?: string; websiteOrderUrl?: string;
}

// Junk name patterns
const JUNK_PATTERNS = [
  /popmenu/i, /case study/i, /pricing/i, /about us/i, /photography/i,
  /toolkit/i, /trends report/i, /testimonial/i, /competitors/i,
  /menu design/i, /design ideas/i, /blog post/i, /commission delivery/i,
  /^order online$/i, /^delivery & takeout$/i, /- delivery & takeout$/i,
  /^menu$/i, /online ordering for/i, /powered by/i,
  /near me/i, /locations, hours/i, /every restaurant should know/i,
  /digital-first restaurants/i, /restaurant growth/i, /client testimonial/i,
  /^[A-Z]{2,4}$/, // Just state/city codes like "NYC", "ACS", "WTC"
  /^\d+-\d+\s/,  // Street addresses as names like "71-30 main street"
  /pizza in .* city/i, // "Pizza in New York City" etc
  /best restaurant/i, /key strategies/i, /growth playbook/i,
];

const JUNK_URL_PATTERNS = [
  /popmenu\.com\/(blog|post|toolkit|pricing|about|photography|testimonial|case-study)/i,
  /owner\.com\/blog/i,
  /slicelife\.com\/(blog|about|press)/i,
  /getbento\.com\/(blog|about|theme)/i,
  /theme-assets/i, /media-cdn\.getbento/i,
  /\.com\/?$/,  // Just a domain root
];

// Better categorization
function categorize(name: string, url?: string): string {
  const n = name.toLowerCase();
  // Specific matches
  if (/pizza|pizzeria|pie\b/i.test(n)) return 'pizza';
  if (/sushi|ramen|udon|teriyaki|hibachi|japanese|izakaya|poke/i.test(n)) return 'japanese';
  if (/thai\b/i.test(n)) return 'thai';
  if (/taco|burrito|mexican|taqueria|tortilla|enchilada|guac/i.test(n)) return 'mexican';
  if (/indian|curry|tandoori|masala|naan|biryani/i.test(n)) return 'indian';
  if (/burger|shake shack|five guys|smash/i.test(n)) return 'burgers';
  if (/bbq|barbecue|smokehouse|brisket|smoke/i.test(n)) return 'bbq';
  if (/cafe|café|coffee|espresso|roast|brew/i.test(n)) return 'cafe';
  if (/wing|buffalo/i.test(n)) return 'wings';
  if (/poke|poké|acai|açaí/i.test(n)) return 'poke';
  if (/chinese|wok|dim sum|dumpling|noodle|szechuan|hunan|peking|lo mein|chow/i.test(n)) return 'chinese';
  if (/korean|bibimbap|kimchi|bulgogi|kbbq/i.test(n)) return 'korean';
  if (/seafood|fish|crab|lobster|oyster|shrimp|clam/i.test(n)) return 'seafood';
  if (/mediterranean|falafel|shawarma|hummus|gyro|greek|pita/i.test(n)) return 'mediterranean';
  if (/breakfast|brunch|pancake|waffle|egg|omelette|morning/i.test(n)) return 'breakfast';
  if (/deli|sandwich|sub|hoagie|panini/i.test(n)) return 'deli';
  if (/bakery|donut|bagel|pastry|cake|cupcake|cookie|bread/i.test(n)) return 'bakery';
  if (/caribbean|jamaican|jerk/i.test(n)) return 'caribbean';
  if (/ethiopian|african/i.test(n)) return 'african';
  if (/cuban|latin|colombian|peruvian|empanada|arepa/i.test(n)) return 'latin';
  if (/hawaiian|acai/i.test(n)) return 'hawaiian';
  if (/vegan|plant.?based|veggie/i.test(n)) return 'vegan';
  if (/italian|pasta|risotto|trattoria|ristorante/i.test(n)) return 'italian';
  if (/steak|chophouse|steakhouse/i.test(n)) return 'steakhouse';
  if (/vietnamese|pho|banh mi/i.test(n)) return 'vietnamese';
  if (/salad|bowl|grain|healthy/i.test(n)) return 'healthy';
  if (/ice cream|gelato|frozen|yogurt/i.test(n)) return 'dessert';
  if (/tea|boba|bubble/i.test(n)) return 'tea';
  if (/juice|smoothie/i.test(n)) return 'juice';
  if (/fried chicken|chicken/i.test(n)) return 'chicken';
  if (/soul food|southern|cajun|creole|gumbo/i.test(n)) return 'southern';

  // URL-based hints
  if (url) {
    const u = url.toLowerCase();
    if (u.includes('pizza')) return 'pizza';
    if (u.includes('sushi')) return 'japanese';
    if (u.includes('taco') || u.includes('mexican')) return 'mexican';
    if (u.includes('thai')) return 'thai';
    if (u.includes('burger')) return 'burgers';
  }

  return 'restaurant';
}

let totalRemoved = 0;
let totalRecategorized = 0;
const cityFiles = readdirSync('scripts').filter(f => f.endsWith('-places.json')).sort();

for (const file of cityFiles) {
  const metro = file.replace('-places.json', '');
  const data: Restaurant[] = JSON.parse(readFileSync('scripts/' + file, 'utf-8'));
  const before = data.length;

  // Filter junk
  const clean = data.filter(r => {
    // Name check
    if (JUNK_PATTERNS.some(p => p.test(r.name))) return false;
    if (r.name.length < 3 || r.name.length > 60) return false;

    // URL check
    const url = r.toastUrl || r.squareUrl || r.websiteOrderUrl;
    if (url && JUNK_URL_PATTERNS.some(p => p.test(url))) {
      // Remove the bad URL but keep the restaurant if name is valid
      delete r.toastUrl; delete r.squareUrl; delete r.websiteOrderUrl;
    }

    return true;
  });

  // Recategorize
  for (const r of clean) {
    const url = r.toastUrl || r.squareUrl || r.websiteOrderUrl;
    const newCat = categorize(r.name, url);
    if (newCat !== r.category) {
      r.category = newCat;
      totalRecategorized++;
    }
  }

  const removed = before - clean.length;
  totalRemoved += removed;
  if (removed > 0) process.stdout.write(metro + ': -' + removed + ' ');
  writeFileSync('scripts/' + file, JSON.stringify(clean, null, 2));
}

console.log('\n✅ Cleaned');
console.log('   Removed: ' + totalRemoved);
console.log('   Recategorized: ' + totalRecategorized);
