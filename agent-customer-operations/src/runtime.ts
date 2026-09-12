import { AgentOrchestrator } from "../../agents/b2b/runtime/orchestrator.js";
import { PolicyEngineAdapter } from "../../agents/b2b/runtime/policy-engine-adapter.js";
import { ToolRegistry } from "../../agents/b2b/runtime/registry.js";
import { diagnoseCustomerCase, prepareCustomerResponse, sendCustomerResponse, updateCustomerCase, verifyCustomerOutcome } from "./tools.js";

export function createCustomerOperationsRuntime(): AgentOrchestrator {
  const registry = new ToolRegistry();
  registry.register(diagnoseCustomerCase);
  registry.register(prepareCustomerResponse);
  registry.register(updateCustomerCase);
  registry.register(sendCustomerResponse);
  registry.register(verifyCustomerOutcome);
  return new AgentOrchestrator(registry, new PolicyEngineAdapter());
}
