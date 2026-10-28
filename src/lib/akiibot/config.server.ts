import "server-only";
import { ChatError } from "./policy";
export type ServerConfig = {
  secret: string;
  origins: string[];
  deployment: "vercel" | "local";
  redisUrl: string;
  redisToken: string;
  prefix: string;
  spendScope: string;
  project: string;
  credentials?: { client_email: string; private_key: string };
  adcPath?: string;
};
export function readServerConfig(): ServerConfig {
  const e = process.env;
  if (
    e.AKIIBOT_ENABLED !== "true" ||
    (e.VERCEL_ENV === "preview" && e.AKIIBOT_PREVIEW_ENABLED !== "true")
  )
    throw new ChatError("unavailable", 503);
  const secret = e.AKIIBOT_SESSION_SECRET || "",
    origins = (e.AKIIBOT_ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (
    secret.length < 32 ||
    !origins.length ||
    !e.UPSTASH_REDIS_REST_URL ||
    !e.UPSTASH_REDIS_REST_TOKEN ||
    !e.GOOGLE_CLOUD_PROJECT
  )
    throw new ChatError("unavailable", 503);
  for (const origin of origins) {
    const u = new URL(origin);
    if (
      u.origin !== origin ||
      (u.protocol !== "https:" &&
        !["localhost", "127.0.0.1"].includes(u.hostname))
    )
      throw new ChatError("unavailable", 503);
  }
  if (e.NODE_ENV === "production" && e.VERCEL !== "1")
    throw new ChatError("unavailable", 503);
  if (e.GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON && e.GOOGLE_APPLICATION_CREDENTIALS)
    throw new ChatError("unavailable", 503);
  let credentials: ServerConfig["credentials"];
  if (e.GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON) {
    const d = JSON.parse(e.GOOGLE_VERTEX_SERVICE_ACCOUNT_JSON);
    if (
      d.type !== "service_account" ||
      d.token_uri !== "https://oauth2.googleapis.com/token" ||
      d.project_id !== e.GOOGLE_CLOUD_PROJECT ||
      !d.client_email ||
      !d.private_key
    )
      throw new ChatError("unavailable", 503);
    credentials = { client_email: d.client_email, private_key: d.private_key };
  }
  if (!credentials && !e.GOOGLE_APPLICATION_CREDENTIALS)
    throw new ChatError("unavailable", 503);
  return {
    secret,
    origins,
    deployment: e.VERCEL === "1" ? "vercel" : "local",
    redisUrl: e.UPSTASH_REDIS_REST_URL,
    redisToken: e.UPSTASH_REDIS_REST_TOKEN,
    prefix: `akiibot:${e.VERCEL_ENV || "development"}:`,
    spendScope: `akiibot:billing:${e.GOOGLE_CLOUD_PROJECT}:`,
    project: e.GOOGLE_CLOUD_PROJECT,
    credentials,
    adcPath: e.GOOGLE_APPLICATION_CREDENTIALS,
  };
}
