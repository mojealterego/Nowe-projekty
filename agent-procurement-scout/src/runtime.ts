import { AgentOrchestrator } from "../../agents/b2b/runtime/orchestrator.js";
import { PolicyEngineAdapter } from "../../agents/b2b/runtime/policy-engine-adapter.js";
import { ToolRegistry } from "../../agents/b2b/runtime/registry.js";
import { commitPurchase, normalizeSupplierOffer, prepareRfq, recommendSupplierTool, verifyPurchaseOutcome } from "./tools.js";

export function createProcurementRuntime(): AgentOrchestrator {
  const registry = new ToolRegistry();
  registry.register(normalizeSupplierOffer);
  registry.register(recommendSupplierTool);
  registry.register(prepareRfq);
  registry.register(commitPurchase);
  registry.register(verifyPurchaseOutcome);
  return new AgentOrchestrator(registry, new PolicyEngineAdapter());
}
