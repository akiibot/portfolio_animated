"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Trophy, Medal, Star } from "lucide-react";

export default function EducationAwards() {
    const education = [
        {
            degree: "B.Sc. in Computer Science and Engineering (CSE)",
            school: "BRAC University",
            date: "2023 – Present",
            gpa: ""
        },
        {
            degree: "Higher Secondary Certificate (Science)",
            school: "Dhaka Residential Model College",
            date: "2020 – 2022",
            gpa: "GPA: 5.0/5.0"
        },
        {
            degree: "Secondary School Certificate (Science)",
            school: "Dhaka Residential Model College",
            date: "2018 – 2020",
            gpa: "GPA: 5.0/5.0"
        }
    ];

    const awards = [
        {
            title: "Global Finalist (Team Lead)",
            event: "NASA Space Apps Challenge 2025",
            icon: <Star className="w-5 h-5 text-indigo-400" />
        },
        {
            title: "1st Position",
            event: "Prompt Engineering Competition, BRACU ROBU Traction 2025",
            icon: <Trophy className="w-5 h-5 text-yellow-400" />
        },
        {
            title: "1st Position",
            event: "IT Olympiad, National Science Carnival 2022",
            icon: <Medal className="w-5 h-5 text-emerald-400" />
        },
        {
            title: "Bronze Standard",
            event: "The Duke of Edinburgh’s International Award",
            icon: <Award className="w-5 h-5 text-orange-400" />
        }
    ];

    return (
        <section id="education" className="relative z-20 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors duration-700 py-32 px-6 md:px-12 text-white border-t border-white/5 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Education Side */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <header className="mb-12 flex items-center gap-4 border-b border-white/10 pb-4">
                        <GraduationCap className="w-8 h-8 text-white/50" />
                        <p className="text-3xl md:text-4xl font-black tracking-tighter">Education.</p>
                    </header>

                    <div className="space-y-6">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold tracking-tight mb-1 text-white">{edu.degree}</h3>
                                <h4 className="text-md text-gray-400 font-medium mb-4">{edu.school}</h4>
                                <div className="flex justify-between items-center text-sm font-mono text-[#a1a1aa]">
                                    <span>{edu.date}</span>
                                    {edu.gpa && <span className="px-3 py-1 bg-black/50 border border-white/10 rounded-full text-white/80">{edu.gpa}</span>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Awards Side */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <header className="mb-12 flex items-center gap-4 border-b border-white/10 pb-4">
                        <Trophy className="w-8 h-8 text-white/50" />
                        <p className="text-3xl md:text-4xl font-black tracking-tighter">Achievements.</p>
                    </header>

                    <div className="space-y-4">
                        {awards.map((award, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                                className="group flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-white/20 hover:from-white/10 transition-all duration-300 cursor-pointer"
                            >
                                <div
                                    className="shrink-0 p-3 bg-black/40 rounded-xl border border-white/10 transition-transform duration-500 transform group-hover:scale-125 group-hover:rotate-12"
                                >
                                    {award.icon}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold tracking-tight">{award.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 leading-snug">{award.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
