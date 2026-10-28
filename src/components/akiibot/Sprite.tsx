"use client";
import { useEffect, useState } from "react";
import { spriteManifest, type SpriteState } from "./assets";
const oneShot = new Set<SpriteState>(["greeting", "happy", "unsure", "error"]);
export default function Sprite({
  state,
  paused,
  onComplete,
}: {
  state: SpriteState;
  paused: boolean;
  onComplete?: () => void;
}) {
  const [quiet, setQuiet] = useState(true),
    [hidden, setHidden] = useState(false),
    [missing, setMissing] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setQuiet(
        media.matches ||
          Boolean(
            (navigator as Navigator & { connection?: { saveData?: boolean } })
              .connection?.saveData,
          ),
      );
    update();
    media.addEventListener("change", update);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    let active = true;
    const image = new Image();
    image.src = spriteManifest.urls[state];
    image.onerror = () => {
      if (active) setMissing(true);
    };
    return () => {
      active = false;
    };
  }, [state]);
  useEffect(() => {
    if (oneShot.has(state) && onComplete) {
      const t = setTimeout(onComplete, 1100);
      return () => clearTimeout(t);
    }
  }, [state, onComplete]);
  return (
    <span
      aria-hidden="true"
      data-state={state}
      className={`akiibot-sprite ${oneShot.has(state) ? "akiibot-once" : ""} ${paused || quiet || hidden ? "akiibot-static" : ""}`}
      style={{
        backgroundImage: missing
          ? "none"
          : `url(${spriteManifest.urls[state]})`,
      }}
    >
      {missing ? "✦" : null}
    </span>
  );
}
