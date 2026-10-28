# Akiibot implementation and verification — 28 October 2026

Follow-up: background-remnant cleanup is recorded in [akiibot-sprite-cleanup.md](akiibot-sprite-cleanup.md). The current manifest uses cleaned version `df293a4bb6e7`; the original supplied version is retained.

Local interactive preview: http://127.0.0.1:3137/ (development server, real protected Gemini/Redis backend). A separate production-build server on port 3140 was used for mocked browser regression checks; production configuration intentionally rejects non-Vercel hosting for real AI requests.

## Delivered

- Nine supplied PNG sprite sheets preserved byte-for-byte under `/akiibot/1fac0ef44182/`. Importer verifies the filename allowlist, path safety, dimensions, RGBA transparency and occupied frames. All 54 frames inspected on the contact sheet; original art retains its different seated/standing poses and supplied shadows rather than being regenerated.
- Lazy responsive panel with plain-text answers, approved source links, starter/follow-up questions, accessible close/focus behavior, reduced-motion/pause, idle/sleeping and all nine states. No API/session calls before submission. Text-only input supports IME and Shift+Enter; mobile modal behavior uses inert background content.
- Public-only curated knowledge from existing content, truthful project/team/prototype caveats, clear AI identity, multilingual responses, missing-fact/contact handoff and light banter. No tools, arbitrary URL fetching, file access or action execution.
- Server-only Vertex service-account auth, fixed Gemini 3.8 Flash global endpoint, LOW thinking (MINIMAL is unsupported), bounded input/output, strict schemas and source IDs. Model text renders literally; supplied HTML-like text cannot execute.
- Signed browser-bound eight-hour tab sessions and signed bounded history; forged roles/history are rejected. Drafts/history stay in tab sessionStorage, with guarded memory fallback and restored-state/link validation. No server-side chat transcripts.
- Free, account-owned Upstash database `akiibot-portfolio`, N. Virginia, confirmed Free Tier / $0 / 500K commands per month / 250MB / 10GB. No payment method or paid upgrade added. Secrets saved in ignored `.env.local`, external Google credential remains outside the repository. Git and deployment exclusions protect credential patterns.
- Shared atomic attempt/session/success limits, browser/IP backstops, four-generation concurrency ceiling, owner-specific leases and request dedup. Conservative integer cost reservations precede generation, settle idempotently in their original UTC month, and remain charged in the ledger on uncertain outcomes. Missing/outage/quota-exhausted Redis disables AI safely. `$4.50` monthly admission allowance plus `$0.50` buffer supports the initial `$5` AI target; unrelated callers, hosting/taxes and independently leaked credentials are outside that allowance.
- Private no-store API responses and sanitized errors. `Server-Timing` contains durations only, never prompts, replies, account identifiers or tokens. No automatic provider retries.

## Verification evidence

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; existing pages remain static, two AI routes dynamic |
| `npm run test:unit` | 32 passed, including actual Redis Lua concurrency, spending reservations, session limits, delayed leases, Unicode/body limits, forged state and safe output |
| Hosted store contract | Passed: two independent Upstash clients / eight racing attempts admit one, cross-client settlement and refund idempotency verified |
| Full production-build Playwright suite | 66 passed in 3.4 minutes, desktop and mobile, existing portfolio/contact/awards/project regressions included |
| Additional sprite/IME test | 2 passed, desktop/mobile; all reply moods and composition-Enter behavior verified |
| Independent review fixes | Both reproduced RED, corrected GREEN, included in the full suite |
| Live model evaluation | Final 12/12 HTTP 200, grounded factual/unknown/Bangla/banter/attack cases inspected; observed timings/answer assessments in `akiibot-live-evaluation.json`, raw final targeted response in `akiibot-grounding-refinement.json` |
| Existing curated external links | All 12 selected destinations returned HTTP 200 with network access; point-in-time reachability only |
| Production dependency audit | Zero vulnerabilities reported |
| Secret checks | No private-key marker in tracked source or compiled client JS; local env and service-account filenames ignored |
| Client payload | Widget-bearing shared layout chunk is 5,941 bytes gzip, including existing navigation; this is not an exact incremental baseline measurement |

The browser checks exercise draft preservation through close/reopen and outages, concurrent submissions, interrupted/stale replies after Clear chat, corrupt storage, mobile layout, reduced motion, explicit retry/countdowns, sleeping, all nine states, IME composition, whitespace submission and exhausted-session expiry recovery. They use installed Chrome with desktop/mobile emulation, not a full Safari/device/screen-reader certification. The source unit suite now needs a local `redis-server` and `redis-cli`; CI installs them explicitly.

