import test from "node:test";
import assert from "node:assert/strict";
import { agentManifests } from "../AGENT-MANIFESTS.js";

test("portfolio contains exactly ten B2B agent manifests", () => {
  assert.equal(agentManifests.length, 10);
  assert.equal(new Set(agentManifests.map((agent) => agent.id)).size, 10);
});

test("every agent has read tools, action controls and KPIs", () => {
  for (const agent of agentManifests) {
    assert.ok(agent.readTools.length > 0, agent.id);
    assert.ok(agent.actionTools.length > 0, agent.id);
    assert.ok(agent.primaryKpis.length > 0, agent.id);
    for (const action of agent.actionTools) {
      if (action.defaultRisk === "high" || action.defaultRisk === "critical") assert.equal(action.requiresApproval, true, `${agent.id}:${action.name}`);
    }
  }
});
