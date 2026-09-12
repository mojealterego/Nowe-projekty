import type { AgentContext, ToolResult } from "../../agents/b2b/runtime/types.js";
import type { ToolDefinition } from "../../agents/b2b/runtime/registry.js";
import { diagnoseCase, type AccountContext, type CustomerCase, type KnowledgeEvidence } from "./domain.js";

export interface DiagnoseInput {
  customerCase: CustomerCase;
  account?: AccountContext;
  evidence: KnowledgeEvidence[];
}

export const diagnoseCustomerCase: ToolDefinition<DiagnoseInput> = {
  name: "customer.diagnose_case",
  async execute(_context: AgentContext, input: DiagnoseInput): Promise<ToolResult> {
    return { ok: true, output: diagnoseCase(input.customerCase, input.account, input.evidence) };
  }
};

export interface ResponseInput {
  customerCase: CustomerCase;
  diagnosis: ReturnType<typeof diagnoseCase>;
  customerName: string;
  evidence: KnowledgeEvidence[];
}

export interface CustomerResponse {
  subject: string;
  body: string;
  evidenceIds: string[];
  requiresHumanReview: boolean;
}

export const prepareCustomerResponse: ToolDefinition<ResponseInput> = {
  name: "customer.prepare_response",
  async execute(_context: AgentContext, input: ResponseInput): Promise<ToolResult<CustomerResponse>> {
    if (input.diagnosis.action === "escalate" || input.evidence.length === 0) {
      return {
        ok: true,
        output: {
          subject: `Update on case ${input.customerCase.id}`,
          body: `Hello ${input.customerName},\n\nWe need a human specialist to review case ${input.customerCase.id} before we can provide a reliable resolution. We will not make changes to your account without the required authorization.`,
          evidenceIds: input.diagnosis.evidenceIds,
          requiresHumanReview: true
        }
      };
    }

    return {
      ok: true,
      output: {
        subject: `Update on case ${input.customerCase.id}`,
        body: `Hello ${input.customerName},\n\nWe reviewed case ${input.customerCase.id}. The issue was classified as ${input.diagnosis.category}. Based on the available account and knowledge evidence, our next step is to address the case without changing account state.\n\nIf this does not resolve the issue, please reply with the relevant details so the case can be escalated.`,
        evidenceIds: input.diagnosis.evidenceIds,
        requiresHumanReview: false
      }
    };
  }
};

export interface UpdateCaseInput {
  caseId: string;
  status: CustomerCase["status"];
  resolutionCode?: string;
}

export const updateCustomerCase: ToolDefinition<UpdateCaseInput> = {
  name: "customer.update_case",
  async execute(_context: AgentContext, input: UpdateCaseInput): Promise<ToolResult> {
    if (!input.caseId || !input.status) {
      return { ok: false, error: { code: "INVALID_CASE_UPDATE", message: "Case id and status are required", retryable: false } };
    }
    return { ok: true, output: { status: "updated", caseId: input.caseId, newStatus: input.status, resolutionCode: input.resolutionCode } };
  }
};

export interface SendResponseInput {
  customerCase: CustomerCase;
  recipient: string;
  response: CustomerResponse;
}

/** Governed delivery boundary. No external provider is contacted here. */
export const sendCustomerResponse: ToolDefinition<SendResponseInput> = {
  name: "customer.send_response",
  async execute(_context: AgentContext, input: SendResponseInput): Promise<ToolResult> {
    if (!input.customerCase.accountVerified) {
      return { ok: false, error: { code: "ACCOUNT_NOT_VERIFIED", message: "Customer identity must be verified before response delivery", retryable: false } };
    }
    if (!input.recipient.includes("@")) {
      return { ok: false, error: { code: "INVALID_RECIPIENT", message: "Recipient must be a valid email address", retryable: false } };
    }
    if (input.response.requiresHumanReview) {
      return { ok: false, error: { code: "HUMAN_REVIEW_REQUIRED", message: "Response requires human review", retryable: false } };
    }
    return { ok: true, output: { status: "approved_for_delivery", caseId: input.customerCase.id, recipient: input.recipient, response: input.response } };
  }
};

export interface VerifyOutcomeInput {
  caseId: string;
  expectedStatus: "resolved" | "closed";
  observedStatus: CustomerCase["status"];
}

export const verifyCustomerOutcome: ToolDefinition<VerifyOutcomeInput> = {
  name: "customer.verify_outcome",
  async execute(_context: AgentContext, input: VerifyOutcomeInput): Promise<ToolResult> {
    const verified = input.observedStatus === input.expectedStatus;
    return {
      ok: verified,
      output: verified ? { verified: true, caseId: input.caseId, status: input.observedStatus } : undefined,
      error: verified ? undefined : { code: "OUTCOME_NOT_VERIFIED", message: `Expected ${input.expectedStatus}, observed ${input.observedStatus}`, retryable: false }
    };
  }
};
