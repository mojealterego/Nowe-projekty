# MONEYOS — PRODUCT REQUIREMENTS DOCUMENT

## 1. Objective

Build an Android-first AI Personal CFO that continuously converts financial data into an explainable financial state, forecasts, recommendations and controlled actions.

## 2. Non-goals

- replacing a bank;
- providing regulated investment advice;
- autonomous high-impact financial decisions;
- generic conversational AI without financial-state grounding.

## 3. Personas

### P1 — Household manager
Needs one view of income, bills, subscriptions, cash runway and goals.

### P2 — Self-employed
Needs separation of recurring business/personal cash flow and protection against tax/bill timing surprises.

### P3 — Couple/family
Needs shared goals and obligations with granular visibility and approval controls.

## 4. Core user journeys

1. Onboard → establish financial goals → connect/import data → classify → generate first financial state.
2. Morning/weekly brief → identify material change → explain cause → propose action.
3. Upcoming bill → forecast impact → recommend timing → prepare reminder/action.
4. Unusual transaction → detect → show evidence → ask user to confirm/correct.
5. Goal → forecast probability → simulate scenarios → select plan.
6. Action → preview exact effect → require approval when consequential → execute → verify.

## 5. Functional requirements

- FR-01: import transaction/account data through supported providers or file import;
- FR-02: normalize merchants, amounts, currencies, timestamps and categories;
- FR-03: maintain a deterministic financial-state snapshot;
- FR-04: detect recurring income/expenses and subscriptions;
- FR-05: calculate cash-flow forecasts for 30/90 days;
- FR-06: surface anomalies with evidence and confidence;
- FR-07: support goals, budgets and sinking funds;
- FR-08: generate an AI brief grounded in stored financial facts;
- FR-09: expose recommendation rationale and supporting transactions;
- FR-10: simulate financial scenarios before action;
- FR-11: create approval requests for consequential actions;
- FR-12: record immutable action/audit events;
- FR-13: allow correction, export and deletion of user data;
- FR-14: expose notification preferences and quiet periods;
- FR-15: instrument product, model and financial-outcome events without storing unnecessary financial payloads.

## 6. Agent contract

The reasoning layer receives a typed `FinancialContext`, may call read-only tools freely, and may propose typed `ActionPlan` objects. Authorization is separate from model output.

### Required action preview

Every actionable plan must contain:

- action type;
- target/provider;
- affected amount/data;
- expected result;
- material risks;
- approval requirement;
- idempotency key;
- verification procedure;
- correction/rollback procedure where available.

## 7. Acceptance criteria

MVP is release-ready only when:

- forecasts are deterministic for identical inputs/configuration;
- all AI claims can be traced to financial facts or clearly marked assumptions;
- unauthorized writes are blocked by policy;
- duplicate external actions are prevented by idempotency;
- every consequential action has an approval event;
- data export/delete paths are tested;
- critical financial calculations have unit/property tests;
- model evaluations include hallucination, stale-context and adversarial-action cases.

## 8. Release gates

**Gate A:** local domain engine and test suite.

**Gate B:** provider sandbox + encrypted persistence.

**Gate C:** agent runtime + policy + approval.

**Gate D:** production-readiness, privacy/security and observability review.

**Gate E:** closed beta with outcome measurement.
