import { it, expect } from "vitest";
import { projects, getProjectBySlug } from "../../src/content/projects";
it("curates six unique primary/secondary projects and never invents a live app", () => {
  const featured = projects.filter((p) => p.placement !== "additional");
  expect(featured).toHaveLength(6);
  expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  expect(getProjectBySlug("find-my-paw")?.sourceUrl).toBeUndefined();
  expect(getProjectBySlug("researchlens")).toBeUndefined();
  expect(getProjectBySlug("now-todays-news")?.role).toBe(
    "Game development contributor",
  );
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
it("labels generated covers as illustrations and keeps them separate from screenshots", () => {
  for (const slug of ["imprnt-ai"]) {
    const project = getProjectBySlug(slug)!;
    expect(project.cover).toBeTruthy();
    expect(project.cover?.caption).toContain("AI-generated");
    expect(project.cover?.caption).toContain("illustration");
    expect(
      project.screenshots.some((image) => image.src === project.cover?.src),
    ).toBe(false);
  }
});

it("includes the supplied demos without treating recordings as live apps", () => {
  expect(getProjectBySlug("vallet")?.video).toEqual({
    kind: "youtube",
    id: "oH30ok8yAMM",
  });
  expect(getProjectBySlug("imprnt-ai")?.video).toEqual({
    kind: "youtube",
    id: "Tb8ayU6DSDo",
  });
  expect(getProjectBySlug("cosmoscope")?.video).toEqual({
    kind: "youtube",
    id: "Bq883qNbjoI",
  });
  expect(getProjectBySlug("now-todays-news")?.video).toEqual({
    kind: "youtube",
    id: "fYtWlmTALKk",
  });
  expect(getProjectBySlug("jointly")?.video).toEqual({
    kind: "file",
    src: "/projects/videos/jointly-demo.mp4",
  });
});
