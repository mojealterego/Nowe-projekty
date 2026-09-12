import { describe, expect, it } from "vitest";
import { createProcurementRuntime } from "../src/runtime.js";
import type { PurchaseRequest, SupplierOffer } from "../src/domain.js";

const request: PurchaseRequest = { id: "PR-1", description: "laptops", quantity: 10, currency: "EUR", budgetCents: 20_000, category: "IT" };
const offer: SupplierOffer = { supplierId: "S-1", supplierName: "Supplier One", unitPriceCents: 1500, shippingCents: 100, setupCents: 0, recurringMonthlyCents: 0, leadTimeDays: 5, minimumOrderQuantity: 1, warrantyMonths: 24, paymentTermsDays: 30, riskFlags: [] };

function context(runtime: ReturnType<typeof createProcurementRuntime>, tenantId = "tenant-a") {
  return runtime.createContext({ tenantId, agentId: "agent-procurement-scout", actorId: "user-1", policyVersion: "v1" });
}

describe("Procurement Scout runtime", () => {
  it("normalizes and recommends deterministically", async () => {
    const runtime = createProcurementRuntime();
    const result = await runtime.execute(context(runtime), { name: "procurement.recommend_supplier", input: { request, offers: [offer] }, risk: "low", resource: "purchase-request/PR-1", estimatedCostEur: 0 });
    expect(result.ok).toBe(true);
    expect((result.output as { recommendedSupplierId: string }).recommendedSupplierId).toBe("S-1");
  });

  it("requires approval for RFQ preparation", async () => {
    const runtime = createProcurementRuntime();
    const ctx = context(runtime);
    const call = { name: "procurement.prepare_rfq", input: { request, supplierIds: ["S-1"], terms: "30 days" }, risk: "medium" as const, resource: "purchase-request/PR-1", estimatedCostEur: 0.1 };
    const pending = await runtime.execute(ctx, call);
    expect(pending.error?.code).toBe("APPROVAL_REQUIRED");
    const approval = runtime.approvalStore().approve(ctx.tenantId, pending.error!.approvalRequestId!);
    expect(approval).toBeTruthy();
    const executed = await runtime.execute(ctx, call, { requestId: pending.error!.approvalRequestId!, token: approval! });
    expect(executed.ok).toBe(true);
  });

  it("does not allow purchase commitment through generic policy", async () => {
    const runtime = createProcurementRuntime();
    const result = await runtime.execute(context(runtime), { name: "procurement.commit_purchase", input: { requestId: "PR-1", supplierId: "S-1", amountCents: 1000, currency: "EUR" }, risk: "high", resource: "purchase/PR-1", estimatedCostEur: 0 });
    expect(result.error?.code).toBe("POLICY_DENIED");
  });

  it("isolates idempotency between tenants", async () => {
    const runtime = createProcurementRuntime();
    const call = { name: "procurement.recommend_supplier", input: { request, offers: [offer] }, risk: "low" as const, resource: "purchase-request/PR-1", estimatedCostEur: 0, idempotencyKey: "recommend-1" };
    const a = await runtime.execute(context(runtime, "tenant-a"), call);
    const b = await runtime.execute(context(runtime, "tenant-b"), call);
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
  });
});
