# Portfolio Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is a proposed plan, not authorization to begin product changes.

**Goal:** Turn the existing animated portfolio into a fast, accessible, evidence-backed presentation for full-stack/software engineering employers.

**Architecture:** Retain the Next.js App Router site and existing dark visual language. Server-render content from typed local records; isolate the progressive canvas as an optional client enhancement. Case studies are static routes; demo links are curated records, never runtime GitHub calls or embedded external apps.

**Tech Stack:** Existing TypeScript, Next.js, React, Tailwind and Framer Motion; propose Vitest for deterministic logic and Playwright for critical browser journeys. Dependency compatibility is pinned and verified in Task 1 before feature work. No database/CMS or service worker.

**Spec:** [Proposed design and change catalogue](../specs/2026-10-27-portfolio-update-design.md). [Project evidence and selection](../../research/2026-10-27-project-selection.md).

## Global Constraints

- Audience confirmed by owner: full-stack/software engineering employers.
- No product implementation or deployment in the planning task. During execution, preserve current uncommitted work and use an isolated branch/worktree per repository policy.
- No lossy asset default without visual approval. Original PNGs stay recoverable.
- Max in-flight frames: 4 desktop / 2 below 768px. Max app cache: 24 / 12 plus in-flight work. Max desired queue: 12. Before scrolling, load at most 8 distinct frames in the background.
- Static poster for reduced motion and detectable Save-Data; explicit opt-in can enable animation. No sequence loader or `/sequence/` requests in static mode; the separate `/hero/` poster request is permitted.
- Only content-hashed `/sequence/` and `/hero/` image URLs receive `public, max-age=31536000, immutable`. HTML, APIs and mutable resume aliases do not.
- Proposed animated hero height: 200vh desktop / 120vh below 768px. Static hero: one viewport with content allowed to grow.
- Contact timeout: 15 seconds. No real provider submission in tests.
- No fabricated metrics, roles, testimonials or awards. Private source remains private. Login-required, simulated and historical demos must be labeled accurately.
- Unsupported case-study claims are omitted from public copy, with draft provenance maintained separately. Missing evidence does not block unrelated fixes.

## Review Focus

1. A single missing frame and rapid backward/forward scroll must leave a valid poster/frame visible; exercised in Tasks 3 and 5.
2. Reduced motion, Save-Data, hidden/offscreen hero and a late load completion must not restart unwanted downloads or resurrect disposed state; exercised in Tasks 3 and 5.
3. HTTP 200/provider rejection, non-JSON response, timeout and double-submit must preserve recoverable contact state; exercised in Task 6.
4. A 320px viewport, 200% zoom and keyboard navigation must retain accessible Resume/Contact actions and readable content; exercised in Tasks 7 and 10.
5. A stale asset version, unknown slug and protected/unavailable demo must not produce stale content, an invented live button or a broken route; exercised in Tasks 4, 8 and 11.

## Delivery order

Release A: baseline, compatibility, loader/poster, cache headers, contact and navigation correctness (Tasks 0–7; Task 2 supplies content contracts). Release B: curated gallery, approved case studies, current resume/experience, metadata and polish (Tasks 8–10). Task 11 verifies and prepares each release. Optional compression comparison is Task 12 and is not a prerequisite for the quality-preserving loading improvements.

The website's first release does not depend on repairing Vallet, Imprnt, ResearchLens V2 or Common Center. Give these accurate source/walkthrough links and status labels. Repairs to those projects are separate work.

## File and responsibility map

