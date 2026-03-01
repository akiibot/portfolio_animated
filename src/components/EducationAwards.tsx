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
        "Global Finalist — NASA Space Apps Challenge 2025 (Team Lead)",
        "1st Position — Prompt Engineering Competition, BRACU ROBU Traction 2025",
        "1st Position — IT Olympiad, National Science Carnival 2022",
        "The Duke of Edinburgh’s International Award — Bronze Standard"
    ];

    return (
        <section id="education" className="relative z-20 bg-[#0a0a0a] py-32 px-6 md:px-12 text-white border-t border-white/5">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Education Side */}
                <div>
                    <header className="mb-12 flex items-end justify-between border-b border-white/10 pb-4">
                        <div>
                            <p className="text-3xl md:text-4xl font-black tracking-tighter">Education.</p>
                        </div>
                    </header>

                    <div className="space-y-8">
                        {education.map((edu, i) => (
                            <div key={i} className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-bold tracking-tight mb-1 text-white">{edu.degree}</h3>
                                <h4 className="text-md text-gray-400 font-medium mb-2">{edu.school}</h4>
                                <div className="flex justify-between items-center text-sm font-mono text-[#a1a1aa]">
                                    <span>{edu.date}</span>
                                    {edu.gpa && <span className="px-2 py-1 bg-black/50 border border-white/10 rounded-full">{edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Awards Side */}
                <div>
                    <header className="mb-12 flex items-end justify-between border-b border-white/10 pb-4">
                        <div>
                            <p className="text-3xl md:text-4xl font-black tracking-tighter">Awards.</p>
                        </div>
                    </header>

                    <div className="space-y-4">
                        {awards.map((award, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-white/30 group-hover:bg-yellow-500 group-hover:shadow-[0_0_10px_rgba(234,179,8,0.8)] transition-all duration-300" />
                                <p className="text-gray-300 font-light leading-relaxed">{award}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
