"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { createSequenceLoader, loadSequenceImage } from "@/lib/sequence-loader";
import { sequenceManifest } from "@/lib/sequence-manifest";
type Connection = EventTarget & { saveData?: boolean };
function preference() {
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  return matchMedia("(prefers-reduced-motion: reduce)").matches || c?.saveData
    ? "static"
    : "animate";
}
function subscribe(callback: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  media.addEventListener("change", callback);
  c?.addEventListener("change", callback);
  return () => {
    media.removeEventListener("change", callback);
    c?.removeEventListener("change", callback);
  };
}
export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialPreferenceResolved = useRef(false);
  const mode = useSyncExternalStore<string>(
    subscribe,
    preference,
    () => "unknown",
  );
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const enabled =
    choice === "play" || (choice === "auto" && mode === "animate");
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = document.getElementById("home");
    if (!enabled || !canvas || !hero) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const mobile = matchMedia("(max-width: 767px)").matches;
    let index = 0;
    let previous = 0;
    let visible = false;
    let raf = 0;
    let disposed = false;
    const draw = () => {
      raf = 0;
      if (disposed) return;
      const frame = loader.getNearest(index);
      if (!frame) return;
      const image = frame.image;
      if (!image.naturalWidth) return;
      const scale = Math.max(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        (canvas.width - image.naturalWidth * scale) / 2,
        (canvas.height - image.naturalHeight * scale) / 2,
        image.naturalWidth * scale,
        image.naturalHeight * scale,
      );
      canvas.dataset.ready = "true";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const loader = createSequenceLoader({
      frameCount: sequenceManifest.frameCount,
      srcFor: sequenceManifest.srcFor,
      maxConcurrent: mobile ? 2 : 4,
      maxCached: mobile ? 12 : 24,
      loadImage: loadSequenceImage,
      onFrameReady: schedule,
    });
    loader.pause();
    const update = () => {
      const box = hero.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -box.top / Math.max(1, hero.offsetHeight - innerHeight)),
      );
      index = Math.round(progress * (sequenceManifest.frameCount - 1));
      if (visible && !document.hidden) {
        loader.request(index, index >= previous ? 1 : -1);
        loader.resume();
        schedule();
      } else loader.pause();
      previous = index;
    };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5);
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      schedule();
      update();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      update();
    });
    observer.observe(hero);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", update);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizeObserver.disconnect();
      loader.dispose();
      removeEventListener("scroll", update);
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", update);
      delete canvas.dataset.ready;
    };
  }, [enabled]);
  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero || mode === "unknown") return;
    hero.dataset.static = String(mode === "static" && choice !== "play");
    let frame = 0;
    if (!initialPreferenceResolved.current) {
      initialPreferenceResolved.current = true;
      if (location.hash && location.hash !== "#home") {
        frame = requestAnimationFrame(() => {
          let id: string;
          try {
            id = decodeURIComponent(location.hash.slice(1));
          } catch {
            return;
          }
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      }
    }
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [mode, choice]);
  return (
    <>
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <button
        className="animation-toggle"
        type="button"
        onClick={() => setChoice(enabled ? "pause" : "play")}
        aria-label={enabled ? "Pause animation" : "Play animation"}
        aria-pressed={enabled}
      >
        {enabled ? <Pause size={13} /> : <Play size={13} />}
        <span>{enabled ? "Pause motion" : "Play motion"}</span>
      </button>
    </>
  );
}
