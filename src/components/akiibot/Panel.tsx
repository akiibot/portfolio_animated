"use client";
import { useEffect, useRef, useState } from "react";
import { fallbackLinks, starterPrompts } from "@/content/akiibot";
import type { useChat } from "./useChat";
type Props = {
  chat: ReturnType<typeof useChat>;
  onClose: () => void;
  paused: boolean;
  onPause: () => void;
};
export default function Panel({ chat, onClose, paused, onPause }: Props) {
  const panel = useRef<HTMLDivElement>(null),
    list = useRef<HTMLDivElement>(null),
    follow = useRef(true),
    composer = useRef<HTMLTextAreaElement>(null);
  const [mobile, setMobile] = useState(false),
    [wait, setWait] = useState(0);
  useEffect(() => {
    const m = matchMedia("(max-width: 600px)");
    const update = () => setMobile(m.matches);
    update();
    m.addEventListener("change", update);
    composer.current?.focus();
    return () => m.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!mobile) return;
    const body = document.body,
      old = body.style.overflow;
    body.style.overflow = "hidden";
    const siblings = [...body.children].filter(
      (e) =>
        e !== panel.current?.closest(".akiibot-root") &&
        e instanceof HTMLElement,
    ) as HTMLElement[];
    const previous = siblings.map((e) => e.inert);
    siblings.forEach((e) => (e.inert = true));
    return () => {
      body.style.overflow = old;
      siblings.forEach((e, i) => (e.inert = previous[i]));
    };
  }, [mobile]);
  useEffect(() => {
    const t = requestAnimationFrame(() =>
      setWait(chat.status?.retryAfterSeconds || 0),
    );
    return () => cancelAnimationFrame(t);
  }, [chat.status]);
  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(timer);
  }, [wait]);
  useEffect(() => {
    if (follow.current && list.current)
      list.current.scrollTop = list.current.scrollHeight;
  }, [chat.messages, chat.pending, chat.status]);
  function keyboard(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
    if (mobile && e.key === "Tab") {
      const nodes = [...(panel.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled),a[href],textarea,summary",
      )||[])].filter(n=>n.getClientRects().length>0);
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  return (
    <div
      ref={panel}
      className="akiibot-panel"
      role="dialog"
      aria-modal={mobile || undefined}
      aria-labelledby="akiibot-title"
      onKeyDown={keyboard}
    >
      <header className="akiibot-header">
        <div>
          <span className="akiibot-dot" />
          <h2 id="akiibot-title">Akiibot</h2>
          <p>Akib’s AI portfolio guide</p>
        </div>
        <button type="button" aria-label="Close Akiibot" onClick={onClose}>
          ×
        </button>
      </header>
      <div
        ref={list}
        className="akiibot-messages"
        onScroll={() => {
          const n = list.current;
          if (n)
            follow.current = n.scrollHeight - n.scrollTop - n.clientHeight < 50;
        }}
      >
        <div className="akiibot-welcome">
          <p className="akiibot-eyebrow">A LITTLE GUIDE. A LOT OF CONTEXT.</p>
          <h3>Get to know the builder.</h3>
          <p>
            I’m Akib’s AI guide. Ask me about his projects, skills, or
            experience.
          </p>
        </div>
        {!chat.messages.length && (
          <div className="akiibot-prompts">
            {starterPrompts.map((p) => (
              <button
                key={p}
                disabled={chat.pending || wait > 0}
                onClick={() => {
                  chat.setDraft(p);
                  void chat.send(p);
                }}
              >
                {p}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        )}
        {chat.messages.map((m) => (
          <article key={m.id} className={`akiibot-message akiibot-${m.role}`}>
            <span className="akiibot-speaker">
              {m.role === "user" ? "You" : "Akiibot"}
            </span>
            <p>{m.text}</p>
            {m.sources?.length ? (
              <div className="akiibot-sources">
                {m.sources.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    onClick={() => {
                      if (s.href.startsWith("/#")) onClose();
                    }}
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>
            ) : null}
            {m.suggestions?.length && m === chat.messages.at(-1) ? (
              <div className="akiibot-suggestions">
                {m.suggestions.map((s) => (
                  <button
                    key={s}
                    disabled={chat.pending || wait > 0}
                    onClick={() => {
                      chat.setDraft(s);
                      void chat.send(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </article>
        ))}
        {chat.pending && (
          <p className="akiibot-thinking">Looking through Akib’s work…</p>
        )}
        {chat.status && (
          <div className="akiibot-error-box" role="alert">
            <p>{chat.status.message}</p>
            {wait > 0 ? (
              <p>Try again in {wait}s.</p>
            ) : (
              chat.retryText &&
              chat.status.code !== "session_limit" && (
                <button
                  onClick={() => void chat.send(chat.retryText)}
                  aria-label="Retry question"
                >
                  Retry question ↗
                </button>
              )
            )}
          </div>
        )}
      </div>
      <nav className="akiibot-fallback" aria-label="Portfolio shortcuts">
        {fallbackLinks.map((s) => (
          <a
            key={s.id}
            href={s.href}
            onClick={() => {
              if (s.href.startsWith("/#")) onClose();
            }}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <form
        className="akiibot-composer"
        onSubmit={(e) => {
          e.preventDefault();
          void chat.send();
        }}
      >
        <label className="sr-only" htmlFor="akiibot-question">
          Your question
        </label>
        <textarea
          ref={composer}
          id="akiibot-question"
          rows={2}
          placeholder="Ask about Akib’s work…"
          value={chat.draft}
          onChange={(e) => chat.setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              if (!chat.pending && wait === 0) void chat.send();
            }
          }}
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={
            chat.pending ||
            wait > 0 ||
            !chat.draft.trim() ||
            [...chat.draft].length > 1200 ||
            chat.remainingMessages === 0
          }
        >
          ↑
        </button>
      </form>
      <div className="akiibot-controls">
        <button onClick={onPause}>
          {paused ? "Resume character" : "Pause character"}
        </button>
        <button onClick={chat.clearConversation}>Clear chat</button>
        <span>
          {[...chat.draft].length > 1000
            ? `${[...chat.draft].length}/1200`
            : chat.remainingMessages !== null && chat.remainingMessages <= 3
              ? `${chat.remainingMessages} replies left`
              : ""}
        </span>
      </div>
      <details className="akiibot-privacy">
        <summary>AI guide · Privacy & limits</summary>
        <p>
          Akiibot may make mistakes. Messages are sent to Google to generate
          replies. We don’t save chat transcripts. Please avoid sensitive
          information. Your conversation stays in this tab; temporary hashed
          usage counters help prevent abuse. Google’s processing and retention
          policies apply.
        </p>
        <a
          href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention"
          target="_blank"
          rel="noreferrer"
        >
          Google’s data handling ↗
        </a>
      </details>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {chat.pending
          ? "Akiibot is thinking."
          : chat.messages.at(-1)?.role === "assistant"
            ? chat.messages.at(-1)?.text
            : ""}
      </div>
    </div>
  );
}
