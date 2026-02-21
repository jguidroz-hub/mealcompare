import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantsForMetro, getDirectOrderUrl } from '@/lib/restaurants';

/**
 * AI-powered restaurant search (now backed by Postgres)
 * POST /api/ai-search
 * Body: { query: "I want spicy Thai food", metro: "austin" }
 */

interface ParsedIntent {
  cuisines: string[];
  moods: string[];
  priceLevel: 'cheap' | 'mid' | 'upscale' | 'any';
  dietary: string[];
  mealType: string | null;
  keywords: string[];
}

const CUISINE_MAP: Record<string, string[]> = {
  pizza: ['pizza', 'pizzeria', 'pie', 'slice', 'neapolitan', 'new york style', 'deep dish'],
  mexican: ['mexican', 'taco', 'burrito', 'enchilada', 'taqueria', 'tex-mex', 'quesadilla', 'nachos', 'guac', 'salsa'],
  thai: ['thai', 'pad thai', 'curry', 'thai food', 'tom yum', 'massaman', 'green curry', 'red curry', 'basil'],
  japanese: ['japanese', 'sushi', 'ramen', 'udon', 'teriyaki', 'tempura', 'poke', 'izakaya', 'sake', 'miso'],
  chinese: ['chinese', 'dim sum', 'dumpling', 'noodle', 'lo mein', 'fried rice', 'szechuan', 'hunan', 'wonton', 'general tso'],
  indian: ['indian', 'curry', 'tikka', 'masala', 'naan', 'biryani', 'tandoori', 'paneer', 'samosa', 'vindaloo'],
  italian: ['italian', 'pasta', 'risotto', 'gnocchi', 'lasagna', 'ravioli', 'trattoria', 'ristorante', 'alfredo', 'marinara'],
  burgers: ['burger', 'cheeseburger', 'smash burger', 'patty', 'wagyu burger'],
  korean: ['korean', 'bibimbap', 'kimchi', 'bulgogi', 'kbbq', 'korean bbq', 'banchan', 'tteokbokki'],
  vietnamese: ['vietnamese', 'pho', 'banh mi', 'spring roll', 'bun'],
  mediterranean: ['mediterranean', 'falafel', 'shawarma', 'hummus', 'gyro', 'greek', 'pita', 'kebab'],
  bbq: ['bbq', 'barbecue', 'brisket', 'ribs', 'pulled pork', 'smoked', 'smokehouse'],
  seafood: ['seafood', 'fish', 'crab', 'lobster', 'shrimp', 'oyster', 'seared', 'catch'],
  southern: ['southern', 'soul food', 'cajun', 'creole', 'fried chicken', 'gumbo', 'jambalaya', 'biscuit'],
  breakfast: ['breakfast', 'brunch', 'pancake', 'waffle', 'eggs', 'omelette', 'benedict', 'mimosa'],
  cafe: ['cafe', 'coffee', 'latte', 'espresso', 'pastry', 'croissant'],
  deli: ['deli', 'sandwich', 'sub', 'hoagie', 'panini', 'pastrami'],
  healthy: ['healthy', 'salad', 'bowl', 'grain bowl', 'acai', 'smoothie', 'vegan', 'plant based', 'gluten free'],
  steakhouse: ['steak', 'steakhouse', 'chophouse', 'filet', 'ribeye', 'prime'],
  wings: ['wings', 'buffalo wings', 'hot wings', 'boneless wings'],
  dessert: ['dessert', 'ice cream', 'gelato', 'cake', 'cookie', 'donut', 'pastry', 'sweet'],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  spicy: ['spicy', 'hot', 'fire', 'heat', 'kick', 'sriracha', 'habanero', 'ghost pepper'],
  comfort: ['comfort', 'cozy', 'warm', 'hearty', 'filling', 'soul', 'home cooking', 'homestyle', 'classic'],
  quick: ['quick', 'fast', 'grab and go', 'takeout', 'pickup', 'easy', 'simple', 'lunch'],
  fancy: ['fancy', 'upscale', 'fine dining', 'date night', 'romantic', 'elegant', 'nice', 'classy'],
  cheap: ['cheap', 'budget', 'affordable', 'inexpensive', 'value', 'deal', 'bang for buck', 'under $10'],
  late: ['late night', 'midnight', 'after hours', 'late', 'open late', 'night owl'],
  family: ['family', 'kids', 'family friendly', 'group', 'large party'],
  hangover: ['hangover', 'greasy', 'carbs', 'heavy', 'loaded', 'indulgent', 'cheat day'],
};

