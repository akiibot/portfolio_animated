"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Sprite from "./Sprite";
import { useChat } from "./useChat";
import type { SpriteState } from "./assets";
import "./akiibot.css";
const Panel = dynamic(() => import("./Panel"), { ssr: false });
export default function Widget() {
  const chat = useChat(),
    [open, setOpen] = useState(false),
    [paused, setPaused] = useState(false),
    [transient, setTransient] = useState<SpriteState | null>(null),
    [sleeping, setSleeping] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null),
    lastReply = useRef<string | undefined>(undefined);
  const clearTransient = useCallback(() => setTransient(null), []);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => launcher.current?.focus());
  };
  useEffect(() => {
    const wake = requestAnimationFrame(() => setSleeping(false));
    const timer = setTimeout(() => {
      if (!chat.pending) setSleeping(true);
    }, 60000);
    return () => {
      cancelAnimationFrame(wake);
      clearTimeout(timer);
    };
  }, [chat.draft, chat.messages, chat.pending, open]);
  useEffect(() => {
    const last = chat.messages.at(-1);
    if (last?.role === "assistant" && last.id !== lastReply.current) {
      lastReply.current = last.id;
      const reveal = requestAnimationFrame(() =>
        setTransient(
          last.mood === "unsure"
            ? "unsure"
            : last.mood === "happy"
              ? "happy"
              : "answering",
        ),
      );
      const t = setTimeout(() => setTransient(null), 1800);
      return () => {
        cancelAnimationFrame(reveal);
        clearTimeout(t);
      };
    }
  }, [chat.messages]);
  const state: SpriteState = chat.pending
    ? "thinking"
    : chat.status
      ? "error"
      : transient ||
        (chat.draft ? "listening" : sleeping ? "sleeping" : "idle");
  return (
    <aside
      className={`akiibot-root ${open ? "akiibot-open" : ""}`}
      aria-label="Akiibot portfolio assistant"
    >
      {open && (
        <Panel
          chat={chat}
          onClose={close}
          paused={paused}
          onPause={() => setPaused((p) => !p)}
        />
      )}
      <button
        ref={launcher}
        className="akiibot-launcher"
        aria-label={open ? "Close Akiibot" : "Open Akiibot"}
        aria-expanded={open}
        onClick={() => {
          if (open) close();
          else {
            setSleeping(false);
            setTransient("greeting");
            setOpen(true);
          }
        }}
      >
        <Sprite state={state} paused={paused} onComplete={clearTransient} />
        <span className="akiibot-launcher-label">
          {open ? "Akiibot" : "Ask Akiibot"}
          <span aria-hidden="true">{open ? "×" : "↗"}</span>
        </span>
      </button>
      {!open && (
        <button
          className="akiibot-pause"
          aria-label={
            paused ? "Resume Akiibot animation" : "Pause Akiibot animation"
          }
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "▶" : "Ⅱ"}
        </button>
      )}
    </aside>
  );
}
