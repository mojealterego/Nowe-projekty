import { AgentOrchestrator } from "../../agents/b2b/runtime/orchestrator.js";
import { PolicyEngineAdapter } from "../../agents/b2b/runtime/policy-engine-adapter.js";
import { ToolRegistry } from "../../agents/b2b/runtime/registry.js";
import { assessContractDeadline, prepareContractAction, sendContractNotice, verifyContractObligation } from "./tools.js";

export function createContractObligationsRuntime(): AgentOrchestrator {
  const registry = new ToolRegistry();
  registry.register(assessContractDeadline);
  registry.register(prepareContractAction);
  registry.register(sendContractNotice);
  registry.register(verifyContractObligation);
  return new AgentOrchestrator(registry, new PolicyEngineAdapter());
}
