import { randomUUID } from "node:crypto";
import type { Agent, Approval, AuditEvent, Execution } from "./domain.js";

export class MemoryStore {
  readonly agents = new Map<string, Agent>();
  readonly executions = new Map<string, Execution>();
  readonly approvals = new Map<string, Approval>();
  readonly audit: AuditEvent[] = [];

  addAgent(agent: Agent): Agent {
    this.agents.set(agent.id, agent);
    this.audit.push({ id: randomUUID(), type: "agent.created", actor: agent.owner, entityId: agent.id, createdAt: new Date().toISOString() });
    return agent;
  }

  heartbeat(agentId: string, now = new Date().toISOString()): Agent | undefined {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;
    const updated = { ...agent, lastHeartbeat: now, status: "online" as const };
    this.agents.set(agentId, updated);
    this.audit.push({ id: randomUUID(), type: "agent.heartbeat", actor: agentId, entityId: agentId, createdAt: now });
    return updated;
  }

  addExecution(execution: Execution): Execution {
    this.executions.set(execution.id, execution);
    this.audit.push({ id: randomUUID(), type: "execution.created", actor: execution.agentId, entityId: execution.id, createdAt: new Date().toISOString() });
    return execution;
  }

  addApproval(approval: Approval): Approval {
    this.approvals.set(approval.id, approval);
    this.audit.push({ id: randomUUID(), type: "approval.created", actor: "system", entityId: approval.id, createdAt: approval.createdAt });
    return approval;
  }

  decideApproval(id: string, status: "approved" | "rejected", now = new Date().toISOString()): Approval | undefined {
    const current = this.approvals.get(id);
    if (!current || current.status !== "pending") return undefined;
    const updated = { ...current, status, decidedAt: now };
    this.approvals.set(id, updated);
    this.audit.push({ id: randomUUID(), type: `approval.${status}`, actor: "operator", entityId: id, createdAt: now });
    return updated;
  }

  costs(): number {
    return [...this.executions.values()].reduce((sum, item) => sum + item.costCents, 0);
  }
}