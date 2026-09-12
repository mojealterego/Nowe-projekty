import { randomUUID } from "node:crypto";
import type { DecisionRequest, DecisionResponse, Policy, Risk } from "./types.js";

const riskRank: Record<Risk, number> = { low: 1, medium: 2, high: 3, critical: 4 };

const defaultPolicies: Policy[] = [
  { id: "email", action: "send_email", maxRisk: "medium", maxCostEur: 1, requireReviewAboveRisk: "medium", enabled: true },
  { id: "payment", action: "create_payment", maxRisk: "low", maxCostEur: 10, requireReviewAboveRisk: "low", enabled: true },
  { id: "read", action: "read_data", maxRisk: "high", maxCostEur: 1, enabled: true },
  { id: "generic", action: "*", maxRisk: "medium", maxCostEur: 2, requireReviewAboveRisk: "medium", enabled: true }
];

export class PolicyEngine {
  constructor(private readonly policies: Policy[] = defaultPolicies) {}

  evaluate(request: DecisionRequest): DecisionResponse {
    const policy = this.policies.find((candidate) => candidate.enabled && (candidate.action === request.action || candidate.action === "*"));
    if (!policy) {
      return { id: randomUUID(), decision: "deny", reasons: ["Brak aktywnej polityki dla operacji"], createdAt: new Date().toISOString(), policyId: "none" };
    }

    const reasons: string[] = [];
    if (riskRank[request.risk] > riskRank[policy.maxRisk]) {
      reasons.push(`Ryzyko ${request.risk} przekracza limit ${policy.maxRisk}`);
    }
    if (request.estimatedCostEur > policy.maxCostEur) {
      reasons.push(`Szacowany koszt ${request.estimatedCostEur.toFixed(2)} EUR przekracza limit ${policy.maxCostEur.toFixed(2)} EUR`);
    }
    if (reasons.length > 0) {
      return { id: randomUUID(), decision: "deny", reasons, createdAt: new Date().toISOString(), policyId: policy.id };
    }

    if (policy.requireReviewAboveRisk && riskRank[request.risk] >= riskRank[policy.requireReviewAboveRisk]) {
      return { id: randomUUID(), decision: "review", reasons: ["Operacja wymaga zatwierdzenia człowieka"], createdAt: new Date().toISOString(), policyId: policy.id };
    }

    return { id: randomUUID(), decision: "allow", reasons: ["Operacja spełnia aktywną politykę"], createdAt: new Date().toISOString(), policyId: policy.id };
  }
}
