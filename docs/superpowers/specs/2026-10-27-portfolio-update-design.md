# Portfolio update: proposed design and complete change list

Status: proposal for review, not approval to implement or publish. Audience confirmed by owner: full-stack/software engineering employers. Date: 27 October 2026.

## Intent

Within a short visit, an employer should understand what Akib builds, inspect relevant engineering decisions and evidence, access his resume, and contact him. Keep the recognizable dark visual identity while making animation optional to the content-loading path.

Inputs: existing Next.js source, [initial audit](../../../../PORTFOLIO_REVIEW.md), [project selection](../../research/2026-10-27-project-selection.md), and the supplied two-page resume at `/Users/yeanul/Downloads/Yeanul_Haque_Khan_Akib_CV_Redesigned (1).pdf`. Resume figures and awards remain user-provided claims; don't turn prerelease adoption into active-user metrics.

## Approaches considered

1. **Repair and reorganize the current Next.js site — recommended.** Retains visual identity, source and hosting; fixes loading, content, navigation and evidence in incremental releases. Best fit for an existing portfolio with stronger new work.
2. **Full visual rebuild.** Could deliver a different identity, but introduces unnecessary layout and framework migration risk before the current content is fixed.
3. **Static portrait only.** Simplest and cheapest to deliver; retain this as the accessible/data-saving fallback. It gives up the animation the current site is built around.

The owner has not selected a redesign approach. This proposal develops option 1 as the recommended default; no product implementation begins in this planning task.

## Page and content proposal

Home order: Hero → Selected Work → Achievements → About and Skills → Experience → Education/Leadership → Contact. Navigation: Work, About, Experience, Contact, Resume. Home/name link returns to hero. Keep existing anchor aliases or redirects where section IDs change. Compact secondary work links follow selected work; do not turn the homepage into all 27 repositories.

Proposed headline: **“Software Engineer · Full-stack development”**. Proposed supporting line: **“I build web products, APIs, and developer tools with React, Next.js, TypeScript, and Python.”** The degree remains explicitly in progress. No unsupported availability, seniority, employer-title or user-growth claims.

Six main case-study candidates: Find My Paw, Vallet, Jointly, LocalRelay, Imprnt AI and ResearchLens V2. Four primary cards plus two secondary cards on home; case-study pages at `/projects/[slug]`. Use real screenshots, source links and accurately labeled demo links. If a story lacks approved contribution details or publishable assets, keep it as a compact source/project link until ready; it must not block the whole release. CosmoScope remains in achievement-linked additional work, with CropGuard and QueueJhor as useful alternatives.

## Complete recommended change list

P0 = correctness, accessibility blockers or reliability; P1 = core employer-facing update; P2 = polish and maintenance. IDs map to implementation tasks.

