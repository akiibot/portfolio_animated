import { readFile, writeFile, mkdir } from "node:fs/promises";
const args = process.argv.slice(2),
  value = (key, fallback) => {
    const i = args.indexOf(key);
    return i < 0 ? fallback : args[i + 1];
  };
const cases = JSON.parse(
  await readFile(
    new URL("../tests/fixtures/akiibot-evaluation.json", import.meta.url),
    "utf8",
  ),
).filter((c) => !value("--case", "") || c.id === value("--case", ""));
const base = value("--base-url", "http://127.0.0.1:3137"),
  maxCalls = Math.min(12, Number(value("--max-calls", "12"))),
  maxUsd = Math.min(0.5, Number(value("--max-usd", ".5")));
if (args.includes("--dry-run")) {
  console.log(JSON.stringify(cases, null, 2));
  process.exit(0);
}
if (!Number.isInteger(maxCalls) || maxCalls < 1 || !(maxUsd > 0))
  throw Error("Invalid evaluation bounds");
// A maximal admitted generation reserves < $0.02 at the policy rate floor.
const perCall = 0.02;
let cookie = "",
  calls = 0,
  historyToken;
const results = [];
async function post(path, body) {
  const start = performance.now();
  const r = await fetch(base + "/api/akiibot/" + path, {
    method: "POST",
    headers: {
      Origin: base,
      "Sec-Fetch-Site": "same-origin",
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(35000),
  });
  if (r.headers.get("set-cookie"))
    cookie = r.headers.get("set-cookie").split(";")[0];
  return {
    status: r.status,
    data: await r.json(),
    ms: Math.round(performance.now() - start),
    timing: r.headers.get("server-timing"),
  };
}
const session = await post("session", {});
if (session.status !== 200)
  throw Error("Session unavailable: " + session.data.code);
for (const c of cases.slice(0, maxCalls)) {
  if ((calls + 1) * perCall > maxUsd) break;
  calls++;
  const r = await post("chat", {
    message: c.question,
    sessionToken: session.data.sessionToken,
    historyToken,
    requestId: crypto.randomUUID(),
  });
  results.push({
    id: c.id,
    status: r.status,
    ms: r.ms,
    timing: r.timing,
    answer: r.data.answer || r.data.message,
    sources: r.data.sources || [],
    mood: r.data.mood,
  });
  if (r.status === 200) historyToken = r.data.historyToken;
  console.log(c.id + ": " + r.status + " (" + r.ms + "ms)");
  if (r.status !== 200) break; // No automatic retries or fresh identities to evade limits.
  if (calls < maxCalls)
    await new Promise((resolve) => setTimeout(resolve, 10500));
}
await mkdir("docs/qa", { recursive: true });
await writeFile(
  value("--case", "")
    ? `docs/qa/akiibot-evaluation-${value("--case", "")}.json`
    : "docs/qa/akiibot-live-evaluation.json",
  JSON.stringify(
    {
      date: new Date().toISOString(),
      base,
      calls,
      reservedUpperBoundUsd: calls * perCall,
      results,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Saved evaluation; maximum reserved estimate $" +
    (calls * perCall).toFixed(2),
);
if (results.some((r) => r.status !== 200)) process.exitCode = 1;
