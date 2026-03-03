"use client";

import { useState } from "react";
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        formData.append("access_key", "277e470e-4516-4cbb-8844-f401fcb57133");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                e.currentTarget.reset();
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                console.error("Form submission failed", data);
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="relative z-20 bg-[#121212] pt-32 pb-12 px-6 md:px-12 text-white border-t border-white/10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">

                    {/* Left: Contact Form */}
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Let&apos;s connect.</h2>
                        <p className="text-xl text-gray-400 font-light mb-10 max-w-md">
                            Always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-light"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-light"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-light resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-3 transition-all duration-300 ${isSuccess
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-white text-black hover:bg-gray-200"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : isSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Message Sent
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Contact Details */}
                    <div className="flex flex-col gap-8 md:pl-12 justify-center">
                        <a href="mailto:yhk.akib12@gmail.com" className="group flex items-center gap-6 text-lg md:text-xl font-light hover:text-white transition-colors text-gray-300 w-fit">
                            <div className="shrink-0 p-4 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                                <Mail className="w-6 h-6" />
                            </div>
                            yhk.akib12@gmail.com
                        </a>

                        <div className="flex gap-8">
                            <a href="https://linkedin.com/in/akiiibot" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-lg font-light hover:text-white transition-colors text-gray-300 w-fit">
                                <div className="shrink-0 p-4 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                LinkedIn
                            </a>

                            <a href="https://github.com/akiibot" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-lg font-light hover:text-white transition-colors text-gray-300 w-fit">
                                <div className="shrink-0 p-4 bg-white/5 rounded-full group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                                    <Github className="w-5 h-5" />
                                </div>
                                GitHub
                            </a>
                        </div>

                        <div className="flex items-center gap-6 text-lg md:text-xl font-light text-gray-400 mt-2">
                            <div className="shrink-0 p-4 bg-white/5 rounded-full">
                                <MapPin className="w-6 h-6" />
                            </div>
                            Mohammadpur, Dhaka - 1207, Bangladesh
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex justify-center items-center pt-8 border-t border-white/10 text-sm text-[#a1a1aa]">
                    <p>© {new Date().getFullYear()} Yeanul Haque Khan Akib. All rights reserved.</p>
                </div>

            </div>
        </section>
    );
}
