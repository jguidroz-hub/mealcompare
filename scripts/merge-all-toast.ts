import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';

const toastFiles = readdirSync('scripts').filter(f => f.match(/^toast-.*-results\.json$/)).sort();
let totalNew = 0;

for (const tf of toastFiles) {
  const metro = tf.replace('toast-', '').replace('-results.json', '');
  const placesFile = `scripts/${metro}-places.json`;
  
  const toastResults = JSON.parse(readFileSync(`scripts/${tf}`, 'utf8'));
  let places = [];
  if (existsSync(placesFile)) {
    places = JSON.parse(readFileSync(placesFile, 'utf8'));
  }
  
  let added = 0;
  for (const tr of toastResults) {
    if (!tr.verified) continue;
    const existing = places.find((p: any) => p.slug === tr.slug);
    if (existing) {
      if (!existing.toastUrl) { existing.toastUrl = tr.url; added++; totalNew++; }
    } else {
      places.push({ name: tr.name, slug: tr.slug, category: 'restaurant', metros: [metro], toastUrl: tr.url });
      added++; totalNew++;
    }
  }
  
  if (added > 0) {
    writeFileSync(placesFile, JSON.stringify(places, null, 2));
    console.log(`✅ ${metro}: +${added}`);
  }
}
console.log(`\n🎉 Total new: ${totalNew}`);
