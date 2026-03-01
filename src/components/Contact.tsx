import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

export default function Contact() {
    return (
        <footer id="contact" className="relative z-20 bg-[#121212] pt-32 pb-12 px-6 md:px-12 text-white border-t border-white/10">
            <div className="max-w-6xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">

                    {/* Main CTA */}
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Let&apos;s connect.</h2>
                        <p className="text-xl text-gray-400 font-light max-w-md">
                            Always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-col gap-6 justify-center">
                        <a href="mailto:yhk.akib12@gmail.com" className="group flex items-center gap-4 text-xl md:text-2xl font-light hover:text-gray-300 transition-colors w-fit">
                            <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            yhk.akib12@gmail.com
                        </a>

                        <a href="tel:+8801757404362" className="group flex items-center gap-4 text-xl md:text-2xl font-light hover:text-gray-300 transition-colors w-fit">
                            <div className="p-3 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            +880 1757404362
                        </a>

                        <div className="flex items-center gap-4 text-lg text-gray-400 font-light mt-4">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            Mohammadpur, Dhaka - 1207, Bangladesh
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-sm text-[#a1a1aa]">
                    <p>© {new Date().getFullYear()} Yeanul Haque Khan Akib. All rights reserved.</p>

                    <div className="flex gap-6">
                        <a href="https://linkedin.com/in/akiiibot" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                        </a>
                        <a href="https://github.com/akiibot" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
