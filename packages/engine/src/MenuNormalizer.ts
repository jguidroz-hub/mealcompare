import { CartItem, normalizeMenuItemName } from '@mealcompare/shared';

/**
 * Menu normalization engine.
 * 
 * The core challenge: the same item has different names across platforms.
 * "Chicken Burrito Bowl" on DoorDash might be "Burrito Bowl - Chicken" on Uber Eats
 * and "Bowl (Chicken, Burrito)" on Grubhub.
 * 
 * v0: Multi-strategy matching with weighted scoring.
 * v1: AI-powered matching with training data from confirmed matches.
 */

// Common food abbreviations/synonyms
const SYNONYMS: Record<string, string[]> = {
  'guac': ['guacamole'],
  'guacamole': ['guac'],
  'fries': ['french fries', 'frites'],
  'french fries': ['fries', 'frites'],
  'coke': ['coca cola', 'coca-cola'],
  'coca cola': ['coke', 'coca-cola'],
  'pepsi': ['pepsi cola'],
  'dr pepper': ['dr. pepper'],
  'mac': ['macaroni'],
  'mac and cheese': ['macaroni and cheese', 'mac & cheese'],
  'bbq': ['barbecue', 'barbeque'],
  'barbecue': ['bbq', 'barbeque'],
  'combo': ['meal', 'whatameal'],
  'meal': ['combo', 'whatameal'],
  'sm': ['small'],
  'md': ['medium', 'med'],
  'lg': ['large'],
  'med': ['medium', 'md'],
  'pc': ['piece', 'pcs'],
  'piece': ['pc', 'pcs'],
  'w/': ['with'],
  'w/o': ['without', 'no'],
  'chkn': ['chicken'],
  'chicken': ['chkn'],
  'sandwich': ['sando', 'sandw'],
  'burg': ['burger', 'hamburger'],
  'burger': ['hamburger', 'burg'],
  'quesadilla': ['quesa'],
  'appetizer': ['app', 'starter'],
  'wings': ['wing', 'wngs'],
  'nuggets': ['nugs', 'nugget'],
  'tenders': ['tender', 'strips'],
  'strips': ['strip', 'tenders'],
};

// Size modifiers to strip for matching (compare base item, not size)
const SIZE_MODIFIERS = [
  'small', 'medium', 'large', 'regular', 'xl', 'extra large',
  'sm', 'md', 'lg', 'reg', 'kid', 'kids', 'family', 'party',
  '6 pc', '8 pc', '10 pc', '12 pc', '20 pc', '6pc', '8pc', '10pc', '12pc', '20pc',
  '6 piece', '8 piece', '10 piece', '12 piece', '20 piece',
];

export class MenuNormalizer {
  /**
   * Compute similarity between two menu item names.
   * Uses multiple strategies and picks the best score.
   */
  similarity(a: string, b: string): number {
    const na = normalizeMenuItemName(a);
    const nb = normalizeMenuItemName(b);

    if (na === nb) return 1.0;

    // Strategy 1: Token Jaccard
    const jaccardScore = this.tokenJaccard(na, nb);

    // Strategy 2: Synonym-expanded Jaccard
    const synonymScore = this.synonymJaccard(na, nb);

    // Strategy 3: Size-stripped match (ignore size, match base item)
    const sizeStrippedScore = this.sizeStrippedMatch(na, nb);

    // Strategy 4: Containment (one name contains the other)
    const containmentScore = this.containment(na, nb);

    // Strategy 5: Numbered item match (#1, #2, etc.)
    const numberedScore = this.numberedMatch(na, nb);

    return Math.max(jaccardScore, synonymScore, sizeStrippedScore, containmentScore, numberedScore);
  }

  private tokenJaccard(a: string, b: string): number {
    const tokensA = new Set(a.split(/\s+/));
    const tokensB = new Set(b.split(/\s+/));
    const intersection = new Set([...tokensA].filter(t => tokensB.has(t)));
    const union = new Set([...tokensA, ...tokensB]);
    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  private synonymJaccard(a: string, b: string): number {
    const tokensA = this.expandSynonyms(a.split(/\s+/));
    const tokensB = this.expandSynonyms(b.split(/\s+/));
    const intersection = new Set([...tokensA].filter(t => tokensB.has(t)));
    const union = new Set([...tokensA, ...tokensB]);
    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  private expandSynonyms(tokens: string[]): Set<string> {
    const expanded = new Set(tokens);
    for (const token of tokens) {
      const syns = SYNONYMS[token];
      if (syns) {
        for (const s of syns) {
          // Add each word of multi-word synonyms
          for (const word of s.split(/\s+/)) {
            expanded.add(word);
          }
        }
      }
    }
    return expanded;
  }

  private sizeStrippedMatch(a: string, b: string): number {
    let strippedA = a;
    let strippedB = b;
    for (const mod of SIZE_MODIFIERS) {
      const re = new RegExp(`\\b${mod}\\b`, 'gi');
      strippedA = strippedA.replace(re, '').trim();
      strippedB = strippedB.replace(re, '').trim();
    }
    strippedA = strippedA.replace(/\s+/g, ' ').trim();
    strippedB = strippedB.replace(/\s+/g, ' ').trim();

    if (strippedA === strippedB && strippedA.length > 2) return 0.85; // High but not perfect (size differs)
    return this.tokenJaccard(strippedA, strippedB) * 0.85;
  }

  private containment(a: string, b: string): number {
    // If one name fully contains the other, it's likely a match
    if (a.length >= 3 && b.includes(a)) return 0.8;
    if (b.length >= 3 && a.includes(b)) return 0.8;
    return 0;
  }

  private numberedMatch(a: string, b: string): number {
    // Match "#1 Whataburger" to "#1 Whataburger Whatameal"
    const numA = a.match(/^#(\d+)\s+(.+)/);
    const numB = b.match(/^#(\d+)\s+(.+)/);
    if (numA && numB && numA[1] === numB[1]) {
      // Same number — check if base name overlaps
      const baseScore = this.tokenJaccard(numA[2], numB[2]);
      return Math.max(0.75, baseScore); // At minimum 0.75 if numbers match
    }
    return 0;
  }

  /**
   * Find the best matching item from a candidate list.
   * Returns null if no match exceeds the threshold.
   */
  findBestMatch(
    item: CartItem,
    candidates: Array<{ name: string; price: number }>,
    threshold = 0.50
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

  /**
   * Match all cart items against a menu, returning matched + unmatched.
   */
  matchCart(
    items: CartItem[],
    menuItems: Array<{ name: string; price: number }>,
    threshold = 0.50
  ): {
    matched: Array<{ cartItem: CartItem; menuItem: { name: string; price: number }; confidence: number }>;
    unmatched: CartItem[];
  } {
    const matched: Array<{ cartItem: CartItem; menuItem: { name: string; price: number }; confidence: number }> = [];
    const unmatched: CartItem[] = [];

    for (const item of items) {
      const match = this.findBestMatch(item, menuItems, threshold);
      if (match) {
        matched.push({ cartItem: item, menuItem: { name: match.name, price: match.price }, confidence: match.confidence });
      } else {
        unmatched.push(item);
      }
    }

    return { matched, unmatched };
  }
}
