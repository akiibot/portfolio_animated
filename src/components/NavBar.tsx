"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
const items = [
  { label: "Work", id: "projects" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];
export default function NavBar() {
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const home = pathname === "/";
  useEffect(() => {
    if (!home) return;
    const ids = [
      "home",
      "projects",
      "achievements",
      "about",
      "experience",
      "education",
      "contact",
    ];
    let ticking = false;
    const update = () => {
      ticking = false;
      let current = "home";
      for (const id of ids) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= innerHeight * 0.35)
          current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [home]);
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link
          href={home ? "#home" : "/"}
          className="wordmark"
          aria-label="Akib home"
        >
          a<span>k</span>
          <i>.</i>
        </Link>
        <div className="nav-links">
          {items.map((item) => (
            <a
              key={item.id}
              href={`${home ? "" : "/"}#${item.id}`}
              aria-current={home && active === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          className="nav-resume"
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
        >
          <span>Resume</span>
          <Download size={15} />
        </a>
        <a
          className="nav-connect"
          href={`${home ? "" : "/"}#contact`}
          aria-label="Let's connect"
        >
          <ArrowUpRight size={17} />
        </a>
      </nav>
    </header>
  );
}
