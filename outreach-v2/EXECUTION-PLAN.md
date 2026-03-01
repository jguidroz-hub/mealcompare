# Eddy Outreach V2 — Execution Plan

## Strategy: Instagram DM + Contact Form (5 Cities)

### Why This Beats Email
| | Email (V1) | Instagram DM + Contact Form (V2) |
|---|---|---|
| Delivery rate | 63% (35% bounced) | ~99% (DMs always land) |
| Open rate | ~15% typical | ~80% (DMs show as notifications) |
| Domain risk | Damaged eddy.delivery reputation | Zero domain risk |
| Personal feel | Looks like spam | Feels like a human reaching out |
| Response rate | 0% (1,112 sent) | 10-20% typical for warm DMs |

### Target: 201 Restaurants Across 5 Cities

| City | Total | Fresh | On Eddy | Fresh+On Eddy (Gold) |
|---|---|---|---|---|
| Austin | 49 | 30 | 23 | 6 |
| Washington DC | 32 | 29 | 17 | **16** 🔥 |
| New York | 40 | 35 | 14 | 10 |
| Los Angeles | 30 | 28 | 7 | 7 |
| Chicago | 50 | 16 | 38 | 7 |
| **TOTAL** | **201** | **138** | **99** | **46** |

**Gold tier (46):** Fresh targets already listed on Eddy. DM includes direct link to their restaurant page.
**Enriched CSV:** `target-lists-enriched.csv` has `eddy_url` column with verified links.

### Eddy API Stats
- Austin: 665 restaurants | DC: 683 | NYC: 1,139 | LA: 898 | Chicago: 852
- Total: 4,237 restaurants with pages on eddy.delivery

### Phase 1: Setup (Day 1)
- [ ] Create @eddydelivery Instagram account
- [ ] Set up as Business account
- [ ] Post 9 seed content pieces (see instagram-setup.md)
- [ ] Follow 50-100 target restaurants

### Phase 2: Austin + DC First Wave (Days 2-3)
**DM the 30 fresh Austin restaurants + 29 fresh DC restaurants**
- Use Variant A (savings-led) for 50%, Variant B (problem-led) for 50%
- Personalize each message with restaurant name + cuisine
- Also submit contact forms for restaurants with websites
- **Target: 59 DMs + 30 contact forms**

### Phase 3: NYC + LA + Chicago (Days 4-7)
- 35 fresh NYC + 28 fresh LA + 16 fresh Chicago = 79 DMs
- Same A/B split on variants
- **Target: 79 DMs + 40 contact forms**

### Phase 4: Follow Up (Day 7-10)
- Send follow-up DM to non-responders (3 days after initial)
- For any responders: schedule 15-min demo calls
- Track everything in outreach-log.csv

### Success Metrics
- **Response rate goal:** >10% (vs 0% on email)
- **Demo call goal:** 5-10 restaurants
- **Active user goal:** 3-5 restaurants promoting Eddy to customers

### Key Files
- `target-lists.csv` — 201 restaurants with IG handles, websites, city, emailed status
- `dm-templates.md` — DM and contact form templates (3 variants + follow-up)
- `instagram-setup.md` — Account setup guide + content plan
- `outreach-log.csv` — Track sends and responses (create during execution)

## Jon's Action Items
1. **Create Instagram account** (needs phone + app)
2. **Confirm eddy.delivery search works** in browser for real comparison screenshots
3. **Approve DM templates** in dm-templates.md
4. **Design 9 seed posts** (or approve Pete using Canva)
5. **Start DMing** — Austin first, then DC, then expand