| Files | Responsibility |
|---|---|
| `src/content/types.ts`, `profile.ts`, `projects.ts`, `experience.ts`, `education.ts`, `awards.ts` | Typed editable content, approved facts and links |
| `src/lib/sequence-loader.ts`, `src/lib/sequence-manifest.ts` | Scheduling/cache logic and versioned asset lookup |
| `src/components/Hero.tsx`, existing `ScrollyCanvas.tsx`, `Overlay.tsx` | Immediate poster and optional synchronized animation |
| Existing `NavBar.tsx`, `ui/tubelight-navbar.tsx`, `Contact.tsx` | Navigation and contact behavior |
| Existing `Projects.tsx`, new `ProjectCard.tsx`, `src/app/projects/[slug]/page.tsx` | Curated gallery and case studies |
| Existing `About.tsx`, `Experience.tsx`, `EducationAwards.tsx`, new `Achievements.tsx` | Resume-driven sections and compact hierarchy |
| `src/app/page.tsx`, `layout.tsx`, `globals.css`, `sitemap.ts`, `robots.ts`, `not-found.tsx` | Document structure, typography and metadata |
| `scripts/prepare-sequence.mjs`, `scripts/check-links.mjs`, `public/sequence/<hash>/`, `public/projects/`, `public/resume/` | Deterministic assets, local captures and link maintenance |
| `tests/unit/`, `tests/e2e/`, config files, `.github/workflows/ci.yml` | Meaningful regression coverage and repeatable verification |
| `docs/qa/`, `docs/content-evidence.md`, `README.md` | Measurements, claim provenance, setup and release notes |

Paths are relative to `/Users/yeanul/Documents/ChatGPT/Portfolio/portfolio_animated`. This plan names new files but does not create them during planning.

### Task 0: Capture an honest baseline

**Files:** Create `docs/qa/portfolio-baseline.md`; no product changes. Covers C27.

**Interfaces:** Produces baseline revision, runtime, build mode, browser/profile, viewport, test conditions, cold/warm asset requests, transferred bytes and visual captures for later comparisons.

- [ ] Record `git status --short`, revision and Node/npm versions. Preserve unrelated changes. Read applicable repository instructions and establish the execution branch/worktree.
- [ ] Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build`; record results, not just exit summaries. Existing baseline had a successful build and one testimonial hook warning; recheck rather than assume.
- [ ] Serve the production build on an available local port. Capture 390px and 1280px layouts, a cold hero load, a warm reload and scroll-to-projects. Collect three lab runs under one documented slow-4G/CPU profile using browser DevTools or a reputable lab tool; use the same tool/settings later.
- [ ] Record full/production-only audit results without forced upgrades. Keep large/raw traces out of Git; retain summarized timings and screenshot references.

**Acceptance:** Later claims have a reproducible baseline. If a measurement tool is unavailable, explicitly record that gap rather than report an invented score.

### Task 1: Stabilize dependencies and establish critical-path test tooling

**Files:** Modify `package.json`, `package-lock.json`, framework/lint config as needed; create `.nvmrc`, `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `docs/qa/dependency-decision.md`. Covers C07, C28 and part of C29.

**Interfaces:** Produces `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:e2e`, `npm run build`, and an explicit production test-server port.

- [ ] Query official support/upgrade documentation and current registry advisories. Choose a supported patched Next.js release and compatible exact React/lint/runtime versions; record the chosen pins, changes and migration cost in the decision file. Existing Node is 22.19.0; don't presume that stays sufficient for the selected release. This compatibility decision is intentionally made against current advisories at execution time.
- [ ] Upgrade in one isolated compatibility change; preserve the visual/behavior baseline. If moving beyond the version supporting `next lint`, replace that command with the supported ESLint CLI/config. Pin verified dependencies in the lockfile.
- [ ] Add Vitest and Playwright as dev tooling, with package scripts above. Browser tests start a production-mode app on port 3100 and never depend on the user’s port-3000 session. Add one useful smoke journey asserting hero identity, working project/contact anchors and no uncaught page errors.
- [ ] Run all new scripts and compare baseline captures. Run `npm audit` and `npm audit --omit=dev`; document each unresolved finding's actual applicability and release decision. Do not equate a clean build with a security assessment.
- [ ] Commit the compatibility/tooling change once checks pass. No major upgrade is merged solely because `audit fix --force` suggested it.

### Task 2: Define curated, evidence-backed content records

**Files:** Create `src/content/{types,profile,projects,experience,education,awards}.ts`, `docs/content-evidence.md`, `tests/unit/content.test.ts`. Covers C09, C13, C15, C19 and C20.

**Interfaces:** `Project` has `slug`, `name`, `summary`, `stack: string[]`, optional approved `role`, `status: 'product'|'prototype'|'hackathon'`, `placement: 'primary'|'secondary'|'additional'`, optional `sourceUrl`, optional `demo: {url, kind: 'live-app'|'sample-dashboard'|'simulated-demo'|'login-required', checkedAt}`, `screenshots: {src,alt,width,height}[]`, and optional approved `caseStudy`. `caseStudy` contains `problem`, `contribution`, `architecture`, `decisions: string[]`, `evidence: {label,url?}[]`, `limitations: string[]`, and optional contextualized `outcome`. Export `projects: readonly Project[]` and `getProjectBySlug(slug: string): Project | undefined`. Profile exports name/headline/summary/email/social URLs/resume URL; remaining files export typed section arrays.

