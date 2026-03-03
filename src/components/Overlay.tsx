"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Overlay() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll tracking overlay
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Section 1: "My Name. Creative Developer." (0% to 20%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
    const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

    // Section 2: "I build digital experiences." (25% to 50%)
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.25, 0.55], [100, -100]);

    // Section 3: "Bridging design and engineering." (60% to 85%)
    const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.6, 0.9], [100, -100]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">

                {/* Section 1 */}
                <motion.div
                    style={{ opacity: opacity1, y: y1, scale: scale1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl px-4 leading-[1.1]"
                    >
                        Yeanul Haque Khan Akib
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                        className="text-xl md:text-3xl text-gray-300 mt-4 font-light drop-shadow-lg tracking-wide"
                    >
                        Aspiring Software Engineer.
                    </motion.p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                    style={{ opacity: opacity2, y: y2 }}
                    className="absolute inset-0 flex flex-col items-start justify-center text-left p-12 md:p-32"
                >
                    <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white max-w-2xl drop-shadow-xl leading-tight">
                        Transforming raw data <span className="text-gray-400 font-serif italic">into meaningful insights.</span>
                    </h2>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                    style={{ opacity: opacity3, y: y3 }}
                    className="absolute inset-0 flex flex-col items-end justify-center text-right p-12 md:p-32"
                >
                    <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white max-w-2xl drop-shadow-xl leading-tight">
                        Building efficient <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">and scalable solutions.</span>
                    </h2>
                </motion.div>

            </div>
        </div>
    );
}
