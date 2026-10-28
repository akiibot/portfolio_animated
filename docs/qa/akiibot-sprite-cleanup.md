# Akiibot sprite cleanup — 28 October 2026

The owner reported background artifacts and explicitly selected code-based pixel cleanup after a generative trial changed the canvas and introduced fringes. The generative result was rejected and is not used by the website. A local segmentation trial was also rejected; production assets use the visually reviewed alpha masks stored in `assets/akiibot-cleanup/masks/`.

## Result

- Original supplied sprites remain byte-identical in `public/akiibot/1fac0ef44182/`.
- Cleaned sprites are in `public/akiibot/df293a4bb6e7/`, referenced by the sprite manifest. The new content hash prevents the browser from reusing the old immutable asset URL.
- Nine sheets retain their 576×96 dimensions and all 54 original 96×96 frame positions. Every RGB channel is unchanged. Only alpha was reduced: 8,674 opaque pixels belonging to background patches, horizontal floor lines, the listening-state top streak and stray fragments were made transparent. No opaque pixels were added and no image resampling or character redraw was performed.
- The added CSS drop shadow was removed so the clean silhouette does not acquire an artificial halo.
- Sleeping poses were inspected separately: attached matte patches behind the tilted head were removed without using a global dark-pixel filter that would erase the trousers or hair.

## Evidence and replay

- `screenshots/akiibot-cleanup-before-after.png`: idle, greeting and sleeping on white, site-dark and magenta backgrounds.
- `screenshots/akiibot-cleaned-all-frames.png`, `akiibot-cleaned-dark.png`, `akiibot-cleaned-magenta.png`: all 54 cleaned frames inspected against each contrasting background.
- `assets/akiibot-cleanup/report.json`: original file SHA-256 values and per-frame removed-pixel counts.
- `output/akiibot-sprites-cleaned.zip`: all nine cleaned PNGs for reuse.

Replay with `python3 scripts/apply-akiibot-cleanup.py` (Pillow required), then `node scripts/prepare-akiibot.mjs --zip output/akiibot-sprites-cleaned.zip`. The checked replay produced exactly the same RGBA pixel arrays as the published cleaned sheets. The mask files are the authoritative cleanup decisions; no segmentation model or generative editor is needed to replay them.

## Checks

All nine original files were compared directly with the supplied ZIP. All cleaned RGB arrays, alpha monotonicity, frame occupancy, sheet size, binary transparency and mask replay were checked. The asset unit test, production build, lint and typecheck passed. The existing desktop/mobile animation-state browser checks passed (2/2) on the updated local preview with mocked replies. No Gemini calls or chatbot backend changes were needed.

The local preview is updated; no production deployment was performed.
