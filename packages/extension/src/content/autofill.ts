/**
 * Auto-Fill Content Script — Phase 5
 * 
 * Receives a list of items from the Eddy web app (via background script)
 * and automatically adds them to the cart on the current delivery platform.
 * 
 * Flow:
 * 1. User builds order on Eddy (/order/[chain-slug])
 * 2. User clicks "Order on [Platform]" → extension opens platform + sends item list
 * 3. This script searches for each item on the platform page and clicks "Add to Cart"
 * 
 * Supported platforms: UberEats, DoorDash (Grubhub partial)
 */

interface AutofillItem {
  name: string;
  quantity: number;
}

interface AutofillRequest {
  type: 'AUTOFILL_CART';
  items: AutofillItem[];
  chainName: string;
}

// Listen for autofill requests from background
chrome.runtime.onMessage.addListener((message: AutofillRequest, _sender, sendResponse) => {
  if (message.type === 'AUTOFILL_CART') {
    autofillCart(message.items, message.chainName)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // async response
  }
});

async function autofillCart(items: AutofillItem[], chainName: string): Promise<{ success: boolean; added: number; failed: string[] }> {
  const host = window.location.hostname;
  const added: string[] = [];
  const failed: string[] = [];

  // Wait for page to fully load
  await waitForPageReady();

  if (host.includes('ubereats.com')) {
    return await autofillUberEats(items);
  } else if (host.includes('doordash.com')) {
    return await autofillDoorDash(items);
  } else if (host.includes('grubhub.com')) {
    return await autofillGrubhub(items);
  }

  return { success: false, added: 0, failed: items.map(i => i.name) };
}

// ─── Uber Eats Auto-Fill ───────────────────────────────────────

async function autofillUberEats(items: AutofillItem[]): Promise<{ success: boolean; added: number; failed: string[] }> {
  const added: string[] = [];
  const failed: string[] = [];

  for (const item of items) {
    try {
      const found = await findAndClickMenuItem(item.name, 'ubereats');
      if (found) {
        // Wait for item modal to open
        await delay(800);
        
        // Set quantity if > 1
        if (item.quantity > 1) {
          await setQuantity(item.quantity, 'ubereats');
        }
        
        // Click "Add to Order" button
        const addBtn = findButtonByText(['Add to Order', 'Add to order', 'Add Item', 'Add item']);
        if (addBtn) {
          addBtn.click();
          await delay(600);
          added.push(item.name);
        } else {
          failed.push(item.name);
        }
      } else {
        failed.push(item.name);
      }
    } catch {
      failed.push(item.name);
    }
  }

  showAutofillResult(added, failed);
  return { success: added.length > 0, added: added.length, failed };
}

// ─── DoorDash Auto-Fill ────────────────────────────────────────

async function autofillDoorDash(items: AutofillItem[]): Promise<{ success: boolean; added: number; failed: string[] }> {
  const added: string[] = [];
  const failed: string[] = [];

  for (const item of items) {
    try {
      const found = await findAndClickMenuItem(item.name, 'doordash');
      if (found) {
        await delay(800);
        
        if (item.quantity > 1) {
          await setQuantity(item.quantity, 'doordash');
        }
        
        const addBtn = findButtonByText(['Add to Cart', 'Add to cart', 'Add to Order', 'Add Item']);
        if (addBtn) {
          addBtn.click();
          await delay(600);
          added.push(item.name);
        } else {
          failed.push(item.name);
        }
      } else {
        failed.push(item.name);
      }
    } catch {
      failed.push(item.name);
    }
  }

  showAutofillResult(added, failed);
  return { success: added.length > 0, added: added.length, failed };
}

// ─── Grubhub Auto-Fill ────────────────────────────────────────

async function autofillGrubhub(items: AutofillItem[]): Promise<{ success: boolean; added: number; failed: string[] }> {
  const added: string[] = [];
  const failed: string[] = [];

  for (const item of items) {
    try {
      const found = await findAndClickMenuItem(item.name, 'grubhub');
      if (found) {
        await delay(800);
        
        if (item.quantity > 1) {
          await setQuantity(item.quantity, 'grubhub');
        }
        
        const addBtn = findButtonByText(['Add to Bag', 'Add to bag', 'Add to Order', 'Add to order']);
        if (addBtn) {
          addBtn.click();
          await delay(600);
          added.push(item.name);
        } else {
          failed.push(item.name);
        }
      } else {
        failed.push(item.name);
      }
    } catch {
      failed.push(item.name);
    }
  }

  showAutofillResult(added, failed);
  return { success: added.length > 0, added: added.length, failed };
}

// ─── Shared Helpers ────────────────────────────────────────────

/**
 * Find a menu item on the page by name and click it to open the item modal.
 */
