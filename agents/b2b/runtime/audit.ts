import { randomUUID } from "node:crypto";
import type { AgentContext, AuditEvent, ToolCall } from "./types.js";

export class AuditStore {
  private readonly events: AuditEvent[] = [];

  append(context: AgentContext, call: ToolCall, decision: AuditEvent["decision"], evidenceIds: string[] = []): AuditEvent {
    const event: AuditEvent = {
      id: randomUUID(),
      tenantId: context.tenantId,
      correlationId: context.correlationId,
      agentId: context.agentId,
      actorId: context.actorId,
      action: call.name,
      resource: call.resource,
      decision,
      timestamp: new Date().toISOString(),
      policyVersion: context.policyVersion,
      evidenceIds: [...evidenceIds],
      idempotencyKey: call.idempotencyKey
    };
    this.events.push(Object.freeze(event));
    return event;
  }

  list(tenantId: string): readonly AuditEvent[] {
    return this.events.filter((event) => event.tenantId === tenantId);
  }
}
