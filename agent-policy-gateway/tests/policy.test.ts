import test from "node:test";
import assert from "node:assert/strict";
import { PolicyEngine } from "../src/policy.js";

const engine = new PolicyEngine();
const base = { agentId: "agent-a", actorId: "user-a", action: "read_data", resource: "crm:customers", risk: "low" as const, estimatedCostEur: 0.01 };

test("niska operacja odczytu jest dozwolona", () => {
  const result = engine.evaluate(base);
  assert.equal(result.decision, "allow");
});

test("wysokie ryzyko dla płatności jest odrzucane", () => {
  const result = engine.evaluate({ ...base, action: "create_payment", risk: "high", estimatedCostEur: 0.2 });
  assert.equal(result.decision, "deny");
});

test("wysłanie wiadomości wymaga review przy średnim ryzyku", () => {
  const result = engine.evaluate({ ...base, action: "send_email", risk: "medium", resource: "client@example.com" });
  assert.equal(result.decision, "review");
});

test("brak polityki specyficznej korzysta z polityki ogólnej", () => {
  const result = engine.evaluate({ ...base, action: "delete_record", risk: "low" });
  assert.equal(result.decision, "allow");
});

test("przekroczenie kosztu jest odrzucane", () => {
  const result = engine.evaluate({ ...base, action: "read_data", estimatedCostEur: 2 });
  assert.equal(result.decision, "deny");
});
