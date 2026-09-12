import { PolicyEngine } from "../../../agent-policy-gateway/src/policy.js";
import type { AgentContext, PolicyGateway, ToolCall } from "./types.js";

/** Adapts the standalone Policy Engine to the B2B runtime contract. */
export class PolicyEngineAdapter implements PolicyGateway {
  constructor(private readonly engine = new PolicyEngine()) {}

  async evaluate(context: AgentContext, call: ToolCall) {
    return this.engine.evaluate({
      agentId: context.agentId,
      actorId: context.actorId,
      action: call.name,
      resource: call.resource,
      risk: call.risk,
      estimatedCostEur: call.estimatedCostEur,
      metadata: { tenantId: context.tenantId, correlationId: context.correlationId }
    });
  }
}
