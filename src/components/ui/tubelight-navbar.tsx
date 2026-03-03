"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface TubelightNavBarProps {
    items: NavItem[]
    className?: string
    children?: React.ReactNode // For injecting action buttons like CV / Hire Me
}

export function TubelightNavBar({ items, className, children }: TubelightNavBarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)

    // Scroll Spy Logic
    useEffect(() => {
        // Only track sections that are actually in the DOM
        const targetSections = items.map(item => item.url.replace("#", ""))

        const callback = (entries: IntersectionObserverEntry[]) => {
            // Look for intersecting items
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Find the item name that corresponds to this ID
                    const matchingItem = items.find(i => i.url.replace("#", "") === entry.target.id)
                    if (matchingItem) {
                        setActiveTab(matchingItem.name)
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: "-20% 0px -79% 0px", // Trigger when element hits top 20%
        });

        targetSections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [items]);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        if (url.startsWith('#')) {
            e.preventDefault();
            const element = document.getElementById(url.replace("#", ""));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <div
            className={cn(
                "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
                className,
            )}
        >
            <div className="flex items-center gap-3 bg-[#121212]/50 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-2xl">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <a
                            key={item.name}
                            href={item.url}
                            onClick={(e) => {
                                setActiveTab(item.name)
                                handleSmoothScroll(e, item.url)
                            }}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                                "text-white/60 hover:text-white",
                                isActive && "bg-white/10 text-white",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </a>
                    )
                })}

                {/* Render extra action buttons if provided */}
                {children && (
                    <div className="flex items-center gap-2 pl-2 border-l border-white/10 ml-2">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}
