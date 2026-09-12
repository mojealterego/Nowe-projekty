import type { Risk } from "./runtime/types.js";

export interface AgentManifest {
  id: string;
  name: string;
  ownerRole: string;
  objective: string;
  readTools: string[];
  actionTools: Array<{ name: string; defaultRisk: Risk; requiresApproval: boolean }>;
  primaryKpis: string[];
}

export const agentManifests: readonly AgentManifest[] = [
  {
    id: "agent-revenue-recovery",
    name: "Agent Revenue Recovery",
    ownerRole: "CFO / Accounts Receivable",
    objective: "Reduce DSO and recover overdue receivables without uncontrolled customer contact.",
    readTools: ["getInvoiceAging", "getCustomerContext", "getPaymentHistory", "getOpenDisputes"],
    actionTools: [{ name: "prepareCollectionOutreach", defaultRisk: "medium", requiresApproval: true }, { name: "recordPromiseToPay", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["DSO", "overdue_amount", "collection_rate", "promise_to_pay_rate"]
  },
  {
    id: "agent-customer-operations",
    name: "Agent Customer Operations",
    ownerRole: "COO / Customer Experience",
    objective: "Resolve customer issues faster while preserving policy and escalation controls.",
    readTools: ["getCustomerCase", "getAccountContext", "getKnowledgeEvidence", "getEntitlements"],
    actionTools: [{ name: "prepareCustomerResponse", defaultRisk: "medium", requiresApproval: true }, { name: "updateCase", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["resolution_time", "cost_per_resolution", "first_contact_resolution", "escalation_rate"]
  },
  {
    id: "agent-procurement-scout",
    name: "Agent Procurement Scout",
    ownerRole: "Procurement",
    objective: "Lower supplier cost and sourcing effort using comparable total-cost evidence.",
    readTools: ["getPurchaseRequest", "searchSuppliers", "getSupplierRisk", "calculateTco"],
    actionTools: [{ name: "prepareRfq", defaultRisk: "medium", requiresApproval: true }, { name: "prepareSupplierRecommendation", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["savings_rate", "sourcing_cycle_time", "supplier_response_rate", "TCO_accuracy"]
  },
  {
    id: "agent-compliance-evidence",
    name: "Agent Compliance Evidence",
    ownerRole: "Compliance / Security",
    objective: "Collect, map and validate audit evidence with freshness and gap visibility.",
    readTools: ["getControlRequirements", "searchEvidence", "getEvidenceMetadata", "getRemediationStatus"],
    actionTools: [{ name: "createEvidenceRequest", defaultRisk: "low", requiresApproval: false }, { name: "prepareRemediationTask", defaultRisk: "medium", requiresApproval: true }],
    primaryKpis: ["evidence_coverage", "stale_evidence_rate", "gap_age", "audit_prep_time"]
  },
  {
    id: "agent-contract-obligations",
    name: "Agent Contract Obligations",
    ownerRole: "Legal / Operations",
    objective: "Convert contractual commitments into owned, dated, evidence-backed obligations.",
    readTools: ["getContract", "extractObligations", "getObligationEvidence", "getOwnerDirectory"],
    actionTools: [{ name: "createObligationTask", defaultRisk: "low", requiresApproval: false }, { name: "prepareContractNotice", defaultRisk: "high", requiresApproval: true }],
    primaryKpis: ["obligation_coverage", "missed_deadlines", "evidence_completeness", "notice_lead_time"]
  },
  {
    id: "agent-ai-finops",
    name: "Agent AI FinOps",
    ownerRole: "CIO / Platform / Finance",
    objective: "Reduce AI spend while preserving measurable quality and service-level outcomes.",
    readTools: ["getModelUsage", "getCostAttribution", "getQualityMetrics", "getRoutingConfig"],
    actionTools: [{ name: "prepareRoutingChange", defaultRisk: "high", requiresApproval: true }, { name: "prepareBudgetAlert", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["cost_per_task", "quality_adjusted_cost", "anomaly_loss", "budget_variance"]
  },
  {
    id: "agent-inventory-replenishment",
    name: "Agent Inventory Replenishment",
    ownerRole: "Supply Chain",
    objective: "Prevent stockouts and excess inventory using demand, lead-time and MOQ constraints.",
    readTools: ["getInventoryPosition", "getDemandForecast", "getSupplierLeadTimes", "simulateReorder"],
    actionTools: [{ name: "preparePurchaseOrder", defaultRisk: "high", requiresApproval: true }, { name: "recordSupplierEta", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["stockout_rate", "inventory_turns", "service_level", "working_capital"]
  },
  {
    id: "agent-data-quality",
    name: "Agent Data Quality",
    ownerRole: "Data / Engineering",
    objective: "Detect data defects, bound blast radius and apply verified corrections safely.",
    readTools: ["getQualitySignals", "profileDataset", "traceLineage", "estimateBlastRadius"],
    actionTools: [{ name: "prepareDataCorrection", defaultRisk: "high", requiresApproval: true }, { name: "createIncident", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["defect_rate", "time_to_detect", "time_to_repair", "downstream_impact"]
  },
  {
    id: "agent-ops-control-tower",
    name: "Agent Ops Control Tower",
    ownerRole: "AI Platform / IT Operations",
    objective: "Correlate agent failures, risk and cost anomalies and coordinate bounded interventions.",
    readTools: ["getAgentEvents", "getTaskTrace", "getRiskSignals", "getCostSignals"],
    actionTools: [{ name: "prepareAgentIntervention", defaultRisk: "high", requiresApproval: true }, { name: "createOpsIncident", defaultRisk: "low", requiresApproval: false }],
    primaryKpis: ["MTTD", "MTTR", "failed_task_rate", "intervention_success_rate"]
  },
  {
    id: "agent-policy-gateway",
    name: "Agent Policy Gateway",
    ownerRole: "Security / IT",
    objective: "Intercept tool calls and enforce identity, context, policy and audit controls before execution.",
    readTools: ["getPolicy", "getActorContext", "getRiskContext", "getAuditHistory"],
    actionTools: [{ name: "evaluateToolCall", defaultRisk: "high", requiresApproval: false }, { name: "preparePolicyChange", defaultRisk: "critical", requiresApproval: true }],
    primaryKpis: ["policy_decision_latency", "blocked_unsafe_calls", "approval_rate", "policy_drift"]
  }
];
