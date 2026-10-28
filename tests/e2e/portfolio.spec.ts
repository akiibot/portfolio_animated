import { test, expect } from "@playwright/test";
test("server renders content and local resume without animation dependencies", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let frames = 0;
  page.on("request", (r) => {
    if (r.url().includes("/sequence/")) frames++;
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Akib");
  await expect(
    page.getByRole("heading", { name: "Selected work." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View resume", exact: true }).first(),
  ).toHaveAttribute("href", /\/resume\/.*\.pdf/);
  expect(frames).toBe(0);
});
test("has accessible mobile navigation, no horizontal overflow, and working project routes", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Work", exact: true }).first().click();
  await expect(page).toHaveURL(/#projects$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/projects/find-my-paw", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find My Paw",
  );
  await page.goto("/projects/not-a-project", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Page not found." }),
  ).toBeVisible();
});
test("success resets contact form and never shows both success and failure", async ({
  page,
}) => {
  await page.route("https://api.web3forms.com/submit", (r) =>
    r.fulfill({ json: { success: true } }),
  );
  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Portfolio test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Message", { exact: true }).fill("Mocked contact test");
  await page.getByRole("button", { name: /^Send message$/i }).click();
  await expect(page.getByRole("status")).toContainText("Message sent");
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
  await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
});
test("provider failure retains message and allows retry", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", (r) =>
    r.fulfill({ status: 500, body: "not json" }),
  );
  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Message", { exact: true }).fill("Keep this message");
  await page.getByRole("button", { name: /^Send message$/i }).click();
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Keep this message",
  );
  await expect(
    page.getByRole("button", { name: /^Send message$/i }),
  ).toBeEnabled();
});
test("versioned assets are immutable but HTML is not", async ({ request }) => {
  const html = await request.get("/");
  const text = await html.text();
  const poster = text.match(/\/hero\/[a-f0-9]{12}\/poster\.png/);
  expect(poster).not.toBeNull();
  const image = await request.get(poster![0]);
  expect(image.headers()["cache-control"]).toContain("immutable");
  expect(html.headers()["cache-control"] || "").not.toContain("immutable");
});
test("a missing animation frame leaves the poster visible with bounded startup requests", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const frames: string[] = [];
  await page.route("**/sequence/**", async (r) => {
    frames.push(r.request().url());
    await r.fulfill({ status: 404, body: "missing" });
  });
  await page.goto("/");
  await expect(
    page.getByRole("img", { name: "Portrait of Yeanul Haque Khan Akib" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Pause animation" }).click();
  expect(frames.length).toBeLessThanOrEqual(8);
  await expect(
    page.getByRole("button", { name: "Play animation" }),
  ).toBeVisible();
});
test("critical content and resume remain accessible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View resume", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Find My Paw", exact: true }),
  ).toBeVisible();
  await context.close();
});
test("all six case studies and sitemap render with correct metadata", async ({
  page,
  request,
}) => {
  for (const slug of [
    "find-my-paw",
    "vallet",
    "jointly",
    "localrelay",
    "imprnt-ai",
    "now-todays-news",
  ]) {
    await page.goto("/projects/" + slug);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      "https://akiibotportfolio.vercel.app/projects/" + slug,
    );
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/projects/localrelay");
  const resume = await request.get(
    "/resume/yeanul-haque-khan-akib-cv-2026-10.pdf",
  );
  expect(resume.headers()["content-type"]).toContain("application/pdf");
});
test("contact rejects provider success:false and malformed JSON without losing input", async ({
  page,
}) => {
  for (const body of ['{"success":false}', "invalid JSON"]) {
    await page.route("https://api.web3forms.com/submit", (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body }),
    );
    await page.goto("/#contact");
    await page.getByLabel("Name", { exact: true }).fill("Test");
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page
      .getByLabel("Message", { exact: true })
      .fill("Retain these words");
    await page.getByRole("button", { name: /^Send message$/i }).click();
    await expect(page.locator("form").getByRole("alert")).toBeVisible();
    await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
      "Retain these words",
    );
    await page.unroute("https://api.web3forms.com/submit");
  }
});
test("contact times out safely and guards rapid duplicate submissions", async ({
  page,
}) => {
  await page.clock.install();
  let calls = 0;
  await page.route("https://api.web3forms.com/submit", async () => {
    calls++;
  });
  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Message", { exact: true }).fill("Retain on timeout");
  await page.locator("form").evaluate((form) => {
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
  await expect.poll(() => calls).toBe(1);
  await page.clock.fastForward(16000);
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
    "Retain on timeout",
  );
});
test("small screens retain navigation and do not overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/");
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Resume", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 390) {
      await page.screenshot({ path: "docs/qa/screenshots/mobile-hero.png" });
      await page
        .getByRole("link", { name: "Work", exact: true })
        .first()
        .click();
      await page
        .getByRole("heading", { name: "Selected work." })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: "docs/qa/screenshots/mobile-projects.png",
      });
    }
  }
});

test("short viewports keep the canvas bitmap at the displayed aspect ratio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("canvas[data-ready=true]")).toBeVisible();
  const mismatch = await page.locator("canvas").evaluate((node) => {
    const canvas = node as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    return Math.abs(canvas.width / canvas.height - rect.width / rect.height);
  });
  expect(mismatch).toBeLessThan(0.005);
});

test("contact protects the submitted draft while a request is pending", async ({
  page,
}) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("https://api.web3forms.com/submit", async (route) => {
    await pending;
    await route.fulfill({ json: { success: true } });
  });
  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("My submitted message");
  await page.getByRole("button", { name: /^Send message$/i }).click();
  await expect(page.getByLabel("Message", { exact: true })).toBeDisabled();
  release();
  await expect(page.getByRole("status")).toContainText("Message sent");
  await expect(page.getByLabel("Message", { exact: true })).toBeEnabled();
});

test("without JavaScript contact directs visitors to email instead of an unsafe GET form", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/#contact");
  await expect(page.locator("#contact form")).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "yhk.akib12@gmail.com", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("direct project anchors remain aligned after hero hydration", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projects");
  await expect(
    page.getByRole("button", { name: "Pause animation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Selected work." }),
  ).toBeInViewport();
});

test("pausing motion does not collapse the hero and move the page", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Pause animation" }),
  ).toBeVisible();
  const before = await page
    .locator("#home")
    .evaluate((node) => node.getBoundingClientRect().height);
  await page.getByRole("button", { name: "Pause animation" }).click();
  const after = await page
    .locator("#home")
    .evaluate((node) => node.getBoundingClientRect().height);
  expect(after).toBe(before);
});

test("lightweight real captures use their direct JPEG URL without runtime transformation", async ({
  page,
}) => {
  await page.goto("/projects/find-my-paw", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("img", {
      name: "Find My Paw landing page featuring a smart QR pet collar",
    }),
  ).toHaveAttribute("src", "/projects/captures/find-my-paw-landing.jpg");
});
