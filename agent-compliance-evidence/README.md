# Agent Compliance Evidence

## Agent #3 — Compliance Evidence Agent

### Problem
SMB teams must repeatedly prove that policies, controls and operational procedures are actually followed. Evidence is fragmented across GitHub, Drive, tickets, logs and SaaS exports.

### Agent
Collects control evidence, maps artifacts to controls, detects stale/missing evidence, assigns confidence and prepares an auditor-ready evidence index. It never declares legal compliance; it reports evidence coverage and gaps.

### Workflow
1. Discover connected sources.
2. Normalize artifacts and timestamps.
3. Map evidence to configured controls.
4. Score freshness, provenance and completeness.
5. Open remediation tasks for gaps.
6. Produce an immutable evidence manifest.

### Architecture
TypeScript + Hono API + Postgres + object storage + queue worker. Provider adapters isolate GitHub/Drive/ticket systems. Hash every evidence artifact and record source metadata.

### Monetization
Starter €49/month; Business €199/month; Enterprise custom. Usage pricing for evidence volume.

### Moat
Evidence provenance graph + reusable control mappings + historical evidence continuity.
