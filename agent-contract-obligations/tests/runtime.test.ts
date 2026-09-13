import { describe, expect, it } from "vitest";
import { createContractObligationsRuntime } from "../src/runtime.js";
import type { ContractObligation, ObligationEvidence } from "../src/domain.js";

const obligation: ContractObligation = {
  id: "OB-1", contractId: "C-1", clause: "4.2", description: "Provide monthly compliance report",
  ownerId: "owner-1", dueDate: "2026-09-20T12:00:00Z", requiredEvidenceTypes: ["report"],
  sourceStart: 100, sourceEnd: 180, confidence: 0.97, status: "open"
};

function context(runtime: ReturnType<typeof createContractObligationsRuntime>, tenantId = "tenant-a") {
  return runtime.createContext({ tenantId, agentId: "agent-contract-obligations", actorId: "user-1", policyVersion: "v1" });
}

describe("Contract Obligations runtime", () => {
  it("extracts actionable obligations with source metadata", async () => {
    const runtime = createContractObligationsRuntime();
    const result = await runtime.execute(context(runtime), { name: "contract.extract_obligations", input: { contractId: "C-1", clauses: [{ clause: "4.2", text: "Supplier shall provide the compliance report within 10 days and maintain insurance certificate." }] }, risk: "low", resource: "contract/C-1", estimatedCostEur: 0 });
    expect(result.ok).toBe(true);
    const extracted = result.output as ContractObligation[];
    expect(extracted).toHaveLength(1);
    expect(extracted[0].confidence).toBeGreaterThanOrEqual(0.8);
    expect(extracted[0].sourceStart).toBe(0);
    expect(extracted[0].requiredEvidenceTypes).toContain("report");
  });

  it("assesses deadlines deterministically", async () => {
    const runtime = createContractObligationsRuntime();
    const result = await runtime.execute(context(runtime), { name: "contract.assess_deadline", input: { obligation, now: "2026-09-12T12:00:00Z" }, risk: "low", resource: "obligation/OB-1", estimatedCostEur: 0 });
    expect(result.ok).toBe(true);
    expect((result.output as { priority: string; daysUntilDue?: number }).priority).toBe("high");
    expect((result.output as { daysUntilDue?: number }).daysUntilDue).toBe(8);
  });

  it("requires approval before sending a notice and rejects token replay", async () => {
    const runtime = createContractObligationsRuntime();
    const ctx = context(runtime);
    const call = { name: "contract.send_notice", input: { obligationId: "OB-1", recipientId: "owner-1", message: "Deadline reminder" }, risk: "medium" as const, resource: "obligation/OB-1", estimatedCostEur: 0.1 };
    const pending = await runtime.execute(ctx, call);
    expect(pending.error?.code).toBe("APPROVAL_REQUIRED");
    const requestId = pending.error!.approvalRequestId!;
    const token = runtime.approvalStore().approve(ctx.tenantId, requestId);
    expect(token).toBeTruthy();
    expect((await runtime.execute(ctx, call, { requestId, token: token! })).ok).toBe(true);
    expect((await runtime.execute(ctx, call, { requestId, token: token! })).error?.code).toBe("INVALID_APPROVAL");
  });

  it("blocks low-confidence consequential actions", async () => {
    const runtime = createContractObligationsRuntime();
    const lowConfidence = { ...obligation, confidence: 0.6 };
    const result = await runtime.execute(context(runtime), { name: "contract.prepare_action", input: { obligation: lowConfidence, action: "escalate", summary: "Escalate missed obligation" }, risk: "medium", resource: "obligation/OB-1", estimatedCostEur: 0.1 });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("LOW_CONFIDENCE");
  });

  it("verifies required evidence", async () => {
    const runtime = createContractObligationsRuntime();
    const evidence: ObligationEvidence[] = [{ id: "E-1", obligationId: "OB-1", type: "report", collectedAt: "2026-09-12T12:00:00Z", source: "drive/report.pdf", valid: true }];
    const result = await runtime.execute(context(runtime), { name: "contract.verify_obligation", input: { obligation, evidence }, risk: "low", resource: "obligation/OB-1", estimatedCostEur: 0 });
    expect(result.ok).toBe(true);
    expect((result.output as { verified: boolean }).verified).toBe(true);
  });

  it("isolates idempotency between tenants", async () => {
    const runtime = createContractObligationsRuntime();
    const call = { name: "contract.assess_deadline", input: { obligation, now: "2026-09-12T12:00:00Z" }, risk: "low" as const, resource: "obligation/OB-1", estimatedCostEur: 0, idempotencyKey: "deadline-1" };
    expect((await runtime.execute(context(runtime, "tenant-a"), call)).ok).toBe(true);
    expect((await runtime.execute(context(runtime, "tenant-b"), call)).ok).toBe(true);
  });
});