- [ ] Write `content.test.ts`: unique URL-safe slugs, valid link schemes, no live-kind entry for known-unavailable URLs, source omitted for private Find My Paw, current six candidates in specified placements. A case-study entry requires approved contribution and at least one publishable screenshot/evidence item.
- [ ] Run `npm run test:unit -- tests/unit/content.test.ts`; confirm failure before adding records/helpers.
- [ ] Populate draft facts from the selection document/resume; keep provenance and unresolved facts in `docs/content-evidence.md`, not in user-facing labels. The old ResearchLens URL must not become a V2 live link. For inaccessible/unverified demos omit the action; a login-required link is optional and explicitly labeled.
- [ ] Confirm or omit individual contribution, award-project associations and adoption context before enabling case-study publication. Use concise factual copy; no inferred Find My Paw stack or unmeasured performance guarantee.
- [ ] Rerun the unit test and typecheck. Commit content/schema together. This task supplies data interfaces; later tasks do not duplicate arrays in UI components.

### Task 3: Build the bounded frame scheduler

**Files:** Create `src/lib/sequence-loader.ts`, `tests/unit/sequence-loader.test.ts`. Covers C02, C03 and loader portion of C04.

**Interfaces:** Implement the `SequenceLoader` and options defined in the spec: `request(index, direction)`, `getNearest(index)`, `pause()`, `resume()`, `dispose()`. `direction` is `-1|0|1`; image loading is injected for deterministic tests. Null is returned when no frame is ready. The caller clamps frame indices to 0–143; the loader also validates bounds.

- [ ] Write tests using deferred fake image promises for target-first priority, direction neighbors, 4/2 concurrency, 24/12 LRU ready-cache caps, 12-item queue cap and no 144-frame eager startup. Test initial idle startup <=8 distinct frames.
- [ ] Add tests for a jump from frame 4 to 140 and then 2, nearest-frame lower-index tie-break, a rejected frame with one delayed retry, no retry after permanent failure, pause/resume without losing current target, and disposed late completion producing no callback.
- [ ] Run the test file and confirm failures against the absent implementation.
- [ ] Implement scheduling with replaced obsolete queued priorities, bounded in-flight work and LRU eviction. No React dependency. Clear timers and references on dispose; don't claim this strictly bounds browser-process memory.
- [ ] Run unit tests and typecheck; commit. This logic's output is a ready image/nearest image, not a React render or scroll owner.

### Task 4: Version animation assets and verify caching

**Files:** Create `scripts/prepare-sequence.mjs`, `src/lib/sequence-manifest.ts`, versioned assets, `tests/unit/sequence-manifest.test.ts`, `tests/e2e/cache.spec.ts`; modify `next.config.mjs`, `ScrollyCanvas.tsx` asset lookup and README asset instructions. Covers C10.

**Interfaces:** `sequenceManifest` exports `{version: string, frameCount: 144, posterSrc: string, srcFor(index: number): string}`. `version` is a SHA-256 content digest prefix of the ordered frame inputs and encoding options (12 hex characters); frame output path `/sequence/<version>/frame_NNN.png`; byte-identical first-frame poster at `/hero/<version>/poster.png`. Preserve original files until rollout/rollback verification is complete. Manifest generation is deterministic.

- [ ] Test unchanged inputs yield identical version and mapping; a changed input byte/encoding option changes the version; all 144 source frames exist and output URLs resolve.
- [ ] Implement the script/manifest without lossy conversion. Update the existing ScrollyCanvas asset lookup to consume this manifest; Task 5 must use the same mapping. Do not maintain parallel hard-coded filename logic.
- [ ] Configure headers solely on the content-hashed sequence and hero-poster paths. Test actual response headers from the production-mode server; verify HTML and mutable URLs do not inherit immutable caching.
- [ ] Validate deployment-preview headers and warm-cache behavior in browser network inspection, then change version and verify fresh asset retrieval. A new browser/evicted cache still downloads: do not promise persistence.
- [ ] Document asset regeneration, old-version retention and rollback; run relevant tests/build, commit. Do not add a service worker.

