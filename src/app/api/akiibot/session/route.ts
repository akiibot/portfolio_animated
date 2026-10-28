import { runtimeDependencies } from "@/lib/akiibot/runtime.server";
import { createSessionHandler, failure } from "@/lib/akiibot/handlers.server";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(req: Request) {
  try {
    return await createSessionHandler(runtimeDependencies())(req);
  } catch (e) {
    return failure(e);
  }
}
