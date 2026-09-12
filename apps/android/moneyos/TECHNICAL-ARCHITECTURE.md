# MONEYOS — TECHNICAL ARCHITECTURE

## Android stack

- Kotlin;
- Jetpack Compose;
- ViewModel + unidirectional state flow;
- Room for structured local data;
- Android Keystore for key material;
- WorkManager for scheduled sync/brief generation;
- DataStore for non-sensitive preferences;
- Kotlin coroutines/Flow;
- provider adapters behind domain interfaces.

## Module boundaries

```text
app
├── feature-onboarding
├── feature-dashboard
├── feature-transactions
├── feature-forecast
├── feature-goals
├── feature-insights
├── feature-copilot
├── feature-approvals
├── feature-settings
├── domain
│   ├── financial-state
│   ├── forecasting
│   ├── categorization
│   ├── recommendations
│   └── policy
├── data
│   ├── local
│   ├── providers
│   └── sync
└── agent
    ├── tools
    ├── planner
    ├── router
    └── audit
```

## Agent/tool boundary

Read-only tools:

- `getFinancialState`
- `getTransactions`
- `getUpcomingObligations`
- `getGoals`
- `simulateScenario`
- `getRecommendationEvidence`

Action tools:

- `createReminder`
- `prepareTransfer`
- `preparePayment`
- `exportReport`

Action tools cannot execute merely because an LLM requested them. The call must pass deterministic policy evaluation and, where required, an approval token.

## Sync strategy

Provider sync is incremental and idempotent. Every imported record has a stable provider identity when available. Conflict resolution prefers provider truth for provider-owned fields and user corrections for categorisation/preferences.

## Forecast engine

V1 is deterministic: recurring income/expenses + known obligations + user-entered assumptions + confidence bands. ML/LLM forecasting is an optional advisory layer and cannot overwrite the deterministic baseline without explicit versioning.

## Offline-first behavior

Dashboard, transaction history, goals and previously generated insights remain available from the local encrypted store. Offline action requests are queued only when their semantics are safe; consequential actions require fresh provider state before execution.

## Observability

Capture latency, sync failures, tool-call outcome, model version, policy decision and approval latency. Do not log raw account numbers, credentials or full transaction descriptions unless explicitly required for a protected diagnostic workflow.
