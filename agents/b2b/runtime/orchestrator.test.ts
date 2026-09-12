import test from "node:test";
import assert from "node:assert/strict";
import { AgentOrchestrator } from "./orchestrator.js";
import { ToolRegistry } from "./registry.js";
import type { AgentContext, PolicyGateway, ToolCall } from "./types.js";

const context: AgentContext = { tenantId: "tenant-a", agentId: "agent-revenue-recovery", actorId: "user-a", correlationId: "corr-a", policyVersion: "v1", startedAt: new Date().toISOString() };
function call(overrides: Partial<ToolCall> = {}): ToolCall { return { name: "recordPromiseToPay", input: { invoiceId: "inv-1" }, risk: "low", resource: "invoice:inv-1", estimatedCostEur: 0, idempotencyKey: "promise-1", ...overrides }; }
function gateway(decision: "allow" | "deny" | "review"): PolicyGateway { return { evaluate: async () => ({ decision, reasons: [decision], policyId: "test-policy" }) }; }

test("allow executes registered tool", async () => {
  const registry = new ToolRegistry(); let executions = 0;
  registry.register({ name: "recordPromiseToPay", execute: async () => { executions += 1; return { ok: true, output: "saved" }; } });
  const result = await new AgentOrchestrator(registry, gateway("allow")).execute(context, call());
  assert.deepEqual(result, { ok: true, output: "saved" }); assert.equal(executions, 1);
});

test("review creates approval and requires token before execution", async () => {
  const registry = new ToolRegistry(); let executions = 0;
  registry.register({ name: "recordPromiseToPay", execute: async () => { executions += 1; return { ok: true, output: "saved" }; } });
  const runtime = new AgentOrchestrator(registry, gateway("review"));
  const blocked = await runtime.execute(context, call({ idempotencyKey: "approval-1" }));
  assert.equal(blocked.error?.code, "APPROVAL_REQUIRED"); assert.equal(executions, 0);
  const requestId = blocked.error!.approvalRequestId!;
  const token = runtime.approvalStore().approve(context.tenantId, requestId);
  const approved = await runtime.execute(context, call({ idempotencyKey: "approval-1" }), { requestId, token });
  assert.deepEqual(approved, { ok: true, output: "saved" }); assert.equal(executions, 1);
});

test("deny never executes the tool", async () => {
  const registry = new ToolRegistry(); let executions = 0;
  registry.register({ name: "recordPromiseToPay", execute: async () => { executions += 1; return { ok: true }; } });
  const result = await new AgentOrchestrator(registry, gateway("deny")).execute(context, call());
  assert.equal(result.error?.code, "POLICY_DENIED"); assert.equal(executions, 0);
});

test("idempotency is isolated by tenant", async () => {
  const registry = new ToolRegistry(); let executions = 0;
  registry.register({ name: "recordPromiseToPay", execute: async () => { executions += 1; return { ok: true, output: executions }; } });
  const runtime = new AgentOrchestrator(registry, gateway("allow"));
  await runtime.execute(context, call({ idempotencyKey: "shared-key" }));
  await runtime.execute({ ...context, tenantId: "tenant-b" }, call({ idempotencyKey: "shared-key" }));
  assert.equal(executions, 2);
});

test("approval token cannot be replayed", async () => {
  const registry = new ToolRegistry(); let executions = 0;
  registry.register({ name: "recordPromiseToPay", execute: async () => { executions += 1; return { ok: true }; } });
  const runtime = new AgentOrchestrator(registry, gateway("review"));
  const first = await runtime.execute(context, call({ idempotencyKey: "replay-1" }));
  const requestId = first.error!.approvalRequestId!; const token = runtime.approvalStore().approve(context.tenantId, requestId);
  await runtime.execute(context, call({ idempotencyKey: "replay-1" }), { requestId, token });
  const replay = await runtime.execute(context, call({ idempotencyKey: "replay-2" }), { requestId, token });
  assert.equal(replay.error?.code, "INVALID_APPROVAL"); assert.equal(executions, 1);
});
