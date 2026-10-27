import { it, expect } from "vitest";
import { digestFrames } from "../../scripts/prepare-sequence.mjs";
import { sequenceManifest } from "../../src/lib/sequence-manifest";
import { existsSync } from "node:fs";
it("versions content deterministically and changes version when bytes change", () => {
  expect(digestFrames([Buffer.from("a")])).toBe(
    digestFrames([Buffer.from("a")]),
  );
  expect(digestFrames([Buffer.from("a")])).not.toBe(
    digestFrames([Buffer.from("b")]),
  );
});
it("maps all original frames and a separate static poster", () => {
  expect(sequenceManifest.frameCount).toBe(144);
  expect(sequenceManifest.posterSrc).toMatch(
    /^\/hero\/[a-f0-9]{12}\/poster.png$/,
  );
  for (let i = 0; i < 144; i++)
    expect(existsSync("public" + sequenceManifest.srcFor(i))).toBe(true);
});
