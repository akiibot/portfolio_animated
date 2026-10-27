# Achievement photographs — 28 October 2026

Owner supplied nine photographs/graphics and confirmed the Best Camper / Best Team trophies were part of the Duke of Edinburgh expedition. The image caption names those trophies; the existing Bronze Standard entry remains a separate credential.

## Added

Five event albums below the existing achievement summary, at `/#achievements`:

- AI Buildfest 2026: trophy photograph, winner announcement, and TBS Graduates team graphic (3).
- NASA Space Apps 2025: finalist announcement and Vitruvian 6 team profile (2).
- IUT GameJam 2026: trophy/cheque and Team Oranges photograph (2).
- Prompt engineering: champion prize presentation (1).
- Duke expedition: Best Camper / Best Team recognition (1).

The supplied Buildfest announcement names Imprnt AI as the MarTech-winning project, so its project story now includes the result and links the original announcement. NASA's supplied team profile explicitly associates Vitruvian 6 with CosmoScope. No unsupported GameJam project name or Duke award year was invented.

Original files are under `public/awards/`, with editable captions/order in `src/content/award-photos.ts`. Every copy is byte-identical to the user-supplied file; exact filenames and SHA-256 values are recorded in `award-photo-integrity.json`. No generated or retouched award evidence is used.

## Viewer behavior

Lazy thumbnails open a native modal dialog. It has a persistent accessible heading/close control before opening, keyboard arrow navigation, Escape/close/backdrop dismissal, focus restoration and background scroll lock. Full images use contain and retain their complete content; an Open original image link allows native full-resolution viewing. Additional full-size images mount only when an album opens. No-JavaScript visitors receive direct links to all nine originals; gallery buttons remain disabled until hydration.

The new achievements section is recognized by scroll tracking without adding an overcrowded mobile nav item. The external-link checker ignores relative local evidence URLs; valid original-image links are not misreported as failed external URLs.

## Verification

- Full existing/new browser suite: **40 passed**, desktop and emulated mobile.
- Strengthened gallery-only suite (actual `complete && naturalWidth > 0` image loading): **6 passed**.
- Unit suite: **9 passed**.
- Lint, TypeScript and production build pass.
- Independent read-only review found no important defects; its image-loading test observation was incorporated.
- Manual browser inspection confirmed the album grid and uncropped full-photo display; screenshot: `screenshots/award-photo-viewer.jpg`.
- No publication or deployment was performed. The local preview remains http://127.0.0.1:3001/#achievements.

## Poridhi album addition

Added the two owner-supplied Poridhi photos as a sixth gallery album, “Poridhi AI Hackathon,” crediting organizers Poridhi.io and Brain Station 23. The event-backdrop photo visibly dates the event 26 April 2025. Captions describe participation without assigning an award or placing. Both photos were copied byte-for-byte, with dimensions preserved and SHA-256 hashes recorded in `award-photo-integrity.json`. The gallery now contains 11 original photos; existing mobile and no-JavaScript checks were updated for the extra album and originals.
