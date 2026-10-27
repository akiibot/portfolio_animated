import { it, expect } from "vitest";
import { projects, getProjectBySlug } from "../../src/content/projects";
it("curates six unique primary/secondary projects and never invents a live app", () => {
  const featured = projects.filter((p) => p.placement !== "additional");
  expect(featured).toHaveLength(6);
  expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  expect(getProjectBySlug("find-my-paw")?.sourceUrl).toBeUndefined();
  expect(getProjectBySlug("researchlens")?.demo).toBeUndefined();
  expect(getProjectBySlug("imprnt-ai")?.demo).toBeUndefined();
  expect(getProjectBySlug("jointly")?.demo?.kind).toBe("sample-dashboard");
  expect(getProjectBySlug("localrelay")?.demo?.kind).toBe("simulated-demo");
  expect(getProjectBySlug("missing")).toBeUndefined();
  for (const p of projects) {
    expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    for (const u of [p.sourceUrl, p.demo?.url].filter(Boolean))
      expect(u).toMatch(/^https:\/\//);
  }
});
