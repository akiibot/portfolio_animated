# Akiibot production release — 28 October 2026

Live portfolio: https://akiibotportfolio.vercel.app

## Deployment

- Source: `ddb480d`, branch `codex/portfolio-update` (includes sprite cleanup).
- Deployment: `dpl_GAFhEz6jM69nksGdkDoKREmvWZTo`.
- Immutable deployment URL: https://akiibotportfolio-5l69dz4et-akiiibots-projects.vercel.app
- Vercel production build passed; server region `iad1`, matching the Redis region.
- Staged with `--prod --skip-domain`, checked through authenticated owner access, then promoted to the public domain. Public alias inspection confirmed this deployment is READY and production.
- No merge to `main` was performed. Future Git-driven production deployments must include this branch's changes to retain Akiibot.

## Configuration

Seven sensitive, production-only Vercel variables were installed: `AKIIBOT_ENABLED`, `AKIIBOT_ALLOWED_ORIGINS`, `AKIIBOT_SESSION_SECRET`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`. The allowed origin is exactly the public domain above; the production signing secret is newly generated. No local credential path is used in production. Deployment manifest inspection confirmed local env files and service-account files were excluded. Secret values are intentionally omitted here.

Published free Vercel WAF rule `rule_akiibot_api_burst_limit_GRObmv`: paths beginning `/api/akiibot/`, 60 requests per IP per 60 seconds, fixed window, HTTP 429 response. No CAPTCHA, paid plan upgrade or payment method was added. This supplements the application limits, shared cost ledger and concurrency guard documented in the implementation QA.

## Public smoke checks

All checks used the public canonical domain without an owner protection bypass:

- Homepage HTTP 200, widget trigger and current sprite hash `df293a4bb6e7` present.
- All nine PNG sprite sheets returned real PNGs at 576 × 96 pixels with immutable caching.
- CV PDF and Find My Paw project page returned HTTP 200.
- Session POST succeeded with Secure, HttpOnly, SameSite=Lax cookie and no-store response.
- One real Gemini question succeeded in 3.33 seconds with grounded text and approved CV/projects links. Response was no-store.
- Replay of the same request ID returned HTTP 429 with `duplicate`; no second generation was admitted.
- Session request from an unapproved origin returned HTTP 403.

A staged real Gemini question also succeeded before promotion. These point-in-time checks complement the unit/browser/live evaluation and independent review already recorded; they do not establish universal abuse resistance or a latency guarantee. Existing IAM, billing-alert and real-device verification boundaries in the implementation QA remain applicable.

## Rollback and disable

Previous production deployment: `dpl_DqqYvTktrCrf6oa6E6Y1xab6CfyB`, URL https://akiibotportfolio-qaahe3ybp-akiiibots-projects.vercel.app.

To roll back, promote that prior deployment in the linked Vercel project. To disable AI on a subsequent release, set production `AKIIBOT_ENABLED=false` and redeploy. Keep the shared Redis ledger intact so deployment changes do not reset usage counters or budget reservations.
