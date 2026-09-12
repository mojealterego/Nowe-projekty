import { AgentOrchestrator } from "../../agents/b2b/runtime/orchestrator.js";
import { PolicyEngineAdapter } from "../../agents/b2b/runtime/policy-engine-adapter.js";
import { ToolRegistry } from "../../agents/b2b/runtime/registry.js";
import { assessComplianceControl, createEvidenceRequest, prepareRemediationTask, verifyRemediation } from "./tools.js";

export function createComplianceRuntime(): AgentOrchestrator {
  const registry = new ToolRegistry();
  registry.register(assessComplianceControl); registry.register(createEvidenceRequest); registry.register(prepareRemediationTask); registry.register(verifyRemediation);
  return new AgentOrchestrator(registry, new PolicyEngineAdapter());
}
