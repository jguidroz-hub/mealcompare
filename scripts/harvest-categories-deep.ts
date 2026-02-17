#!/usr/bin/env npx tsx
import { writeFileSync, readFileSync, existsSync } from 'fs';
interface R { name: string; slug: string; category: string; metros: string[]; toastUrl?: string; websiteOrderUrl?: string; }
function slugify(n: string) { return n.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40); }
function cat(n: string) {
  const l = n.toLowerCase();
  if (l.includes('pizza')) return 'pizza'; if (l.includes('sushi')||l.includes('ramen')) return 'japanese';
  if (l.includes('thai')) return 'thai'; if (l.includes('taco')||l.includes('mexican')) return 'mexican';
  if (l.includes('indian')) return 'indian'; if (l.includes('burger')) return 'burgers';
  if (l.includes('bbq')) return 'bbq'; if (l.includes('cafe')||l.includes('coffee')) return 'cafe';
  if (l.includes('wing')) return 'wings'; if (l.includes('poke')) return 'poke';
  if (l.includes('bakery')||l.includes('donut')) return 'bakery'; if (l.includes('deli')||l.includes('sandwich')) return 'deli';
  if (l.includes('seafood')||l.includes('fish')||l.includes('crab')||l.includes('lobster')) return 'seafood';
  if (l.includes('chinese')||l.includes('wok')||l.includes('dim sum')) return 'chinese';
  if (l.includes('korean')||l.includes('bibimbap')) return 'korean';
  if (l.includes('greek')||l.includes('gyro')||l.includes('mediterranean')) return 'mediterranean';
  if (l.includes('cuban')||l.includes('latin')||l.includes('colombian')||l.includes('peruvian')) return 'latin';
  if (l.includes('jamaican')||l.includes('caribbean')||l.includes('jerk')) return 'caribbean';
  if (l.includes('ethiopian')||l.includes('african')) return 'african';
  if (l.includes('hawaiian')||l.includes('acai')) return 'hawaiian';
  return 'restaurant';
}
function clean(t: string) { return t.replace(/\|.*$/,'').replace(/-\s*(Online|Order|Menu|Delivery|Toast|ChowNow).*$/i,'').replace(/Order (from|online|now) /i,'').trim(); }

const METROS: Record<string,string> = {
  nyc:'New York',chicago:'Chicago',la:'Los Angeles',sf:'San Francisco',boston:'Boston',miami:'Miami',
  dc:'Washington DC',austin:'Austin',houston:'Houston',atlanta:'Atlanta',seattle:'Seattle',denver:'Denver',
  philly:'Philadelphia',nashville:'Nashville',nola:'New Orleans',dallas:'Dallas',phoenix:'Phoenix',
  portland:'Portland',detroit:'Detroit',minneapolis:'Minneapolis',charlotte:'Charlotte',tampa:'Tampa',
  sandiego:'San Diego',stlouis:'St Louis',pittsburgh:'Pittsburgh',columbus:'Columbus',
  indianapolis:'Indianapolis',milwaukee:'Milwaukee',raleigh:'Raleigh',baltimore:'Baltimore',
};

// Deep category queries — things we haven't searched yet
const CATEGORY_QUERIES = [
  (l:string) => `site:order.toasttab.com ${l} deli`,
  (l:string) => `site:order.toasttab.com ${l} bakery`,
  (l:string) => `site:order.toasttab.com ${l} poke`,
  (l:string) => `site:order.toasttab.com ${l} wings`,
  (l:string) => `site:order.toasttab.com ${l} seafood`,
  (l:string) => `site:order.toasttab.com ${l} chinese`,
  (l:string) => `site:order.toasttab.com ${l} greek`,
  (l:string) => `site:order.toasttab.com ${l} sandwich`,
  (l:string) => `site:order.toasttab.com ${l} breakfast`,
  (l:string) => `site:order.toasttab.com ${l} salad`,
  (l:string) => `site:order.toasttab.com ${l} juice smoothie`,
  (l:string) => `site:order.toasttab.com ${l} Cuban`,
  (l:string) => `site:ordering.chownow.com ${l} pizza`,
  (l:string) => `site:ordering.chownow.com ${l} Chinese`,
  (l:string) => `site:ordering.chownow.com ${l} Thai`,
  (l:string) => `site:ordering.chownow.com ${l} Mediterranean`,
];

const URL_MATCHERS = [
  { match: 'order.toasttab.com/online/', key: 'toastUrl' },
  { match: '.toast.site', key: 'toastUrl' },
  { match: 'ordering.chownow.com', key: 'websiteOrderUrl' },
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
    const queries = CATEGORY_QUERIES.map(fn => fn(label));
    process.stdout.write(`🍕 ${metro.toUpperCase()}...`);
    for (const q of queries) {
      for (const r of await search(q)) {
        const platform = URL_MATCHERS.find(p => r.url.includes(p.match));
        if (!platform) continue;
        if (r.url.includes('/item-')) continue;
        const name = clean(r.title); if (name.length<3||name.length>60) continue;
        const slug = slugify(name); if (seen.has(slug)) continue; seen.add(slug);
        const rest: R = {name,slug,category:cat(name),metros:[metro]};
        (rest as any)[platform.key] = r.url.split('?')[0];
        newOnes.push(rest);
      }
      await new Promise(r=>setTimeout(r,300));
    }
    if (newOnes.length>0) writeFileSync(file,JSON.stringify([...existing,...newOnes],null,2));
    total += newOnes.length;
    console.log(` +${newOnes.length}`);
  }
  console.log(`\n🎉 Total: +${total}`);
})();
