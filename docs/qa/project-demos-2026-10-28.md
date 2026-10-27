# Project demos and selection update — 28 October 2026

Owner supplied four YouTube URLs and a local Jointly recording and requested that ResearchLens no longer be shown. This extends the previously authorized project cards and click-to-load video design.

- Imprnt AI: https://www.youtube.com/watch?v=Tb8ayU6DSDo
- Vallet: https://www.youtube.com/watch?v=oH30ok8yAMM
- CosmoScope: https://www.youtube.com/watch?v=Bq883qNbjoI
- Now Today’s News: https://www.youtube.com/watch?v=fYtWlmTALKk

YouTube oEmbed returned the expected titles for all four on 28 October. This verifies identity and reachability, not permanent embed availability. Each player retains an external YouTube link.

## Media and content

Jointly original: `/Users/yeanul/Downloads/Jointly Final Video.mp4`, 193,913,596 bytes, 176.066633 seconds, 1918×1076 H.264/AAC. The original is untouched. Web derivative: `public/projects/videos/jointly-demo.mp4`, 15,110,697 bytes, 176.066667 seconds, 1280×718 H.264/AAC, fast-start MP4. Encoded with libx264 CRF 23 / fast, AAC 128 kbps; no cuts or content changes. The smaller derivative trades some resolution and compression quality for download size. No recording bytes load before opening its demo.

Game release: https://notfullyblissful.itch.io/now-todays-news
Team source: https://github.com/Alfa5nm/TrioJam
The release describes a narrative propaganda/news-arranging puzzle game and IUT GameJam win. The repository identifies Godot 4 and a three-person team. The owner said they helped build it; role remains “Game development contributor,” without assigning specific systems to them.

Downloaded original images linked directly by the itch.io release page:
- City screenshot: https://img.itch.zone/aW1hZ2UvNDc4NTQ4Ni8yODYyNzUxMC5wbmc=/original/JJxUVB.png
- Narrative screenshot: https://img.itch.zone/aW1hZ2UvNDc4NTQ4Ni8yODYyNzUwOC5wbmc=/original/g2wGIc.png

Resized to 1280 pixels wide and encoded as JPEG quality 88, preserving composition. The release page discloses hand-drawn work and AI-assisted assets; the project story retains this disclosure.

ResearchLens was removed from the project registry. Its former case-study route returns 404 and is absent from generated sitemap entries. Historical research documents and unused assets remain as records.

## Interaction

Native details/summary provides keyboard activation and a no-JavaScript link fallback. React mounts a privacy-enhanced YouTube iframe or native controlled video only after expansion and removes it on collapse. No autoplay. CosmoScope retains its additional-project placement, with its own demo disclosure. Now Today’s News replaces ResearchLens in the two-card secondary row and has a project story and game-download link.

Experience remains directly after Projects, followed by About, Achievements, Education, and Contact. Navigation follows the same order.

## Verification

- Unit tests: 10 passed.
- Lint, production build, type checking, and git diff whitespace check: passed.
- All 8 new browser checks passed on desktop and mobile, covering no eager requests, player removal, real local video playback, game images, ResearchLens 404/sitemap exclusion, and no-JavaScript fallback. Six existing rendering, navigation, case-study and metadata checks also passed.
- The initial mobile playback test attempted playback below the viewport; bringing the player into view corrected the test, and actual playback advanced on both device profiles.
- Native browser preview verified the actual YouTube embed renders the game video thumbnail. Screenshot: `screenshots/now-todays-news.jpg`.
- Independent read-only code review found no important defects before browser verification.

## Follow-up: playback inside project card screens

Owner requested that “Watch demo” play inside the existing screenshot frame. Featured cards now replace the screenshot with the player, leaving the browser-style chrome and fixed 16:9 screen dimensions intact. The action requests playback and brings the screen into view. “Show screenshot” unmounts the player, stopping playback, and restores the original image and caption. The video caption provides an external fallback. Without JavaScript, the card offers a direct recording link. Project-story and CosmoScope additional-entry demos retain their existing disclosures.

The shared `DemoPlayer` keeps local-video and YouTube rendering consistent. Card players request autoplay after the user's click; browser policies may still require the player's Play control. No video source/iframe is mounted before interaction. New checks verify iframe placement inside the screen, stable screen height, autoplay attributes, actual Jointly playback, and screenshot restoration.

Follow-up verification: lint, all 10 unit tests, production build and type checking passed. Eight playback/fallback checks passed in the desktop/mobile browser run. The two unchanged game-image checks timed out during a slow concurrent run; rerunning those serially passed on both profiles. Actual browser preview confirmed Vallet playing within its original card frame. Proof: `screenshots/in-card-demo.jpg`. The independent follow-up code review found no important defects.
