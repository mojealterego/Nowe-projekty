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

export interface ClauseInput { clause: string; text: string; }

function dayDiff(now: string, dueDate: string): number {
  return Math.ceil((Date.parse(dueDate) - Date.parse(now)) / 86_400_000);
}

function isoDateFromMatch(match: RegExpMatchArray): string | undefined {
  const year = Number(match[3]);
  const month = Number(match[2]);
  const day = Number(match[1]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function extractObligations(contractId: string, clauses: ClauseInput[]): ContractObligation[] {
  const results: ContractObligation[] = [];
  for (const [index, clause] of clauses.entries()) {
    const text = clause.text.trim();
    if (!text) continue;
    const lower = text.toLowerCase();
    const actionSignal = /\b(shall|must|required to|agrees to|will provide|will deliver|is obligated to|zobowiązuje się|musi|należy dostarczyć)\b/i.test(text);
    const deadline = text.match(/\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/);
    const days = text.match(/\b(?:within|w ciągu)\s+(\d+)\s+days?\b/i);
    const recurring = lower.match(/\b(monthly|quarterly|annually|weekly|miesięcznie|kwartalnie|rocznie|tygodniowo)\b/);
    const evidence: string[] = [];
    if (/report|raport|certificate|certyfikat|document|dokument|proof|potwierdzenie/i.test(text)) evidence.push(/report|raport/i.test(text) ? "report" : "document");
    if (/insurance|ubezpieczen/i.test(text)) evidence.push("insurance_certificate");
    const hasSignal = actionSignal || Boolean(deadline || days || recurring || evidence.length);
    if (!hasSignal) continue;
    const dueDate = deadline ? isoDateFromMatch(deadline) : undefined;
    const recurringDays = days ? Number(days[1]) : recurring ? ({ weekly: 7, miesięcznie: 30, monthly: 30, kwartalnie: 90, quarterly: 90, rocznie: 365, annually: 365, tygodniowo: 7 } as Record<string, number>)[recurring[1].toLowerCase()] : undefined;
    const confidence = dueDate || recurringDays || evidence.length ? 0.96 : 0.82;
    results.push({
      id: `${contractId}:obligation:${index + 1}`,
      contractId,
      clause: clause.clause,
      description: text,
      dueDate,
      recurringDays,
      requiredEvidenceTypes: [...new Set(evidence)],
      sourceStart: 0,
      sourceEnd: clause.text.length,
      confidence,
      status: "open"
    });
  }
  return results;
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
