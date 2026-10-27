# Baseline and measurement scope

Original revision: 5fc02920c82041dacb8bce027e165865fc14fd56. Original production build passed and lint reported one unused testimonial-hook warning during the initial review. Original browser title was Create Next App; source eagerly requested all 144 PNG frames (~64 MiB) and waited for all to finish before rendering the canvas.

Original runtime on this machine: Node 22.19.0, npm 10.9.3. New checks use a separate production-mode server on 127.0.0.1:3100; the user preview is served separately.

No controlled slow-4G/CPU LCP/CLS benchmark was captured before edits. No claimed percentage or seconds improvement is based on a guessed baseline. The new request budget and image fallback are directly tested; optional three-run lab comparisons remain a separate measurement, not a reason to report fabricated scores.
