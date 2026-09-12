import { Hono } from "hono";
import { MemoryStore } from "./store.js";
import type { Agent, Execution } from "./domain.js";

export const app = new Hono();
export const store = new MemoryStore();

app.get("/health", (c) => c.json({ status: "ok", service: "agent-ops-control-tower" }));

app.get("/api/agents", (c) => c.json([...store.agents.values()]));

app.post("/api/agents", async (c) => {
  const body = await c.req.json<Omit<Agent, "createdAt">>();
  const agent: Agent = { ...body, createdAt: new Date().toISOString() };
  return c.json(store.addAgent(agent), 201);
});

app.get("/api/executions", (c) => c.json([...store.executions.values()]));

app.post("/api/executions", async (c) => {
  const body = await c.req.json<Omit<Execution, "startedAt">>();
  const execution: Execution = { ...body, startedAt: new Date().toISOString() };
  return c.json(store.addExecution(execution), 201);
});

app.get("/api/metrics/costs", (c) => c.json({ costCents: store.costs() }));
app.get("/api/audit", (c) => c.json(store.audit));

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 8787);
  const { serve } = await import("@hono/node-server");
  serve({ fetch: app.fetch, port });
  console.log(`Agent Ops Control Tower działa na porcie ${port}`);
}