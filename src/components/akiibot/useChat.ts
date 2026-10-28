"use client";
import { useEffect, useRef, useState } from "react";
import type {
  ChatFailure,
  ChatReply,
  DisplayMessage,
} from "@/lib/akiibot/types";
import { fallbackLinks } from "@/content/akiibot";
import { restoreConversation, validMessages } from "./client-state";
const storageKey = "akiibot-tab-v1";
type Stored = {
  messages: DisplayMessage[];
  draft: string;
  sessionToken?: string;
  expiresAt?: number;
  historyToken?: string;
  remainingMessages: number | null;
};
const empty: Stored = { messages: [], draft: "", remainingMessages: null };
export function useChat() {
  const [data, setData] = useState<Stored>(empty),
    [ready, setReady] = useState(false),
    [pending, setPending] = useState(false),
    [status, setStatus] = useState<ChatFailure | null>(null),
    [retryText, setRetryText] = useState("");
  const current = useRef(data),
    busy = useRef(false),
    controller = useRef<AbortController | null>(null),
    generation = useRef(0);
  useEffect(() => {
    current.current = data;
  }, [data]);
  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (!mounted) return;
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) {
          const s = restoreConversation(raw, Date.now());
          if (s) setData(s);
        }
      } catch {
        /* Storage can be unavailable in privacy mode. */
      }
      setReady(true);
    });
    return () => {
      mounted = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (ready)
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        /* Continue in memory. */
      }
  }, [data, ready]);
  useEffect(() => {
    if (!data.expiresAt) return;
    const expiresAt = data.expiresAt;
    const timer = setTimeout(
      () =>
        setData((s) =>
          s.expiresAt === expiresAt
            ? {
                ...s,
                messages: [],
                sessionToken: undefined,
                historyToken: undefined,
                expiresAt: undefined,
                remainingMessages: null,
              }
            : s,
        ),
      Math.max(0, expiresAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [data.expiresAt]);
  const setDraft = (draft: string) => setData((s) => ({ ...s, draft }));
  async function send(text?: string) {
    const rawSubmittedDraft = text ?? current.current.draft;
    const message = rawSubmittedDraft.trim();
    if (
      busy.current ||
      !message ||
      [...message].length > 1200 ||
      (current.current.remainingMessages === 0 &&
        (current.current.expiresAt || 0) > Date.now())
    )
      return;
    busy.current = true;
    setPending(true);
    setStatus(null);
    setRetryText("");
    const turn = ++generation.current;
    const abort = new AbortController();
    controller.current = abort;
    const timer = setTimeout(() => abort.abort(), 30000);
    let snapshot = { ...current.current };
    const post = async (path: string, body: unknown) => {
      const r = await fetch(`/api/akiibot/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abort.signal,
      });
      const value = await r.json();
      if (!r.ok) throw value;
      return value;
    };
    try {
      if (
        !snapshot.sessionToken ||
        !snapshot.expiresAt ||
        snapshot.expiresAt <= Date.now()
      ) {
        const s = await post("session", {});
        snapshot = {
          ...snapshot,
          messages: [],
          remainingMessages: null,
          sessionToken: s.sessionToken,
          expiresAt: s.expiresAt,
          historyToken: undefined,
        };
      }
      const reply: ChatReply = await post("chat", {
        message,
        sessionToken: snapshot.sessionToken,
        historyToken: snapshot.historyToken,
        requestId: crypto.randomUUID(),
      });
      if (turn !== generation.current) return;
      if (
        typeof reply.answer !== "string" ||
        !Array.isArray(reply.sources) ||
        !Array.isArray(reply.suggestions) ||
        typeof reply.historyToken !== "string"
      )
        throw new Error("Invalid response");
      if (
        !validMessages([
          {
            id: "reply",
            role: "assistant",
            text: reply.answer,
            sources: reply.sources,
            suggestions: reply.suggestions,
            mood: reply.mood,
          },
        ])
      )
        throw new Error("Invalid response");
      setData((s) => ({
        ...snapshot,
        draft: s.draft === rawSubmittedDraft ? "" : s.draft,
        messages: [
          ...snapshot.messages,
          { id: crypto.randomUUID(), role: "user", text: message },
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: reply.answer,
            sources: reply.sources,
            suggestions: reply.suggestions,
            mood: reply.mood,
          },
        ].slice(-30) as DisplayMessage[],
        historyToken: reply.historyToken,
        remainingMessages: reply.remainingMessages,
      }));
    } catch (e) {
      if (turn !== generation.current) return;
      const error = e as Partial<ChatFailure>;
      setStatus({
        code: error.code || "unavailable",
        message:
          typeof error.message === "string" && error.code
            ? error.message
            : "That reply was interrupted. Your question is safe to retry.",
        retryAfterSeconds: error.retryAfterSeconds,
        fallbackLinks,
      });
      setRetryText(message);
      setData((s) => ({
        ...s,
        sessionToken:
          error.code === "session_expired" ? undefined : snapshot.sessionToken,
        expiresAt: snapshot.expiresAt,
        historyToken:
          error.code === "session_expired" ? undefined : snapshot.historyToken,
      }));
    } finally {
      clearTimeout(timer);
      if (turn === generation.current) {
        busy.current = false;
        setPending(false);
        controller.current = null;
      }
    }
  }
  function clearConversation() {
    generation.current++;
    controller.current?.abort();
    busy.current = false;
    setPending(false);
    setStatus(null);
    setRetryText("");
    setData((s) => ({
      ...s,
      messages: [],
      draft: "",
      historyToken: undefined,
    }));
  }
  return {
    messages: data.messages,
    draft: data.draft,
    remainingMessages: data.remainingMessages,
    pending,
    status,
    retryText,
    setDraft,
    send,
    clearConversation,
    cancel: () => controller.current?.abort(),
  };
}
