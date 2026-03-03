"use client";

import { motion } from "framer-motion";

export default function Experience() {
    const experiences = [
        {
            role: "AI Software Support Intern (Remote)",
            company: "Strontium Corporation (Artistly AI | CloneVoice AI)",
            date: "2025 – Present",
            points: [
                "Provide technical support to 50–60 users daily via Helpscout.",
                "Identify and document 50+ bugs, gather 60+ user suggestions, and collaborate with the dev team to improve performance.",
                "Analyze user issues and AI workflow behavior to detect potential bugs and recommend product enhancements."
            ]
        },
        {
            role: "Volunteer",
            company: "RS Championship (Summer 2024)",
            date: "Summer 2024",
            points: [
                "Helped organize various sports events.",
                "Managed distribution of t-shirts, jerseys, and souvenirs."
            ]
        },
        {
            role: "Organizing Secretary",
            company: "DRMC Science Club",
            date: "2021 – 2022",
            points: [
                "Helped organize the National Science Carnival 2022.",
                "Trained volunteers and managed national-level Olympiads."
            ]
        }
    ];

    return (
        <section id="experience" className="relative z-20 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors duration-700 py-32 px-6 md:px-12 text-white border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16">
                    <h2 className="text-sm uppercase tracking-widest text-[#a1a1aa] mb-4">Timeline</h2>
                    <p className="text-4xl md:text-5xl font-black tracking-tighter">Experience.</p>
                </header>

                <div className="space-y-12">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="relative pl-8 md:pl-0"
                        >
                            {/* Timeline Line (Mobile) */}
                            <div className="md:hidden absolute left-0 top-2 bottom-0 w-px bg-white/10" />
                            <div className="md:hidden absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-white/50" />

                            <div className="flex flex-col md:flex-row gap-4 md:gap-12 group">
                                {/* Date Side */}
                                <div className="md:w-1/4 shrink-0 mt-1 md:text-right text-[#a1a1aa] text-sm font-mono pt-1">
                                    {exp.date}
                                </div>

                                {/* Content Side */}
                                <div className="md:w-3/4 relative pb-12 border-b border-white/5 group-last:border-none group-last:pb-0">
                                    {/* Timeline Desktop dot */}
                                    <div
                                        className="hidden md:block absolute -left-[2.3rem] top-2 w-2 h-2 rounded-full bg-white/30 cursor-pointer transition-all duration-500 transform hover:scale-150 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                    />
                                    <div className="hidden md:block absolute -left-9 top-6 bottom-0 w-px bg-white/10 group-last:hidden" />

                                    <h3 className="text-xl font-bold tracking-tight mb-1 text-white">{exp.role}</h3>
                                    <h4 className="text-md text-gray-400 font-medium mb-6 italic">{exp.company}</h4>

                                    <ul className="space-y-3 text-sm text-gray-300 font-light leading-relaxed">
                                        {exp.points.map((point, j) => (
                                            <li key={j} className="flex gap-3">
                                                <span className="text-[#a1a1aa] mt-1.5">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
