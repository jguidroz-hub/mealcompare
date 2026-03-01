/**
 * Chain Deep Links — Phase 4
 * 
 * Maps chain slugs to their ordering URLs on each platform + direct.
 * These enable "one click to order on the winning platform."
 */

export interface ChainLinks {
  direct?: string;
  doordash?: string;
  ubereats?: string;
  grubhub?: string;
  app?: string; // Mobile app deep link (iOS/Android)
}

/**
 * Build a search-based deep link for any platform.
 * Works as fallback when we don't have an exact store link.
 */
export function buildSearchLink(platform: string, chainName: string, metro?: string): string {
  const q = encodeURIComponent(chainName);
  switch (platform) {
    case 'doordash':
      return `https://www.doordash.com/search/store/${q}/`;
    case 'ubereats':
      return `https://www.ubereats.com/search?q=${q}`;
    case 'grubhub':
      return `https://www.grubhub.com/search?orderMethod=delivery&query=${q}`;
    case 'direct':
      return CHAIN_DIRECT_URLS[chainName.toLowerCase()] ?? 
             `https://www.google.com/search?q=${q}+order+online+direct`;
    case 'pickup':
      return `https://www.google.com/maps/search/${q}`;
    default:
      return `https://www.google.com/search?q=${q}+order+online`;
  }
}

/**
 * Known direct ordering URLs for top chains.
 */
const CHAIN_DIRECT_URLS: Record<string, string> = {
  "mcdonald's": 'https://www.mcdonalds.com/us/en-us/mobile-order-and-pay.html',
  'chipotle': 'https://www.chipotle.com/order',
  "chick-fil-a": 'https://www.chick-fil-a.com/order',
  'subway': 'https://order.subway.com/',
  'taco bell': 'https://www.tacobell.com/food',
  "wendy's": 'https://order.wendys.com/',
  'burger king': 'https://www.bk.com/menu',
  'popeyes': 'https://www.popeyes.com/order',
  "domino's": 'https://www.dominos.com/en/',
  'pizza hut': 'https://www.pizzahut.com/menu',
  "papa john's": 'https://www.papajohns.com/order',
  'panda express': 'https://www.pandaexpress.com/order',
  'wingstop': 'https://www.wingstop.com/order',
  'panera bread': 'https://delivery.panera.com/',
  'five guys': 'https://order.fiveguys.com/',
  'starbucks': 'https://app.starbucks.com/',
  "raising cane's": 'https://www.raisingcanes.com/order',
  'whataburger': 'https://whataburger.com/order',
  'sonic drive-in': 'https://www.sonicdrivein.com/menu',
  "dunkin'": 'https://www.dunkindonuts.com/en/mobile-ordering',
  "arby's": 'https://www.arbys.com/menu',
  'kfc': 'https://www.kfc.com/order',
  'shake shack': 'https://order.shakeshack.com/',
  "jersey mike's": 'https://www.jerseymikes.com/menu',
  'cava': 'https://order.cava.com/',
  'sweetgreen': 'https://order.sweetgreen.com/',
  'firehouse subs': 'https://www.firehousesubs.com/order',
  "zaxby's": 'https://www.zaxbys.com/menu',
  'jack in the box': 'https://www.jackinthebox.com/order',
  'noodles & company': 'https://www.noodles.com/order',
  'tropical smoothie cafe': 'https://www.tropicalsmoothiecafe.com/order',
  "culver's": 'https://www.culvers.com/order',
  'el pollo loco': 'https://www.elpolloloco.com/order',
  "portillo's": 'https://www.portillos.com/order-online/',
  'del taco': 'https://www.deltaco.com/order',
  'wawa': 'https://www.wawa.com/order',
  'qdoba': 'https://order.qdoba.com/',
  "jimmy john's": 'https://www.jimmyjohns.com/order/',
  "moe's southwest grill": 'https://www.moes.com/order',
  "bojangles": 'https://www.bojangles.com/order-online/',
  "torchy's tacos": 'https://www.torchystacos.com/order',
  "p. terry's": 'https://www.pterrys.com/order',
};

/**
 * Get all ordering links for a chain across platforms.
 */
export function getChainLinks(chainName: string): ChainLinks {
  const lower = chainName.toLowerCase();
  return {
    direct: CHAIN_DIRECT_URLS[lower],
    doordash: buildSearchLink('doordash', chainName),
    ubereats: buildSearchLink('ubereats', chainName),
    grubhub: buildSearchLink('grubhub', chainName),
  };
}

/**
 * Get the best link for ordering on a specific platform.
 */
export function getOrderLink(chainName: string, platform: string): string {
  if (platform === 'direct') {
    const lower = chainName.toLowerCase();
    return CHAIN_DIRECT_URLS[lower] ?? buildSearchLink('direct', chainName);
  }
  return buildSearchLink(platform, chainName);
}
