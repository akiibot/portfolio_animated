# Accessibility verification scope

Server-rendered main content, one h1 per route, h2 section headings, named navigation/actions, skip link, visible keyboard focus and label/input associations are present. Reduced motion defaults to a static poster; explicit Play is an opt-in. Images carry descriptive alt text/captions; generated imagery is labeled separately from actual screenshots. Contact feedback uses live status/error semantics, and no-JavaScript visitors have direct email access.

Automated viewport checks pass at widths 320, 375, 390, 768 and 1280px; a 390×600 test verifies canvas aspect ratio, covering a short-window failure found in review. Desktop and emulated-mobile visual captures are under `screenshots/`. No horizontal overflow was detected in those checks. This is not a complete assistive-technology audit; exact browser/OS zoom, real Safari and screen-reader behavior remain release review scope.
