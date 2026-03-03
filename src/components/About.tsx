"use client";

import { motion } from "framer-motion";

export default function About() {
    const programmingSkills = ["Python", "HTML", "CSS", "Tailwind", "JavaScript (Learning)", "SQL", "PHP"];
    const toolsSkills = ["Microsoft Office Suite", "Problem Solving", "Data Analysis", "Communication", "Collaboration"];

    return (
        <section id="about" className="relative z-20 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors duration-700 py-32 px-6 md:px-12 text-white border-t border-white/5">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Profile / Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="text-sm uppercase tracking-widest text-[#a1a1aa] mb-6">Profile</h2>
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300">
                        Motivated and detail-oriented aspiring <span className="text-white font-medium">Software Engineer</span> with a strong foundation in programming, databases, and data analysis.
                    </p>
                    <p className="text-lg md:text-xl font-light leading-relaxed text-gray-400 mt-6">
                        Eager to learn and continuously improve, with a deep interest in transforming raw data into meaningful insights. Passionate about exploring modern data tools, cloud technologies, and scalable systems to build efficient and reliable data solutions.
                    </p>
                </motion.div>

                {/* Skills */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="text-sm uppercase tracking-widest text-[#a1a1aa] mb-6"
                    >
                        Skills
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        className="mb-8"
                    >
                        <h3 className="text-lg font-medium text-white mb-4">Programming & Technical</h3>
                        <div className="flex flex-wrap gap-3">
                            {programmingSkills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-sm text-gray-300 hover:scale-105 duration-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                        <h3 className="text-lg font-medium text-white mb-4">Tools & Core Competencies</h3>
                        <div className="flex flex-wrap gap-3">
                            {toolsSkills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-sm text-gray-300 hover:scale-105 duration-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
