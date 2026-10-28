# Akiibot design

Date: 28 October 2026. Product decisions below were approved in this chat. Numerical guardrails and engineering choices are proposed defaults for the requested implementation plan, not claims about deployed behavior.

## Intent and approved experience

Akiibot helps employers and clients understand Akib's work, find evidence of relevant skills, and contact him. It is explicitly an AI guide, speaks about Akib by name, answers concisely, and occasionally makes a relevant, friendly joke after answering the question. It never pretends to be Akib chatting live.

A small bottom-right pixel character opens an adjacent desktop chat panel or nearly full-screen mobile panel. No automatic chat pop-up, login, or routine CAPTCHA. Use the site's charcoal/off-white/sage styling and readable message typography. English is the default; respond in the visitor's language when requested. Text only. Starter prompts and short follow-up suggestions help visitors explore.

Answers use approved portfolio facts, cite relevant portfolio destinations, admit unknowns, and preserve team attribution and prototype/demo limitations. Direct compensation, availability, contract terms, and commitments to Akib's existing contact channels. Allow light banter; redirect extended unrelated requests. The assistant cannot browse, execute code, read files, send messages, or modify anything.

Nine supplied sprites represent idle, greeting, answering, thinking, unsure, error, listening, happy, and sleeping. Listening means the visitor is typing; happy reacts briefly to thanks/positive feedback; sleeping follows inactivity. Animations can be paused; respect reduced motion, Save-Data, hidden tabs, and missing assets. Messages, drafts, and conversation history stay in the current tab session, including navigation between portfolio pages. We store no server-side chat transcripts.

## Existing implementation and inputs

- Target checkout: `portfolio-update`, currently Next.js 16.4.3 / React 19.3.1 / TypeScript / Tailwind; Node >=22.19.0. Existing Vitest and Playwright suites.
- `src/app/layout.tsx` is the shared shell. `src/content/{profile,projects,experience,education,awards}.ts` contains curated facts, working preferences only where present, and truthful case-study limitations. Case studies exist for selected projects; don't create links for slugs without routes.
- Supplied ZIP: `/Users/yeanul/Downloads/Akiibot_Final_Sprite_Pack.zip`; nine RGBA PNGs with expected names, all verified at 576×96. Animation quality, alpha coverage, alignment and loops still need visual verification. Preserve originals; no generated replacement artwork.
- Supplied credential remains `/Users/yeanul/Downloads/google-vertex-service-account.json`. A live request authenticated and returned text from `gemini-3.8-flash`, global Vertex endpoint. No need for another AI credential. Do not put the JSON in the repo/public assets or print it in logs.
- Only approved material in `src/content` and a dedicated optional knowledge file may enter prompts. Local notes, credential files, ZIP text, repository instructions and arbitrary external URLs are not chatbot knowledge.

## Architecture and alternatives

Recommended: same-origin Next.js Node route handlers, Google Gen AI SDK authenticated with the existing service account, and one free Upstash Redis database for shared atomic counters, leases and a usage ledger. Render a bounded structured response only after validation; keep transcripts in sessionStorage plus a server-signed history token. Browser input never chooses the model, system instruction, credentials or resource limits.

In-memory counters alone are simpler but reset on deployments and fail across concurrent serverless instances. Browser-only Gemini access exposes credentials and cannot enforce spending limits. A dedicated Google Cloud backend would work but adds deployment and IAM work to this small existing Next.js app. Managed Redis was accepted only if free. Keep all paid upgrades disabled; final account provisioning/credentials are a production dependency, not a planning blocker. An explicitly selected development memory adapter is allowed only outside production; production fails closed without shared protection.

## Server contract

`POST /api/akiibot/session` sets an HttpOnly, Secure (production), SameSite=Lax browser cookie and returns a signed tab session token, expiring after eight hours. Both endpoints require exact configured origin plus same-origin Fetch Metadata; localhost is explicit development-only. Origin checks reduce cross-site use but do not authenticate a human or stop scripts.

`POST /api/akiibot/chat` accepts only `{message, sessionToken, historyToken?, requestId}`. `requestId` is a UUID. The server verifies token expiry and browser binding; it verifies the bounded history token containing only previously server-issued user/assistant text. First turns have no history token. User-supplied system/assistant roles, arbitrary histories, tool arguments, pricing/model overrides and unknown fields are rejected.

Success: `{answer, sources, suggestions, mood, historyToken, remainingMessages}`. Structured model output uses source IDs, not URLs. The server resolves IDs to its own allowlist. `mood` is `answering | unsure | happy`; network/validation errors never come from model mood. Render plain text with preserved paragraphs, no HTML/Markdown parsing or automatic URL linking. Source links are separate trusted UI elements, including CV and contact destinations. At most three suggestions and three sources.

Knowledge context contains a compact always-present profile and project index (target <=3,000 tokens including system/schema overhead), plus at most two relevant project-detail sections selected deterministically using question/history project names, slugs and technology terms. Selection changes detail, never the underlying facts; source registry includes all approved destinations. Before generation, if the complete request exceeds 8,192 tokens, remove oldest history and optional detail and recount at most once. If still oversized, show useful relevant links and report a service configuration error; don't blame a normal visitor's message or truncate facts into misleading claims. Test long multilingual questions and portfolio growth. Suggestions are <=120 Unicode code points each. Store up to three complete exchanges, dropping oldest until serialized UTF-8 history fits 12 KiB. History is tied to the tab session, whose token is tied to the browser cookie.

