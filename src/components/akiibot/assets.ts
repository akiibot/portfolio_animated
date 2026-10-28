export const spriteStates = [
  "idle",
  "greeting",
  "answering",
  "thinking",
  "unsure",
  "error",
  "listening",
  "happy",
  "sleeping",
] as const;
export type SpriteState = (typeof spriteStates)[number];
export const spriteManifest = {
  width: 96,
  height: 96,
  frames: 6,
  hash: "df293a4bb6e7",
  urls: Object.fromEntries(
    spriteStates.map((s) => [s, `/akiibot/df293a4bb6e7/akiibot-${s}.png`]),
  ) as Record<SpriteState, string>,
};
