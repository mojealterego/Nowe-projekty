# MONEYOS — DOMAIN MODEL

## Design principle

The financial domain is deterministic and provider-agnostic. AI may interpret and propose; it does not become the source of truth for balances, transactions or authorization.

## Core entities

```text
User
 ├── FinancialProfile
 ├── Account
 │    └── Transaction
 ├── Recurrence
 ├── Obligation
 ├── Goal
 │    └── Scenario
 ├── Insight
 ├── ActionPlan
 │    └── Approval
 └── AuditEvent
```

## Account

Fields: `id`, `providerId`, `type`, `currency`, `displayName`, `currentBalance`, `availableBalance?`, `lastSyncedAt`, `status`.

Account balances are provider data and must retain provenance/timestamp.

## Transaction

Fields: `id`, `accountId`, `providerTransactionId?`, `postedAt`, `amountMinor`, `currency`, `merchant`, `category`, `subcategory?`, `direction`, `status`, `recurrenceId?`, `confidence`, `source`, `metadata`.

Use integer minor units for monetary calculations. Never use binary floating point for persisted money.

## FinancialState

Derived immutable snapshot containing:

- total liquid balance;
- available cash;
- expected income;
- expected obligations;
- discretionary spend;
- recurring commitments;
- debt service;
- savings rate;
- cash runway;
- forecast confidence;
- source timestamps.

## Recommendation

`id`, `type`, `title`, `rationale`, `evidenceIds[]`, `estimatedImpact`, `confidence`, `expiresAt`, `status`.

## ActionPlan

`id`, `type`, `provider`, `parameters`, `amountMinor?`, `riskLevel`, `requiresApproval`, `idempotencyKey`, `verificationPlan`, `rollbackPlan?`, `status`.

## AuditEvent

Append-only event containing actor, action, target, decision, timestamp, policy version and evidence references. Never store secrets or unnecessary raw credentials.

## Calculation invariants

1. `amountMinor` is integer.
2. Currency is explicit.
3. Forecast inputs carry timestamps.
4. Derived state is reproducible from source facts + model version.
5. AI-generated values are marked as estimates and never silently promoted to facts.
6. External writes require idempotency.
