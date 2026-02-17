#!/usr/bin/env npx tsx
import { writeFileSync, readFileSync, existsSync } from 'fs';
interface R { name: string; slug: string; category: string; metros: string[]; websiteOrderUrl?: string; }
function slugify(n: string) { return n.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40); }
function cat(n: string) {
  const l = n.toLowerCase();
  if (l.includes('pizza')) return 'pizza'; if (l.includes('sushi')||l.includes('ramen')) return 'japanese';
  if (l.includes('thai')) return 'thai'; if (l.includes('taco')||l.includes('mexican')) return 'mexican';
  if (l.includes('indian')) return 'indian'; if (l.includes('burger')) return 'burgers';
  if (l.includes('bbq')) return 'bbq'; if (l.includes('cafe')||l.includes('coffee')) return 'cafe';
  if (l.includes('wing')) return 'wings'; if (l.includes('chinese')) return 'chinese';
  if (l.includes('korean')) return 'korean'; if (l.includes('seafood')) return 'seafood';
  return 'restaurant';
}
function clean(t: string) { return t.replace(/\|.*$/,'').replace(/-\s*(Online|Order|Menu|Delivery|Pickup).*$/i,'').replace(/Order (from|online|now) /i,'').trim(); }

const METROS: Record<string,string> = {
  nyc:'New York',chicago:'Chicago',la:'Los Angeles',sf:'San Francisco',boston:'Boston',miami:'Miami',
  dc:'Washington DC',austin:'Austin',houston:'Houston',atlanta:'Atlanta',seattle:'Seattle',denver:'Denver',
  philly:'Philadelphia',nashville:'Nashville',nola:'New Orleans',dallas:'Dallas',phoenix:'Phoenix',
  portland:'Portland',detroit:'Detroit',minneapolis:'Minneapolis',charlotte:'Charlotte',tampa:'Tampa',
  sandiego:'San Diego',stlouis:'St Louis',pittsburgh:'Pittsburgh',columbus:'Columbus',
  indianapolis:'Indianapolis',milwaukee:'Milwaukee',raleigh:'Raleigh',baltimore:'Baltimore',
};

// Niche platforms + broader direct ordering searches
const QUERY_SETS = [
  // Olo (powers many chains + independents)
  (label: string) => `site:olo.com ${label} restaurant order`,
  (label: string) => `site:olo.com ${label} food order online`,
  // Slice (pizza-specific — huge network)
  (label: string) => `site:slicelife.com ${label} pizza`,
  (label: string) => `site:slicelife.com ${label} order`,
  // BentoBox ordering
  (label: string) => `site:getbento.com ${label} restaurant order`,
  // GloriaFood
  (label: string) => `site:gloriafood.com ${label} restaurant`,
  // Clover
  (label: string) => `site:clover.com ${label} restaurant order`,
  // EZCater (catering but still direct)
  (label: string) => `site:ezcater.com ${label} restaurant`,
  // Generic "order direct" searches
  (label: string) => `"order directly from the restaurant" ${label}`,
  (label: string) => `"order direct" restaurant ${label} -doordash -ubereats -grubhub`,
  (label: string) => `restaurant ${label} "our online ordering" -doordash -ubereats`,
  (label: string) => `${label} restaurant "place your order" website direct`,
];

const URL_MATCHERS = [
  { match: '.olo.com', key: 'websiteOrderUrl' },
  { match: 'slicelife.com', key: 'websiteOrderUrl' },
  { match: 'getbento.com', key: 'websiteOrderUrl' },
  { match: 'gloriafood.com', key: 'websiteOrderUrl' },
  { match: '.clover.com', key: 'websiteOrderUrl' },
  { match: 'ezcater.com', key: 'websiteOrderUrl' },
  { match: 'order.toasttab.com', key: 'websiteOrderUrl' },
  { match: 'ordering.chownow.com', key: 'websiteOrderUrl' },
  { match: 'order.online/store', key: 'websiteOrderUrl' },
  { match: '.popmenu.com', key: 'websiteOrderUrl' },
  { match: '.square.site', key: 'websiteOrderUrl' },
  { match: '.menufy.com', key: 'websiteOrderUrl' },
  { match: '.owner.com', key: 'websiteOrderUrl' },
  { match: '.toast.site', key: 'websiteOrderUrl' },
];

async function search(q: string) {
  try {
    const r = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=20`,
      { headers: {'Accept':'application/json','X-Subscription-Token':process.env.BRAVE_API_KEY||''}, signal: AbortSignal.timeout(10000) });
    if (!r.ok) return [];
    const d = await r.json() as any;
    return (d.web?.results||[]).map((r:any)=>({title:r.title,url:r.url}));
  } catch { return []; }
}

(async () => {
  let total = 0;
  for (const [metro, label] of Object.entries(METROS)) {
    const file = `scripts/${metro}-places.json`;
    const existing: R[] = existsSync(file) ? JSON.parse(readFileSync(file,'utf-8')) : [];
    const seen = new Set(existing.map(r=>r.slug));
    const newOnes: R[] = [];
    const queries = QUERY_SETS.map(fn => fn(label));
    process.stdout.write(`🔌 ${metro.toUpperCase()}...`);
    for (const q of queries) {
      for (const r of await search(q)) {
        const platform = URL_MATCHERS.find(p => r.url.includes(p.match));
        if (!platform) continue;
        if (r.url.includes('/item-')) continue;
        const name = clean(r.title); if (name.length<3||name.length>60) continue;
        const slug = slugify(name); if (seen.has(slug)) continue; seen.add(slug);
        newOnes.push({name,slug,category:cat(name),metros:[metro],websiteOrderUrl:r.url.split('?')[0]});
      }
      await new Promise(r=>setTimeout(r,350));
    }
    if (newOnes.length>0) writeFileSync(file,JSON.stringify([...existing,...newOnes],null,2));
    total += newOnes.length;
    console.log(` +${newOnes.length}`);
  }
  console.log(`\n🎉 Total: +${total}`);
})();
