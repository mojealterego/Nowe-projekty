import { randomUUID } from "node:crypto";
import { IdempotencyStore } from "./idempotency.js";
import { AuditStore } from "./audit.js";
import { ApprovalStore } from "./approval-store.js";
import { ToolRegistry } from "./registry.js";
import { retry } from "./retry.js";
import type { AgentContext, PolicyGateway, ToolCall, ToolResult } from "./types.js";

export class AgentOrchestrator {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly policy: PolicyGateway,
    private readonly idempotency: IdempotencyStore = new IdempotencyStore(),
    private readonly audit: AuditStore = new AuditStore(),
    private readonly approvals: ApprovalStore = new ApprovalStore()
  ) {}

  async execute<T>(context: AgentContext, call: ToolCall, approval?: { requestId: string; token: string }): Promise<ToolResult<T>> {
    const tool = this.registry.assertRegistered(call);
    const key = call.idempotencyKey;

    if (key && this.idempotency.has(context.tenantId, key)) {
      return { ok: true, output: this.idempotency.get<T>(context.tenantId, key) };
    }

    const decision = await this.policy.evaluate(context, call);
    this.audit.append(context, call, decision.decision);

    if (decision.decision === "deny") {
      return { ok: false, error: { code: "POLICY_DENIED", message: decision.reasons.join("; "), retryable: false } };
    }

    if (decision.decision === "review") {
      if (!approval) {
        const request = this.approvals.create(context, call, decision.reasons.join("; "));
        return {
          ok: false,
          error: { code: "APPROVAL_REQUIRED", message: decision.reasons.join("; "), retryable: false, approvalRequestId: request.id }
        };
      }
      if (!this.approvals.consume(context.tenantId, approval.requestId, approval.token, call)) {
        this.audit.append(context, call, "deny");
        return { ok: false, error: { code: "INVALID_APPROVAL", message: "Approval token is invalid, expired, consumed or bound to another action", retryable: false } };
      }
    }

    const result = await retry(() => tool.execute(context, call.input));
    if (result.ok) this.audit.append(context, call, "allow");
    if (result.ok && key && result.output !== undefined) this.idempotency.set(context.tenantId, key, result.output);
    return result as ToolResult<T>;
  }

  createContext(input: Omit<AgentContext, "correlationId" | "startedAt">): AgentContext {
    if (!input.tenantId || !input.agentId || !input.actorId || !input.policyVersion) throw new Error("INVALID_AGENT_CONTEXT");
    return { ...input, correlationId: randomUUID(), startedAt: new Date().toISOString() };
  }

  approvalStore(): ApprovalStore { return this.approvals; }
  auditStore(): AuditStore { return this.audit; }
}
