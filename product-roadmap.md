# Eddy Product Roadmap

*Based on cofounder feedback, Feb 28 2026*

## Vision
"Pick a restaurant, build your order, and Eddy calculates the best deal across every delivery service based on your actual benefits (credit cards, memberships, etc). Click to load it up in the winning app."

## Current State
- Restaurant-level price comparison across DoorDash, UberEats, Grubhub, direct ordering
- 30 cities, 19K+ restaurants
- Chrome extension + website (eddy.delivery)
- Featured listings monetization ($29/$99/mo)
- No menu-level data, no user profiles, no cart abstraction

---

## Phase 1: My Benefits Profile (MVP — 2-3 weeks)
**Goal:** Make existing comparisons personalized based on user's real costs.

### Features
- **Benefits profile** (stored locally or with account):
  - Credit cards: Chase Sapphire (3x dining), Amex Gold (4x restaurants), etc.
  - Memberships: DashPass ($9.99/mo → $0 delivery + reduced fees), Uber One ($9.99/mo → $0 delivery), Grubhub+ ($9.99/mo → $0 delivery)
  - Loyalty points / credits: Chase DoorDash credits ($5/mo Sapphire Reserve), Amex Uber credits ($15/mo Platinum)
- **Adjusted comparison**: Show "your price" vs sticker price per platform
  - Factor in: delivery fee waiver (membership), service fee reduction, credit card cashback/points value, monthly credits remaining
- **Savings tracker**: "You've saved $X this month by using Eddy"

### Technical Scope
- User profile UI (settings page or extension popup)
- Benefits calculator module (credit card rewards DB, membership fee structures)
- Modified comparison display: "Sticker: $24.50 → Your cost: $21.30" per platform
- Local storage for privacy (no account required), optional account for sync

### Benefits Database (built-in)
Common cards & their dining/delivery categories:
- Chase Sapphire Preferred/Reserve (3x dining)
- Amex Gold (4x restaurants)
- Capital One SavorOne (3% dining)
- Citi Custom Cash (5% top category)
- DoorDash credit cards
- Uber Visa (5% on Uber orders)

Memberships:
- DashPass: $0 delivery on $12+ orders, reduced service fees
- Uber One: $0 delivery on $15+ orders, 5% off orders
- Grubhub+: $0 delivery on $12+ orders

---

## Phase 2: Menu Normalization — Top Chains (1-2 months)
**Goal:** Enable item-level comparison for popular chains.

### Approach
- Start with top 50 chains (Chipotle, McDonald's, Chick-fil-A, Subway, etc.)
- Normalize menu items across platforms (same burrito, different prices)
- Show per-item price deltas ("Chipotle burrito bowl: $10.50 on DoorDash vs $9.75 direct")
- Chain menus are standardized → easier to match across platforms

### Technical
- Menu scraping pipeline (or partner APIs if available)
- Item matching/normalization engine
- Price monitoring (menus change frequently — need refresh cadence)
- DB: `menu_items` table with platform-specific pricing

---

## Phase 3: Cart Builder + Real-Time Pricing (2-3 months)
**Goal:** Build your actual order, see the true total on every platform.

### Features
- Pick restaurant → see normalized menu
- Add items with customizations (size, toppings, etc.)
- Real-time total per platform including:
  - Item prices (often different per platform — markup varies)
  - Delivery fee (or $0 with membership)
  - Service fee
  - Small order fee
  - Tip (user sets once, applied to all)
  - Tax
  - Credit card rewards / points value
  - Monthly credits applied
- **Winner badge**: "Best deal: UberEats — Save $4.20 vs DoorDash"

### Technical
- Cart abstraction layer (platform-agnostic item model)
- Fee calculator per platform (delivery, service, small order, tax)
- Real-time or near-real-time pricing (cache with TTL)

---

## Phase 4: Handoff & Auto-Fill (1-2 months)
**Goal:** One click to place the order on the winning platform.

### Approaches (from easiest to hardest)
1. **Deep link to restaurant page** on winning platform (works today for most)
2. **Chrome extension auto-navigation** — opens the platform, navigates to restaurant
3. **Cart pre-fill via extension** — inject items into the platform's cart (fragile, platform-dependent)
4. **API ordering** (long-term dream — requires partnerships or reverse engineering)

### Realistic v1
- Deep link to restaurant on winning platform
- Extension shows "your cart" side-by-side so you can manually re-enter
- Clipboard copy of order summary for easy re-entry

---

## Monetization Evolution
| Phase | Revenue Model |
|-------|--------------|
| Current | Featured restaurant listings ($29/$99/mo) |
| Phase 1 | Premium benefits profiles (free tier: 1 card, paid: unlimited cards + memberships) |
| Phase 2-3 | Affiliate commissions on orders placed through Eddy deep links |
| Phase 4 | Transaction fee or premium subscription for auto-ordering |

## Key Risks
- **Menu scraping durability** — platforms change DOM/APIs frequently
- **Price accuracy** — stale prices erode trust fast
- **Platform TOS** — scraping may violate terms; need to assess legal risk per platform
- **Scope creep** — Phase 1 alone is valuable; don't skip to Phase 3 prematurely

---

*Phase 1 is the priority. It makes Eddy immediately more useful with the data we already have.*
