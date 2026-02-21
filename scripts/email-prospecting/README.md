# Eddy Email Prospecting Pipeline

## Overview
1,907 restaurants in our database have NO direct ordering URL.
Each one is a potential referral:
- Toast: $2,000/qualified referral (pending approval)
- ChowNow: $350/launched client, $150/qualified lead (ACTIVE)
- Owner.com: TBD
- Square: $30/referral

## Pipeline Stages
1. **Enrich** — Find restaurant contact emails via web search
2. **Template** — Create email sequences (cold → follow-up 1 → follow-up 2)
3. **Send** — Batch send via Resend (projectgreenbelt.com domain, verified)
4. **Track** — Open/click tracking, conversion to referral links
5. **Report** — Dashboard of pipeline metrics

## Files
- `enrich-emails.ts` — Search for restaurant emails via Brave API
- `email-templates.ts` — Cold outreach + follow-up sequences
- `send-campaign.ts` — Batch sender via Resend
- `no-direct-ordering.json` — 1,907 target restaurants (generated from main DB)
