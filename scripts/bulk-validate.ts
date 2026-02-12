#!/usr/bin/env npx tsx
/**
 * Bulk Toast slug validator — generates common restaurant slug patterns
 * and validates them against toast.site via HEAD requests.
 * 
 * NO API keys needed. Just brute-force validation.
 * 
 * Usage: npx tsx scripts/bulk-validate.ts --metro nyc
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';

// Popular restaurant chains + common independents known to use Toast
const CHAIN_SLUGS = [
  // National chains on Toast
  'sweetgreen', 'shakeshack', 'noodlesandcompany', 'potbelly', 'jasonsdeli',
  'mcalisters', 'schlotzskys', 'moesswgrill', 'qdoba', 'chipotle',
  'panera', 'panerabread', 'jimmyjohns', 'jerseymiikes', 'firehouse',
  'firehousesubs', 'whichwich', 'blaze', 'blazepizza', 'modpizza',
  'pieology', 'pizzarev', 'zpizza', 'crustpizza',
  // Common indie patterns
  'thekitchen', 'thecafe', 'thelocal', 'thetap', 'thepub',
  'bluebirdcafe', 'redrobin', 'greenkitchen', 'urbanplate',
];

// Metro-specific well-known restaurants
const METRO_SLUGS: Record<string, string[]> = {
  nyc: [
    'torizaku', 'kelloggsdiner', 'eattap', 'losmunchies1', 'thekatirollcompany',
    'sushikingdom', 'zabbputawnbrooklyn', 'elnopalrestaurant', 'brooklynbridgeitalianrestaurant',
    'yourwaycafe', 'lavenderroom', 'truthrestaurantandlounge', 'krunchykrust',
    'winnerbakery', 'bukharagrillmanhattanrestaurant', 'coffeeprojectny',
    'thelokalrestaurant', 'lotuscuisineofindia', 'toastcoffeehouse',
    // Common NYC restaurant name patterns
    'joes', 'joespizza', 'joesshanghai', 'lukes', 'lukeslobster',
    'halalsguys', 'thehalal', 'shake', 'shakeshack',
    'grimaldis', 'lombardis', 'difara', 'juliana', 'luigis',
    'carmine', 'carminesnyc', 'eataly', 'balthazar',
    'katz', 'katzdeli', 'katzdelicatessen', 'russdaughters',
    'mamafina', 'mamasboynyc', 'lucali', 'emmys', 'emmyssquared',
    'artichoke', 'artichokepizza', 'princestreetpizza',
    'xi', 'xian', 'xianfamous', 'xianfamousfoods',
    'vanessa', 'vanessadumpling', 'joes', 'thecornerbistro',
    'thesmith', 'thediner', 'dinobbq', 'mightquinn', 'mightyquinns',
    'dekalb', 'dekalbmarket', 'bergn', 'smorgasburg',
    'sweetgreen', 'cava', 'cavamezze', 'chopt', 'diginn',
    'justSalad', 'justsalad', 'bareburger', 'bychloe', 'bychloe',
    'tacombi', 'losaburrito', 'dosvias', 'rfreshi',
    'littleitalypizza', 'bensonhurstpizza', 'lpizza', 'famousbens',
    'harlemshake', 'amysthai', 'bangkokstreet', 'upthai',
    'hanjan', 'hanjoowoo', 'kunjip', 'madangsui',
    'gramercy', 'gramercytavern', 'deadrabbit', 'financier',
    'levain', 'levainbakery', 'magnolia', 'magnoliabakery',
    'georgetown', 'georgetowncupcake', 'milk', 'milkbar',
    'momofuku', 'momofukunoodle', 'ssam', 'ssambar',
    'baohaus', 'kopitiam', 'wonton', 'wontonnoodle',
    'redrooster', 'sylvia', 'sylvias', 'amysbrothers',
    'thegreek', 'thegreeknyc', 'astoriaseafood',
    'jacksoncafe', 'queenscomfort', 'lbsteak', 'sripraphai',
  ],
  chicago: [
    'giordanos', 'loumalnatispizzeria', 'portillos', 'alsbeefonitalian',
    'garrettspopcorn', 'loumitchells', 'superdawg', 'thewienerscircle',
    'ricobenes', 'johnnies', 'pequodspizza', 'chicagopizzaandoven',
    'deepdishpizza', 'artofpizza', 'publican', 'girlandthegoat',
    'bigstar', 'aumarche', 'dusekboard', 'chicagodiner',
    'mccormickandschmicks', 'frontera', 'fronteragrill', 'xoco',
    'bavette', 'bavettesbar', 'cindy', 'cindysrooftop',
    'kimski', 'dove', 'doverestaurant', 'parsoncafe',
    'lulacafe', 'londonhouse', 'rpmitalian', 'rpmsea',
    'bellemore', 'mfkrestaurant', 'elske', 'wherevereatery',
    'fatrice', 'fatricechicago', 'dakao', 'bakerandnosh',
    'chickenshop', 'honeybutter', 'honeybutterchicken',
    'stansburger', 'krisspykrunch', 'johnnyskitchen',
    'thecheesecakefactory', 'rockit', 'rockitbar',
    'bonhomme', 'aintshebad', 'thecurryhouse',
  ],
  la: [
    'inandout', 'innout', 'pinkshotdogs', 'pinkshollywood',
    'langers', 'langersdeli', 'philippes', 'grandcentral',
    'guelaguetza', 'brentsdeli', 'canters', 'cantersdeli',
    'portos', 'portosbakery', 'howlin', 'howlinrays',
    'bestia', 'republique', 'gjusta', 'gjelina',
    'animalrestaurant', 'nightbirdla', 'sqirl', 'konbi',
    'langer', 'joansonsoy', 'guerrillatacos', 'mariscos',
    'sugarfish', 'nobu', 'nobumalibu', 'malibuseafood',
    'zankou', 'zankourchicken', 'roscoes', 'roscoeshouse',
    'fatsal', 'fatsals', 'thedoghaus', 'umamicatessen',
    'eggslut', 'grandcentralmarket', 'tacoselgordo',
    'leo', 'leosallday', 'sunright', 'halfandhalf',
    'barkitchen', 'cassia', 'rusticcanyon', 'tartine',
    'bottegalouie', 'catchla', 'meatonthebonebbq',
  ],
  boston: [
    'mikespastry', 'modernapastry', 'nefeli', 'giannottes',
    'neptunoyster', 'legalseafoods', 'unionoyster',
    'barking', 'barkingcrab', 'yankelobster', 'dailycatch',
    'oleana', 'sarma', 'giulia', 'coppa',
    'meiwei', 'myershang', 'genki', 'tora',
    'allfiredpizza', 'dumpling', 'dumplingxuan', 'wokandroll',
    'thebeehive', 'lawnonthed', 'sweetrice', 'sambar',
    'cafenation', 'flour', 'flourbakery', 'tatte', 'tattebakery',
    'clover', 'cloverfast', 'clovergrillshake',
    'lifealive', 'bysmith', 'sweetgreen', 'cavamezze',
    'tasty', 'tastymburger', 'wahlburgers', 'wayfarerboston',
  ],
  miami: [
    'versailles', 'versaillesrestaurant', 'lacarreta',
    'joesstonecrabs', 'joesstone', 'garciasseafood',
    'casatua', 'mymandolin', 'mandolin', 'boia',
    'boiade', 'losfelinos', 'sergios', 'berries',
    'zak', 'zakthebaker', 'bunburybynight', 'coyo',
    'coyotaco', 'suviche', 'lucali', 'lucaliwynwood',
    'komokitchen', 'miam', 'phucchai', 'riviera',
    'laculata', 'beaker', 'beakerandflask', 'drinkhaus',
    'threefifths', 'thecitadel', 'wynwoodyard',
    'swamphead', 'laestradera', 'casalin', 'santinobrew',
  ],
  philly: [
    'pats', 'patskingofsteaks', 'genos', 'genosteaks',
    'jimssouthstreet', 'jimsteaks', 'sonnys', 'famous4th',
    'readingterminal', 'dinics', 'beilersdoughnuts',
    'zahav', 'dizengoff', 'goldie', 'laserlion',
    'federal', 'federaldonuts', 'frankford', 'harp',
    'southgatebrewing', 'pizzabrain', 'emmasquare',
    'stargaze', 'stockyard', 'southphilly', 'bardot',
    'bloomsdale', 'kalaya', 'suraya', 'vedge',
    'thelovedayluckybar', 'evanbrewing', 'ardmore',
  ],
  atlanta: [
    'thevarsity', 'waffle', 'wafflehouse', 'chick',
    'chickfila', 'annies', 'anniesthai', 'bonamie',
    'foxbros', 'foxbrosbbq', 'community', 'communitybbq',
    'sweetauburn', 'gunshow', 'staplehouse', 'bacchanalia',
    'optimist', 'optimistfish', 'marthalore', 'breadwinner',
    'generalmuir', 'thebutteryatl', 'ladybird', 'beetacos',
    'sixfeet', 'sixfeetunder', 'onceandfor', 'poorhendrik',
    'nonis', 'revivalatl', 'supremefish', 'antico',
    'anticopizza', 'amicissima', 'boccalupo', 'thecook',
  ],
  denver: [
    'casabonita', 'denvercentral', 'ilpostinodenver',
    'samsfireplace', 'buckhorn', 'mybrothersbar',
    'guardsandgrace', 'punchbowl', 'mercantile',
    'thesource', 'comida', 'acorndenver', 'rootdown',
    'euclid', 'euclidhall', 'workandclass', 'tavernhg',
    'stowaway', 'denverbiscuit', 'lucile', 'lucilesdenver',
    'snooze', 'snoozemorning', 'universalcafe',
    'illegalpetest', 'bonenrow', 'steubens', 'jbirds',
    'pieclubdenver', 'forestroom', 'deathandco',
  ],
  seattle: [
    'pikeplacefish', 'pikes', 'piroshkypiroshky',
    'biscuitbitch', 'beechers', 'beechershandmade',
    'salumi', 'salumideli', 'canlis', 'canlisrestaurant',
    'barsanmiguel', 'sitandstay', 'revel', 'joule',
    'ezells', 'ezellschicken', 'dicks', 'dicksdrivein',
    'ivarseafood', 'ivars', 'thewalkingpot', 'thaiger',
    'carmines', 'meetthecat', 'soireseattle', 'soireesea',
    'fremont', 'fremontbrewing', 'woodshop', 'thecure',
  ],
  sf: [
    'tartine', 'tartinebakery', 'bourgesbourbon',
    'swanloyster', 'tadich', 'tadigrill', 'houseofprime',
    'tonyromas', 'foreigncinema', 'zazie', 'thelittle',
    'missionchinese', 'burmasuper', 'burmasuperstar',
    'dandelion', 'dandelionchocolate', 'sightglass',
    'fourbarrel', 'bluebottle', 'bluebottlecoffee',
    'humphry', 'humphryslocombe', 'birddog', 'latrappe',
    'sottomare', 'swanoysterdepot', 'hayesvalley',
    'arsicault', 'arsicaultbakery', 'tartinemanufactory',
    'dollydimsum', 'cheunghing', 'goldenmountain',
    'millionthaitea', 'senor', 'senorsisig', 'elfarolito',
  ],
  houston: [
    'ninfa', 'ninfas', 'originalninfas', 'papadeaux',
    'killen', 'killensbbq', 'gatlin', 'gatlinsbbq',
    'truthbbq', 'pitroom', 'pitroombbq', 'tmanderson',
    'underbelly', 'underbellyhospitality', 'onefifth',
    'xochi', 'pinkdoor', 'rielrest', 'beefino',
    'feges', 'fegesbbq', 'nancyshouse', 'crawfish',
    'pappadreaux', 'papasitos', 'govindas', 'himalaya',
    'londonchop', 'thepitroom', 'roost', 'emmalee',
  ],
  nashville: [
    'hattieb', 'hattiebschicken', 'princeshotchicken',
    'boltonsspicy', 'partyfowl', '400degrees',
    'martin', 'martinsbbq', 'jacksbbq', 'edley',
    'edleysbbq', 'pegleg', 'peglegporker',
    'husk', 'huskrestaurant', 'thecatbird',
    'five', 'fivepoints', 'audrey', 'audreyrestaurant',
    'barcelonanashville', 'rolfanddaughters', 'theturnip',
    'thefarmhouse', 'loveless', 'lovelesscafe',
    'pancakepantry', 'biscuitlove', 'thenashville',
    'monells', 'arnolds', 'arnoldscountry', 'merchants',
  ],
  portland: [
    'poktok', 'pokpok', 'screenddoor', 'screendoor',
    'pinoblanc', 'voodoo', 'voodoodonut', 'saltandstraw',
    'lardo', 'lardorestaurant', 'pinetstate', 'pinestbiscuit',
    'portiasplace', 'tusk', 'canard', 'langbaan',
    'kachka', 'kachkarestaurant', 'olympia', 'olympiaprovisions',
    'nostrana', 'ava', 'avasitalian', 'bullard',
    'nuvrei', 'kensbread', 'kensartisan', 'stacked',
    'podnah', 'podnahspit', 'screendr', 'thewoodsman',
  ],
  nola: [
    'commanders', 'commanderspalace', 'galatoires',
    'antoinnes', 'antoines', 'brennan', 'brennans',
    'cochon', 'cochonbutcher', 'peche', 'pecheseafood',
    'companyburgerfries', 'doris', 'dorisdoris',
    'willieandreedtoo', 'bacchanal', 'bacchanalwine',
    'turkeys', 'turkeyandthewolf', 'stein', 'steinsdeli',
    'domilise', 'domilises', 'parasols', 'parkway',
    'parkwaybakery', 'johnnys', 'johnnyspoboyshop',
    'saba', 'sabarestaurant', 'thecombo', 'felixs',
    'camellia', 'camelliagrill', 'mothersmvp', 'mothers',
    'districdonuts', 'districut', 'surreys', 'surreyscafe',
  ],
  sandiego: [
    'hodads', 'hodadsburgers', 'tacostand', 'oscars',
    'oscarsmexican', 'lucha', 'luchaubre', 'lolitas',
    'brokenyolk', 'brokenyolkcafe', 'snooze', 'hash',
    'hashhouse', 'cotija', 'rfreshi', 'pokewan',
    'crossstreet', 'cesarsplace', 'oscarsseafood',
    'juniperfig', 'born', 'bornandbred', 'craft',
    'craftpizza', 'ironside', 'ironsidefish', 'thefishmarket',
    'galaxy', 'galaxytacos', 'thepresley', 'commonfind',
    'tajima', 'tajimaramen', 'undeadbrewing', 'societas',
  ],
  minneapolis: [
    'matts', 'mattsbar', 'thenook', 'convention',
    'conventiongrill', 'juicylucy', 'hellobird',
    'hellopizza', 'youngjoni', 'travail', 'travillkitchen',
    'spoon', 'spoonriver', 'sea', 'seachange',
    'hoishea', 'hoishiang', 'midnorth', 'midnorthfood',
    'revival', 'revivalmpls', 'worldstreet', 'milkjam',
    'milkjamcreamery', 'bobino', 'bobinocafe', 'broders',
    'broderscucinaitalia', 'victors', 'petiteleo',
  ],
};

async function validate(slug: string, platform: 'toast' | 'square' = 'toast'): Promise<boolean> {
  const domain = platform === 'toast' ? 'toast.site' : 'square.site';
  const url = `https://${slug}.${domain}/`;
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    return res.ok || (platform === 'toast' && res.status === 403);
  } catch { return false; }
}

async function crawlMetro(metro: string) {
  const slugs = [...new Set([...CHAIN_SLUGS, ...(METRO_SLUGS[metro] || [])])];
  console.log(`\n🔍 ${metro.toUpperCase()}: Testing ${slugs.length} Toast slugs...`);
  
  const results: Array<{ name: string; slug: string; category: string; metros: string[]; toastUrl: string }> = [];
  const BATCH = 20;
  
  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH);
    const checks = await Promise.all(batch.map(async slug => {
      const ok = await validate(slug);
      return { slug, ok };
    }));
    
    for (const { slug, ok } of checks) {
      if (ok) {
        const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        results.push({
          name,
          slug,
          category: 'restaurant',
          metros: [metro],
          toastUrl: `https://${slug}.toast.site/`,
        });
      }
    }
    
    process.stdout.write(`  ${Math.min(i + BATCH, slugs.length)}/${slugs.length} checked, ${results.length} live\r`);
  }
  
  console.log(`\n  ✅ ${results.length} live Toast restaurants in ${metro}`);
  
  // Save
  writeFileSync(`scripts/${metro}-toast-results.json`, JSON.stringify(results, null, 2));
  
  const tsLines = results.map(r =>
    `  { name: '${r.name.replace(/'/g, "\\'")}', slug: '${r.slug}', category: 'restaurant', metros: ['${metro}'], toastUrl: '${r.toastUrl}' },`
  );
  writeFileSync(`scripts/${metro}-restaurants.ts`,
    `// Auto-generated — ${new Date().toISOString()}\n// ${results.length} verified restaurants in ${metro.toUpperCase()}\n\nexport const ${metro.toUpperCase()}_RESTAURANTS = [\n${tsLines.join('\n')}\n];\n`
  );
  
  return results;
}

// CLI
const args = process.argv.slice(2);
const metroArg = args.find(a => a.startsWith('--metro='))?.split('=')[1]
  || (args.includes('--metro') ? args[args.indexOf('--metro') + 1] : 'all');

(async () => {
  const start = Date.now();
  const metros = metroArg === 'all' ? Object.keys(METRO_SLUGS) : [metroArg];
  
  let totalFound = 0;
  for (const metro of metros) {
    const results = await crawlMetro(metro);
    totalFound += results.length;
  }
  
  console.log(`\n🎉 Total: ${totalFound} restaurants across ${metros.length} cities`);
  console.log(`⏱️ Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
})();
