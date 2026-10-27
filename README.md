# Akib — Software Engineer & Product Builder

Personal portfolio for Yeanul Haque Khan Akib. Next.js App Router, React, TypeScript and Tailwind CSS. Server-rendered content, six static case studies, and an optional progressively loaded canvas portrait sequence.

## Run locally

Use Node **22.19.0** (or a compatible newer release) and npm 10+.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. To use another port: `npm run dev -- --port 3001`.

For the production build:

```sh
npm run build
npm run start -- --port 3001
```

Webpack is selected explicitly for predictable local builds; the app uses standard Next.js APIs. No database, AI keys or account credentials are needed. Contact uses the existing public Web3Forms integration. Configure a replacement provider access key in Contact.tsx if ownership changes; it is a public submission identifier, not a privileged API secret.

## Content and screenshots

Edit `src/content/` for profile, projects, role attribution, experience, awards and education. Event albums and photo captions are in `src/content/award-photos.ts`, with originals in `public/awards/`; keep complete originals available through the viewer. Project routes are generated from records containing case-study content. Keep source/demo buttons accurate: sample dashboards and simulations must not be labeled live analysis. Never expose private source or claim that V1 screenshots show V2.

Real local screenshot assets live in `public/projects/captures/`; provenance and limitations are recorded in `docs/content-evidence.md`. Replace screenshots by adding a new asset and updating the relevant record. Use actual interface captures where available. Owner-approved conceptual covers belong in the separate `cover` field and must be labeled as illustrations, never fabricated screenshots. The approved CV lives in `public/resume/`; add a newly dated file and update `profile.resume` when it changes.

## Animation and caching

The poster renders in HTML before JavaScript. Only the current/nearby frames load, with 4 desktop / 2 mobile concurrent requests and application-cache limits of 24 / 12 images. Reduced motion and detectable Save-Data start with a static portrait; Play motion explicitly opts in. Pausing stops queued work without collapsing the reserved hero layout; in-flight images may finish. Direct section links are realigned after initial motion preferences resolve. The browser may retain its own additional decoded/HTTP cache.

Original PNGs are unchanged. To regenerate versioned assets:

```sh
npm run prepare:sequence
```

The script hashes the ordered source bytes and copies them under `/sequence/<hash>/`, plus a separate `/hero/<hash>/poster.png`. Only these content-versioned paths receive one-year immutable caching. Never replace bytes under an existing hash; create a new version. Keep a previous deployment available for rollback. Compression and a new portrait remain optional choices; there is no lossy conversion in this update.

## Checks

```sh
npm run lint
npm run test:unit
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
npm audit
npm audit --omit=dev
npm run check:links
# Optional three-run candidate-only cold/warm lab sample:
PORTFOLIO_BROWSER_CHANNEL=chrome node scripts/measure-performance.mjs
```

For installed Google Chrome instead of Playwright's downloaded Chromium: `PORTFOLIO_BROWSER_CHANNEL=chrome npm run test:e2e`. Browser tests own **port 3100**, run against a production build and mock all contact-provider traffic. Keep an unrelated service off that port. For an explicitly selected existing server use `PORTFOLIO_TEST_URL=http://127.0.0.1:3001`; don't use that override for CI.

The external-link report is manual and non-blocking because external sites can throttle or require login. It doesn't send forms or rewrite project statuses. CI runs lint, unit tests, build, typecheck and desktop/mobile browser journeys; no production secrets are required.

## Release and rollback

1. Run checks above and inspect desktop/mobile screenshots and all six project pages.
2. Create a Vercel preview only when release work is authorized. `VERCEL_ENV=preview` produces noindex/nofollow metadata and disallows indexing in robots.txt; inspect the deployed HTML/header behavior.
3. Check the actual preview's versioned image headers, resume, real screenshots and public project links. Provider delivery still needs a deliberately agreed real-message smoke test if desired.
4. Publish only when authorized. Current canonical domain: https://akiibotportfolio.vercel.app.
5. Smoke-check home, a case study, resume, sitemap, metadata and asset loading. Roll back by promoting the previous working Vercel deployment; do not overwrite old versioned assets or delete source images to “clear” caches.

No production deployment is performed by the local implementation workflow. See `docs/qa/portfolio-release.md` for verified results and outstanding limitations.
