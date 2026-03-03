"use client";

import { useEffect, useState } from "react";


export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen(false); // Close menu on click
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

                    <div className="flex items-center gap-4">
                        <a
                            href="https://drive.google.com/file/d/1ShkV7fwprgLWgoSpJBJCiRa-XLnKjeVQ/view?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            CV
                        </a>
                        <a
                            href="mailto:yhk.akib12@gmail.com"
                            className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>

            </div>

            {/* Mobile Nav Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col gap-6 shadow-2xl">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={`#${link.id}`}
                            onClick={(e) => scrollToSection(e, link.id)}
                            className="text-lg text-gray-300 hover:text-white transition-colors duration-300 tracking-wide"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-white/10">
                        <a
                            href="https://drive.google.com/file/d/1ShkV7fwprgLWgoSpJBJCiRa-XLnKjeVQ/view?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2"
                        >
                            View CV
                        </a>
                        <a
                            href="mailto:yhk.akib12@gmail.com"
                            className="text-center px-6 py-3 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
