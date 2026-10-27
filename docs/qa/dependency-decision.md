# Dependency compatibility decision — 27 October 2026

Registry-verified framework pins: Next.js 16.4.3, React/React DOM 19.3.1; Node 22.19.0 on this machine. TypeScript target ES2017 and automatic React JSX follow Next.js requirements. ESLint CLI replaces removed `next lint`; ESLint 9.39.5 is pinned because the current Next config's import/react/a11y plugins declare support through ESLint 9. ESLint 10 was evaluated and rejected for peer incompatibility. The registry marks ESLint 9 deprecated; it remains a documented dev-tool limitation until the Next plugin set supports the newer major.

Vitest 5.0.5 replaces the initially evaluated 3.x release because audit identified test-tool vulnerabilities there. Node 22 type definitions match its peer contract. Compatible transitive updates were applied without forcing unsupported major dependency changes. Latest installation reported zero advisories; rerun full/production-only audits before release because advisories change.

The production build, typecheck and unit suite pass on this machine. A clean `npm ci` and browser suite are part of final verification. Webpack is selected explicitly; no forced package resolution or legacy-peer-deps override was used.
