# Anti-Bot Research — Food Delivery Platforms

## Summary (validated Feb 12, 2026)

| Platform | Server-Side API | Extension-Side | Difficulty |
|----------|----------------|----------------|------------|
| Uber Eats | ✅ Works (search + menu) | ✅ DOM + API | Supposedly hardest, but API works |
| DoorDash | ❌ Cloudflare blocks | ✅ User's browser session | Medium-hard |
| Grubhub | ❌ 401 (needs auth) | ✅ DOM scraping | Easiest |

## DoorDash
- Cloudflare at the edge (TLS fingerprint, header consistency, IP reputation)
- Rate limiting + IP monitoring
- Dynamic content via GraphQL (requires JS execution)
- CAPTCHA for detected anomalies
- **Our approach:** Extension content scripts run in user's browser → bypasses Cloudflare entirely

## Uber Eats
- Behavioral analysis (request frequency, navigation paths, mouse movements)
- IP rate limiting
- Session-bound APIs + GraphQL with auth tokens
- Frequent structural changes
- Mobile-first detection
- **Our approach:** Public search + menu API works without auth as of Feb 2026. Cache aggressively, rate limit, add jitter.

## Grubhub
- CAPTCHA + IP blocking
- Dynamic AJAX loading
- Rate limiting
- Third-party fraud detection (Incognia)
- **Our approach:** Requires auth token for API. Extension-side DOM scraping as backup. Explore developer API partnership for Phase 2.

## Mitigations Built
1. Rate limiter (1 req/sec per domain)
2. Menu cache (1hr TTL)
3. Realistic headers (User-Agent, Referer, Origin)
4. Graceful degradation (API fail → fee estimates)
5. Extension architecture = runs as real user (bypasses all anti-bot)
