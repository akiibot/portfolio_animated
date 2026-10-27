# Local implementation and verification — 27 October 2026

Updated preview: http://127.0.0.1:3001/
Branch: `codex/portfolio-update`
Checkout: `/Users/yeanul/Documents/ChatGPT/Portfolio/portfolio-update`
Source implementation revision: `9dbacc7` (later report commits change documentation only).

## Delivered

- Immediate server-rendered portrait and useful text/actions. The original 144-frame load gate is replaced with bounded current/nearby loading, finite retries, last-frame/poster fallback, pause, reduced-motion/Save-Data defaults and visibility suspension.
- Stable reserved hero geometry: direct project/contact anchors work after hydration; Pause does not collapse the page. Canvas backing dimensions follow its actual rendered bounds, including short/zoomed viewports.
- Versioned original-quality PNGs and poster, with immutable browser caching only on versioned paths. All 144 generated-path copies compare byte-for-byte with their originals. The resume copy's SHA-256 matches the supplied PDF.
- Six curated case studies, four primary projects and supporting work. Updated skills, professional experience, teaching, education and six achievements. Owner-confirmed lead architect/developer attribution, with team and prototype context.
- Genuine deployment screenshots for Find My Paw, Jointly and LocalRelay; recorded Vallet hosted-demo images; an explicitly labeled earlier ResearchLens interface retained inside its story. Owner-requested Imprnt/ResearchLens editorial covers are separate, clearly captioned illustrations. Full prompts and paths: `generated-covers.md`.
- Accessible compact navigation and resume access; proper headings/skip link/focus; canonical metadata, social preview, favicon, robots and sitemap; responsive layouts.
- Reliable contact success/error/timeout/duplicate handling. Fields are locked while sending so unsent edits are not cleared. With JavaScript disabled, the form is hidden and direct email remains available, avoiding accidental GET submission of private text.
- Typed content files, provenance notes, README, CI, curated external-link checker and an optional reproducible local lab script.

## Verified results

| Check | Result |
|---|---|
| Clean `npm ci --ignore-scripts` | Passed; audited install reported zero advisories |
| `npm run lint` | Passed |
| `npm run test:unit` | 9 passed |
| `npm run build` | Passed; six statically generated case studies |
| `npm run typecheck` | Passed |
| `PORTFOLIO_BROWSER_CHANNEL=chrome npm run test:e2e` | 34 passed, desktop and emulated mobile |
| Full and production-only npm audits | Both zero known vulnerabilities at review time |
| Curated external link report | All 14 selected destinations returned HTTP 200; status only, not full feature verification |
| Real capture files | Native JPEG bytes preserved; extensions corrected and lightweight images served directly |
| Original animation frames | 144/144 byte-identical |
| Supplied/local CV | Same SHA-256: `3a4b66c398a3036380f3361f175827070de029744ef1e425b56270765dd868c4` |

Browser checks cover missing frames, no-JS rendering, motion preference, direct anchors, stable pause, short-height canvas sizing, 320/375/390/768/1280px overflow, local resume and metadata, all six case-study routes, unknown slug, asset caching, and mocked contact success/rejection/invalid-JSON/failure/timeout/duplicate/draft behavior. Real submission was not sent.

An independent reviewer identified short-height portrait distortion and contact edits-during-submit loss; both were reproduced and fixed with regression tests. Further visual checks exposed direct-link/pause layout shifts; their regressions also pass. Final browser suite completed in 30.9 seconds on this machine. The review decisions and boundaries are in `implementation-decisions.md`.

## Candidate-only loading sample

See `candidate-performance.json` and `scripts/measure-performance.mjs`. Three fresh-context cold visits and three warm revisits use a 390×844 Chromium viewport, configured 150ms latency, 1.6 Mbps downlink and 4× CPU slowdown. These are local browser observations, not a deployed Lighthouse score or real-user measurements. A like-for-like original-production timing baseline was not captured; no speedup percentage is claimed. LCP is the browser's selected content candidate, not a claim that every image or frame has finished loading.

Final medians: cold LCP 652ms / warm 340ms; CLS approximately 0.00117 / 0.000116. The reliable request-budget observation is **three initial sequence requests**, with about 1.4 MB of frame transfer on cold visits and **zero frame bytes retransferred** on warm visits. The hero no longer waits for all 144 frames. Browser eviction can still force future downloads.

## Remaining boundaries and next inputs

- No GitHub push, merge, Vercel preview or production publication was performed. CI is configured but has not run on GitHub. Verify actual deployed headers and noindex behavior on a release preview before publishing.
- External demo reliability remains separate project work: Vallet session readiness, Imprnt hosting and a public ResearchLens V2 URL. Their unavailable/protected destinations are not presented as live app buttons.
- Update 28 October: nine supplied event photographs are now included in five albums. See `award-gallery-2026-10-28.md` for the follow-up validation and source mapping.
- Original animation quality is preserved. Optional lossy format comparisons remain a separate owner decision. The generated project covers do not change the animation assets.
- Browser checks use installed Chrome with desktop/mobile emulation. They are not a full Safari/device/screen-reader certification or an exact OS/browser 200% zoom audit; short-height/reflow and keyboard-ready controls were inspected.
- ESLint 9 is pinned to satisfy current Next plugin peers; the registry marks that development-tool major deprecated. No unsupported peer override was used. Revisit when the plugin set supports the newer major.
- Web3Forms's documented optional honeypot is present, with local guards; provider delivery and stronger anti-spam/domain settings were not independently exercised. See the provider's [honeypot documentation](https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection) for its stated limitations.

## Local run / rollback

`cd /Users/yeanul/Documents/ChatGPT/Portfolio/portfolio-update && npm run dev -- --port 3001` for editable development, or build then `npm run start -- --port 3001` for production mode. Stop the existing preview process before binding the same port.

The original checkout and its revision remain available at `../portfolio_animated`. The implementation branch/worktree is retained for review and adding award photos. For any future publication, keep the preceding Vercel deployment and roll back by promoting it; don't overwrite bytes under an existing content hash.