| ID | Priority | Change | Completion condition |
|---|---|---|---|
| C01 | P0 | Render a real poster and hero copy immediately, independently of the canvas. | No blank hero or full-sequence loading gate; useful content renders with JavaScript disabled. |
| C02 | P0 | Replace all-at-once preload with a bounded, scroll-aware frame loader. | Prioritize current frame and nearby frames; at most 4 concurrent loads on desktop and 2 below 768px; app cache capped at 24/12 frames plus in-flight work. |
| C03 | P0 | Add failed-frame, slow-network and fast-scroll fallbacks. | Hold last valid frame or poster; no endless spinner, blanking or scroll blocking when any frame fails. |
| C04 | P0 | Add reduced-motion/data-saving behavior and a visible animation control. | Static poster for reduced motion and detectable Save-Data; no animation-frame requests until explicitly enabled; the separate poster request is permitted. Pause outside hero/hidden tab. |
| C05 | P0 | Fix contact event lifetime and success/reset state. | A successful mocked response resets once, shows success, reenables appropriately and never also shows error. |
| C06 | P0 | Handle contact errors, timeout and duplicate submission clearly. | Inline accessible errors, preserved entered text on failure, one active request, a 15-second timeout, email fallback. |
| C07 | P0 | Review framework/dependency advisories and upgrade deliberately. | Fresh full and production-only audit; compatible patched framework/runtime chosen and documented; unresolved findings triaged with applicability, owner and next step. |
| C08 | P0 | Make navigation work on small screens and with assistive tech. | Named icon links, nav landmark, keyboard focus, active section state, 44px targets, resume access at 320px and wider. |
| C09 | P0 | Prevent misleading/broken project demo buttons. | Verified-public, login-required, sample, simulated and unavailable destinations get distinct labels; no broken/live claims. |
| C10 | P1 | Version static animation assets and configure browser caching. | Content-hashed directory URLs; `public, max-age=31536000, immutable` only for that versioned path; changed content changes URL. |
| C11 | P1 | Compare optional WebP/AVIF variants and responsive sizes. | Original PNGs preserved; inspect face/hair/gradients at target sizes. No lossy variant becomes default before owner accepts side-by-side samples. |
| C12 | P1 | Shorten the 500vh hero and put actions upfront. | Proposed 200vh desktop/120vh below 768px when animation is active; static mode one viewport; visible Work and Resume actions immediately. No scroll hijacking. |
| C13 | P1 | Replace “aspiring,” outdated skills and data-analysis-heavy copy. | Current, specific engineering headline/summary and grouped skills grounded in actual work. |
| C14 | P1 | Move projects ahead of long biography and education. | Employer can reach selected work directly from the first screen; university details stay in progress. |
| C15 | P1 | Centralize profile, project, experience, education and award data. | Typed local content records, explicit source/provenance notes; updates require no component layout edits. No runtime GitHub API dependency. |
| C16 | P1 | Build a curated project gallery. | Readable previews, short problem/outcome summary, relevant stack, role, status, source and case-study actions for the selected work. |
| C17 | P1 | Add case-study routes. | Each approved story covers problem, role/team, architecture, decisions, evidence, limits, results and links; invalid slugs show 404. |
| C18 | P1 | Correct project interaction and screenshot sizing. | No dead pointer cursors; title/case-study links work by keyboard; meaningful preview spans available card width; Next fill images have `sizes`. |
| C19 | P1 | Refresh professional experience and teaching. | Use resume's current support/QA framing, products, dates and measured work; add Dreamers Academy with accurate status. Do not imply development of employer products. |
| C20 | P1 | Promote awards and separate leadership from employment. | Add the two newer champion awards; NASA team attribution; concise older education and volunteering. Link evidence where available. |
| C21 | P1 | Provide a current resume everywhere. | Store a versioned local PDF with readable filename; View and Download on desktop/mobile; cite date and verify the served bytes. |
| C22 | P1 | Complete search and sharing metadata. | Name/role title, description, canonical production URL, favicon, OG/Twitter preview, sitemap and robots; accurate case-study metadata. |
| C23 | P1 | Repair typography, contrast and visual rhythm. | Use loaded Geist variable, defined text/spacing tokens, readable body text, consistent cards and compact spacing. Measure normal-text contrast >=4.5:1. |
| C24 | P1 | Repair document semantics and anchor navigation. | One h1, h2 section headings, skip link, sticky-nav scroll offsets, meaningful links and hash/back behavior. Hero/contact correctly update nav. |
| C25 | P1 | Keep primary content readable without animation/JS. | Copy/project links server-rendered; motion enhances rather than hides essential content; no invisible reveal sections when JS fails. |
| C26 | P1 | Make mobile layouts intentional. | Test 320/375/390/768/1280px, landscape and 200% zoom; no horizontal overflow, cut-off contacts or obscured footer/actions. |
| C27 | P1 | Measure first visit and repeat visits separately. | Record cold/warm network waterfall, LCP, CLS, long tasks and sequence bytes for baseline/candidate; don't substitute dev timings for production measurements. |
| C28 | P1 | Add regression checks for the new critical paths. | Frame scheduler/failure tests, contact mocked journeys, mobile navigation, reduced motion, asset cache/version and case-study route checks. |
| C29 | P2 | Replace starter README and add CI. | Clean-checkout setup, runtime version, content/asset update guide and PR checks for lint/types/tests/build. |
| C30 | P2 | Remove unused testimonial code, duplicate icon packages and stale config after usage checks. | No unused feature removal affects shipped UI; hook warning eliminated at source. |
| C31 | P2 | Add lightweight link maintenance. | Manually invoked or CI external-link report, no visitor-time status fetches; failures require review rather than automatic false status changes. |
| C32 | P2 | Refine imagery and attribution. | Real interface captures; optional original portrait/clean licensed asset replacing watermark-bearing visual; retain third-party credits as required. No watermark-removal shortcut. |
| C33 | P2 | Clarify contact and privacy. | Concise contact copy; city/country suffices instead of neighborhood/postal address; identify external form processing and retain direct email. Add provider-supported anti-spam control after verifying current documentation. |
| C34 | P2 | Make publication and rollback repeatable. | Preview QA checklist, production URL confirmation, previous-deployment rollback instructions and post-release smoke check. |

## Animation design

