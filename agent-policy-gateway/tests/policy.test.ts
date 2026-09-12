import test from "node:test";
import assert from "node:assert/strict";
import { PolicyEngine } from "../src/policy.js";

const engine = new PolicyEngine();
const base = { agentId: "agent-a", actorId: "user-a", action: "read_data", resource: "crm:customers", risk: "low" as const, estimatedCostEur: 0.01 };

test("niska operacja odczytu jest dozwolona", () => {
  assert.equal(engine.evaluate(base).decision, "allow");
});

test("wysokie ryzyko dla płatności jest odrzucane", () => {
  assert.equal(engine.evaluate({ ...base, action: "create_payment", risk: "high", estimatedCostEur: 0.2 }).decision, "deny");
});

test("wysłanie wiadomości wymaga review przy średnim ryzyku", () => {
  assert.equal(engine.evaluate({ ...base, action: "send_email", risk: "medium", resource: "client@example.com" }).decision, "review");
});

test("destrukcyjne delete nie przechodzi przez wildcard", () => {
  const result = engine.evaluate({ ...base, action: "delete_record", risk: "low" });
  assert.equal(result.decision, "deny");
  assert.equal(result.policyId, "implicit-destructive-deny");
});

test("zmiana poświadczeń bez jawnej polityki jest odrzucana", () => {
  assert.equal(engine.evaluate({ ...base, action: "change_credentials", risk: "low" }).decision, "deny");
});

test("transfer środków bez jawnej polityki jest odrzucany", () => {
  assert.equal(engine.evaluate({ ...base, action: "transfer_funds", risk: "low" }).decision, "deny");
});

test("nieznana operacja jest odrzucana", () => {
  assert.equal(engine.evaluate({ ...base, action: "unknown_action", risk: "low" }).decision, "deny");
});

test("przekroczenie kosztu jest odrzucane", () => {
  assert.equal(engine.evaluate({ ...base, action: "read_data", estimatedCostEur: 2 }).decision, "deny");
});
