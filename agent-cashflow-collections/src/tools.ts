import type { AgentContext, ToolResult } from "../../agents/b2b/runtime/types.js";
import type { ToolDefinition } from "../../agents/b2b/runtime/registry.js";
import { prioritizeInvoice, type CustomerHistory, type Invoice } from "./domain.js";

export interface PrioritizeInput {
  invoice: Invoice;
  history: CustomerHistory;
  now?: string;
}

export const prioritizeCollection: ToolDefinition<PrioritizeInput> = {
  name: "collections.prioritize_invoice",
  async execute(_context: AgentContext, input: PrioritizeInput): Promise<ToolResult> {
    return { ok: true, output: prioritizeInvoice(input.invoice, input.history, input.now ? new Date(input.now) : new Date()) };
  }
};

export interface DraftMessageInput {
  invoice: Invoice;
  customerName: string;
  decision: ReturnType<typeof prioritizeInvoice>;
}

export const draftCollectionMessage: ToolDefinition<DraftMessageInput> = {
  name: "collections.draft_message",
  async execute(_context: AgentContext, input: DraftMessageInput): Promise<ToolResult> {
    if (input.decision.nextAction === "human_review") {
      return { ok: true, output: { sendable: false, reason: "Customer opted out; human review required" } };
    }
    const subject = `Payment reminder for invoice ${input.invoice.id}`;
    const body = `Hello ${input.customerName},\n\nThis is a reminder that invoice ${input.invoice.id} for ${input.invoice.amountCents / 100} ${input.invoice.currency} is overdue. Please let us know if payment has already been arranged or if there is an issue we should address.\n\nThank you.`;
    return { ok: true, output: { sendable: true, subject, body } };
  }
};
