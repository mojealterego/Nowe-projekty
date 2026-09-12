import type { Agent, AuditEvent, Execution } from "./domain.js";

export class MemoryStore {
  readonly agents = new Map<string, Agent>();
  readonly executions = new Map<string, Execution>();
  readonly audit: AuditEvent[] = [];

  addAgent(agent: Agent): Agent {
    this.agents.set(agent.id, agent);
    this.audit.push({ id: crypto.randomUUID(), type: "agent.created", actor: agent.owner, entityId: agent.id, createdAt: new Date().toISOString() });
    return agent;
  }

  addExecution(execution: Execution): Execution {
    this.executions.set(execution.id, execution);
    this.audit.push({ id: crypto.randomUUID(), type: "execution.created", actor: execution.agentId, entityId: execution.id, createdAt: new Date().toISOString() });
    return execution;
  }

  costs(): number {
    return [...this.executions.values()].reduce((sum, item) => sum + item.costCents, 0);
  }
}