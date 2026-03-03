"use client";

import { Home, Lightbulb, Briefcase, GraduationCap, Download } from "lucide-react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function NavBar() {
    const navItems = [
        { name: 'About', url: '#about', icon: Home },
        { name: 'Experience', url: '#experience', icon: Briefcase },
        { name: 'Education', url: '#education', icon: GraduationCap },
        { name: 'Projects', url: '#projects', icon: Lightbulb }
    ];

    const scrollToContact = () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <TubelightNavBar items={navItems}>
            <a
                href="https://drive.google.com/file/d/1ShkV7fwprgLWgoSpJBJCiRa-XLnKjeVQ/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 hover:bg-white/10 text-white/80 hover:text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-sm font-medium mr-2"
                title="View Resume"
            >
                <Download size={16} />
                Resume
            </a>

            <InteractiveHoverButton
                onClick={scrollToContact}
                text="Hire Me"
                className="w-24 md:w-28 py-1.5 md:py-2 text-xs md:text-sm bg-white text-black border-none"
            />
        </TubelightNavBar>
    );
}
