export type Risk = "low" | "medium" | "high" | "critical";
export type Decision = "allow" | "deny" | "review";

export interface AgentContext {
  tenantId: string;
  agentId: string;
  actorId: string;
  correlationId: string;
  policyVersion: string;
  startedAt: string;
}

export interface ToolCall<TInput = unknown> {
  name: string;
  input: TInput;
  risk: Risk;
  resource: string;
  estimatedCostEur: number;
  idempotencyKey?: string;
}

export interface ToolResult<TOutput = unknown> {
  ok: boolean;
  output?: TOutput;
  error?: { code: string; message: string; retryable: boolean };
}

export interface ApprovalRequest {
  id: string;
  tenantId: string;
  agentId: string;
  actorId: string;
  action: string;
  resource: string;
  summary: string;
  expiresAt: string;
  status: "pending" | "approved" | "rejected" | "expired";
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  correlationId: string;
  agentId: string;
  actorId: string;
  action: string;
  resource: string;
  decision: Decision;
  timestamp: string;
  policyVersion: string;
  evidenceIds: string[];
  idempotencyKey?: string;
}

export interface PolicyGateway {
  evaluate(context: AgentContext, call: ToolCall): Promise<{ decision: Decision; reasons: string[]; policyId: string }>;
}