async function findAndClickMenuItem(itemName: string, platform: string): Promise<boolean> {
  const normalized = itemName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  
  // Find all clickable menu item elements
  const allElements = document.querySelectorAll(
    'button, [role="button"], a, [data-testid*="MenuItem"], [data-testid*="menu-item"], [class*="menuItem"], [class*="MenuItem"]'
  );
  
  let bestMatch: { element: Element; score: number } | null = null;
  
  for (const el of allElements) {
    const text = el.textContent?.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() ?? '';
    if (!text) continue;
    
    // Exact containment
    if (text.includes(normalized) || normalized.includes(text)) {
      const score = Math.min(normalized.length, text.length) / Math.max(normalized.length, text.length);
      if (score > 0.4 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { element: el, score };
      }
    }
    
    // Token overlap
    const tokensA = new Set(normalized.split(/\s+/));
    const tokensB = new Set(text.split(/\s+/));
    const intersection = [...tokensA].filter(t => tokensB.has(t));
    const jaccard = intersection.length / new Set([...tokensA, ...tokensB]).size;
    if (jaccard > 0.5 && (!bestMatch || jaccard > bestMatch.score)) {
      bestMatch = { element: el, score: jaccard };
    }
  }
  
  if (bestMatch && bestMatch.score > 0.4) {
    (bestMatch.element as HTMLElement).click();
    return true;
  }
  
  // Fallback: scroll through the page looking for the item
  return await scrollAndFind(normalized);
}

async function scrollAndFind(normalizedName: string): Promise<boolean> {
  const scrollContainer = document.querySelector('main') ?? document.documentElement;
  const maxScrolls = 10;
  
  for (let i = 0; i < maxScrolls; i++) {
    scrollContainer.scrollBy(0, 400);
    await delay(300);
    
    const elements = document.querySelectorAll('button, [role="button"], a, [class*="menuItem"], [class*="MenuItem"]');
    for (const el of elements) {
      const text = el.textContent?.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() ?? '';
      if (text.includes(normalizedName) && text.length < normalizedName.length * 3) {
        (el as HTMLElement).click();
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Set quantity in the item modal.
 */
async function setQuantity(targetQty: number, platform: string): Promise<void> {
  // Most platforms have +/- buttons in the item modal
  const plusBtns = document.querySelectorAll(
    '[data-testid*="increment"], [data-testid*="plus"], [aria-label*="Increase"], [aria-label*="increase"], [aria-label*="Add"]'
  );
  
  // Also try finding + button near quantity display
  const allButtons = document.querySelectorAll('button');
  let plusBtn: HTMLElement | null = null;
  
  for (const btn of allButtons) {
    const text = btn.textContent?.trim();
    const label = btn.getAttribute('aria-label')?.toLowerCase() ?? '';
    if (text === '+' || label.includes('increase') || label.includes('increment') || label.includes('add one')) {
      plusBtn = btn;
      break;
    }
  }
  
  if (!plusBtn && plusBtns.length > 0) {
    plusBtn = plusBtns[0] as HTMLElement;
  }
  
  if (plusBtn) {
    // Click (targetQty - 1) times (item starts at qty 1)
    for (let i = 1; i < targetQty; i++) {
      plusBtn.click();
      await delay(200);
    }
  }
}

/**
 * Find a button by its text content.
 */
function findButtonByText(texts: string[]): HTMLElement | null {
  const allButtons = document.querySelectorAll('button, [role="button"]');
  
  for (const btn of allButtons) {
    const btnText = btn.textContent?.trim() ?? '';
    for (const text of texts) {
      if (btnText.toLowerCase().includes(text.toLowerCase())) {
        return btn as HTMLElement;
      }
    }
  }
  
  return null;
}

function waitForPageReady(): Promise<void> {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      setTimeout(resolve, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(resolve, 1000));
    }
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Show a floating notification with autofill results.
 */
function showAutofillResult(added: string[], failed: string[]): void {
  const existing = document.getElementById('stf-autofill-result');
  if (existing) existing.remove();
  
  const total = added.length + failed.length;
  const isSuccess = added.length > 0;
  
  const el = document.createElement('div');
  el.id = 'stf-autofill-result';
  el.innerHTML = `
    <div style="
      position: fixed; top: 24px; right: 24px; z-index: 2147483647;
      width: 320px; background: #0f1729; border: 1px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
      border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #e2e8f0; padding: 16px; animation: stf-slide-in 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 20px;">${isSuccess ? '✅' : '⚠️'}</span>
        <span style="font-weight: 700; font-size: 14px;">
          ${isSuccess ? `Added ${added.length}/${total} items` : 'Auto-fill failed'}
        </span>
        <button onclick="this.closest('#stf-autofill-result').remove()" style="
          margin-left: auto; background: none; border: none; color: #475569; cursor: pointer; font-size: 16px;
        ">✕</button>
      </div>
      ${added.length > 0 ? `
        <div style="font-size: 12px; color: #10b981; margin-bottom: 4px;">
          ✓ ${added.join(', ')}
        </div>
      ` : ''}
      ${failed.length > 0 ? `
        <div style="font-size: 12px; color: #f87171;">
          ✗ Couldn't find: ${failed.join(', ')}
        </div>
        <div style="font-size: 11px; color: #475569; margin-top: 6px;">
          You can search and add these items manually.
        </div>
      ` : ''}
    </div>
    <style>
      @keyframes stf-slide-in {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    </style>
  `;
  
  document.body.appendChild(el);
  
  // Auto-dismiss after 8 seconds
  setTimeout(() => {
    const existing = document.getElementById('stf-autofill-result');
    if (existing) {
      existing.style.transition = 'opacity 0.5s';
      existing.style.opacity = '0';
      setTimeout(() => existing.remove(), 500);
    }
  }, 8000);
}

console.log('[SkipTheFee] Autofill content script loaded');
