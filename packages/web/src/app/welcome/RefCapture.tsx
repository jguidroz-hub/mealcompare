'use client';

import { useEffect } from 'react';

const EXTENSION_ID = 'nogipmchmfjhmnjcmeppmmngeokhaoob';

export default function RefCapture() {
  useEffect(() => {
    // Capture ref from URL params (set by /ut?ref=ambassador_name → install → welcome)
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || localStorage.getItem('eddy_ref');
    const source = params.get('source');

    // Also check cookie/localStorage set by /ut landing page
    if (!ref) {
      const stored = document.cookie.match(/eddy_ref=([^;]+)/);
      if (stored) {
        sendRef(stored[1]);
        return;
      }
    }

    if (ref) {
      localStorage.setItem('eddy_ref', ref);
      sendRef(ref);
    }

    // Track install event on server
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'welcome_page',
        ref: ref || null,
        source: source || null,
      }),
    }).catch(() => {});
  }, []);

  return null;
}

function sendRef(ref: string) {
  // Try to send ref to extension via external messaging
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(EXTENSION_ID, {
        type: 'SET_REF',
        payload: { ref },
      }, () => {
        // Ignore errors — extension may not be ready yet
      });
    }
  } catch {
    // Extension not available — ref is saved in localStorage for later
  }
}
