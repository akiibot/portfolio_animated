import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { spriteManifest, spriteStates } from "@/components/akiibot/assets";
describe("supplied Akiibot sprites", () => {
  it("has nine versioned RGBA sheets, six occupied frames each", () => {
    expect(spriteStates).toHaveLength(9);
    for (const state of spriteStates) {
      const path = `public${spriteManifest.urls[state]}`;
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.readUInt32BE(16)).toBe(576);
      expect(bytes.readUInt32BE(20)).toBe(96);
      expect(bytes[25]).toBe(6);
    }
    expect(spriteManifest.frames).toBe(6);
  });
});
