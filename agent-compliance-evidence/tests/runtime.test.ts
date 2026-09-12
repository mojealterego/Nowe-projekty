import { describe, expect, it } from "vitest";
import { createComplianceRuntime } from "../src/runtime.js";
import type { ControlRequirement, Evidence } from "../src/domain.js";
const control: ControlRequirement = { id: "AC-1", framework: "SOC2", name: "Access review", requiredEvidenceTypes: ["access-review"], maxAgeDays: 30 };
const evidence: Evidence = { id: "EV-1", type: "access-review", collectedAt: "2026-09-10T00:00:00Z", source: "iam", checksum: "abc", valid: true };
const ctx = (r: ReturnType<typeof createComplianceRuntime>) => r.createContext({ tenantId: "tenant-a", agentId: "agent-compliance-evidence", actorId: "auditor", policyVersion: "v1" });
describe("Compliance Evidence runtime", () => {
 it("satisfies a control with fresh valid evidence", async () => { const r=createComplianceRuntime(); const x=await r.execute(ctx(r),{name:"compliance.assess_control",input:{control,evidence,now:"2026-09-12T00:00:00Z"},risk:"low",resource:"control/AC-1",estimatedCostEur:0}); expect(x.ok).toBe(true); expect((x.output as any).assessment.status).toBe("satisfied"); });
 it("requires approval for remediation", async () => { const r=createComplianceRuntime(); const c=ctx(r); const call={name:"compliance.prepare_remediation",input:{controlId:"AC-1",severity:"high" as const,summary:"Replace stale evidence"},risk:"medium" as const,resource:"control/AC-1",estimatedCostEur:0.1}; const p=await r.execute(c,call); expect(p.error?.code).toBe("APPROVAL_REQUIRED"); const token=r.approvalStore().approve(c.tenantId,p.error!.approvalRequestId!); expect(token).toBeTruthy(); const done=await r.execute(c,call,{requestId:p.error!.approvalRequestId!,token:token!}); expect(done.ok).toBe(true); });
 it("reports missing evidence instead of inventing compliance", async () => { const r=createComplianceRuntime(); const x=await r.execute(ctx(r),{name:"compliance.assess_control",input:{control,evidence:[],now:"2026-09-12T00:00:00Z"},risk:"low",resource:"control/AC-1",estimatedCostEur:0}); expect((x.output as any).assessment.status).toBe("missing"); });
});
