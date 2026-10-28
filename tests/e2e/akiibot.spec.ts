import { test, expect } from "@playwright/test";
test("Akiibot opens on demand, preserves drafts and closes accessibly", async ({
  page,
}) => {
  let apiCalls = 0;
  page.on("request", (r) => {
    if (r.url().includes("/api/akiibot")) apiCalls++;
  });
  await page.goto("/");
  const launcher = page.getByRole("button", {
    name: "Open Akiibot",
    exact: true,
  });
  await expect(launcher).toBeVisible();
  expect(apiCalls).toBe(0);
  await launcher.click();
  await expect(page.getByRole("dialog", { name: "Akiibot" })).toBeVisible();
  await page.getByLabel("Your question").fill("What has Akib built?");
  await page.keyboard.press("Escape");
  await expect(launcher).toBeFocused();
  await launcher.click();
  await expect(page.getByLabel("Your question")).toHaveValue(
    "What has Akib built?",
  );
});
test("Akiibot replies safely and survives an interrupted request", async ({
  page,
}) => {
  await page.route("**/api/akiibot/session", (r) =>
    r.fulfill({
      json: { sessionToken: "fixture", expiresAt: Date.now() + 100000 },
    }),
  );
  await page.route("**/api/akiibot/chat", (r) =>
    r.fulfill({
      json: {
        answer: "Akib built a testnet prototype. <script>alert(1)</script>",
        sources: [{ id: "vallet", label: "Vallet", href: "/projects/vallet" }],
        suggestions: ["What were the tradeoffs?"],
        mood: "answering",
        historyToken: "signed",
        remainingMessages: 14,
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  await page.getByLabel("Your question").fill("Tell me about Vallet");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(
    page
      .locator(".akiibot-message p")
      .filter({ hasText: "Akib built a testnet prototype." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Vallet ↗", exact: true }).last(),
  ).toHaveAttribute("href", "/projects/vallet");
  await page.unroute("**/api/akiibot/chat");
  await page.route("**/api/akiibot/chat", (r) =>
    r.fulfill({
      status: 503,
      json: {
        code: "unavailable",
        message: "Please try again.",
        fallbackLinks: [],
      },
    }),
  );
  await page.getByLabel("Your question").fill("Keep this draft");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Akiibot" }).getByRole("alert"),
  ).toContainText("Please try again.");
  await expect(
    page.getByRole("button", { name: "Retry question" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Contact Akib", exact: true }),
  ).toBeVisible();
});

test("preserves new typing while a reply is pending and ignores stale replies after clearing", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  let calls = 0;
  await page.route("**/api/akiibot/session", (r) =>
    r.fulfill({
      json: { sessionToken: "fixture", expiresAt: Date.now() + 100000 },
    }),
  );
  await page.route("**/api/akiibot/chat", async (r) => {
    calls++;
    await gate;
    await r
      .fulfill({
        json: {
          answer: "Old response",
          sources: [],
          suggestions: [],
          mood: "answering",
          historyToken: "signed",
          remainingMessages: 14,
        },
      })
      .catch(() => {});
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  const draft = page.getByLabel("Your question");
  await draft.fill("First question");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
    "data-state",
    "thinking",
  );
  await draft.fill("Next question draft");
  await draft.press("Enter");
  expect(calls).toBe(1);
  await page.getByRole("button", { name: "Clear chat", exact: true }).click();
  release();
  await expect(page.locator(".akiibot-message")).toHaveCount(0);
  await expect(draft).toHaveValue("");
});

test("supports reduced motion, corrupted storage, privacy links and responsive layout", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    sessionStorage.setItem(
      "akiibot-tab-v1",
      '{"messages":[null],"draft":"bad"}',
    ),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  await expect(page.getByLabel("Your question")).toHaveValue("");
  const motion = await page
    .locator(".akiibot-sprite")
    .evaluate((e) => getComputedStyle(e).animationName);
  expect(motion).toBe("none");
  const dialog = page.getByRole("dialog", { name: "Akiibot" });
  const box = await dialog.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({
    path: `docs/qa/screenshots/akiibot-${info.project.name}.png`,
  });
});

test("waits on 429 without retrying automatically and preserves text", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/akiibot/session", (r) =>
    r.fulfill({
      json: { sessionToken: "fixture", expiresAt: Date.now() + 100000 },
    }),
  );
  await page.route("**/api/akiibot/chat", (r) => {
    calls++;
    return r.fulfill({
      status: 429,
      json: {
        code: "rate_limited",
        message: "Please pause briefly.",
        retryAfterSeconds: 2,
        fallbackLinks: [],
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  await page.getByLabel("Your question").fill("Remember me");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Akiibot" }).getByRole("alert"),
  ).toContainText("Please pause briefly.");
  await expect(page.getByLabel("Your question")).toHaveValue("Remember me");
  await expect(
    page.getByRole("button", { name: "Retry question" }),
  ).toBeVisible({ timeout: 6000 });
  expect(calls).toBe(1);
});

test("typing and inactivity drive listening and sleeping; pause is independent", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  await page.clock.fastForward(2000);
  await page.getByLabel("Your question").fill("Typing");
  await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
    "data-state",
    "listening",
  );
  await page.getByLabel("Your question").fill("");
  await page.clock.fastForward(61000);
  await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
    "data-state",
    "sleeping",
  );
  await page
    .getByRole("button", { name: "Pause character", exact: true })
    .click();
  await expect(page.locator(".akiibot-sprite")).toHaveClass(/akiibot-static/);
});

test("clears the raw submitted draft including whitespace, but preserves newer edits", async ({
  page,
}) => {
  await page.route("**/api/akiibot/session", (r) =>
    r.fulfill({
      json: { sessionToken: "fixture", expiresAt: Date.now() + 100000 },
    }),
  );
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  let calls = 0;
  await page.route("**/api/akiibot/chat", async (r) => {
    calls++;
    if (calls === 2) await gate;
    await r.fulfill({
      json: {
        answer: "Answered.",
        sources: [],
        suggestions: [],
        mood: "answering",
        historyToken: "signed",
        remainingMessages: 14,
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  const input = page.getByLabel("Your question");
  await input.fill("  First question\n");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(page.locator(".akiibot-message.akiibot-assistant")).toHaveCount(
    1,
  );
  await expect(input).toHaveValue("");
  await input.fill("Second question");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(page.locator(".akiibot-thinking")).toBeVisible();
  await input.fill("New draft");
  release();
  await expect(page.locator(".akiibot-message.akiibot-assistant")).toHaveCount(
    2,
  );
  await expect(input).toHaveValue("New draft");
});

test("an exhausted tab renews after expiry without a reload or premature Enter bypass", async ({
  page,
}) => {
  await page.clock.install();
  let issued = 0,
    calls = 0;
  await page.route("**/api/akiibot/session", (r) => {
    issued++;
    return r.fulfill({
      json: {
        sessionToken: "fixture-" + issued,
        expiresAt: Date.now() + (issued === 1 ? 10000 : 1000000),
      },
    });
  });
  await page.route("**/api/akiibot/chat", (r) => {
    calls++;
    return r.fulfill({
      json: {
        answer: "Answered.",
        sources: [],
        suggestions: [],
        mood: "answering",
        historyToken: "signed",
        remainingMessages: calls === 1 ? 0 : 14,
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  const input = page.getByLabel("Your question"),
    send = page.getByRole("button", { name: "Send question", exact: true });
  await input.fill("Last question");
  await send.click();
  await expect(page.locator(".akiibot-message.akiibot-assistant")).toHaveCount(
    1,
  );
  await input.fill("Keep this next draft");
  await expect(send).toBeDisabled();
  await input.press("Enter");
  expect(calls).toBe(1);
  await page.clock.fastForward(11000);
  await expect(input).toHaveValue("Keep this next draft");
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.locator(".akiibot-message.akiibot-assistant")).toHaveCount(
    1,
  );
  await expect.poll(() => issued).toBe(2);
  await expect.poll(() => calls).toBe(2);
});

test("all response moods animate and IME composition never submits", async ({
  page,
}) => {
  await page.clock.install();
  let calls = 0;
  const moods = ["unsure", "happy", "answering"];
  await page.route("**/api/akiibot/session", (r) =>
    r.fulfill({
      json: { sessionToken: "fixture", expiresAt: Date.now() + 1000000 },
    }),
  );
  await page.route("**/api/akiibot/chat", (r) => {
    const mood = moods[calls++];
    return r.fulfill({
      json: {
        answer: "Reply " + calls,
        sources: [],
        suggestions: [],
        mood,
        historyToken: "signed",
        remainingMessages: 15 - calls,
      },
    });
  });
  await page.goto("/");
  await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
    "data-state",
    "idle",
  );
  await page.getByRole("button", { name: "Open Akiibot", exact: true }).click();
  await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
    "data-state",
    "greeting",
  );
  await page.clock.fastForward(2000);
  const input = page.getByLabel("Your question");
  await input.fill("Composing");
  await input.dispatchEvent("keydown", {
    key: "Enter",
    isComposing: true,
    bubbles: true,
  });
  expect(calls).toBe(0);
  for (const [i, mood] of moods.entries()) {
    await input.fill("Question " + i);
    await page
      .getByRole("button", { name: "Send question", exact: true })
      .click();
    await expect(
      page.locator(".akiibot-message.akiibot-assistant"),
    ).toHaveCount(i + 1);
    await page.clock.runFor(50);
    await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
      "data-state",
      mood,
    );
    await page.clock.fastForward(2000);
  }
  await page.unroute("**/api/akiibot/chat");
  await page.route("**/api/akiibot/chat", (r) =>
    r.fulfill({
      status: 503,
      json: { code: "unavailable", message: "Unavailable", fallbackLinks: [] },
    }),
  );
  await input.fill("Failure");
  await page
    .getByRole("button", { name: "Send question", exact: true })
    .click();
  await expect(page.locator(".akiibot-sprite")).toHaveAttribute(
    "data-state",
    "error",
  );
});
