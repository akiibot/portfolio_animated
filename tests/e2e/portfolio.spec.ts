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
  await page.goto("/projects/find-my-paw");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find My Paw",
  );
  await page.goto("/projects/not-a-project");
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
    "researchlens",
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
