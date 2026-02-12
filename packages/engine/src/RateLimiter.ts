/**
 * Simple per-domain rate limiter.
 * Ensures we don't hammer platform APIs and get blocked.
 */
export class RateLimiter {
  private lastCall: Map<string, number> = new Map();
  private minIntervalMs: number;

  constructor(minIntervalMs = 1000) {
    this.minIntervalMs = minIntervalMs;
  }

  async wait(domain: string): Promise<void> {
    const now = Date.now();
    const last = this.lastCall.get(domain) ?? 0;
    const elapsed = now - last;

    if (elapsed < this.minIntervalMs) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minIntervalMs - elapsed)
      );
    }

    this.lastCall.set(domain, Date.now());
  }
}

// Global rate limiter — 1 request per second per domain
export const rateLimiter = new RateLimiter(1000);
