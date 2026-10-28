import "server-only";
import { z } from "zod";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { ChatRequest, ErrorCode } from "./types";
export const policy = {
  maxBody: 24 * 1024,
  maxHistory: 12 * 1024,
  maxMessage: 1200,
  maxInput: 8192,
  maxOutput: 1024,
  sessionMs: 8 * 3600_000,
  leaseMs: 45000,
  budgetMicro: 4_500_000,
  inputMicro: 1.5,
  outputMicro: 7.5,
} as const;
export class ChatError extends Error {
  constructor(
    public code: ErrorCode,
    public status = 400,
    public retryAfterSeconds?: number,
  ) {
    super(code);
  }
}
export const messageSchema = z
  .string()
  .trim()
  .min(1)
  .refine((s) => [...s].length <= policy.maxMessage);
const requestSchema = z
  .object({
    message: messageSchema,
    sessionToken: z.string().min(1).max(2048),
    historyToken: z.string().max(18000).optional(),
    requestId: z.uuid(),
  })
  .strict();
export function validateChatBody(raw: unknown): ChatRequest {
  const r = requestSchema.safeParse(raw);
  if (!r.success) throw new ChatError("invalid_request");
  return r.data;
}
export async function readBoundedJson(req: Request): Promise<unknown> {
  const reader = req.body?.getReader();
  if (!reader) throw new ChatError("invalid_request");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > policy.maxBody) {
        await reader.cancel();
        throw new ChatError("invalid_request", 413);
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (e) {
    if (e instanceof ChatError) throw e;
    throw new ChatError("invalid_request");
  } finally {
    reader.releaseLock();
  }
}
export function verifyOrigin(req: Request, allowed: string[]): void {
  if (
    !allowed.includes(req.headers.get("origin") || "") ||
    req.headers.get("sec-fetch-site") !== "same-origin"
  )
    throw new ChatError("forbidden", 403);
  if (req.headers.get("content-type")?.split(";")[0] !== "application/json")
    throw new ChatError("invalid_request");
}
export function trustedClientIdentity(
  req: Request,
  deployment: "vercel" | "local",
  secret: string,
  now = Date.now(),
): { ipHash: string } {
  let ip =
    deployment === "local"
      ? "127.0.0.1"
      : req.headers.get("x-forwarded-for")?.trim();
  if (!ip || !isIP(ip)) throw new ChatError("unavailable", 503);
  if (isIP(ip) === 6) ip = new URL(`http://[${ip}]/`).hostname;
  return {
    ipHash: createHmac("sha256", secret)
      .update(`${Math.floor(now / 86400000)}:${ip}`)
      .digest("hex"),
  };
}