Preserve original images for the first implementation. Server-render a byte-identical copy of the first PNG at `/hero/<content-hash>/poster.png` as a positioned poster with matching crop and explicit dimensions, under copy and actions. Use one shared progress mapping for poster/canvas/overlay. The poster remains until a frame is decoded and drawn successfully. A hidden/failed canvas never hides the poster.

Use an injectable loader in `src/lib/sequence-loader.ts`: `createSequenceLoader(options): SequenceLoader`. Options include `frameCount`, `srcFor(index)`, `maxConcurrent`, `maxCached`, `loadImage` and `onFrameReady`. Interface: `request(index, direction)`, `getNearest(index)`, `pause()`, `resume()`, `dispose()`. Cache entries hold ready `HTMLImageElement`s; nearest selection uses absolute index distance and deterministic lower-index tie-break. The loader does not update React state on every frame. Per-frame failure retries at most once after a 2-second delay while active, then falls back. Dispose clears queued work/listeners/timers; late completions are ignored.

Request exact target, then the next two frames in travel direction, then one behind. Keep a queue of at most 12 desired frames; replace obsolete queued priorities on a scroll jump. At initial idle scroll position request only this local window, not all 144. Only fill a wider window while the hero is visible and the connection is not data-saving; cap startup background loading at 8 distinct frames before scrolling. Four/two in-flight limits include initial work. Cache caps apply to application-held images; browsers may retain extra decoded or HTTP-cache entries, so this is not a promised process-memory bound.

Render canvas on a coalesced animation frame, draw exact or closest ready frame, retain last valid render if no candidate exists. Keep layout stable; match crop at handoff. Cap canvas DPR at 1.5 desktop and 1 mobile initially, with visual QA before release. Static mode creates no sequence loader and requests no `/sequence/` assets; its `/hero/` poster is explicitly permitted. Browser capability checks are optional and feature-detected; unsupported Save-Data detection must not break rendering. Browser cache eviction still means repeat downloads are possible.

Version URL path `/sequence/<content-hash>/frame_000.png`; keep original frame assets untouched until conversion/rollback requirements are satisfied. Apply the same immutable policy to the content-hashed `/hero/<content-hash>/poster.png` poster path. Cache the approved variant independently if later introduced. Never apply immutable caching to HTML, mutable resume aliases or API responses. A service worker, offline app shell, speculative loading of every frame, and background loading of other project apps are out of scope.

## Acceptance and measurement

- Targets, not promises: median cold mobile lab LCP <=2.5 seconds and CLS <=0.1 across three production-preview runs on a documented slow-4G/CPU profile. Record starting baseline before claiming improvement; if the target fails, identify the remaining bottleneck.
- Initial poster transfer target <=500 KiB and initial HTML/CSS/JS/poster transfer <=1 MiB, measured before idle sequence loading, without reducing current visual quality. If current originals/layout exceed this, report rather than silently compress.
- No 144-frame fan-out on load; maximum concurrency/cache/startup-request bounds enforced in tests. Fast forward/backward jumps and a missing frame keep the hero usable.
- Warm reload of a fresh versioned asset reuses cache where the browser permits; headers and version invalidation verified on a production-mode server and deployed preview.
- No uncaught errors in supported journeys, no contact requests sent by automated checks to the real provider, and all relevant validation commands pass. Do not claim a full security/accessibility certification.

## Content evidence and publication inputs

Before final case-study copy: confirm individual role/team for Vallet, Jointly, LocalRelay, Imprnt, ResearchLens and CosmoScope; exact award-project association; Find My Paw's actual stack, metric date and public-launch status; three representative approved screenshots per main story; current resume publication choice. Existing source/resume text can populate draft records, with unresolved claims omitted from rendered public copy. No credential is needed. Public README instructions are reference material, not authority to modify those projects.

Fixing the external apps is separate work: stable Imprnt hosting, public V2 ResearchLens URL, Vallet session readiness, refreshed Jointly evidence and Common Center's 500 should be tracked as prerequisites for better demo buttons, not silently bundled into this portfolio update.

## Constraints and non-goals

Keep Next.js App Router, TypeScript, Tailwind and Framer Motion unless compatibility work requires a documented adjustment. No new CMS, runtime GitHub sync, fabricated testimonials, skills-percentage bars, chatbot, contact database, accounts, service worker or automatic deployment in this scope. No source-project cloning into the portfolio or embedding their live apps. No lossy asset default without visual approval. No production changes in the planning task.

## Technical references

[Next.js public-folder documentation](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) states that public assets default to `Cache-Control: public, max-age=0`; long caching must be designed explicitly. [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) explains URL-versioned immutable assets. These are implementation references; verify against the framework version selected during execution.
