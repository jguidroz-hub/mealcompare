import { readFileSync, writeFileSync, existsSync } from 'fs';

const metros = ['houston', 'dallas', 'chicago', 'nyc', 'la'];

let newDirectUrls = 0;

for (const metro of metros) {
  const toastFile = `scripts/toast-${metro}-results.json`;
  const placesFile = `scripts/${metro}-places.json`;
  
  if (!existsSync(toastFile)) {
    console.log(`Missing ${toastFile}`);
    continue;
  }
  
  const toastResults = JSON.parse(readFileSync(toastFile, 'utf8'));
  let places = [];
  if (existsSync(placesFile)) {
    places = JSON.parse(readFileSync(placesFile, 'utf8'));
  }
  
  let added = 0;
  
  for (const tr of toastResults) {
    if (!tr.verified) continue;
    
    // Check if it already exists
    const existing = places.find(p => p.slug === tr.slug);
    if (existing) {
      if (!existing.toastUrl) {
        existing.toastUrl = tr.url;
        added++;
        newDirectUrls++;
      }
    } else {
      // Add new restaurant
      places.push({
        name: tr.name,
        slug: tr.slug,
        category: 'restaurant',
        metros: [metro],
        toastUrl: tr.url
      });
      added++;
      newDirectUrls++;
    }
  }
  
  if (added > 0) {
    writeFileSync(placesFile, JSON.stringify(places, null, 2));
    console.log(`✅ ${metro.toUpperCase()}: Added ${added} new Toast direct URLs`);
  } else {
    console.log(`ℹ️ ${metro.toUpperCase()}: No new URLs added`);
  }
}

console.log(`\n🎉 Total new direct ordering URLs: ${newDirectUrls}`);
