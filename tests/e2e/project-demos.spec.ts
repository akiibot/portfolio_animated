import { test, expect } from "@playwright/test";

test("demo players make no requests until opened and are removed when closed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mediaRequests: string[] = [];
  page.on("request", (request) => {
    if (/youtube|jointly-demo\.mp4/.test(request.url()))
      mediaRequests.push(request.url());
  });
  await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Demo player</p>" }),
  );
  await page.goto("/");
  await expect(page.locator("iframe, video")).toHaveCount(0);
  expect(mediaRequests).toEqual([]);
  const card = page
    .locator(".project-card")
    .filter({
      has: page.getByRole("heading", { name: "Vallet", exact: true }),
    });
  const screen = card.locator(".preview-image");
  const before = await screen.boundingBox();
  await card.getByRole("button", { name: "Watch demo of Vallet" }).click();
  await expect(screen.getByTitle("Vallet video demo")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/oH30ok8yAMM?autoplay=1",
  );
  await expect(screen.locator("a, img")).toHaveCount(0);
  const after = await screen.boundingBox();
  expect(after?.height).toBeCloseTo(before!.height, 0);
  await expect(
    card.getByRole("link", { name: "Open on YouTube" }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=oH30ok8yAMM");
  await card.getByRole("button", { name: "Show screenshot of Vallet" }).click();
  await expect(screen.locator("iframe")).toHaveCount(0);
  await expect(screen.locator("img")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("Jointly recording loads and plays with native controls on demand", async ({
  page,
}) => {
  await page.goto("/projects/jointly");
  await expect(page.locator("video")).toHaveCount(0);
  await page.locator("summary").filter({ hasText: "of Jointly" }).click();
  const video = page.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState))
    .toBeGreaterThanOrEqual(1);
  expect(
    await video.evaluate((node: HTMLVideoElement) => node.duration),
  ).toBeGreaterThan(175);
  await video.scrollIntoViewIfNeeded();
  await expect(video).toBeInViewport();
  await video.evaluate((node: HTMLVideoElement) => {
    node.muted = true;
    return node.play();
  });
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThan(0);
  await page.locator("summary").filter({ hasText: "of Jointly" }).click();
  await expect(page.locator("video")).toHaveCount(0);
});

test("the game has real release images and ResearchLens is absent from public pages", async ({
  page,
  request,
}) => {
  await page.goto("/projects/now-todays-news");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Now Today’s News",
  );
  await expect(
    page.getByRole("link", { name: "Get the game" }),
  ).toHaveAttribute("href", "https://notfullyblissful.itch.io/now-todays-news");
  const image = page.getByAltText(
    "Now Today's News side-scrolling city with a public broadcast and protesters",
  );
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBeGreaterThan(0);
  expect((await request.get("/projects/researchlens")).status()).toBe(404);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "researchlens",
  );
  await page.goto("/");
  await expect(page.getByText(/ResearchLens/i)).toHaveCount(0);
  await expect(
    page.locator("summary").filter({ hasText: "of CosmoScope" }),
  ).toHaveCount(1);
});

test("demo links remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/projects/vallet");
  await page.locator("summary").click();
  await expect(
    page.getByRole("link", { name: "Open on YouTube" }),
  ).toBeVisible();
  await context.close();
});

test("the Jointly card plays inside its preview and restores its screenshot", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const card = page
    .locator(".project-card")
    .filter({
      has: page.getByRole("heading", { name: "Jointly", exact: true }),
    });
  await card.getByRole("button", { name: "Watch demo of Jointly" }).click();
  const video = card.locator(".preview-image video");
  await expect(video).toBeInViewport();
  await expect(video).toHaveAttribute("autoplay", "");
  await video.evaluate((node: HTMLVideoElement) => {
    node.muted = true;
    return node.play();
  });
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThan(0);
  await card
    .getByRole("button", { name: "Show screenshot of Jointly" })
    .click();
  await expect(card.locator("video")).toHaveCount(0);
  await expect(card.locator(".preview-image img")).toBeVisible();
});
