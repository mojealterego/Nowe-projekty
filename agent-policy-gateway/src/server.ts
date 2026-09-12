import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { resolve } from "node:path";
import { PolicyEngine } from "./policy.js";
import { JsonlAuditStore } from "./store.js";
import type { AuditEvent, DecisionRequest } from "./types.js";

const engine = new PolicyEngine();
const store = new JsonlAuditStore(resolve(process.env.AUDIT_FILE ?? "./data/audit.jsonl"));
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? "127.0.0.1";

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
}

async function body(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

function validRequest(value: unknown): value is DecisionRequest {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.agentId === "string" && v.agentId.length > 0 &&
    typeof v.actorId === "string" && v.actorId.length > 0 &&
    typeof v.action === "string" && v.action.length > 0 &&
    typeof v.resource === "string" && v.resource.length > 0 &&
    (v.risk === "low" || v.risk === "medium" || v.risk === "high" || v.risk === "critical") &&
    typeof v.estimatedCostEur === "number" && Number.isFinite(v.estimatedCostEur) && v.estimatedCostEur >= 0;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      send(res, 200, { status: "ok", service: "agent-policy-gateway", version: "0.1.0" });
      return;
    }

    if (req.method === "POST" && req.url === "/v1/decisions") {
      const raw = await body(req);
      let parsed: unknown;
      try { parsed = JSON.parse(raw); } catch { send(res, 400, { error: "Nieprawidłowy JSON" }); return; }
      if (!validRequest(parsed)) { send(res, 422, { error: "Nieprawidłowy format żądania" }); return; }

      const decision = engine.evaluate(parsed);
      const event: AuditEvent = { ...decision, request: parsed };
      await store.append(event);
      send(res, 200, decision);
      return;
    }

    send(res, 404, { error: "Nie znaleziono zasobu" });
  } catch (error) {
    console.error(error);
    send(res, 500, { error: "Błąd wewnętrzny" });
  }
});

server.listen(port, host, () => console.log(`Agent Policy Gateway działa na http://${host}:${port}`));
