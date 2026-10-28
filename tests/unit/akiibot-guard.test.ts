import { beforeAll, afterAll, expect, it } from "vitest";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { Guard } from "@/lib/akiibot/guard.server";
const exec = promisify(execFile),
  port = 16379;
const server = spawn(
  "redis-server",
  [
    "--port",
    String(port),
    "--bind",
    "127.0.0.1",
    "--save",
    "",
    "--appendonly",
    "no",
    "--locale-collate",
    "C",
  ],
  { stdio: "ignore", env: { ...process.env, LC_ALL: "C", LANG: "C" } },
);
const store = {
  eval: async (script: string, keys: string[], args: (string | number)[]) => {
    const { stdout } = await exec("redis-cli", [
      "-p",
      String(port),
      "--json",
      "EVAL",
      script,
      String(keys.length),
      ...keys,
      ...args.map(String),
    ]);
    return JSON.parse(stdout);
  },
};
beforeAll(async () => {
  for (let i = 0; i < 50; i++) {
    try {
      await exec("redis-cli", ["-p", String(port), "PING"]);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 30));
    }
  }
  throw new Error("Local test Redis unavailable");
});
afterAll(() => {
  server.kill();
});
const now = Date.UTC(2026, 9, 28);
function guard() {
  const id = crypto.randomUUID();
  return new Guard(store, `test:${id}:`, `billing:${id}:`);
}
function input(browserId = "b", t = now) {
  return {
    browserId,
    sessionId: "s",
    ipHash: "ip",
    requestId: crypto.randomUUID(),
    now: t,
  };
}
it("atomically limits browser/global concurrency across independent instances", async () => {
  const g = guard();
  const results = await Promise.all(
    Array.from({ length: 20 }, () => g.admitAttempt(input())),
  );
  expect(results.filter((x) => x.allowed)).toHaveLength(1);
  const g2 = guard();
  const many = await Promise.all(
    Array.from({ length: 5 }, (_, i) => g2.admitAttempt(input("browser" + i))),
  );
  expect(many.filter((x) => x.allowed)).toHaveLength(4);
});
it("deduplicates, counts successes, and retains ambiguous cost", async () => {
  const g = guard();
  const req = input();
  const a = await g.admitAttempt(req);
  if (!a.allowed) throw Error();
  expect((await g.admitAttempt(req)).allowed).toBe(false);
  const r = await g.reserveCost(a.lease, 8192, now);
  await g.finishAttempt(a.lease, r, undefined, false);
  expect(await g.spent(now)).toBe(r.reservedMicroUsd);
  await g.finishAttempt(
    a.lease,
    r,
    { inputTokens: 10, billableOutputTokens: 10 },
    true,
  );
  expect(await g.spent(now)).toBe(r.reservedMicroUsd);
});
it("enforces per-session success limit and idempotent settlement", async () => {
  const g = guard();
  for (let i = 0; i < 15; i++) {
    const a = await g.admitAttempt(input("b", now + i * 11000));
    if (!a.allowed) throw new Error(a.code);
    const r = await g.reserveCost(a.lease, 100, now);
    await g.finishAttempt(
      a.lease,
      r,
      { inputTokens: 100, billableOutputTokens: 10 },
      true,
    );
    await g.finishAttempt(
      a.lease,
      r,
      { inputTokens: 0, billableOutputTokens: 0 },
      true,
    );
  }
  const a = await g.admitAttempt(input("b", now + 200000));
  expect(a.allowed).toBe(false);
  if (!a.allowed) expect(a.code).toBe("session_limit");
  expect(await g.spent(now)).toBe(15 * 225);
});
it("reserves spending atomically and keeps original month on settlement", async () => {
  const g = guard();
  const a = await g.admitAttempt(input());
  if (!a.allowed) throw Error();
  const r = await g.reserveCost(a.lease, 8192, now);
  expect(r.reservedMicroUsd).toBe(19968);
  await g.finishAttempt(
    a.lease,
    r,
    { inputTokens: 100, billableOutputTokens: 20 },
    false,
  );
  expect(await g.spent(now)).toBe(300);
  expect(await g.spent(Date.UTC(2026, 10, 1))).toBe(0);
});

it("never admits concurrent reservations beyond the monthly allowance", async () => {
  const g = guard();
  const leases = Array.from({ length: 240 }, () => ({
    id: crypto.randomUUID(),
    browser: "synthetic",
    session: "synthetic",
    now,
  }));
  const results = await Promise.allSettled(
    leases.map((l) => g.reserveCost(l, 8192, now)),
  );
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(225);
  expect(await g.spent(now)).toBe(225 * 19968);
  expect(await g.spent(now)).toBeLessThanOrEqual(4500000);
});
it("releasing an old expired lease does not release a newer browser lease", async () => {
  const prefix = "lease-test:" + crypto.randomUUID() + ":";
  const g = new Guard(store, prefix, prefix + "billing:");
  const first = await g.admitAttempt(input());
  if (!first.allowed) throw Error();
  // The test clock advances sorted-set time; explicitly expire the real Redis PX key too.
  await store.eval(
    "return redis.call('DEL',KEYS[1])",
    [prefix + "active-browser:b"],
    [],
  );
  const later = await g.admitAttempt(input("b", now + 46000));
  if (!later.allowed) throw Error();
  await g.finishAttempt(first.lease, undefined, undefined, false);
  const third = await g.admitAttempt(input("b", now + 47000));
  expect(third.allowed).toBe(false);
  if (!third.allowed) expect(third.code).toBe("busy");
});
it("limits issuance independently from paid replies and bounds shared-IP attempts", async () => {
  const g = guard();
  for (let i = 0; i < 12; i++)
    expect(
      (await g.admitSessionCreation({ browserId: "b", ipHash: "ip", now }))
        .allowed,
    ).toBe(true);
  expect(
    (await g.admitSessionCreation({ browserId: "b", ipHash: "ip", now }))
      .allowed,
  ).toBe(false);
  for (let i = 0; i < 60; i++)
    await g.admitAttempt(input("different-" + i, now));
  const after = await g.admitAttempt(input("another", now));
  expect(after.allowed).toBe(false);
  if (!after.allowed) expect(after.code).toBe("rate_limited");
});
