"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
    const projects = [
        {
            title: "OneTap Bus",
            role: "Full-Stack Project",
            desc: "A modern, full-featured bus route finder, fare calculator, and seat reservation platform built for daily commuters in Dhaka city. Provides an easy way to search routes and estimate fares.",
            tags: ["HTML", "CSS", "JavaScript", "PHP"],
            link: "https://github.com/akiibot/OneTap-Bus",
            images: [
                "/projects/onetap-bus/Gemini_Generated_Image_7hxud97hxud97hxu.png"
            ]
        },
        {
            title: "Retail Sales Analysis",
            role: "Data Analysis Project",
            desc: "A SQL-based project analyzing a retail store’s dataset to extract insights. Conducted data cleaning, EDA, and queried for customer behavior, product performance, and sales trends.",
            tags: ["SQL", "Data Cleaning", "EDA"],
            link: "https://github.com/akiibot/sql_retailSalesProject1",
            images: [
                "/projects/retail-sales/retailsales.png"
            ]
        },
        {
            title: "CosmoScope",
            role: "NASA Space Apps Challenge 2025",
            desc: "A browser game that turns exploration of ultra-high-res NASA imagery into a minimalist, story-driven experience. Play as a time-traveling astronaut investigating mysterious signals from Earth, exploring the solar system, and discovering hidden secrets across time and space.",
            tags: ["Game Dev", "NASA API"],
            link: "https://github.com/Alfa5nm/CosmoScope_v2",
            images: [
                "/projects/cosmoscope/cosmoscope1.png"
            ]
        }
    ];

    return (
        <section id="projects" className="relative z-20 min-h-screen bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors duration-700 py-32 px-6 md:px-12 text-white">
            <div className="max-w-6xl mx-auto">

                <header className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
                    <div>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter">Projects.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="group relative flex flex-col justify-between min-h-[24rem] h-full p-8 rounded-2xl overflow-hidden transition-all duration-500 border border-white/5 bg-white/5 backdrop-blur-md cursor-pointer hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.05)] hover:border-white/10"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-2">{project.title}</h3>
                                    <p className="text-[#a1a1aa] text-sm">{project.role}</p>
                                </div>

                                <a
                                    href={project.link}
                                    className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors duration-300 shrink-0 ml-4"
                                    aria-label={`View ${project.title}`}
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="relative z-10 mt-auto">
                                <p className="text-gray-300 mb-8 font-light leading-relaxed">
                                    {project.desc}
                                </p>

                                {project.images && (
                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        {project.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-video rounded-md overflow-hidden border border-white/10 group/img bg-[#121212]">
                                                <Image
                                                    src={img}
                                                    alt={`${project.title} screenshot ${idx + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 text-xs font-mono">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-black/50 border border-white/10 rounded-full text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