### Task 5: Show the poster immediately and enhance with animation

**Files:** Create `src/components/Hero.tsx`, `tests/e2e/hero.spec.ts`; modify `ScrollyCanvas.tsx`, `Overlay.tsx`, `src/app/page.tsx`. Covers C01, C03, C04, C12 and C25.

**Interfaces:** `Hero` server-renders profile copy/poster/actions; the client enhancement receives sequence manifest, poster URL and profile text as props. A single normalized progress value maps to frame and overlay state. Client code uses Task 3; a visible button controls animation without changing access to content.

- [ ] Add browser tests: block every sequence request and assert visible poster/copy/actions; serve some delayed/missing frames and assert no blank handoff or uncaught errors; jump scroll down/up and confirm a valid render remains. Assert bootstrap request/concurrency bounds with controlled responses.
- [ ] Test reduced motion and detectable Save-Data: no `/sequence/` requests before opting in, while the `/hero/` poster remains visible. Test tab visibility and offscreen hero suspension, plus unmount/remount with delayed completions. With JavaScript disabled, poster, heading and Work/Resume links remain usable.
- [ ] Run tests to expose current preload/fallback behavior; then implement poster layering and lazy loader activation. Use one coalesced render per animation frame; draw decoded candidates and only then reveal the canvas. Never hide the poster on download-start alone.
- [ ] Set specified hero heights and canvas DPR caps; match poster/canvas crop. Honor reduced motion in overlay and smooth scrolling too. Opt-in restarts only the animation, not document loading.
- [ ] Verify keyboard/zoom layouts and poster-to-canvas transition visually at mobile/desktop. Run unit tests, hero browser tests and build; commit.

### Task 6: Make contact submission reliable and accessible

**Files:** Modify `src/components/Contact.tsx`; create `tests/e2e/contact.spec.ts`. Covers C05, C06, C33.

**Interfaces:** Keep the existing Web3Forms integration initially. Model status as idle/submitting/success/error, capture form synchronously, set AbortController timeout to 15 seconds and clear timeout on completion/unmount. Preserve direct email access. Public provider access-key presence is not automatically a leaked server secret.

- [ ] Mock provider responses in browser tests: success; HTTP 200 with `success:false`; non-2xx; invalid JSON; timeout; two rapid submits. Assert one request, correct accessible status, successful reset only, failed values preserved, enabled retry and no success-then-error combination.
- [ ] Run to demonstrate the current success/reset bug; implement the captured-form fix, guarded submission and explicit state transitions. Keep a visible success acknowledgment until the next editing/submission action instead of a fragile timer reset.
- [ ] Add live status/error semantics, appropriate autocomplete and descriptive submit/loading text. Replace disruptive alert-based failures; keep email fallback available throughout.
- [ ] Use city/country contact location and brief truthful external-form-processing disclosure. Check current provider docs for a supported honeypot/domain restriction; add only the documented mechanism, with its behavior tested. Never paste provider secrets into UI copy.
- [ ] Run mocked contact journeys plus lint/typecheck/build, then commit. A real message requires a separately agreed test recipient/purpose and is not necessary for these checks.

### Task 7: Repair navigation, semantics and section order

**Files:** Modify `NavBar.tsx`, `ui/tubelight-navbar.tsx`, `src/app/page.tsx`, `globals.css`; create `tests/e2e/navigation.spec.ts`. Covers C08, C14, C24, C26 and remaining C25.

**Interfaces:** Stable IDs `home`, `projects`, `about`, `experience`, `education`, `contact`; resume URL supplied by profile data. Nav links include Home/name, Work, About, Experience, Contact, Resume, with an accessible compact layout below 768px. A link uses browser hash/back behavior; active location reflects hero and contact.

