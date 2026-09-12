import type { AgentContext, ToolResult } from "../../agents/b2b/runtime/types.js";
import type { ToolDefinition } from "../../agents/b2b/runtime/registry.js";
import { assessControl, buildGap, type ControlRequirement, type Evidence } from "./domain.js";

export const assessComplianceControl: ToolDefinition<{ control: ControlRequirement; evidence: Evidence[]; now?: string }> = {
  name: "compliance.assess_control",
  async execute(_context, input) { const assessment = assessControl(input.control, input.evidence, input.now ? new Date(input.now) : new Date()); return { ok: true, output: { assessment, gap: buildGap(input.control, assessment, input.evidence) } }; }
};

export const createEvidenceRequest: ToolDefinition<{ controlId: string; evidenceTypes: string[] }> = {
  name: "compliance.create_evidence_request",
  async execute(_context, input) { if (!input.controlId || input.evidenceTypes.length === 0) return { ok: false, error: { code: "INVALID_EVIDENCE_REQUEST", message: "Control and evidence types are required", retryable: false } }; return { ok: true, output: { status: "request_created", controlId: input.controlId, evidenceTypes: input.evidenceTypes } }; }
};

export const prepareRemediationTask: ToolDefinition<{ controlId: string; severity: "medium" | "high" | "critical"; summary: string }> = {
  name: "compliance.prepare_remediation",
  async execute(_context, input) { return { ok: true, output: { status: "ready_for_approval", ...input } }; }
};

export const verifyRemediation: ToolDefinition<{ controlId: string; evidence: Evidence[]; control: ControlRequirement; now?: string }> = {
  name: "compliance.verify_remediation",
  async execute(_context, input) { const assessment = assessControl(input.control, input.evidence, input.now ? new Date(input.now) : new Date()); return assessment.status === "satisfied" ? { ok: true, output: { status: "verified", assessment } } : { ok: false, error: { code: "REMEDIATION_UNVERIFIED", message: `Control remains ${assessment.status}`, retryable: false } }; }
};
