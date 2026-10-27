# Portfolio project selection

Reviewed 27 October 2026 for full-stack/software engineering employers.

## Method and limits

Enumerated all 27 public repositories through the [GitHub API](https://api.github.com/users/akiibot/repos?per_page=100&sort=updated). Requested READMEs for 18 candidates (16 available; two returned 404), inspected file trees for nine, and sampled implementation/limitation files for seven. Also read the externally owned CosmoScope repository already linked from the portfolio and checked Find My Paw, supplied in the resume. This is a selection review, not an independent audit of every repository or a claim that their tests currently pass.

Weighting: engineering substance and decisions, useful product workflow, demonstrated ownership, inspectable evidence, relevance to the target role, and reviewer-friendly presentation. Stars, repository count, recency alone and a long feature list are not evidence of quality. Team contributions must be attributed before publication.

HTTP checks below are point-in-time observations; HTTP 200 does not verify backend functionality. No accounts were created, no real SMS or contact message was sent, and no financial actions were performed. Demo credentials are not required to carry out the portfolio update.

## Recommended six case studies

Order is an editorial recommendation, not a claim that each is equally production-ready. Show four prominent cards initially, with two additional case studies in a secondary row. Swap the order if a stronger verified result becomes available.

| Order | Project | Why it earns a place | What the case study should prove | Link/status decision |
|---|---|---|---|---|
| 1 | **Find My Paw** | A specific real-world product, deployed public interface, and user-reported prerelease adoption. Strong ownership story. | QR-to-pet-profile-to-owner-contact journey, your actual architecture and contributions, and lessons from the prerelease. | [Public site](https://www.findmypaw.app/) opened in browser. Source is private per resume: no fake GitHub button. The 40+ prerelease-user figure is resume-supplied and needs dated context; it is not verified active usage. |
| 2 | **Vallet** (formerly ProofFi) | Strongest sampled systems-engineering story: typed contracts, FastAPI/Next.js, verification and execution boundaries, persistence and tests. | Explain planner versus verifier versus executor, one rejected candidate, and a testnet-only evidence trail. Highlight your specific team contribution. | [Repository](https://github.com/akiibot/vallet), [preview](https://prooffi-preview.vercel.app). HTTP 200; browser stayed at “Checking your session…” across observations. Prefer a case study and walkthrough; do not offer this as a frictionless public demo until repaired. Single-user, synthetic balances and Base Sepolia; no production financial-safety claims. |
| 3 | **Jointly** | Distinctive developer tool rather than another generic AI wrapper: Git isolation, MCP, executable interaction tests and evidence reporting. | Show the coupon/payment-retry collision missed by isolated tests, a scoped repair, and limits of the result. | [Repository](https://github.com/akiibot/jointly), [sample dashboard](https://jointly-ai-merge.vercel.app). Opened in browser. UI explicitly labels bundled historical evidence and a legacy unverified passport. Label the button “Sample dashboard,” not “Run analysis”; no claim that hosted analysis or automatic merging is live. |
| 4 | **LocalRelay** | Most immediately inspectable interactive demo of the new projects. Demonstrates offline web engineering, Web Workers, local inference, validation and state transitions. | Visitor/operator asymmetry, reviewed Bangla templates, exact offer/acceptance/acknowledgement states, and manual fallback. | [Repository](https://github.com/akiibot/LocalRelay), [interactive demo](https://localrelay-test.vercel.app/demo). Opened in browser without login. Label “Simulated SMS demo.” AI is experimental; basic-phone compatibility and independent Bangla review remain unverified per README. |
| 5 | **Imprnt AI** (repo spelling: `inprnt-ai`) | Strong full-stack visual product with a technically interesting separation of AI imagery and deterministic typography. | Brand brief → structured blueprint → AI background → HTML/CSS composition → three exported formats. Show actual generated outputs. | [Repository](https://github.com/akiibot/inprnt-ai). [Listed deployment](https://inprnt-ai.vercel.app) and latest successful-record preview both returned 404. Use source + screenshots/walkthrough until restored. Do not repeat README speed/perfection claims without measurement. Connect a competition award only after confirming this was the winning submission. |
| 6 | **ResearchLens V2** | Retrieval, deduplication, ranking, API orchestration and relational persistence add useful engineering breadth. | Trace one query through sources, ranking, evidence and faculty matching. Explain saved-report isolation accurately. | [V2 repository](https://github.com/akiibot/researchLensV2). Latest deployment record points to a preview that redirects to Vercel login. The [public ResearchLens link](https://research-lens-ashy.vercel.app) opens, but belongs to the V1 repo metadata; do not label it V2. V2 owner tokens are explicitly not a full account/authentication system. |

Find My Paw's stack is not verified from public source. Obtain it from the owner rather than inferring it from the other projects. Likewise, don't infer individual ownership from a repository being under this GitHub account.

## Worth retaining, with lower prominence

| Project | Recommendation | Evidence and preparation |
|---|---|---|
| [CosmoScope](https://github.com/Alfa5nm/CosmoScope_v2) | Keep as an achievement-linked project; this can replace a less presentable main card once personal contribution and a good walkthrough are ready. | README describes React/Three.js/MapLibre, NASA APIs and Express/SQLite. Connect to the resume-reported NASA finalist/team-lead achievement with attribution. No public deployment was established in this review. |
| [CropGuard AI](https://github.com/akiibot/CropGuard-AI) | Strong supporting engineering project; reserve slot or substitute for ResearchLens when a reliable walkthrough exists. | Sampled eight risk-engine test functions. Deterministic scoring separated from narration, WebSocket simulator and SQLite. No public app URL found; recent GitHub deployment records were failures linking to a Railway management console, not a visitor demo. Describe as a simulated monitoring prototype, not field-validated disease/yield prediction. |
| [QueueJhor](https://github.com/akiibot/QueueJhor) | Small supporting API case study, especially for backend/support tooling applications. | Rules + transaction evidence + optional LLM fallback; sample and adversarial tests present. Strong connection to your support work. No actual hosted endpoint found in README/runbook. Do not repeat “injection-proof” or guaranteed-safety wording. |
| [Protos Common Center](https://github.com/akiibot/protos_common_center) | Conditional future case study for team workflows, roles and persistence. | README distinguishes operational foundation from read-only/seeded views. Listed Vercel URL returned 500; README Sites URL could not be verified because the request failed TLS negotiation. Needs a stable approved sample-data walkthrough and confirmed personal contribution. |
| [OneTap Bus](https://github.com/akiibot/OneTap-Bus) | Keep in additional work; demonstrates PHP/MySQL and a conventional full-stack journey. | Team project; payments explicitly simulated. Listed [Vercel link](https://v0-one-tap-bus.vercel.app) returned HTTP 200 without an extracted title; browser navigation was blocked. This does not establish that the PHP/MySQL backend runs there or that the preview matches the repo. Verify the mapping before using a Live App button. |
| [AI Daily Planner](https://github.com/akiibot/ai-daily-planner-generator) | Optional visual/export project, particularly for freelance work; below the core six for this employer audience. | [Landing page](https://ai-daily-planner-generator.vercel.app) returned 200. README describes layouts, PNG/PDF export and optional image generation. Generation/export not exercised; don't claim they are currently verified. |

## Remaining account inventory

| Repository | Placement and reason |
|---|---|
| `QueueStorm` | Omit as a separate card; overlaps QueueJhor and is described as a mock preliminary-round service. |
| `researchLens` | Earlier version of the same product; link as V1 only if useful within the V2 case study, not as a duplicate main project. |
| `tahmina-jasmin-folio` | Optional client/design-work collection if your role and permission are confirmed. Public page returned 200; useful responsive UI work, weaker systems breadth than the six. |
| `priom-portfolio` | Same optional collection. Public page returned 200; README is still the Next.js starter. |
| `artistly-v6-comparison` | Keep out of public case studies until employer permission and publishable sample evidence are established. Description suggests production/development QA comparisons; no README found. Mention the job's approved aggregate outcomes instead. |
| `ai-engineer-roadmap` | Learning material; no README found. Omit from project gallery. |
| `mat_quizprep_website` | README only identifies the project; insufficient evidence to prioritize over stronger work. |
| `sql_retailSalesProject1` | Move out of featured projects. Tutorial-inspired introductory analysis; README has query/description mismatches (`< 1000` for a “greater than 1000” task and a date range extending beyond the described month). Fix these before using it as SQL evidence. |
| `cse221_BRACU` | Coursework: GitHub only, or a small education reference. |
| `portfolio_animated` | The portfolio itself; optional source link in footer after this update, not a featured case study. |
| `webDevPortfolio`, `html-portfolio`, `htlml.resume`, `html-resume.capstone1` | Older learning/portfolio iterations; omit from the main gallery. |
| `TestRepoPH`, `git_test`, `akiibot` | Test/profile repositories; omit from gallery. |

Five public repositories in the main choices + five supporting repositories under this account + seventeen repositories in the remaining inventory account for all 27 public repositories. CosmoScope is outside the account; Find My Paw is an additional private-source product.

## Link evidence details

- Jointly's repository homepage field lists `jointly-mu.vercel.app` (HTTP 200); README specifies `jointly-ai-merge.vercel.app`, which was inspected in the browser. Use the documented canonical demo after owner confirmation.
- ResearchLens V2's latest GitHub deployment status was successful on 10 July 2026, but its URL `research-lens-v2-efasekdfg-akiiibots-projects.vercel.app` redirected to Vercel login on review. Build/deployment success does not mean public accessibility.
- Imprnt's latest success-record URL `inprnt-fum6btryd-akiiibots-projects.vercel.app` also returned 404. Do not substitute an arbitrary guessed domain.
- A full feature journey was not performed on Find My Paw, Vallet, ResearchLens, the planner, or the portfolio sites. LocalRelay's initial interactive demo state and Jointly's sample evidence were inspected, not independently regenerated.

## Source trail

Primary sources: each linked repository's README and public metadata. Implementation samples: [Vallet verifier](https://github.com/akiibot/vallet/blob/HEAD/services/api/app/verifier/service.py), [Vallet limits](https://github.com/akiibot/vallet/blob/HEAD/docs/KNOWN_LIMITATIONS.md), [Jointly passport](https://github.com/akiibot/jointly/blob/HEAD/packages/core/src/passport.ts), [Jointly limits](https://github.com/akiibot/jointly/blob/HEAD/docs/limitations.md), [LocalRelay worker](https://github.com/akiibot/LocalRelay/blob/HEAD/src/workers/inference.worker.ts), [Imprnt renderer](https://github.com/akiibot/inprnt-ai/blob/HEAD/backend/compositor/renderer.py), [ResearchLens owner token](https://github.com/akiibot/researchLensV2/blob/HEAD/lib/ownerToken.ts), [CropGuard tests](https://github.com/akiibot/CropGuard-AI/blob/HEAD/backend/tests/test_engine.py), [QueueJhor runbook](https://github.com/akiibot/QueueJhor/blob/HEAD/RUNBOOK.md). Public repository code was read, not executed.

## Inspected tree revisions

The sampled source trees were captured at these Git object IDs (not claims about deployed revisions):

- `vallet`: `153c3c1de64fc0a67790ffb43b6601ce2db699fb`
- `protos_common_center`: `d7fa6830b7de893d4191f9dc4c5a76b3997e6fec`
- `LocalRelay`: `76726ffce85c6694fb0a6807e9cc707a6b13b036`
- `jointly`: `9d77aa253c015034b734a035a4f3acb5d2ef1567`
- `researchLensV2`: `da67b296e446380140661c76327fc1894fbb6220`
- `inprnt-ai`: `0f5217bd170c5403623118bbb6f0f6d8c3a538d2`
- `QueueJhor`: `82013e8613f2f130932e754720a4e9eff254cf2c`
- `CropGuard-AI`: `ddde3dcc3db892edcb336cb6e22a530c789d9c2d`
- `QueueStorm`: `a446478ba79e7abee0ddaed178657fdef0bcf2ee`
