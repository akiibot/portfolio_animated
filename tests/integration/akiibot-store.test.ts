import { it, expect } from "vitest";
import { Guard } from "@/lib/akiibot/guard.server";
import { createStore } from "@/lib/akiibot/store.server";
process.loadEnvFile(".env.local");
it("shares real free Redis counters across two clients without storing transcripts", async () => {
  const url = process.env.UPSTASH_REDIS_REST_URL,
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Configure free Redis credentials first");
  const prefix = `akiibot:contract:${crypto.randomUUID()}:`,
    scope = prefix + "billing:",
    now = Date.now();
  const a = new Guard(createStore(url, token), prefix, scope),
    b = new Guard(createStore(url, token), prefix, scope);
  const results = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      (i % 2 ? a : b).admitAttempt({
        browserId: "browser",
        sessionId: "session",
        ipHash: "synthetic-ip",
        requestId: crypto.randomUUID(),
        now,
      }),
    ),
  );
  expect(results.filter((r) => r.allowed)).toHaveLength(1);
  const admitted = results.find((r) => r.allowed);
  if (!admitted?.allowed) throw Error("No admitted request");
  const r = await a.reserveCost(admitted.lease, 100, now);
  await b.finishAttempt(
    admitted.lease,
    r,
    { inputTokens: 100, billableOutputTokens: 20 },
    true,
  );
  expect(await a.spent(now)).toBe(300);
  await a.finishAttempt(
    admitted.lease,
    r,
    { inputTokens: 0, billableOutputTokens: 0 },
    true,
  );
  expect(await b.spent(now)).toBe(300);
});
