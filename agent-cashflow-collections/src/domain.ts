export interface Invoice {
  id: string;
  customerId: string;
  amountCents: number;
  currency: string;
  dueDate: string;
  status: "open" | "paid" | "disputed";
}

export interface CustomerHistory {
  customerId: string;
  averageDaysLate: number;
  paymentsOnTimeRate: number;
  openDisputes: number;
  communicationOptOut: boolean;
}

export interface CollectionDecision {
  invoiceId: string;
  priority: "low" | "medium" | "high" | "critical";
  score: number;
  nextAction: "monitor" | "reminder" | "follow_up" | "human_review";
  rationale: string[];
}

const MS_PER_DAY = 86_400_000;

function overdueDays(dueDate: string, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(dueDate).getTime()) / MS_PER_DAY));
}

export function prioritizeInvoice(invoice: Invoice, history: CustomerHistory, now = new Date()): CollectionDecision {
  if (invoice.status !== "open") {
    return { invoiceId: invoice.id, priority: "low", score: 0, nextAction: "monitor", rationale: ["Invoice is not open"] };
  }

  const days = overdueDays(invoice.dueDate, now);
  const amountWeight = Math.min(30, invoice.amountCents / 100_000);
  const latenessWeight = Math.min(45, days * 3);
  const historyWeight = Math.min(20, history.averageDaysLate * 1.5);
  const disputePenalty = history.openDisputes > 0 ? 25 : 0;
  const score = Math.max(0, Math.min(100, Math.round(amountWeight + latenessWeight + historyWeight - disputePenalty)));

  const priority = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  const nextAction = history.communicationOptOut
    ? "human_review"
    : priority === "critical" || priority === "high"
      ? "follow_up"
      : priority === "medium"
        ? "reminder"
        : "monitor";

  return {
    invoiceId: invoice.id,
    priority,
    score,
    nextAction,
    rationale: [
      `${days} days overdue`,
      `payment history average delay: ${history.averageDaysLate} days`,
      `open disputes: ${history.openDisputes}`,
      history.communicationOptOut ? "customer opted out of automated communication" : "automated communication permitted"
    ]
  };
}
