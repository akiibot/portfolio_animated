import "server-only";
import { readServerConfig } from "./config.server";
import { Guard } from "./guard.server";
import { createStore } from "./store.server";
import { createVertex } from "./vertex.server";
import { SessionSigner } from "./session.server";
export function runtimeDependencies() {
  const config = readServerConfig();
  return {
    config,
    guard: new Guard(
      createStore(config.redisUrl, config.redisToken),
      config.prefix,
      config.spendScope,
    ),
    vertex: createVertex(config),
    signer: new SessionSigner(config.secret),
  };
}
