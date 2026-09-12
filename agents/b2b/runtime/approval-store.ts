import { randomUUID } from "node:crypto";
import type { AgentContext, ApprovalRequest, ToolCall } from "./types.js";

type StoredApproval = ApprovalRequest & { token: string };

export class ApprovalStore {
  private readonly requests = new Map<string, StoredApproval>();

  create(context: AgentContext, call: ToolCall, summary: string, ttlMs = 15 * 60_000): ApprovalRequest {
    const request: StoredApproval = {
      id: randomUUID(), tenantId: context.tenantId, agentId: context.agentId, actorId: context.actorId,
      action: call.name, resource: call.resource, summary,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(), status: "pending", token: randomUUID()
    };
    this.requests.set(request.id, request);
    return this.publicRequest(request);
  }

  approve(tenantId: string, requestId: string): string {
    const request = this.getLive(tenantId, requestId);
    if (!request) throw new Error("APPROVAL_NOT_FOUND_OR_EXPIRED");
    if (request.status !== "pending") throw new Error(`APPROVAL_NOT_PENDING:${request.status}`);
    request.status = "approved";
    return request.token;
  }

  consume(tenantId: string, requestId: string, token: string, call: ToolCall): boolean {
    const request = this.getLive(tenantId, requestId);
    if (!request || request.status !== "approved" || request.token !== token) return false;
    if (request.action !== call.name || request.resource !== call.resource) return false;
    request.status = "rejected";
    request.token = "consumed";
    return true;
  }

  get(tenantId: string, requestId: string): ApprovalRequest | undefined {
    const request = this.requests.get(requestId);
    if (!request || request.tenantId !== tenantId) return undefined;
    this.expireIfNeeded(request);
    return this.publicRequest(request);
  }

  private getLive(tenantId: string, requestId: string): StoredApproval | undefined {
    const request = this.requests.get(requestId);
    if (!request || request.tenantId !== tenantId) return undefined;
    this.expireIfNeeded(request);
    return request.status === "expired" ? undefined : request;
  }

  private expireIfNeeded(request: StoredApproval): void {
    if (request.status === "pending" && Date.parse(request.expiresAt) <= Date.now()) request.status = "expired";
  }

  private publicRequest(request: StoredApproval): ApprovalRequest {
    const { token: _token, ...publicRequest } = request;
    return Object.freeze({ ...publicRequest });
  }
}
