# OMNI Agent Portfolio — 10 agents

## Market intelligence snapshot — 2026

Current research indicates that SMB agent adoption is moving from experiments toward operational workflows. Upwork reports active SMB pilots in customer service (40%), scheduling/admin support (38%) and data analytics (37%), while privacy/security remains the leading adoption barrier at 49%. https://www.upwork.com/resources/state-of-ai-in-smbs

Deloitte expects rapid growth of AI-agent usage in SaaS and highlights data management, observability, governance, interoperability and hybrid usage/outcome pricing as structural requirements. https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecommunications-predictions/2026/saas-ai-agents.html

BCG's 2026 procurement research shows production agentic AI can deliver more value than pilots, but heterogeneous data, legacy integration and governance remain major blockers. https://www.bcg.com/publications/2026/scaling-agentic-ai-in-tech-procurement

AIMultiple's 2026 agentic ERP research shows a convergence of agents with procurement, finance, inventory, compliance, RAG, APIs/RPA, multi-agent orchestration and lifecycle management. https://aimultiple.com/agentic-ai-erp

## Ten-agent architecture

| # | Agent | Primary buyer | Core job | Revenue |
|---|---|---|---|---|
| 1 | Agent Policy Gateway | SMB/IT | Decide ALLOW/REVIEW/DENY for agent actions | subscription + usage |
| 2 | Agent Ops Control Tower | AI operations | Observe agents, executions, approvals and cost | subscription + usage |
| 3 | Compliance Evidence Agent | Compliance/ops | Collect, map and verify audit evidence | subscription + evidence volume |
| 4 | Procurement Scout | Procurement/owners | Discover suppliers and compare TCO/risk | subscription + sourcing events |
| 5 | Cashflow Collections Agent | Finance | Prioritize receivables and manage follow-up | subscription + invoice volume |
| 6 | Contract Obligation Agent | Legal/ops | Convert contracts into executable obligations | subscription |
| 7 | Data Quality Agent | Operations/data | Detect and safely remediate bad data | subscription + records |
| 8 | Inventory Replenishment Agent | Retail/manufacturing | Predict replenishment and supplier risk | subscription + volume |
| 9 | AI FinOps Agent | AI platform/finance | Attribute and optimize agent/model spend | subscription + % monitored spend |
| 10 | Customer Operations Agent | SMB service teams | Resolve requests by acting in business systems | subscription + resolved interactions |

## Shared platform contract

All agents should expose:
- tenant and identity context;
- structured tool calls;
- policy evaluation before consequential actions;
- approval/human handoff;
- provenance for retrieved facts;
- execution IDs and cost telemetry;
- append-only audit events;
- idempotency keys for external writes;
- retry/dead-letter handling;
- explicit confidence and uncertainty states.

## Portfolio strategy

The first two products are horizontal infrastructure. Agents 3–10 are vertical/workflow products that can consume the infrastructure. This creates an internal platform flywheel: policy, observability, audit and FinOps become shared primitives while domain agents create direct revenue and proprietary workflow data.

## Priority

1. Compliance Evidence — high trust requirement and recurring evidence workload.
2. Procurement Scout — clear economic value and strong 2026 agentic-AI signal.
3. Cashflow Collections — directly measurable cash-flow outcome.
4. Contract Obligation — sticky recurring workflow with strong data moat.
5. AI FinOps — natural attachment to every other agent.
6. Customer Operations — broad SMB demand, but crowded market.
7. Data Quality — strong infrastructure value, integration-heavy.
8. Inventory Replenishment — high value in selected verticals, forecasting complexity.

The portfolio intentionally avoids generic chatbots and thin AI wrappers. Each agent has a stateful workflow, system actions, measurable outcome and human-control boundary.
