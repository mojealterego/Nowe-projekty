export type ObligationStatus = "open" | "due_soon" | "overdue" | "fulfilled" | "waived";
export type ObligationPriority = "low" | "medium" | "high" | "critical";

export interface Contract {
  id: string;
  counterparty: string;
  title: string;
  effectiveDate: string;
  expiryDate?: string;
  autoRenew: boolean;
}

export interface ContractObligation {
  id: string;
  contractId: string;
  clause: string;
  description: string;
  ownerId?: string;
  dueDate?: string;
  recurringDays?: number;
  requiredEvidenceTypes: string[];
  sourceStart: number;
  sourceEnd: number;
  confidence: number;
  status: ObligationStatus;
}

export interface ObligationAssessment {
  obligationId: string;
  priority: ObligationPriority;
  status: ObligationStatus;
  daysUntilDue?: number;
  reasons: string[];
}

export interface ObligationEvidence {
  id: string;
  obligationId: string;
  type: string;
  collectedAt: string;
  source: string;
  valid: boolean;
}

function dayDiff(now: string, dueDate: string): number {
  return Math.ceil((Date.parse(dueDate) - Date.parse(now)) / 86_400_000);
}

export function assessDeadline(obligation: ContractObligation, now: string): ObligationAssessment {
  if (obligation.status === "fulfilled" || obligation.status === "waived") return { obligationId: obligation.id, priority: "low", status: obligation.status, reasons: ["Obligation is already closed"] };
  if (!obligation.dueDate) return { obligationId: obligation.id, priority: obligation.confidence < 0.8 ? "high" : "medium", status: "open", reasons: ["No due date is defined"] };
  const daysUntilDue = dayDiff(now, obligation.dueDate);
  if (daysUntilDue < 0) return { obligationId: obligation.id, priority: "critical", status: "overdue", daysUntilDue, reasons: ["Deadline has passed"] };
  if (daysUntilDue <= 7) return { obligationId: obligation.id, priority: "high", status: "due_soon", daysUntilDue, reasons: ["Deadline is within 7 days"] };
  if (daysUntilDue <= 30) return { obligationId: obligation.id, priority: "medium", status: "due_soon", daysUntilDue, reasons: ["Deadline is within 30 days"] };
  return { obligationId: obligation.id, priority: "low", status: "open", daysUntilDue, reasons: ["Deadline is outside the monitoring window"] };
}

export function verifyObligation(obligation: ContractObligation, evidence: ObligationEvidence[]): { verified: boolean; missingTypes: string[]; invalidEvidenceIds: string[] } {
  const relevant = evidence.filter(e => e.obligationId === obligation.id);
  const availableTypes = new Set(relevant.filter(e => e.valid).map(e => e.type));
  const missingTypes = obligation.requiredEvidenceTypes.filter(type => !availableTypes.has(type));
  const invalidEvidenceIds = relevant.filter(e => !e.valid).map(e => e.id);
  return { verified: missingTypes.length === 0 && invalidEvidenceIds.length === 0, missingTypes, invalidEvidenceIds };
}
