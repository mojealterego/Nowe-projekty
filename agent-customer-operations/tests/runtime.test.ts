import { describe, expect, it } from "vitest";
import { createCustomerOperationsRuntime } from "../src/runtime.js";
import type { AccountContext, CustomerCase, KnowledgeEvidence } from "../src/domain.js";

const account: AccountContext = {
  customerId: "cust-1",
  plan: "business",
  active: true,
  entitlementStatus: "valid",
  openBalanceCents: 0
};

const evidence: KnowledgeEvidence[] = [{
  id: "kb-1",
  title: "Reset connection",
  content: "Reconnect the client and retry.",
  source: "help-center",
  confidence: 0.98
}];

const customerCase: CustomerCase = {
  id: "case-1",
  customerId: "cust-1",
  subject: "Client connection failed",
  description: "The client reports an error after login.",
  status: "open",
  accountVerified: true,
  sensitiveActionRequested: false
};

function runtimeContext(runtime: ReturnType<typeof createCustomerOperationsRuntime>, tenantId = "tenant-a") {
  return runtime.createContext({
    tenantId,
    agentId: "agent-customer-operations",
    actorId: "operator-1",
    policyVersion: "customer-v1"
  });
}

describe("customer operations runtime", () => {
  it("diagnoses a verified case deterministically", async () => {
    const runtime = createCustomerOperationsRuntime();
    const result = await runtime.execute(runtimeContext(runtime), {
      name: "customer.diagnose_case",
      input: { customerCase, account, evidence },
      risk: "low",
      resource: "customer/cust-1/case/case-1",
      estimatedCostEur: 0.05,
      idempotencyKey: "diag-1"
    });
    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({ category: "technical", action: "respond" });
  });

  it("requires approval before customer response delivery", async () => {
    const runtime = createCustomerOperationsRuntime();
    const context = runtimeContext(runtime);
    const response = await runtime.execute(context, {
      name: "customer.send_response",
      input: {
        customerCase,
        recipient: "customer@example.com",
        response: {
          subject: "Case update",
          body: "We reviewed your issue.",
          evidenceIds: ["kb-1"],
          requiresHumanReview: false
        }
      },
      risk: "medium",
      resource: "customer/cust-1/case/case-1",
      estimatedCostEur: 0.2,
      idempotencyKey: "send-1"
    });
    expect(response.ok).toBe(false);
    expect(response.error?.code).toBe("APPROVAL_REQUIRED");
    expect(response.error?.approvalRequestId).toBeTruthy();

    const requestId = response.error!.approvalRequestId!;
    const token = runtime.approvalStore().approve(context.tenantId, requestId);
    expect(token).toBeTruthy();

    const approved = await runtime.execute(context, {
      name: "customer.send_response",
      input: {
        customerCase,
        recipient: "customer@example.com",
        response: {
          subject: "Case update",
          body: "We reviewed your issue.",
          evidenceIds: ["kb-1"],
          requiresHumanReview: false
        }
      },
      risk: "medium",
      resource: "customer/cust-1/case/case-1",
      estimatedCostEur: 0.2,
      idempotencyKey: "send-1"
    }, { requestId, token: token! });

    expect(approved.ok).toBe(true);
    expect(approved.output).toMatchObject({ status: "approved_for_delivery" });
  });

  it("denies delivery when identity is not verified", async () => {
    const runtime = createCustomerOperationsRuntime();
    const context = runtimeContext(runtime);
    const unverified = { ...customerCase, accountVerified: false };
    const result = await runtime.execute(context, {
      name: "customer.send_response",
      input: {
        customerCase: unverified,
        recipient: "customer@example.com",
        response: { subject: "Case update", body: "Review required.", evidenceIds: [], requiresHumanReview: false }
      },
      risk: "medium",
      resource: "customer/cust-1/case/case-1",
      estimatedCostEur: 0.2,
      idempotencyKey: "send-unverified-1"
    });
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("APPROVAL_REQUIRED");

    const requestId = result.error!.approvalRequestId!;
    const token = runtime.approvalStore().approve(context.tenantId, requestId)!;
    const delivery = await runtime.execute(context, {
      name: "customer.send_response",
      input: {
        customerCase: unverified,
        recipient: "customer@example.com",
        response: { subject: "Case update", body: "Review required.", evidenceIds: [], requiresHumanReview: false }
      },
      risk: "medium",
      resource: "customer/cust-1/case/case-1",
      estimatedCostEur: 0.2,
      idempotencyKey: "send-unverified-1"
    }, { requestId, token });
    expect(delivery.ok).toBe(false);
    expect(delivery.error?.code).toBe("ACCOUNT_NOT_VERIFIED");
  });

  it("keeps idempotency isolated per tenant", async () => {
    const runtime = createCustomerOperationsRuntime();
    const first = await runtime.execute(runtimeContext(runtime, "tenant-a"), {
      name: "customer.update_case",
      input: { caseId: "case-1", status: "resolved", resolutionCode: "fixed" },
      risk: "low",
      resource: "customer/cust-1/case/case-1",
      estimatedCostEur: 0.05,
      idempotencyKey: "case-update-1"
    });
    const second = await runtime.execute(runtimeContext(runtime, "tenant-b"), {
      name: "customer.update_case",
      input: { caseId: "case-2", status: "closed" },
      risk: "low",
      resource: "customer/cust-2/case/case-2",
      estimatedCostEur: 0.05,
      idempotencyKey: "case-update-1"
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.output).toMatchObject({ caseId: "case-2" });
  });
});