- [ ] Add tests for keyboard-only navigation, named links, current section state, hash/back restoration, anchor landing below sticky nav, and resume action at 320px. Test 200% zoom and no horizontal document overflow at 320/375/390/768/1280px.
- [ ] Replace fixed padding/no-wrap assumptions with an intentional compact mobile layout; preserve >=44px target dimensions. Do not require all six labels to fit on one mobile line.
- [ ] Add nav/main landmarks and skip link; use h2s for section titles, `scroll-margin-top` for anchors and visible focus. Respect reduced motion; do not prevent default hashes without reproducing normal history/focus behavior.
- [ ] Reorder sections per spec; ensure content is present without animation initialization. Remove dead pointer styling from decorative award/timeline elements.
- [ ] Run navigation browser tests and keyboard checks, build and commit. Release A can now be reviewed independently of case-study assets.

### Task 8: Publish curated project cards and approved case studies

**Files:** Modify `Projects.tsx`; create `ProjectCard.tsx`, `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx`, project screenshot assets, `tests/e2e/projects.spec.ts`. Covers C09, C16, C17, C18, C32 and part of C22.

**Interfaces:** Task 2's `projects` and `getProjectBySlug`; static params include only approved case-study records. Use framework-compatible route parameter typing and metadata APIs selected in Task 1. Additional work links use the same records, without duplicating product versions.

- [ ] Write tests for primary/secondary placement, only approved slugs rendering, unknown/draft slug returning 404, private-source omission and exact demo-kind labels. Verify ProjectCard and source/demo actions by keyboard; avoid nested anchors and invented clickable cards.
- [ ] Add approved real interface screenshots, sized responsively and loaded lazily below the fold. Use honest placeholders only in development; public cards with missing imagery use a designed text treatment. No fabricated product screenshots.
- [ ] Build four primary and two secondary cards, with additional work links. Main action opens the case study; source/demo are distinct actions with appropriate external-link semantics. Replace current one-image/three-column thumbnail grid.
- [ ] Implement case-study sections from approved records and unique metadata. Explain architecture with a small static diagram where it clarifies the story. Distinguish test fixtures, recorded evidence, prototypes and user-reported metrics.
- [ ] Run tests/build; visually check full-width previews on phones and desktop. Smoke-check public demo destinations without signing in or creating external data; record checked date and commit.

### Task 9: Update resume, experience, awards and skills

**Files:** Modify `About.tsx`, `Experience.tsx`, `EducationAwards.tsx`; create `Achievements.tsx`, `public/resume/yeanul-haque-khan-akib-cv-2026-10.pdf`; update content records and `tests/e2e/content.spec.ts`. Covers C13, C19–C21.

**Interfaces:** Section components consume typed content only. Profile provides one resume URL used by hero/nav/footer and View/Download actions.

- [ ] Review and approve public facts against the supplied PDF and owner corrections. Keep current title/date wording, university “in progress,” and dated adoption context. Add QA/support work and teaching without overstating software authorship at the employer.
- [ ] Group concrete skills as Languages, Frontend, Backend/Data, Testing/Delivery and AI/Developer Tools. Remove “JavaScript (Learning)” and generic Office emphasis; no proficiency percentage graphics.
- [ ] Add the newer awards and retain NASA/team role and relevant older achievements; keep school/leadership sections compact. Do not attach a win to a project based on guesswork.
- [ ] Copy the approved PDF unchanged to the versioned resume path; compare file digest with the source. Verify served content type, readable filename, view/download behavior and all mobile links. Never overwrite the original Downloads file.
- [ ] Assert critical facts/resume links in browser smoke checks, visually inspect section spacing and commit. Styling-only details require visual review, not mirrored implementation tests.

### Task 10: Finish metadata, typography and accessibility polish

**Files:** Modify `layout.tsx`, `globals.css`, cards/sections as needed; create `src/app/sitemap.ts`, `robots.ts`, approved favicon/OG assets, `tests/e2e/metadata.spec.ts`, `docs/qa/accessibility.md`. Covers C22, C23, C24, C25, C26, C30, C32.

**Interfaces:** Production base URL is `https://akiibotportfolio.vercel.app` until owner explicitly changes domain. Sitemap enumerates home and approved case studies only. Existing local fonts remain available.

