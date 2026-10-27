import { test, expect } from "@playwright/test";
test("achievement albums preserve full photos and support keyboard viewing", async ({
  page,
}) => {
  await page.goto("/#achievements", { waitUntil: "domcontentloaded" });
  const opener = page.getByRole("button", {
    name: "View AI Buildfest 2026 photos",
  });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "AI Buildfest 2026 photos" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("1 / 3", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "src",
    "/awards/buildfest-trophy.jpg",
  );
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("2 / 3", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Next photo" }).click();
  await expect(dialog.getByText("3 / 3", { exact: true })).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "Open original image" }),
  ).toHaveAttribute("href", "/awards/buildfest-team.jpeg");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});
test("all supplied event albums are accessible on small screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 750 });
  await page.goto("/#achievements", { waitUntil: "domcontentloaded" });
  for (const name of [
    "AI Buildfest 2026",
    "NASA Space Apps 2025",
    "IUT GameJam 2026",
    "Prompt engineering",
    "Camp recognition",
  ]) {
    await page.getByRole("button", { name: `View ${name} photos` }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const image = dialog.getByRole("img");
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate((node) => {
          const photo = node as HTMLImageElement;
          return photo.complete && photo.naturalWidth > 0;
        }),
      )
      .toBe(true);
    expect(
      await image.evaluate((node) => getComputedStyle(node).objectFit),
    ).toBe("contain");
    await dialog.getByRole("button", { name: "Close photos" }).click();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("original award photos remain accessible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/#achievements", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /original photo/ })).toHaveCount(
    9,
  );
  await context.close();
});
