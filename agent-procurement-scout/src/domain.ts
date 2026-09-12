export interface PurchaseRequest {
  id: string;
  description: string;
  quantity: number;
  currency: string;
  budgetCents?: number;
  requiredBy?: string;
  category: string;
}

export interface SupplierOffer {
  supplierId: string;
  supplierName: string;
  unitPriceCents: number;
  shippingCents: number;
  setupCents: number;
  recurringMonthlyCents: number;
  leadTimeDays: number;
  minimumOrderQuantity: number;
  warrantyMonths: number;
  paymentTermsDays: number;
  riskFlags: string[];
}

export interface NormalizedOffer extends SupplierOffer {
  quantity: number;
  initialCostCents: number;
  firstYearCostCents: number;
  constraintFlags: string[];
}

export interface ProcurementRecommendation {
  requestId: string;
  recommendedSupplierId?: string;
  recommendedSupplierName?: string;
  shortlist: NormalizedOffer[];
  rationale: string[];
  savingsVsHighestCents: number;
  requiresHumanReview: boolean;
}

export function normalizeOffer(request: PurchaseRequest, offer: SupplierOffer): NormalizedOffer {
  const quantity = Math.max(request.quantity, offer.minimumOrderQuantity);
  const initialCostCents = quantity * offer.unitPriceCents + offer.shippingCents + offer.setupCents;
  const firstYearCostCents = initialCostCents + offer.recurringMonthlyCents * 12;
  const constraintFlags: string[] = [];
  if (offer.minimumOrderQuantity > request.quantity) constraintFlags.push("MOQ exceeds requested quantity");
  if (request.budgetCents !== undefined && initialCostCents > request.budgetCents) constraintFlags.push("initial cost exceeds budget");
  if (request.requiredBy && new Date(request.requiredBy).getTime() < Date.now() + offer.leadTimeDays * 86_400_000) constraintFlags.push("lead time misses required date");
  constraintFlags.push(...offer.riskFlags);
  return { ...offer, quantity, initialCostCents, firstYearCostCents, constraintFlags };
}

export function recommendSupplier(request: PurchaseRequest, offers: SupplierOffer[]): ProcurementRecommendation {
  const shortlist = offers.map((offer) => normalizeOffer(request, offer)).sort((a, b) => a.firstYearCostCents - b.firstYearCostCents);
  if (shortlist.length === 0) return { requestId: request.id, shortlist: [], rationale: ["No supplier offers available"], savingsVsHighestCents: 0, requiresHumanReview: true };
  const viable = shortlist.filter((offer) => offer.constraintFlags.length === 0);
  const selected = viable[0];
  const highest = Math.max(...shortlist.map((offer) => offer.firstYearCostCents));
  return {
    requestId: request.id,
    recommendedSupplierId: selected?.supplierId,
    recommendedSupplierName: selected?.supplierName,
    shortlist,
    rationale: selected ? [`Lowest normalized first-year cost among viable offers: ${selected.firstYearCostCents} cents`, `Compared ${shortlist.length} normalized offers`] : ["No offer satisfies all constraints; human review required"],
    savingsVsHighestCents: selected ? Math.max(0, highest - selected.firstYearCostCents) : 0,
    requiresHumanReview: true
  };
}
