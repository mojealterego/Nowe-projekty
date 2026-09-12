import { randomUUID } from "node:crypto";
import { IdempotencyStore } from "./idempotency.js";
import { AuditStore } from "./audit.js";
import { ToolRegistry } from "./registry.js";
import { retry } from "./retry.js";
import type { AgentContext, PolicyGateway, ToolCall, ToolResult } from "./types.js";

export class AgentOrchestrator {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly policy: PolicyGateway,
    private readonly idempotency: IdempotencyStore = new IdempotencyStore(),
    private readonly audit: AuditStore = new AuditStore()
  ) {}

  async execute<T>(context: AgentContext, call: ToolCall): Promise<ToolResult<T>> {
    const tool = this.registry.assertRegistered(call);
    const key = call.idempotencyKey;

    if (key && this.idempotency.has(key)) {
      return { ok: true, output: this.idempotency.get<T>(key) };
    }

    const decision = await this.policy.evaluate(context, call);
    this.audit.append(context, call, decision.decision);
    if (decision.decision !== "allow") {
      return { ok: false, error: { code: decision.decision === "review" ? "APPROVAL_REQUIRED" : "POLICY_DENIED", message: decision.reasons.join("; "), retryable: false } };
    }

    const result = await retry(() => tool.execute(context, call.input));
    if (result.ok && key && result.output !== undefined) this.idempotency.set(key, result.output);
    return result as ToolResult<T>;
  }

  createContext(input: Omit<AgentContext, "correlationId" | "startedAt">): AgentContext {
    return { ...input, correlationId: randomUUID(), startedAt: new Date().toISOString() };
  }

  auditStore(): AuditStore {
    return this.audit;
  }
}
