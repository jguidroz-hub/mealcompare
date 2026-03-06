'use client';

import { useEffect } from 'react';

/**
 * Captures ?ref= param from URL and stores in cookie + localStorage.
 * When user installs the extension and hits /welcome, RefCapture reads it.
 */
export default function RefCookie() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      // Store ref in cookie (30 days) and localStorage
      document.cookie = `eddy_ref=${encodeURIComponent(ref)};max-age=${30 * 86400};path=/;SameSite=Lax`;
      localStorage.setItem('eddy_ref', ref);
    }

    // Track UT page visit
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'ut_page_visit',
        ref: ref || null,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, []);

  return null;
}
