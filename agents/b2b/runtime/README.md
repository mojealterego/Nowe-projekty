# Shared B2B Agent Runtime

Foundation for all ten B2B agents. The runtime enforces a separation between reasoning and execution.

## Execution pipeline

`agent intent → typed ToolCall → registry allowlist → policy decision → audit → approval gate → idempotent execution → retry/timeout → result → verification`

## Security invariants

- tenant ID is mandatory on every execution context;
- tools must be explicitly registered;
- policy denial/review is terminal for the current call;
- consequential calls require an explicit policy allow and, where configured, an approval token;
- external writes carry idempotency keys;
- audit events are append-only and tenant-scoped;
- retries are bounded and timeout-protected;
- raw credentials and secrets are outside the runtime event model.

## Intended consumers

1. Revenue Recovery
2. Customer Operations
3. Procurement Scout
4. Compliance Evidence
5. Contract Obligations
6. AI FinOps
7. Inventory Replenishment
8. Data Quality
9. Ops Control Tower
10. Policy Gateway
