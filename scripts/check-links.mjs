import { projects } from "../src/content/projects.ts";
import { profile } from "../src/content/profile.ts";
const urls = [
  ...new Set(
    [
      profile.github,
      profile.linkedin,
      ...projects.flatMap((p) => [
        p.sourceUrl,
        p.demo?.url,
        ...(p.caseStudy?.evidence.map((e) => e.url) || []),
      ]),
    ].filter((url) => typeof url === "string" && /^https?:\/\//.test(url)),
  ),
];
const report = [];
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        headers: { "User-Agent": "Akib-Portfolio-Link-Check" },
      });
      const protectedLink =
        /vercel.com\/(login|sso)/.test(response.url) ||
        response.status === 401 ||
        response.status === 403;
      report.push({
        url,
        status: response.status,
        result: protectedLink
          ? "protected / review"
          : response.ok
            ? "reachable"
            : "failed / review",
      });
      await response.body?.cancel();
    } catch (error) {
      report.push({
        url,
        result: "inconclusive / review",
        reason: error.message,
      });
    }
  }
}
await Promise.all(Array.from({ length: 3 }, worker));
console.table(report);
console.log(
  "Point-in-time HTTP checks only; review failures manually. No content was rewritten.",
);
