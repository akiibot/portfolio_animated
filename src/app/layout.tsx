import type { Metadata } from "next";
import localFont from "next/font/local";
import NavBar from "@/components/NavBar";
import Akiibot from "@/components/akiibot/Widget";
import { profile } from "@/content/profile";
import "./globals.css";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});
const preview = process.env.VERCEL_ENV === "preview";
export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: "Akib — Software Engineer & Product Builder",
    template: "%s | Akib",
  },
  description: profile.summary,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Akib · Software Engineer",
    title: "Yeanul Haque Khan Akib",
    description: profile.summary,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Akib — software engineer and product builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeanul Haque Khan Akib",
    description: profile.summary,
    images: ["/opengraph-image"],
  },
  robots: preview
    ? { index: false, follow: false }
    : { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <NavBar />
        {children}
        <Akiibot />
      </body>
    </html>
  );
}