function parseIntent(query: string): ParsedIntent {
  const q = query.toLowerCase();
  const cuisines: string[] = [];
  for (const [cuisine, keywords] of Object.entries(CUISINE_MAP)) {
    if (keywords.some(k => q.includes(k))) cuisines.push(cuisine);
  }
  const moods: string[] = [];
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (keywords.some(k => q.includes(k))) moods.push(mood);
  }
  const dietary: string[] = [];
  if (/vegan/i.test(q)) dietary.push('vegan');
  if (/vegetarian|veggie/i.test(q)) dietary.push('vegetarian');
  if (/gluten.?free/i.test(q)) dietary.push('gluten-free');
  if (/halal/i.test(q)) dietary.push('halal');
  if (/kosher/i.test(q)) dietary.push('kosher');
  let priceLevel: 'cheap' | 'mid' | 'upscale' | 'any' = 'any';
  if (moods.includes('cheap')) priceLevel = 'cheap';
  if (moods.includes('fancy')) priceLevel = 'upscale';
  let mealType: string | null = null;
  if (/breakfast|brunch|morning/i.test(q)) mealType = 'breakfast';
  if (/lunch/i.test(q)) mealType = 'lunch';
  if (/dinner/i.test(q)) mealType = 'dinner';
  if (/late night|midnight/i.test(q)) mealType = 'late-night';
  if (/dessert|sweet/i.test(q)) mealType = 'dessert';
  const stopWords = new Set(['i', 'want', 'need', 'looking', 'for', 'some', 'good', 'the', 'best', 'a', 'an', 'me', 'my', 'in', 'near', 'around', 'something', 'like', 'get', 'order', 'craving', 'feel', 'feeling', 'mood', 'hungry', 'food', 'restaurant', 'place', 'eat', 'eating', 'tonight', 'today', 'now', 'delivery', 'deliver', 'to', 'from', 'with', 'and', 'or', 'that', 'is', 'are', 'of', 'really']);
  const keywords = q.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  return { cuisines, moods, dietary, priceLevel, mealType, keywords };
}

function scoreRestaurant(r: any, intent: ParsedIntent): number {
  let score = 0;
  const name = r.name.toLowerCase();
  const cat = r.category.toLowerCase();
  if (intent.cuisines.includes(cat)) score += 50;
  for (const cuisine of intent.cuisines) {
    const keywords = CUISINE_MAP[cuisine] || [];
    if (keywords.some(k => name.includes(k))) score += 30;
  }
  for (const kw of intent.keywords) {
    if (name.includes(kw)) score += 20;
    if (cat.includes(kw)) score += 15;
  }
  if (r.directUrl) score += 25;
  if (intent.moods.includes('comfort') && ['southern', 'bbq', 'burgers', 'deli', 'pizza'].includes(cat)) score += 15;
  if (intent.moods.includes('spicy') && ['thai', 'indian', 'mexican', 'korean', 'chinese'].includes(cat)) score += 15;
  if (intent.moods.includes('hangover') && ['burgers', 'pizza', 'breakfast', 'deli', 'mexican'].includes(cat)) score += 15;
  if (intent.moods.includes('quick') && ['burgers', 'pizza', 'deli', 'poke', 'wings'].includes(cat)) score += 10;
  if (intent.moods.includes('fancy') && ['steakhouse', 'seafood', 'italian', 'japanese'].includes(cat)) score += 15;
  if (intent.dietary.includes('vegan') && ['vegan', 'healthy'].includes(cat)) score += 20;
  if (intent.dietary.includes('vegan') && name.includes('vegan')) score += 30;
  if (intent.mealType === 'breakfast' && ['breakfast', 'cafe', 'bakery'].includes(cat)) score += 20;
  if (intent.mealType === 'dessert' && ['dessert', 'bakery', 'tea'].includes(cat)) score += 20;
  return score;
}

export async function POST(req: NextRequest) {
  try {
    const { query, metro = 'nyc' } = await req.json();
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }
    const intent = parseIntent(query);
    const restaurants = await getRestaurantsForMetro(metro);
    const scored = restaurants.map(r => ({
      name: r.name,
      category: r.category,
      directUrl: getDirectOrderUrl(r),
      hasToast: !!r.toastUrl,
      hasSquare: !!r.squareUrl,
      hasWebsite: !!r.websiteOrderUrl,
      score: scoreRestaurant({
        name: r.name,
        category: r.category,
        directUrl: getDirectOrderUrl(r),
      }, intent),
    })).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 20);
    const parts: string[] = [];
    if (intent.cuisines.length) parts.push(intent.cuisines.join(', '));
    if (intent.moods.length) parts.push(intent.moods.join(', '));
    if (intent.dietary.length) parts.push(intent.dietary.join(', '));
    if (intent.mealType) parts.push(intent.mealType);
    return NextResponse.json({
      query, metro,
      intent: { understood: parts.join(' · ') || 'general search', cuisines: intent.cuisines, moods: intent.moods, dietary: intent.dietary, mealType: intent.mealType },
      count: scored.length,
      restaurants: scored,
    }, { headers: { 'Cache-Control': 'public, s-maxage=60' } });
  } catch (e: any) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
