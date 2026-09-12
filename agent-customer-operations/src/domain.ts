export type CasePriority = "low" | "medium" | "high" | "critical";
export type CaseCategory = "billing" | "technical" | "access" | "delivery" | "account" | "other";
export type CaseAction = "monitor" | "respond" | "update_case" | "escalate";

export interface CustomerCase {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  category?: CaseCategory;
  status: "open" | "pending" | "resolved" | "closed";
  priority?: CasePriority;
  accountVerified: boolean;
  sensitiveActionRequested: boolean;
}

export interface AccountContext {
  customerId: string;
  plan: string;
  active: boolean;
  entitlementStatus: "valid" | "expired" | "unknown";
  openBalanceCents: number;
}

export interface KnowledgeEvidence {
  id: string;
  title: string;
  content: string;
  source: string;
  confidence: number;
}

export interface Diagnosis {
  category: CaseCategory;
  priority: CasePriority;
  action: CaseAction;
  rationale: string[];
  evidenceIds: string[];
}

const categoryRules: Array<[CaseCategory, RegExp]> = [
  ["billing", /bill|invoice|charge|payment|refund|price/i],
  ["technical", /error|bug|broken|failed|crash|not working|login/i],
  ["access", /access|permission|locked|password|sign in/i],
  ["delivery", /delivery|shipment|shipping|tracking|arrive/i],
  ["account", /account|profile|subscription|plan/i]
];

function classify(text: string): CaseCategory {
  return categoryRules.find(([, pattern]) => pattern.test(text))?.[0] ?? "other";
}

export function diagnoseCase(
  customerCase: CustomerCase,
  account: AccountContext | undefined,
  evidence: KnowledgeEvidence[]
): Diagnosis {
  const text = `${customerCase.subject} ${customerCase.description}`;
  const category = customerCase.category ?? classify(text);
  const rationale: string[] = [];

  if (!customerCase.accountVerified) {
    return {
      category,
      priority: "high",
      action: "escalate",
      rationale: ["Customer account identity is not verified; account-changing assistance must stop"],
      evidenceIds: evidence.map((item) => item.id)
    };
  }

  if (!account || account.entitlementStatus === "unknown") {
    return {
      category,
      priority: "high",
      action: "escalate",
      rationale: ["Required account or entitlement state is unavailable; do not invent account state"],
      evidenceIds: evidence.map((item) => item.id)
    };
  }

  if (customerCase.sensitiveActionRequested) {
    rationale.push("Sensitive or irreversible action requested; human authorization is required");
  }
  if (!account.active) rationale.push("Customer account is inactive");
  if (account.entitlementStatus === "expired") rationale.push("Entitlement is expired");
  if (evidence.length === 0) rationale.push("No knowledge evidence available");

  const priority: CasePriority = customerCase.sensitiveActionRequested || !account.active ? "high" : evidence.length === 0 ? "medium" : "low";
  const action: CaseAction = customerCase.sensitiveActionRequested || evidence.length === 0 ? "escalate" : customerCase.status === "open" ? "respond" : "monitor";
  if (evidence.length > 0) rationale.push(`${evidence.length} knowledge evidence item(s) available`);

  return { category, priority, action, rationale, evidenceIds: evidence.map((item) => item.id) };
}
