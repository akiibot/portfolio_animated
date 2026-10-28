import { it, expect } from "vitest";
import {
  trustedClientIdentity,
  validateChatBody,
  readBoundedJson,
  verifyOrigin,
} from "@/lib/akiibot/policy";
it("ignores forged XFF in local mode and requires a single verified ingress IP in production", () => {
  const secret = "s".repeat(64),
    now = 123;
  const a = trustedClientIdentity(
    new Request("https://a.test", { headers: { "x-forwarded-for": "evil" } }),
    "local",
    secret,
    now,
  );
  const b = trustedClientIdentity(
    new Request("https://a.test"),
    "local",
    secret,
    now,
  );
  expect(a).toEqual(b);
  expect(() =>
    trustedClientIdentity(
      new Request("https://a.test", {
        headers: { "x-forwarded-for": "1.2.3.4, 8.8.8.8" },
      }),
      "vercel",
      secret,
      now,
    ),
  ).toThrow();
  const x = trustedClientIdentity(
    new Request("https://a.test", {
      headers: { "x-forwarded-for": "2001:db8::1" },
    }),
    "vercel",
    secret,
    now,
  );
  const y = trustedClientIdentity(
    new Request("https://a.test", {
      headers: { "x-forwarded-for": "2001:0db8:0:0:0:0:0:1" },
    }),
    "vercel",
    secret,
    now,
  );
  expect(x).toEqual(y);
});
it("allows full Unicode questions within 1200 code points and bounds real bytes even with false content length", async () => {
  const payload = {
    message: "😄".repeat(1200),
    sessionToken: "t",
    requestId: crypto.randomUUID(),
  };
  expect(validateChatBody(payload).message).toBe(payload.message);
  expect(() =>
    validateChatBody({ ...payload, message: payload.message + "a" }),
  ).toThrow();
  const req = new Request("https://a.test", {
    method: "POST",
    headers: { "content-length": "1" },
    body: JSON.stringify({ x: "😄".repeat(7000) }),
  });
  await expect(readBoundedJson(req)).rejects.toThrow();
});
it("does not accept lookalike origins or absent Fetch Metadata", () => {
  expect(() =>
    verifyOrigin(
      new Request("https://a.test", {
        headers: {
          origin: "https://a.test.evil.test",
          "sec-fetch-site": "same-origin",
          "content-type": "application/json",
        },
      }),
      ["https://a.test"],
    ),
  ).toThrow();
  expect(() =>
    verifyOrigin(
      new Request("https://a.test", {
        headers: {
          origin: "https://a.test",
          "content-type": "application/json",
        },
      }),
      ["https://a.test"],
    ),
  ).toThrow();
});
