# MealCompare 🍔

**"Kayak for Food Delivery"** — Compare prices across DoorDash, Uber Eats, Grubhub & direct ordering.

## Architecture

```
packages/
├── shared/      # Types, constants, helpers (shared across all packages)
├── engine/      # Comparison engine + platform adapters
├── extension/   # Chrome extension (content scripts + popup)
└── web/         # Next.js API + landing page
```

## Monorepo Structure

- **@mealcompare/shared** — Core types (`CartItem`, `PlatformQuote`, `ComparisonResult`), normalization helpers
- **@mealcompare/engine** — `ComparisonEngine` orchestrates platform adapters, `MenuNormalizer` for cross-platform item matching
- **@mealcompare/extension** — Chrome MV3 extension: content scripts detect carts on delivery platforms, popup shows comparison
- **@mealcompare/web** — Next.js app: `/api/compare` endpoint for the extension, landing page for installs

## How It Works

1. User browses DoorDash/Uber Eats/Grubhub
2. Content script detects cart items via DOM parsing
3. Background worker calls `/api/compare` with cart data
4. Engine queries other platforms for the same restaurant + items
5. Popup shows price comparison with deep links to switch

## Development

```bash
npm install
npm run dev:web    # Start API server on :3001
npm run dev:ext    # Build extension (load unpacked in chrome://extensions)
```

## MVP Scope (2 weeks)

**Week 1:** Chrome extension + comparison engine core
- Cart capture from DoorDash, Uber Eats, Grubhub
- Cross-platform restaurant matching
- Public menu price lookup (no auth)
- Popup UI with price comparison + deep links

**Week 2:** Market data + polish
- Top 200 restaurants in Austin + DC
- Delivery fee estimation
- Savings calculation
- Landing page + Chrome Web Store submission

## Markets

- **Austin, TX** — Jon's base, strong delivery market, Favor (local platform)
- **Washington, DC** — Co-founder's market, restaurant operator network

## Tech Stack

- TypeScript monorepo (npm workspaces)
- Chrome Extension Manifest V3
- Next.js 15 (API + landing page)
- Vite (extension build)