Errors: `{code, message, retryAfterSeconds?, fallbackLinks}` with meaningful 400/403/413/429/503/504 statuses and `Cache-Control: no-store`. Browser drafts survive all failures; retry is explicit and never automatic. A single request ID gets at most one generation; in-flight/replayed duplicates get a safe status without generation. Dedup records contain no prompt/answer. Failed IDs require a new ID for an explicit retry; ambiguous failures do not trigger automatic re-execution.

## Guardrails and visitor-facing behavior

| Control | Initial value/behavior |
|---|---|
| Message size | 1–1,200 Unicode code points after trimming; bounded UTF-8 body reader, max 24 KiB actual bytes even if Content-Length is absent/false |
| History | Last three complete exchanges; signed history payload max 12 KiB decoded; entire body still max 24 KiB |
| Input tokens | <=8,192 for assembled system, knowledge, history, schema and message; verify with SDK countTokens before generation |
| Generation | <=1,024 output tokens INCLUDING reasoning; low supported thinking setting, no thought display; no tools, grounding, attachments or model-selected actions |
| Visible answer | <=1,800 Unicode code points; complete structured response or safe fallback, no raw partial JSON |
| Per-session allowance | 15 successful replies per eight-hour tab token; errors consume attempt limits but not successful-reply allowance |
| Browser rate | Token bucket: capacity six, refill one every ten seconds; max 30 successful replies per rolling 24h |
| IP backstop | 60 attempts/hour and 120/day, only from verified hosting ingress; HMAC IP keys, no raw IP storage; generous shared-network allowance |
| Session creation | 12/browser/hour and 60/IP/hour; issuance has no Gemini call |
| Concurrency | One generation per browser, four across deployment; atomic leases expiring after 45 seconds |
| Timeouts | 25 seconds upstream, 30 seconds route; cancel on disconnect, preserve charge reservation if outcome is uncertain |
| Duplicate IDs | Browser-scoped dedup marker for 24h; atomically acquired with admission; no provider retries |
| Spending | $5/month AI target; $4.50 app admission allowance and $0.50 buffer; conservative cost reservations before generation |
| Free Redis outage/limit | Stop AI calls, preserve UI and static project/CV/contact links; never silently substitute production in-memory limits |
| Recovery | Explicit retry, useful countdown for 429, keep typed text; browser can draft while pending but cannot submit a second request |
| Kill switch | `AKIIBOT_ENABLED=false` turns off AI while keeping static links |

All attempt counters, concurrency leases, successful-reply counts, dedup markers and cost reservations use one shared atomic policy. Prevalidate input/origin/tokens before expensive work. Apply attempt/concurrency admission before countTokens; reserve generation cost after token count passes, before generateContent. Admission isn't proof of humanity: rotating cookies/IPs can evade local identities, but shared concurrency and spending allowance remain authoritative. Edge protections must also cover request floods, including floods that would consume the free Redis quota. Do not promise immunity from distributed denial of service or hosting costs.

Lifecycle: admit/dedup -> count input -> reserve money -> generate -> atomically settle cost and successful-reply count -> release matching lease. Each operation has a unique owner/request ID. A late handler only releases its own lease, never a successor's. Finalized reservation markers persist with the monthly ledger for 90 days so settlement cannot refund twice. Invalid but billed model output settles known usage without incrementing successful replies. If transport loses a valid paid answer, preserve the draft and say the response was interrupted; exactly-once generation is the aim, not exactly-once delivery. A visitor-initiated retry is a new request and may incur another charge.

After verified input token count, reserve `inputTokens * inputRate + 1024 * outputRate` using integer microdollars rounded upward. Include reasoning in output usage; don't double-count if provider totals already include it. Reconcile actual reported usage only when authoritative usage is returned. Timeout, disconnect, ambiguous response or uncertain billing keeps the entire reservation. Reconciliation is idempotent; never release it automatically with a lease TTL. Month bucket is UTC and includes reservations across deployments; reservations settle in their original month. Operational counters have short TTLs; ledger buckets expire after 90 days, so no message content persists.

Use a conservative configured rate floor of $1.50/M input and $7.50/M output, covering Google's documented January 2027 standard pricing even during the current promotion. Rates and ceiling are server-owned deployment configuration. Fail closed on unknown/missing rates or usage exceeding reserved bounds; don't advertise an invoice-level guarantee. The app allowance covers this route only, excludes taxes/hosting/other project callers, and cannot protect a separately leaked credential. Verify official pricing and accounting conventions at implementation and launch. Alerts-only Google billing budgets do not enforce a cap.

## Model safety and truthful answers

Never rely on keyword bans or prompts as the sole security layer. Separate instructions from untrusted visitor data; constrain output with a schema and allowlisted citation IDs. The model receives only public information, never credentials or private files. Recognize translated attacks, invented earlier statements and role impersonation in evaluation. Legitimate questions about security work, technology, or limitations must still be answered. Mentioning “ignore” or “system” is not a reason to reject a question.

