export type AgentStatus = "online" | "degraded" | "offline";
export type ExecutionStatus = "queued" | "running" | "completed" | "failed";

export interface Agent {
  id: string;
  name: string;
  owner: string;
  status: AgentStatus;
  lastHeartbeat: string;
  createdAt: string;
}

export interface Execution {
  id: string;
  agentId: string;
  workflow: string;
  status: ExecutionStatus;
  costCents: number;
  startedAt: string;
  finishedAt?: string;
}

export interface Approval {
  id: string;
  executionId: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  decidedAt?: string;
}

export interface AuditEvent {
  id: string;
  type: string;
  actor: string;
  entityId: string;
  createdAt: string;
}

export function calculateStatus(lastHeartbeat: string, now = Date.now()): AgentStatus {
  const age = now - new Date(lastHeartbeat).getTime();
  if (age >= 300_000) return "offline";
  if (age >= 120_000) return "degraded";
  return "online";
}