import type { AgentContext, ToolResult } from "../../agents/b2b/runtime/types.js";
import type { ToolDefinition } from "../../agents/b2b/runtime/registry.js";
import { assessDeadline, extractObligations, verifyObligation, type ClauseInput, type ContractObligation, type ObligationEvidence } from "./domain.js";

export const extractContractObligations: ToolDefinition<{ contractId: string; clauses: ClauseInput[] }> = {
  name: "contract.extract_obligations",
  async execute(_context: AgentContext, input) { return { ok: true, output: extractObligations(input.contractId, input.clauses) }; }
};

export const assessContractDeadline: ToolDefinition<{ obligation: ContractObligation; now: string }> = {
  name: "contract.assess_deadline",
  async execute(_context: AgentContext, input) { return { ok: true, output: assessDeadline(input.obligation, input.now) }; }
};

export const verifyContractObligation: ToolDefinition<{ obligation: ContractObligation; evidence: ObligationEvidence[] }> = {
  name: "contract.verify_obligation",
  async execute(_context: AgentContext, input) { return { ok: true, output: verifyObligation(input.obligation, input.evidence) }; }
};

export interface PrepareActionInput { obligation: ContractObligation; action: "remind_owner" | "request_evidence" | "escalate"; recipientId?: string; summary: string; }
export const prepareContractAction: ToolDefinition<PrepareActionInput> = {
  name: "contract.prepare_action",
  async execute(_context: AgentContext, input): Promise<ToolResult> {
    if (input.obligation.confidence < 0.8) return { ok: false, error: { code: "LOW_CONFIDENCE", message: "Low-confidence obligation requires human confirmation before consequential action", retryable: false } };
    return { ok: true, output: { status: "ready_for_approval", obligationId: input.obligation.id, action: input.action, recipientId: input.recipientId, summary: input.summary } };
  }
};

export interface SendNoticeInput { obligationId: string; recipientId: string; message: string; }
/** Post-approval boundary; no notification provider is called in the MVP. */
export const sendContractNotice: ToolDefinition<SendNoticeInput> = {
  name: "contract.send_notice",
  async execute(_context: AgentContext, input): Promise<ToolResult> {
    if (!input.recipientId.trim()) return { ok: false, error: { code: "INVALID_RECIPIENT", message: "Recipient is required", retryable: false } };
    if (!input.message.trim()) return { ok: false, error: { code: "EMPTY_MESSAGE", message: "Notice message is required", retryable: false } };
    return { ok: true, output: { status: "approved_for_delivery", obligationId: input.obligationId, recipientId: input.recipientId } };
  }
};
