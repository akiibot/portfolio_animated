"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";

const FRAME_COUNT = 144; // From 000 to 143

export default function ScrollyCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Scroll tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll 0 -> 1 to frame index 0 -> 143
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        // 1. Preload all images
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, "0");
                img.src = `/sequence/frame_${frameNumber}_delay-0.055s.png`; // User has .pngs in sequence folder

                img.onload = () => {
                    loadedCount++;
                    setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                    if (loadedCount === FRAME_COUNT) {
                        setImages(loadedImages);
                        setIsLoaded(true);
                    }
                };
                loadedImages.push(img);
            }
        };

        loadImages();
    }, []);

    useEffect(() => {
        if (!isLoaded || images.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Handle responsive canvas sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(frameIndex.get());
        };

        const renderFrame = (index: number) => {
            if (!ctx || !canvas) return;

            const safeIndex = Math.min(Math.max(Math.floor(index), 0), FRAME_COUNT - 1);
            const img = images[safeIndex];

            if (!img) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Object-fit: cover logic
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (canvasRatio > imgRatio) {
                // Canvas is wider than image (e.g. Desktop)
                drawHeight = canvas.width / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                // Canvas is taller than image (e.g. Mobile)
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Initial setup
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Subscribe to frame changes efficiently
        const unsubscribe = frameIndex.on("change", renderFrame);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            unsubscribe();
        };
    }, [isLoaded, images, frameIndex]);

    return (
        <div ref={containerRef} className="relative h-[500vh] bg-[#121212] pointer-events-none">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {!isLoaded && (
                    <div className="absolute bottom-6 right-6 flex items-center gap-4 z-50 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[#a1a1aa] text-xs uppercase tracking-widest font-medium">Loading Sequence</span>
                            <span className="text-white font-mono text-sm tabular-nums font-bold">{loadingProgress}%</span>
                        </div>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
}
