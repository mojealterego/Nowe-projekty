import type { AgentContext, ToolResult } from "../../agents/b2b/runtime/types.js";
import type { ToolDefinition } from "../../agents/b2b/runtime/registry.js";
import { normalizeOffer, recommendSupplier, type PurchaseRequest, type SupplierOffer } from "./domain.js";

export const normalizeSupplierOffer: ToolDefinition<{ request: PurchaseRequest; offer: SupplierOffer }> = {
  name: "procurement.normalize_offer",
  async execute(_context: AgentContext, input) { return { ok: true, output: normalizeOffer(input.request, input.offer) }; }
};

export const recommendSupplierTool: ToolDefinition<{ request: PurchaseRequest; offers: SupplierOffer[] }> = {
  name: "procurement.recommend_supplier",
  async execute(_context: AgentContext, input) { return { ok: true, output: recommendSupplier(input.request, input.offers) }; }
};

export interface PrepareRfqInput { request: PurchaseRequest; supplierIds: string[]; terms: string; }
export const prepareRfq: ToolDefinition<PrepareRfqInput> = {
  name: "procurement.prepare_rfq",
  async execute(_context: AgentContext, input): Promise<ToolResult> {
    if (input.supplierIds.length === 0) return { ok: false, error: { code: "NO_SUPPLIERS", message: "At least one supplier is required", retryable: false } };
    return { ok: true, output: { status: "ready_for_approval", requestId: input.request.id, supplierIds: input.supplierIds, terms: input.terms } };
  }
};

export interface CommitPurchaseInput { requestId: string; supplierId: string; amountCents: number; currency: string; }
/** Deliberately no external purchase API: this is the post-approval commitment boundary. */
export const commitPurchase: ToolDefinition<CommitPurchaseInput> = {
  name: "procurement.commit_purchase",
  async execute(_context: AgentContext, input) {
    if (input.amountCents <= 0) return { ok: false, error: { code: "INVALID_AMOUNT", message: "Purchase amount must be positive", retryable: false } };
    return { ok: true, output: { status: "approved_for_execution", ...input } };
  }
};

export const verifyPurchaseOutcome: ToolDefinition<{ requestId: string; supplierId: string; confirmed: boolean }> = {
  name: "procurement.verify_outcome",
  async execute(_context: AgentContext, input) {
    return input.confirmed
      ? { ok: true, output: { status: "verified", requestId: input.requestId, supplierId: input.supplierId } }
      : { ok: false, error: { code: "OUTCOME_UNVERIFIED", message: "Supplier commitment could not be verified", retryable: false } };
  }
};
