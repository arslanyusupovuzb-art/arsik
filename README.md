# Arsik

A high-craft, responsive storefront for premium AI subscriptions and developer tools.

## Run

Requires Node.js 20.19+ (Node 22 recommended).

~~~sh
npm install
npm run dev
~~~

Production build:

~~~sh
npm run build
npm run preview
~~~

The static production site is generated in `dist/` and can be deployed on a static host. The relative Vite base supports hosting in a subdirectory.

## Included

- All 13 supplied products with exact prices, descriptions, account types, and coverage.
- Three-column desktop, two-column tablet, and one-column phone layouts.
- Instant category filtering and price sorting.
- Keyboard command search: Cmd+K / Ctrl+K, arrow keys, Enter, Escape.
- Responsive side / bottom order drawer with focus management.
- Animated prices, product counts, and order totals.
- Email validation, bounded quantities, a no-warranty acknowledgment, and clipboard fallback.
- Reduced-motion support, semantic controls, focus indicators, and self-hosted fonts.
- Custom SVG product avatars matching each supplied visual theme.

## Open-source UI libraries

The application imports the actual packages:

| Library | Use | Source |
| --- | --- | --- |
| Sonner | Stacked order notifications | https://github.com/emilkowalski/sonner |
| Number Flow | Prices, quantities, totals, and counts | https://github.com/barvian/number-flow |
| cmdk | Search, filtering, and keyboard navigation | https://github.com/dip/cmdk |
| Motion | Shared category indicator and entrance motion | https://github.com/motiondivision/motion |
| Radix Dialog | Focus trapping, accessible dialogs, Escape dismissal | https://github.com/radix-ui/primitives |

## Checkout behavior

This is a storefront preview. It does not charge money, place orders, send email, provision accounts, or verify inventory. The header's delivery indicator is a visual preview, not an operational health check.

"Copy order spec" creates a readable specification from the selected product, quantity, and delivery email. It copies the text to the clipboard and displays a Sonner toast. If the clipboard is unavailable, the complete specification is shown for manual copying.

No passwords, authentication tokens, or payment details are collected. Form data stays in React memory until the user copies it; there is no local storage or backend submission.

The product copy and advertised terms are supplied catalog content, not independently verified provider offers. The unusual Claude pricing and the Cursor Ultra "No Warranty" condition are intentionally preserved.

## Verification

~~~sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
~~~

GitHub Actions runs catalog/order tests, a production build, and Chromium checks at desktop and phone sizes. Browser tests cover filtering, price sorting, command search, focus restoration, form validation, quantity limits, no-warranty acknowledgment, clipboard success and failure, responsive overflow, reduced motion, and accessibility. Successful runs provide a production-build artifact plus a browser report.

A deployment service and real payment/fulfillment integration are still required before live commerce.
