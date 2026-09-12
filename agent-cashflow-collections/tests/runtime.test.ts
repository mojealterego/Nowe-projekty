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

  it("blocks automated communication for opted-out customers", async () => {
    const runtime = createCollectionsRuntime();
    const context = runtime.createContext(contextInput);
    const result = await runtime.execute(context, {
      name: "collections.draft_message",
      input: {
        invoice,
        customerName: "Acme",
        decision: { invoiceId: invoice.id, priority: "high", score: 80, nextAction: "human_review", rationale: ["customer opted out"] }
      },
      risk: "low",
      resource: `customer:${invoice.customerId}`,
      estimatedCostEur: 0.1,
      idempotencyKey: "draft:INV-100"
    });
    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({ sendable: false });
  });

  it("requires human approval before collection message delivery", async () => {
    const runtime = createCollectionsRuntime();
    const context = runtime.createContext(contextInput);
    const call = {
      name: "collections.send_message",
      input: {
        invoice,
        recipient: "finance@example.com",
        communicationOptOut: false,
        message: { subject: "Payment reminder", body: "Please arrange payment." }
      },
      risk: "low" as const,
      resource: `customer:${invoice.customerId}`,
      estimatedCostEur: 0.1,
      idempotencyKey: "send:INV-100"
    };

    const pending = await runtime.execute(context, call);
    expect(pending.ok).toBe(false);
    expect(pending.error?.code).toBe("APPROVAL_REQUIRED");
    expect(pending.error?.approvalRequestId).toBeDefined();

    const requestId = pending.error!.approvalRequestId!;
    const token = runtime.approvalStore().approve(context.tenantId, requestId);
    expect(token).toBeDefined();

    const approved = await runtime.execute(context, call, { requestId, token: token! });
    expect(approved.ok).toBe(true);
    expect(approved.output).toMatchObject({ status: "approved_for_delivery", invoiceId: invoice.id });

    const replay = await runtime.execute(context, call, { requestId, token: token! });
    expect(replay.ok).toBe(true);
    expect(replay.output).toEqual(approved.output);
  });

  it("rejects an opted-out customer at the delivery boundary", async () => {
    const runtime = createCollectionsRuntime();
    const context = runtime.createContext(contextInput);
    const call = {
      name: "collections.send_message",
      input: {
        invoice,
        recipient: "finance@example.com",
        communicationOptOut: true,
        message: { subject: "Payment reminder", body: "Please arrange payment." }
      },
      risk: "low" as const,
      resource: `customer:${invoice.customerId}`,
      estimatedCostEur: 0.1,
      idempotencyKey: "send:INV-OPT-OUT"
    };

    const pending = await runtime.execute(context, call);
    expect(pending.error?.code).toBe("APPROVAL_REQUIRED");
    const token = runtime.approvalStore().approve(context.tenantId, pending.error!.approvalRequestId!);
    const result = await runtime.execute(context, call, { requestId: pending.error!.approvalRequestId!, token: token! });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("COMMUNICATION_OPT_OUT");
  });
});
