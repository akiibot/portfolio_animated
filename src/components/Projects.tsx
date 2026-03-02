import { ArrowUpRight } from "lucide-react";

export default function Projects() {
    const projects = [
        {
            title: "OneTap Bus",
            role: "Full-Stack Project",
            desc: "A modern, full-featured bus route finder, fare calculator, and seat reservation platform built for daily commuters in Dhaka city. Provides an easy way to search routes and estimate fares.",
            tags: ["Next.js", "React", "Tailwind CSS"],
            link: "https://github.com/akiibot/OneTap-Bus",
        },
        {
            title: "Retail Sales Analysis",
            role: "Data Analysis Project",
            desc: "A SQL-based project analyzing a retail store’s dataset to extract insights. Conducted data cleaning, EDA, and queried for customer behavior, product performance, and sales trends.",
            tags: ["SQL", "Data Cleaning", "EDA"],
            link: "https://github.com/akiibot/sql_retailSalesProject1",
        },
        {
            title: "CosmoScope",
            role: "NASA Space Apps Challenge 2025",
            desc: "A browser game that turns exploration of ultra-high-res NASA imagery into a minimalist, story-driven experience. Play as a time-traveling astronaut investigating mysterious signals from Earth, exploring the solar system, and discovering hidden secrets across time and space.",
            tags: ["Game Dev", "NASA API"],
            link: "https://github.com/Alfa5nm/CosmoScope_v2",
        }
    ];

    return (
        <section id="projects" className="relative z-20 min-h-screen bg-[#0a0a0a] py-32 px-6 md:px-12 text-white">
            <div className="max-w-6xl mx-auto">

                <header className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
                    <div>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter">Projects.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, i) => (
                        <div
                            key={i}
                            className="group relative flex flex-col justify-between h-96 p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/5 bg-white/5 backdrop-blur-md"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-2">{project.title}</h3>
                                    <p className="text-[#a1a1aa] text-sm">{project.role}</p>
                                </div>

                                <a
                                    href={project.link}
                                    className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                                    aria-label={`View ${project.title}`}
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </div>

                            <div className="relative z-10 mt-auto pt-8">
                                <p className="text-gray-300 mb-6 font-light leading-relaxed">
                                    {project.desc}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs font-mono">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-black/50 border border-white/10 rounded-full text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                <footer className="mt-32 pt-12 border-t border-white/10 text-center text-sm text-[#a1a1aa] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} Yeanul Haque Khan Akib. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="https://linkedin.com/in/akiiibot" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="https://github.com/akiibot" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </footer>

            </div>
        </section>
    );
}