## Live latency, usage and limitations

Final 12-case local evaluation: median 5,893.5ms, nearest-rank p95/max 19,412ms, 0/12 final-run errors. Individual model generations ranged roughly 1.9–16.7s. The target median <=6s was met in this sample; target p95 <=12s was **not** met. No model substitution was made because the owner requested Gemini 3.8 Flash. Guard round trips from Dhaka to N. Virginia individually measured roughly 229–778ms in this local sample; this does not establish matched-region production performance.

Two earlier runs each stopped on a 25-second timeout at the third question. The system returned 504 without automatic retries, kept the submitted draft available, and retained the full usage reservation. An isolated follow-up succeeded in 5.1s; the final complete run succeeded with follow-up history. Transient latency remains a provider/region consideration. Conservative route ledger before the last targeted grounding check: approximately **$0.101593**, including unknown-outcome reservations, rather than a claim about the exact Google invoice. Final evaluation reserves at most $0.24; a targeted grounding wording check also passed (HTTP 200, 6,348ms, at most $0.02 reserved). Combined evaluation run upper bounds stayed below $0.50.

The model resisted the evaluated fabricated MIT/Google credentials, fake Nobel history, private-key request and off-topic essay. This is sample-based evidence, not proof of universal prompt-injection resistance. An evaluation refinement tells the model to describe absent credentials/awards as unlisted or unverified rather than assert that they are false; prompts and schema still cannot guarantee every sentence is correct. Credentials/private data never enter model context, and no actions are available even if generated text is manipulated.

## Independent review

One fresh independent reviewer examined the whole change for security, standards and spec behavior. No important server-side bypass was found. Two P2 findings were fixed with tests that failed first:

1. Raw whitespace submitted with a question remained in the composer and could encourage a second paid request. The client now compares against the captured raw submission, preserving any newer draft.
2. An exhausted tab kept Send disabled after expiry while Enter behaved differently. Expiry now clears old conversation authorization/allowance locally without issuing a request, retains the draft, and renews on the next explicit send. The common send path enforces the pre-expiry quota for buttons, suggestions and Enter.

No review findings were deferred. Additional author checks added bounded restored-state validation, safe stored links and operational duration-only timing.

## Implementation rulings

- Guard methods carry opaque typed lease/reservation objects rather than bare IDs, keeping request identities out of long-lived settlement records. Callers must retain these objects during one request.
- Approved dependencies were installed together and reply tests grouped with knowledge tests, keeping shared boundary checks together; no product scope change.
- Original superpowers helper scripts disappeared during a session refresh. Execution continued against the already-approved plan with the existing ledger and equivalent manual steps; no runtime behavior change.
- The SDK counter omits the response-schema wrapper. The request bound adds its UTF-8 byte length plus 256 tokens to measured content/system tokens; this conservatively reduces available context rather than under-reserving cost.
- UI tasks 6/7 were delivered together because the mounted Widget consumes useChat directly; no throwaway publicly exposed fixture API was introduced.

## Production release boundaries

Production was deployed on 28 October 2026 after owner approval. See [akiibot-production-release.md](akiibot-production-release.md) for deployment, public smoke checks, configuration and rollback details. The following records the original release checklist and remaining verification boundaries:

- Install production server-only secrets in the hosting environment; a local Downloads credential path is not a production credential. Use the same project ledger and stable session secret, exact deployment origin allowlists and explicit preview enablement.
- Confirm actual Vercel ingress/XFF overwrite, cookies, free edge/bot protections and body handling on the deployed preview. Application controls cannot prevent every distributed flood from consuming hosting or free-Redis quota. Do not enable a paid WAF/Redis upgrade automatically.
- Service-account IAM policy inspection returned HTTP 403. Inference works; current role bindings/least privilege were not independently certified. An account administrator should check inference-only access before release; no IAM changes were made.
- Configure/verify Google billing alerts and current provider pricing/retention; alerts-only budgets are supplementary, not hard caps. Global routing is the owner-selected tested setup; no regional data-residency promise.
- Test blocked storage, real on-screen keyboards and assistive technology on target devices; automated coverage does not certify all browsers. Verify closed-widget CLS against a deployed baseline if a release performance guarantee is needed.
- Keep `AKIIBOT_ENABLED=false` available as a kill switch, retain the previous working deployment, and roll back by promoting it. Static portfolio/contact links remain usable with AI disabled.

See the implementation plan/spec for the full policy and test boundaries. Local test evidence and public production smoke evidence are recorded separately.
