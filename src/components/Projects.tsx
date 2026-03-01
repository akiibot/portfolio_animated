import { ArrowUpRight } from "lucide-react";

export default function Projects() {
    const projects = [
        {
            title: "Neon Nexus",
            role: "Lead Developer",
            desc: "A high-performance WebGL experience exploring futuristic interfaces.",
            tags: ["Three.js", "React", "GLSL"],
            link: "#",
        },
        {
            title: "Atlas Design System",
            role: "Design Engineer",
            desc: "An ultra-minimalist, accessible component library used by 500+ teams.",
            tags: ["Tailwind", "Framer Motion", "Radix Primitives"],
            link: "#",
        },
        {
            title: "Echo Protocol",
            role: "Frontend Architect",
            desc: "Real-time dashboard processing millions of events per second with zero lag.",
            tags: ["Next.js", "WebSockets", "Canvas API"],
            link: "#",
        },
        {
            title: "Lunar Landing",
            role: "Creative Coder",
            desc: "Award-winning promotional site with narrative-driven scroll animations.",
            tags: ["GSAP", "Next.js", "Lenis"],
            link: "#",
        }
    ];

    return (
        <section className="relative z-20 min-h-screen bg-[#0a0a0a] py-32 px-6 md:px-12 text-white">
            <div className="max-w-6xl mx-auto">

                <header className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
                    <div>
                        <h2 className="text-sm uppercase tracking-widest text-[#a1a1aa] mb-4">Selected Works</h2>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter">Case Studies.</p>
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
                    <p>© {new Date().getFullYear()} John Doe. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </footer>

            </div>
        </section>
    );
}
