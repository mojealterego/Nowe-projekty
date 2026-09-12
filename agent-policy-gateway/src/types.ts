export type Decision = "allow" | "deny" | "review";
export type Risk = "low" | "medium" | "high" | "critical";

export interface DecisionRequest {
  agentId: string;
  actorId: string;
  action: string;
  resource: string;
  risk: Risk;
  estimatedCostEur: number;
  metadata?: Record<string, string>;
}

export interface Policy {
  id: string;
  action: string;
  maxRisk: Risk;
  maxCostEur: number;
  requireReviewAboveRisk?: Risk;
  enabled: boolean;
}

export interface DecisionResponse {
  id: string;
  decision: Decision;
  reasons: string[];
  createdAt: string;
  policyId: string;
}

export interface AuditEvent extends DecisionResponse {
  request: DecisionRequest;
}
