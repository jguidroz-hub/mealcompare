import { CartItem, normalizeMenuItemName } from '@mealcompare/shared';

/**
 * Menu normalization engine.
 * 
 * The core challenge: the same item has different names across platforms.
 * "Chicken Burrito Bowl" on DoorDash might be "Burrito Bowl - Chicken" on Uber Eats
 * and "Bowl (Chicken, Burrito)" on Grubhub.
 * 
 * v0 strategy: Fuzzy string matching with restaurant-specific overrides.
 * v1: AI-powered matching with training data from confirmed matches.
 */
export class MenuNormalizer {
  /**
   * Compute similarity between two menu item names.
   * Returns 0-1 score where 1 = exact match.
   */
  similarity(a: string, b: string): number {
    const na = normalizeMenuItemName(a);
    const nb = normalizeMenuItemName(b);

    if (na === nb) return 1.0;

    // Token-based matching
    const tokensA = new Set(na.split(/\s+/));
    const tokensB = new Set(nb.split(/\s+/));

    const intersection = new Set([...tokensA].filter(t => tokensB.has(t)));
    const union = new Set([...tokensA, ...tokensB]);

    if (union.size === 0) return 0;

    // Jaccard similarity
    const jaccard = intersection.size / union.size;

    // Boost if key food words match (protein, dish type)
    const foodWords = [
      'chicken', 'beef', 'pork', 'shrimp', 'fish', 'tofu', 'veggie', 'steak',
      'burger', 'burrito', 'bowl', 'taco', 'pizza', 'sandwich', 'wrap', 'salad',
      'soup', 'pasta', 'rice', 'noodle', 'wings', 'fries', 'combo', 'meal',
      'small', 'medium', 'large', 'regular', 'family',
    ];

    const foodA = [...tokensA].filter(t => foodWords.includes(t));
    const foodB = [...tokensB].filter(t => foodWords.includes(t));
    const foodMatch = foodA.filter(t => foodB.includes(t)).length;
    const foodTotal = Math.max(foodA.length, foodB.length, 1);
    const foodScore = foodMatch / foodTotal;

    // Weighted: 60% Jaccard, 40% food-word match
    return jaccard * 0.6 + foodScore * 0.4;
  }

  /**
   * Find the best matching item from a candidate list.
   * Returns null if no match exceeds the threshold.
   */
  findBestMatch(
    item: CartItem,
    candidates: Array<{ name: string; price: number }>,
    threshold = 0.55
  ): { name: string; price: number; confidence: number } | null {
    let best: { name: string; price: number; confidence: number } | null = null;

    for (const candidate of candidates) {
      const score = this.similarity(item.name, candidate.name);
      if (score >= threshold && (!best || score > best.confidence)) {
        best = { ...candidate, confidence: score };
      }
    }

    return best;
  }
}
