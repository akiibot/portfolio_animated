import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="not-found wrap">
      <p className="eyebrow">404 / A SMALL DETOUR</p>
      <h1>Page not found.</h1>
      <p>
        That page isn’t here. There’s more to explore back at the portfolio.
      </p>
      <Link href="/" className="button button-light">
        Back to home ↗
      </Link>
    </main>
  );
}
