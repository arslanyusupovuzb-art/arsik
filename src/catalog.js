export const products = [
  {
    "id": "chatgpt-sprint",
    "category": "ChatGPT",
    "title": "ChatGPT Plus — 5H Sprint Pass",
    "priceCents": 900,
    "warranty": "5 Hours Warranty",
    "type": "Shared / Instant Access",
    "delivery": "ready",
    "theme": "sprint",
    "description": "High-speed access to OpenAI's flagship reasoning and multimodal models. Built for intensive short-burst coding, deep research, and rapid prototyping."
  },
  {
    "id": "chatgpt-pro",
    "category": "ChatGPT",
    "title": "ChatGPT Plus — 25-Day Pro Access",
    "priceCents": 1499,
    "warranty": "25 Days Warranty",
    "type": "Dedicated Account",
    "delivery": "ready",
    "theme": "shield",
    "description": "Full monthly cycle of ChatGPT Plus with extended 25-day coverage. Includes GPT-4o, advanced voice, data analysis, and priority execution speeds."
  },
  {
    "id": "chatgpt-personal",
    "category": "ChatGPT",
    "title": "ChatGPT Plus — Personal Account Upgrade",
    "priceCents": 1999,
    "warranty": "Full Term Activation",
    "type": "On Your Account",
    "delivery": "personal",
    "theme": "personal",
    "description": "Direct Plus activation applied seamlessly to your existing personal OpenAI account. Keep all your private chat history, custom GPTs, and memory intact."
  },
  {
    "id": "chatgpt-go",
    "category": "ChatGPT",
    "title": "ChatGPT Go — Personal Lite Activation",
    "priceCents": 699,
    "warranty": "Full Term Activation",
    "type": "On Your Account",
    "delivery": "personal",
    "theme": "plane",
    "description": "Lightweight, budget-friendly tier upgraded directly on your personal account. Fast daily responses and essential reasoning without breaking the bank."
  },
  {
    "id": "claude-compute",
    "category": "Claude",
    "title": "Claude Max (20x Usage) — Heavy Compute Pass",
    "priceCents": 15990,
    "warranty": "3 Hours Warranty",
    "type": "Ultra-High Rate Limit",
    "delivery": "ready",
    "theme": "turbine",
    "description": "Massive 20x rate-limit multiplier for Claude's top-tier models. Engineered for full-repository refactoring, massive context ingestion, and zero-throttle workflows."
  },
  {
    "id": "claude-velocity",
    "category": "Claude",
    "title": "Claude Max (50x Usage) — Enterprise Velocity",
    "priceCents": 6900,
    "warranty": "7 Days Warranty",
    "type": "Extreme Rate Limit",
    "delivery": "ready",
    "theme": "starburst",
    "description": "Unrivaled 50x message capacity backed by a full 7-day warranty. Conquer week-long engineering sprints and autonomous agent tasks without hitting rate walls."
  },
  {
    "id": "grok-annual",
    "category": "Grok",
    "title": "Grok Plus — 12-Month Annual Pass",
    "priceCents": 6999,
    "warranty": "1 Month Warranty",
    "type": "12-Month Subscription",
    "delivery": "ready",
    "theme": "orbit",
    "description": "Full year of xAI's Grok Plus featuring real-time X platform intelligence, unfiltered reasoning, and deep search synthesis with 30-day warranty protection."
  },
  {
    "id": "grok-trial",
    "category": "Grok",
    "title": "SuperGrok — 7-Day Personal Trial",
    "priceCents": 500,
    "warranty": "7 Days Access",
    "type": "On Your Account",
    "delivery": "personal",
    "theme": "eclipse",
    "description": "One-week SuperGrok activation directly on your personal account. Test drive enhanced DeepSearch, Think mode, and higher daily image generation limits."
  },
  {
    "id": "grok-monthly",
    "category": "Grok",
    "title": "SuperGrok — 1-Month Personal Upgrade",
    "priceCents": 2990,
    "warranty": "30 Days Access",
    "type": "On Your Account",
    "delivery": "personal",
    "theme": "sphere",
    "description": "30 days of unlocked SuperGrok capabilities applied straight to your own profile. Priority model routing, extended reasoning chains, and zero credential sharing."
  },
  {
    "id": "grok-quarterly",
    "category": "Grok",
    "title": "SuperGrok — 3-Month Personal Quarterly Pass",
    "priceCents": 4274,
    "warranty": "90 Days Access",
    "type": "On Your Account",
    "delivery": "personal",
    "theme": "rings",
    "description": "Maximum value 90-day SuperGrok upgrade on your personal account. Lock in three months of uninterrupted frontier xAI access at a steep quarterly discount."
  },
  {
    "id": "grok-ultra",
    "category": "Grok",
    "title": "Grok Ultra — 1-Month Frontier Tier",
    "priceCents": 6900,
    "warranty": "2 Days Warranty",
    "type": "1-Month Account",
    "delivery": "ready",
    "theme": "monolith",
    "description": "xAI's highest-compute tier for 1 month. Unlocks peak reasoning depth, maximum context windows, and first-in-line access to experimental model checkpoints."
  },
  {
    "id": "cursor-pro",
    "category": "Cursor",
    "title": "Cursor Pro — 2-Month Developer Pass",
    "priceCents": 2499,
    "warranty": "28 Days Warranty",
    "type": "2-Month Subscription",
    "delivery": "ready",
    "theme": "terminal",
    "description": "Two months of the industry-standard AI code editor with a 28-day warranty. Enjoy fast Tab autocompletions, multi-file Composer edits, and premium frontier models."
  },
  {
    "id": "cursor-ultra",
    "category": "Cursor",
    "title": "Cursor Ultra — 1-Month Uncapped Power",
    "priceCents": 11989,
    "warranty": "No Warranty",
    "type": "1-Month Ultra Tier",
    "delivery": "ready",
    "theme": "matrix",
    "description": "Extreme-compute Cursor Ultra tier built for power engineers running parallel background agents and massive codebase indexing. Sold as-is at a steep discount."
  }
];

export const categories = ['All', 'ChatGPT', 'Claude', 'Grok', 'Cursor'];
export const money = (cents) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2,
}).format(cents / 100);

export function filterProducts(category = 'All', sort = 'featured') {
  const list = products.filter((product) => category === 'All' || product.category === category);
  if (sort === 'price-asc') list.sort((a, b) => a.priceCents - b.priceCents);
  if (sort === 'price-desc') list.sort((a, b) => b.priceCents - a.priceCents);
  return list;
}

export function createOrderSpec(product, quantity, email) {
  if (!products.some((item) => item.id === product?.id)) throw new Error('Unknown product');
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) throw new Error('Quantity must be between 1 and 5');
  const deliveryEmail = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryEmail)) throw new Error('Enter a valid email address');
  const canonical = products.find((item) => item.id === product.id);
  return [
    'ARSIK / ORDER SPECIFICATION',
    '',
    'Product: ' + canonical.title,
    'Product ID: ' + canonical.id,
    'Account type: ' + canonical.type,
    'Delivery: ' + (canonical.delivery === 'personal' ? 'Personal account activation instructions by email' : 'Account access details by email'),
    'Delivery email: ' + deliveryEmail,
    'Listed coverage: ' + canonical.warranty,
    'Quantity: ' + quantity,
    'Unit price: ' + money(canonical.priceCents),
    'Total: ' + money(canonical.priceCents * quantity),
    '',
    'This is an order specification, not a payment receipt or confirmation.',
  ].join('\n');
}
