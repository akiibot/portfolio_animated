"use client";

import { useEffect, useState } from "react";


export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navLinks = [
        { name: "About", id: "about" },
        { name: "Experience", id: "experience" },
        { name: "Education", id: "education" },
        { name: "Projects", id: "projects" },
        { name: "Contact", id: "contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-[#121212]/80 backdrop-blur-md border-b border-white/10 py-4 shadow-xl"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-between items-center">

                {/* Logo */}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="relative hover:opacity-80 transition-opacity"
                >
                    <span className="text-2xl md:text-3xl font-black tracking-tighter text-white inline-flex items-baseline">
                        akii<span className="text-gray-400 font-medium">bot</span><span className="text-indigo-500 ml-0.5">.</span>
                    </span>
                </a>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={`#${link.id}`}
                            onClick={(e) => scrollToSection(e, link.id)}
                            className="text-sm text-gray-300 hover:text-white transition-colors duration-300 tracking-wide"
                        >
                            {link.name}
                        </a>
                    ))}

                    <a
                        href="mailto:yhk.akib12@gmail.com"
                        className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Hire Me
                    </a>
                </div>

                {/* Mobile Menu Button (Hamburger placeholder) */}
                <div className="md:hidden">
                    <button className="text-white p-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

            </div>
        </nav>
    );
}
