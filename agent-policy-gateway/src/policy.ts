import { randomUUID } from "node:crypto";
import type { DecisionRequest, DecisionResponse, Policy, Risk } from "./types.js";

const riskRank: Record<Risk, number> = { low: 1, medium: 2, high: 3, critical: 4 };

// Wildcard policy is intentionally read-only. Any externally visible or
// destructive action must have an explicit policy entry.
const defaultPolicies: Policy[] = [
  { id: "email", action: "send_email", maxRisk: "medium", maxCostEur: 1, requireReviewAboveRisk: "medium", enabled: true },
  { id: "payment", action: "create_payment", maxRisk: "low", maxCostEur: 10, requireReviewAboveRisk: "low", enabled: true },
  { id: "read", action: "read_data", maxRisk: "high", maxCostEur: 1, enabled: true },
  { id: "generic-read", action: "read_*", maxRisk: "medium", maxCostEur: 2, enabled: true },
  { id: "collections-prioritize", action: "collections.prioritize_invoice", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "collections-draft", action: "collections.draft_message", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "collections-send", action: "collections.send_message", maxRisk: "medium", maxCostEur: 1, requireReviewAboveRisk: "low", enabled: true },
  { id: "customer-diagnose", action: "customer.diagnose_case", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "customer-prepare-response", action: "customer.prepare_response", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "customer-update-case", action: "customer.update_case", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "customer-send-response", action: "customer.send_response", maxRisk: "medium", maxCostEur: 1, requireReviewAboveRisk: "low", enabled: true },
  { id: "customer-verify-outcome", action: "customer.verify_outcome", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "procurement-normalize", action: "procurement.normalize_offer", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "procurement-recommend", action: "procurement.recommend_supplier", maxRisk: "low", maxCostEur: 0.25, enabled: true },
  { id: "procurement-rfq", action: "procurement.prepare_rfq", maxRisk: "medium", maxCostEur: 1, requireReviewAboveRisk: "medium", enabled: true },
  { id: "procurement-commit", action: "procurement.commit_purchase", maxRisk: "high", maxCostEur: 10, requireReviewAboveRisk: "low", enabled: true },
  { id: "procurement-verify", action: "procurement.verify_outcome", maxRisk: "low", maxCostEur: 0.25, enabled: true }
];

const destructiveActionPattern = /^(delete|destroy|remove|revoke|rotate|reset|disable|transfer|withdraw|create_payment|change_credentials|grant_access|send_.*|publish|execute_.*)/i;

function matches(policyAction: string, action: string): boolean {
  if (policyAction === action) return true;
  if (policyAction.endsWith("*")) return action.startsWith(policyAction.slice(0, -1));
  return false;
}

export class PolicyEngine {
  constructor(private readonly policies: Policy[] = defaultPolicies) {}

  evaluate(request: DecisionRequest): DecisionResponse {
    if (destructiveActionPattern.test(request.action) && !this.policies.some((p) => p.enabled && p.action === request.action)) {
      return { id: randomUUID(), decision: "deny", reasons: ["Operacja destrukcyjna lub wywołująca efekt zewnętrzny wymaga jawnej polityki"], createdAt: new Date().toISOString(), policyId: "implicit-destructive-deny" };
    }

    const policy = this.policies.find((candidate) => candidate.enabled && matches(candidate.action, request.action));
    if (!policy) return { id: randomUUID(), decision: "deny", reasons: ["Brak aktywnej polityki dla operacji"], createdAt: new Date().toISOString(), policyId: "none" };

    const reasons: string[] = [];
    if (riskRank[request.risk] > riskRank[policy.maxRisk]) reasons.push(`Ryzyko ${request.risk} przekracza limit ${policy.maxRisk}`);
    if (request.estimatedCostEur > policy.maxCostEur) reasons.push(`Szacowany koszt ${request.estimatedCostEur.toFixed(2)} EUR przekracza limit ${policy.maxCostEur.toFixed(2)} EUR`);
    if (reasons.length > 0) return { id: randomUUID(), decision: "deny", reasons, createdAt: new Date().toISOString(), policyId: policy.id };

    if (policy.requireReviewAboveRisk && riskRank[request.risk] >= riskRank[policy.requireReviewAboveRisk]) {
      return { id: randomUUID(), decision: "review", reasons: ["Operacja wymaga zatwierdzenia człowieka"], createdAt: new Date().toISOString(), policyId: policy.id };
    }

    return { id: randomUUID(), decision: "allow", reasons: ["Operacja spełnia aktywną politykę"], createdAt: new Date().toISOString(), policyId: policy.id };
  }
}
