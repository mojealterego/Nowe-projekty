import { AgentOrchestrator } from "../../agents/b2b/runtime/orchestrator.js";
import { PolicyEngineAdapter } from "../../agents/b2b/runtime/policy-engine-adapter.js";
import { ToolRegistry } from "../../agents/b2b/runtime/registry.js";
import { draftCollectionMessage, prioritizeCollection, sendCollectionMessage } from "./tools.js";

export function createCollectionsRuntime(): AgentOrchestrator {
  const registry = new ToolRegistry();
  registry.register(prioritizeCollection);
  registry.register(draftCollectionMessage);
  registry.register(sendCollectionMessage);
  return new AgentOrchestrator(registry, new PolicyEngineAdapter());
}