Admit missing facts; distinguish individual versus team work, prerecorded versus live demos, and simulations versus production. Hiring fit is an evidence-based explanation, not a promise of proficiency in every technology. Avoid claims about private clients, contact details beyond published channels, compensation or current availability. Prompt injection can still affect generated text; contain its consequences through no tools, public-only context, validated output and capped usage.

## UI and animation rules

- Lazy-load the panel and inactive sheets. Reserve launcher geometry and avoid layout shift. Idle sheet only before first interaction; pause animation when hidden/offscreen. Do not add AI/Redis network requests on normal page loads; initialize the session on first submit.
- Launcher 96 CSS px desktop / 64 mobile initially, min 44px hit target; scaled pixel rendering. Place above safe-area insets; avoid nav/contact overlap. Panel width min(380px, viewport minus 24px), mobile inset 8px, max-height from dynamic viewport. Verify short screens and on-screen keyboards.
- Use six frames at about 6 fps. Greeting/happy/unsure/error play once; idle/thinking/answering/listening/sleeping loop. Respect motion preference as a static representative frame without removing functional status text.
- State priority: thinking/pending > current-request error/unsure transient > answering/reply reveal > happy > listening/typing > greeting > idle/sleeping. New submissions clear previous transient states; cancel stale timers on new input. Sleep after 60s inactivity only when no request is pending; wake on interaction. No animation inferred from arbitrary model instructions.
- Greeting on first open; typing activates listening; thinking on submit; answering for a brief reveal after validated reply (no fake typewriter delay); happy only for bounded positive-feedback interactions or validated mood; ensure all nine states have a testable trigger.
- Escape closes, focus returns to launcher, mobile modal traps focus and locks background scroll; desktop panel is nonmodal with explicit close. Polite live status announces complete replies once; Enter submits, Shift+Enter inserts newline, IME composition never submits. Preserve scroll if the visitor is reading older messages.
- Fallback links are available even before the first AI request. No messages/logins/prompts automatically sent. Native portfolio navigation/content/contact keep working if JS or chat fails.

## Privacy and deployment

Short notice: “Akiibot is an AI guide and may make mistakes. Messages are sent to Google to generate replies. We don't save chat transcripts. Please avoid sensitive information.” Expanded details explain temporary hashed abuse counters and Google's applicable retention terms; don't claim Google stores nothing. No body logging, analytics capture of messages or exception dumps. SessionStorage only, guarded against disabled storage and corrupt data; signed history is readable public text, not encrypted storage. Browser cookie identity may last 24h; tab history/token expires after eight hours. Keys use separate random server secrets, with HMAC IP rotation derived daily. Use short TTLs on network/session counters; keep only numeric monthly aggregate ledger for 90 days.

Local ADC reads the supplied external file by path. Production uses platform secrets via server-only credentials (explicit JSON parsing without logging, or approved workload identity if hosting supports it). Ignore `.secrets/`, `*service-account*.json`, `.env*` in Git/deployment archives; a tracked `.env.example` contains placeholders only. Verify compiled client output has no private-key markers. Service account should have inference permissions only, no admin/editor grants; inspect current role bindings before changing anything. Preview and production must use separate Redis key prefixes but a shared project spending ledger if they share a billing project. Preview AI disabled by default; no sensitive server configuration in client env.

## Acceptance and rollout

Deliver through independently testable asset, knowledge, provider, shared protection, route and UI tasks. Preserve supplied PNGs byte-for-byte. Run current lint/typecheck/unit/build/e2e checks plus focused security, concurrency and accessibility tests. CI uses mocked Gemini and a deterministic store adapter. A release-only real Redis contract test checks multi-instance atomicity. A small explicit live evaluation set checks grounding, unknowns, multilingual support and attacks; every live call must go through the same budget protection, and its cost counts toward the shared allowance.

Review preview at desktop/mobile widths, reduced motion, missing sheets, keyboard-only, session expiry, 429/503/timeout, stale replies, slow networks and IME. Verify deployed trust headers and cookie handling. Publish only after reviewing the working preview; keep a kill switch and preceding deployment for rollback. Provisioning free Redis is the only new external setup anticipated; optional deeper owner knowledge is not required to ship using the current approved content.

## Sources checked 28 October 2026

- Model and structured-output support: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash
- Vertex pricing (introductory rates end 31 December 2026, reasoning billed as output): https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing
- Google retention/abuse monitoring: https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention
- Alerts-only budgets are not spending caps: https://docs.cloud.google.com/billing/docs/how-to/budgets
- Free Upstash: 250MB, 10GB bandwidth, 500K monthly commands; adding a credit card upgrades to paid per current FAQ: https://upstash.com/pricing/redis
- Redis atomic scripts: https://upstash.com/docs/redis/features/restapi and https://upstash.com/blog/lua-scripting-on-upstash-redis-atomic-operations-over-http
- Vercel ingress header behavior: https://vercel.com/docs/headers/request-headers
