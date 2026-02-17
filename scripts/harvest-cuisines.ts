#!/usr/bin/env npx tsx
import { writeFileSync, readFileSync, existsSync } from 'fs';
interface R { name: string; slug: string; category: string; metros: string[]; toastUrl?: string; websiteOrderUrl?: string; }
function slugify(n: string) { return n.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '').slice(0, 40); }
function cat(n: string) {
  const l = n.toLowerCase();
  if (l.includes('pizza')) return 'pizza'; if (l.includes('sushi')||l.includes('ramen')) return 'japanese';
  if (l.includes('thai')) return 'thai'; if (l.includes('taco')||l.includes('mexican')) return 'mexican';
  if (l.includes('indian')||l.includes('curry')) return 'indian'; if (l.includes('burger')) return 'burgers';
  if (l.includes('bbq')||l.includes('barbecue')) return 'bbq'; if (l.includes('cafe')||l.includes('coffee')) return 'cafe';
  if (l.includes('wing')) return 'wings'; if (l.includes('poke')) return 'poke';
  if (l.includes('chinese')||l.includes('dumpling')) return 'chinese'; if (l.includes('korean')) return 'korean';
  if (l.includes('seafood')||l.includes('fish')||l.includes('oyster')) return 'seafood';
  if (l.includes('mediterranean')||l.includes('falafel')||l.includes('shawarma')) return 'mediterranean';
  if (l.includes('breakfast')||l.includes('brunch')||l.includes('pancake')||l.includes('waffle')) return 'breakfast';
  return 'restaurant';
}
function clean(t: string) { return t.replace(/\|.*$/,'').replace(/-\s*(Online|Order|Toast|Menu).*$/i,'').trim(); }
const METROS: Record<string,string> = {
  nyc:'New York',chicago:'Chicago',la:'Los Angeles',sf:'San Francisco',boston:'Boston',miami:'Miami',
  dc:'Washington DC',austin:'Austin',houston:'Houston',atlanta:'Atlanta',seattle:'Seattle',denver:'Denver',
  philly:'Philadelphia',nashville:'Nashville',nola:'New Orleans',dallas:'Dallas',phoenix:'Phoenix',
  portland:'Portland',detroit:'Detroit',minneapolis:'Minneapolis',charlotte:'Charlotte',tampa:'Tampa',
  sandiego:'San Diego',stlouis:'St Louis',pittsburgh:'Pittsburgh',columbus:'Columbus',
  indianapolis:'Indianapolis',milwaukee:'Milwaukee',raleigh:'Raleigh',baltimore:'Baltimore',
};
const CUISINES = ['pizza','sushi','ramen','thai','mexican','indian','chinese','korean','burger','bbq',
  'seafood','mediterranean','poke','wings','breakfast','brunch','sandwich','salad','vegan','soul food',
  'cajun','hawaiian','peruvian','ethiopian','jamaican','greek','turkish','lebanese','cuban','colombian'];

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
    // Pick 8 random cuisines per metro to avoid too many queries
    const shuffled = [...CUISINES].sort(()=>Math.random()-0.5).slice(0,8);
    const queries = shuffled.map(c=>`site:order.toasttab.com ${c} ${label}`);
    process.stdout.write(`🍕 ${metro.toUpperCase()}...`);
    for (const q of queries) {
      for (const r of await search(q)) {
        if (!r.url.includes('order.toasttab.com/online/') || r.url.includes('/item-')) continue;
        const name = clean(r.title); if (name.length<3||name.length>60) continue;
        const slug = slugify(name); if (seen.has(slug)) continue; seen.add(slug);
        newOnes.push({name,slug,category:cat(name),metros:[metro],toastUrl:r.url.split('?')[0]});
      }
      await new Promise(r=>setTimeout(r,300));
    }
    if (newOnes.length>0) writeFileSync(file,JSON.stringify([...existing,...newOnes],null,2));
    total += newOnes.length;
    console.log(` +${newOnes.length}`);
  }
  console.log(`\n🎉 Total: +${total}`);
})();
