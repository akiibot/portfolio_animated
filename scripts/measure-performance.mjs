// Optional reproducible candidate-only lab sample. Not a Lighthouse score or a field benchmark.
import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
const url = process.env.PORTFOLIO_LAB_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({
  channel: process.env.PORTFOLIO_BROWSER_CHANNEL || undefined,
});
const samples = [];
try {
  for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__portfolioLab = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const item of list.getEntries())
          window.__portfolioLab.lcp = item.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const item of list.getEntries())
          if (!item.hadRecentInput) window.__portfolioLab.cls += item.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    for (const visit of ["cold", "warm"]) {
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(4000);
      const metrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        const frames = resources.filter((r) => r.name.includes("/sequence/"));
        return {
          ...window.__portfolioLab,
          sequenceRequests: frames.length,
          sequenceTransferred: frames.reduce((s, r) => s + r.transferSize, 0),
          totalResourceTransferred: resources.reduce(
            (s, r) => s + r.transferSize,
            0,
          ),
        };
      });
      samples.push({ run, visit, ...metrics });
    }
    await context.close();
  }
  const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const report = {
    profile: {
      url,
      viewport: "390x844",
      browser: "Chromium",
      latencyMs: 150,
      downloadMbps: 1.6,
      cpuSlowdown: 4,
      observation: "load event plus four seconds",
      date: "2026-10-27",
      note: "Candidate only; no equivalent original-production timing baseline. LCP/CLS from browser PerformanceObserver, not a Lighthouse or field score.",
    },
    samples,
    medians: Object.fromEntries(
      ["cold", "warm"].map((visit) => {
        const rows = samples.filter((s) => s.visit === visit);
        return [
          visit,
          {
            lcpMs: Math.round(median(rows.map((r) => r.lcp))),
            cls: median(rows.map((r) => r.cls)),
            sequenceRequests: median(rows.map((r) => r.sequenceRequests)),
            sequenceTransferred: median(rows.map((r) => r.sequenceTransferred)),
          },
        ];
      }),
    ),
  };
  await mkdir("docs/qa", { recursive: true });
  await writeFile(
    "docs/qa/candidate-performance.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report.medians, null, 2));
} finally {
  await browser.close();
}
