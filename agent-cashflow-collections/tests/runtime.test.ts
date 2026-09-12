import { describe, expect, it } from "vitest";
import { createCollectionsRuntime } from "../src/runtime.js";

const contextInput = {
  tenantId: "tenant-a",
  agentId: "agent-cashflow-collections",
  actorId: "system",
  policyVersion: "v1"
};

const invoice = {
  id: "INV-100",
  customerId: "C-1",
  amountCents: 250_000,
  currency: "EUR",
  dueDate: "2026-09-01T00:00:00.000Z",
  status: "open" as const
};

const history = {
  customerId: "C-1",
  averageDaysLate: 8,
  paymentsOnTimeRate: 0.4,
  openDisputes: 0,
  communicationOptOut: false
};

describe("Cashflow Collections runtime", () => {
  it("executes deterministic prioritization through the policy gateway", async () => {
    const runtime = createCollectionsRuntime();
    const context = runtime.createContext(contextInput);
    const result = await runtime.execute(context, {
      name: "collections.prioritize_invoice",
      input: { invoice, history, now: "2026-09-12T00:00:00.000Z" },
      risk: "low",
      resource: `invoice:${invoice.id}`,
      estimatedCostEur: 0.1,
      idempotencyKey: "priority:INV-100"
    });

    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({ invoiceId: "INV-100", priority: "critical" });
  });

  it("does not send anything when the customer opted out", async () => {
    const runtime = createCollectionsRuntime();
    const context = runtime.createContext(contextInput);
    const result = await runtime.execute(context, {
      name: "collections.draft_message",
      input: {
        invoice,
        customerName: "Acme",
        decision: {
          invoiceId: invoice.id,
          priority: "high",
          score: 80,
          nextAction: "human_review",
          rationale: ["customer opted out"]
        }
      },
      risk: "low",
      resource: `customer:${invoice.customerId}`,
      estimatedCostEur: 0.1,
      idempotencyKey: "draft:INV-100"
    });

    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({ sendable: false });
  });
});
