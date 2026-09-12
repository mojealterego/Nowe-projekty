# Agent Procurement Scout

## Agent #4 — Procurement Scout

Agent dla SMB, który wyszukuje dostawców, normalizuje oferty, porównuje warunki i przygotowuje rekomendację zakupową. Nie zawiera umów ani nie składa zamówień bez zatwierdzenia człowieka.

### Workflow
Request → supplier discovery → qualification → quote extraction → TCO comparison → risk check → negotiation draft → approval.

### Architecture
TypeScript, Hono, Postgres, web/search adapters, document extraction worker, policy gateway integration, approval queue.

### Differentiator
Nie jest katalogiem dostawców. Buduje porównywalny model całkowitego kosztu, terminów, ryzyka i warunków handlowych.

### Monetization
€79/month Starter, €299/month Business, usage fee per sourcing event.