- [ ] Test title/description/canonical and case-study metadata, social image resolution, sitemap entries and robots behavior for production. Keep preview deployments non-indexable using deployment configuration appropriate to the selected framework/host; verify actual headers/meta, not a guessed environment flag.
- [ ] Bind body typography to `--font-geist-sans`; define a small spacing/text/color scale and consistent card styles. Ensure normal text contrast >=4.5:1 and reduced-motion styles apply to reveals/hover/transitions.
- [ ] Review keyboard flow, 200% zoom, mobile landscape, screen-reader names and reduced motion. No essential content may depend on hover or visible animation. Add automated accessibility checks only where they catch material regressions; document manual limitations.
- [ ] Remove unused testimonial component and icon packages after confirming imports. Replace a watermark-bearing visual only with an approved original/licensed asset, not watermark removal. The sequence can remain until replacement exists.
- [ ] Run metadata/navigation/project tests, lint/typecheck/build, inspect all routes and commit.

### Task 11: CI, link maintenance, measurement and release preparation

**Files:** Create `.github/workflows/ci.yml`, `scripts/check-links.mjs`, `docs/qa/portfolio-release.md`; replace starter `README.md`. Covers C27–C29, C31, C34.

**Interfaces:** CI consumes Task 1 scripts on the pinned Node version. `npm run check:links` reports reachable, protected, failed and inconclusive external destinations with bounded timeout/concurrency and no form submissions. Transient external failures report for review instead of automatically rewriting status or failing all PRs.

- [ ] CI runs clean install, lint, types, deterministic tests and build; browser tests use their isolated production server. Keep provider submission mocked and no production secrets required.
- [ ] Check content/asset links and canonical production routes, including 404s. README explains setup, content edits, asset versioning, quality comparison, contact provider, checks and release/rollback.
- [ ] Repeat Task 0 lab conditions for three cold and warm runs; report medians and sequence transfer separately. Targets: cold lab LCP <=2.5s, CLS <=0.1, initial poster <=500 KiB, initial HTML/CSS/JS/poster <=1 MiB before background frames. Treat unmet targets as findings to resolve, not guaranteed results.
- [ ] Obtain a deploy preview when implementation is authorized; verify actual cache headers, no mobile overflow, representative case studies, resume and mocked contact. Save a compact before/after report with conditions and unresolved limits.
- [ ] Prepare production release and rollback to the previous working deployment. Publish only when the execution request authorizes it or final approval has been obtained. Post-release smoke check contains no live message or financial/SMS action.

### Task 12: Optional image-format comparison, after the functional improvements

**Files:** Add `scripts/compare-sequence-formats.mjs`, `docs/qa/image-quality.md`, local comparison outputs; modify manifest/assets only after acceptance. Covers C11.

**Interfaces:** Consume originals, do not overwrite them. Output labeled PNG/lossless-WebP/high-quality-lossy-WebP/AVIF samples plus bytes and generation settings. Start with frames 0, 36, 72, 108, 143; review all frames/transition flicker if conversion is selected.

- [ ] Produce side-by-side samples at intended desktop/mobile crop and display sizes; inspect face, hair, fine textures, gradient banding and temporal consistency. Report measured savings, not a promised percentage.
- [ ] Let the owner choose whether the quality tradeoff is acceptable. If not, keep PNG or lossless assets; Tasks 3–5 still improve perceived loading and revisits.
- [ ] If approved, encode the full sequence, regenerate a new content-hashed manifest, preserve originals and rerun failure/caching/hero tests. Validate Safari/Chrome image decoding and mobile behavior. Benchmark before choosing extra format complexity; one well-supported format may suffice.
- [ ] Publish comparison conclusions in the QA note; commit only the approved production assets/configuration. Lossy conversion is not assumed approved by the request for this plan.

## Handoff and unresolved inputs

The recommended approach is incremental execution in the existing site. This planning task adds documentation only. Before publishing new case studies, obtain precise team contributions, approved assets, award associations and Find My Paw context listed in the spec. For missing evidence, ship the reliable core with a smaller approved selection rather than inventing details. Compression approval is deferred to concrete visual samples. The selected dependency pins are determined and tested in Task 1; this plan does not claim an untested upgrade is compatible.

## Plan self-review

- C01–C34 are each mapped above; optional C11 is explicitly separate.
- Review-focus failures map to named tests/tasks, including cache invalidation, bad slugs and mislabeled demos.
- Content types are defined before consumers; loader/manifest interfaces remain separate from React and shared by the hero.
- Publication and external-app fixes are not silently included. Source documents and tests are evidence at different levels; repository tests were not executed during research.
