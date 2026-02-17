#!/usr/bin/env npx tsx
import { writeFileSync, readFileSync, existsSync } from 'fs';
interface R { name: string; slug: string; category: string; metros: string[]; websiteOrderUrl?: string; toastUrl?: string; }
function slugify(n: string) { return n.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40); }
function cat(n: string) {
  const l = n.toLowerCase();
  if (l.includes('pizza')) return 'pizza'; if (l.includes('sushi')||l.includes('ramen')) return 'japanese';
  if (l.includes('thai')) return 'thai'; if (l.includes('taco')||l.includes('mexican')) return 'mexican';
  if (l.includes('indian')) return 'indian'; if (l.includes('burger')) return 'burgers';
  if (l.includes('bbq')) return 'bbq'; if (l.includes('cafe')||l.includes('coffee')) return 'cafe';
  if (l.includes('wing')) return 'wings'; if (l.includes('chinese')) return 'chinese';
  if (l.includes('poke')) return 'poke'; if (l.includes('seafood')) return 'seafood';
  if (l.includes('mediterranean')||l.includes('greek')||l.includes('falafel')) return 'mediterranean';
  if (l.includes('korean')) return 'korean'; if (l.includes('bakery')||l.includes('donut')) return 'bakery';
  return 'restaurant';
}
function clean(t: string) { return t.replace(/\|.*$/,'').replace(/-\s*(Online|Order|Menu|Delivery|Pickup|Toast|ChowNow|Popmenu).*$/i,'').replace(/Order (from|online|now) /i,'').trim(); }

const METROS: Record<string,string[]> = {
  nyc: ['Jersey City NJ','Hoboken NJ','Stamford CT','White Plains NY','Yonkers NY','New Rochelle NY'],
  chicago: ['Evanston IL','Oak Park IL','Naperville IL','Schaumburg IL','Arlington Heights IL'],
  la: ['Pasadena CA','Glendale CA','Long Beach CA','Burbank CA','Torrance CA','Irvine CA'],
  sf: ['Berkeley CA','Palo Alto CA','San Mateo CA','Walnut Creek CA','San Jose CA'],
  boston: ['Newton MA','Quincy MA','Worcester MA','Providence RI'],
  miami: ['Fort Lauderdale FL','Hollywood FL','Boca Raton FL','West Palm Beach FL'],
  dc: ['Alexandria VA','Bethesda MD','Silver Spring MD','Tysons VA','Rockville MD'],
  austin: ['Round Rock TX','Cedar Park TX','Georgetown TX','San Marcos TX'],
  houston: ['Sugar Land TX','The Woodlands TX','Katy TX','Pearland TX'],
  atlanta: ['Marietta GA','Roswell GA','Sandy Springs GA','Alpharetta GA'],
  seattle: ['Bellevue WA','Redmond WA','Kirkland WA','Tacoma WA','Everett WA'],
  denver: ['Boulder CO','Aurora CO','Lakewood CO','Fort Collins CO'],
  dallas: ['Plano TX','Arlington TX','Frisco TX','McKinney TX','Irving TX'],
  phoenix: ['Mesa AZ','Chandler AZ','Gilbert AZ','Glendale AZ','Peoria AZ'],
  portland: ['Beaverton OR','Lake Oswego OR','Tigard OR','Salem OR'],
  tampa: ['Clearwater FL','Sarasota FL','Lakeland FL','Brandon FL'],
  sandiego: ['Chula Vista CA','Oceanside CA','Carlsbad CA','Encinitas CA'],
  charlotte: ['Huntersville NC','Cornelius NC','Matthews NC','Gastonia NC'],
  raleigh: ['Cary NC','Apex NC','Wake Forest NC','Morrisville NC'],
  baltimore: ['Towson MD','Columbia MD','Annapolis MD','Ellicott City MD'],
};

const URL_MATCHERS = [
  { match: 'order.toasttab.com/online/', key: 'toastUrl' },
  { match: '.toast.site', key: 'toastUrl' },
  { match: 'ordering.chownow.com', key: 'websiteOrderUrl' },
  { match: 'order.online/store', key: 'websiteOrderUrl' },
  { match: '.popmenu.com', key: 'websiteOrderUrl' },
  { match: '.square.site', key: 'websiteOrderUrl' },
  { match: '.menufy.com', key: 'websiteOrderUrl' },
  { match: '.owner.com', key: 'websiteOrderUrl' },
  { match: '.olo.com', key: 'websiteOrderUrl' },
  { match: 'slicelife.com', key: 'websiteOrderUrl' },
  { match: 'getbento.com', key: 'websiteOrderUrl' },
  { match: 'ezcater.com', key: 'websiteOrderUrl' },
  { match: '.clover.com', key: 'websiteOrderUrl' },
  { match: 'gloriafood.com', key: 'websiteOrderUrl' },
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
  for (const [metro, suburbs] of Object.entries(METROS)) {
    const file = `scripts/${metro}-places.json`;
    const existing: R[] = existsSync(file) ? JSON.parse(readFileSync(file,'utf-8')) : [];
    const seen = new Set(existing.map(r=>r.slug));
    const newOnes: R[] = [];
    const queries: string[] = [];
    for (const sub of suburbs) {
      queries.push(`site:order.toasttab.com ${sub} restaurant`);
      queries.push(`site:ordering.chownow.com ${sub}`);
      queries.push(`site:slicelife.com ${sub} pizza`);
    }
    process.stdout.write(`🏘️ ${metro.toUpperCase()} suburbs (${suburbs.length})...`);
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
