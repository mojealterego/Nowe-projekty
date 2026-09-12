# PRD — Compliance Evidence Agent

## MVP
- connector registry;
- evidence ingestion;
- SHA-256 provenance hash;
- control/evidence mapping;
- freshness and completeness scoring;
- gap queue;
- evidence manifest export;
- RBAC and audit log.

## Non-goals
Legal advice, certification, automatic regulatory conclusions.

## Success metrics
Evidence collection time -70%; stale evidence detection >95%; provenance coverage 100%; false control mappings <5%.

## Security
Least-privilege connectors, encryption at rest/in transit, tenant isolation, retention policies, append-only audit trail.

## Key risk
Bad mappings can create false confidence. Every automated mapping must expose source, confidence and reviewer state.
