# Agent Cashflow Collections

## Agent #5 — Cashflow Collections Agent

Agent finansowy dla SMB, który monitoruje należności, priorytetyzuje zaległe faktury, przewiduje ryzyko opóźnienia i przygotowuje spersonalizowane follow-upy. Wysyłka wymaga zatwierdzenia lub wcześniej zdefiniowanej polityki.

### Workflow
Invoices → aging → customer history → risk score → next-best-action → message draft → approval/send → outcome tracking.

### Architecture
TypeScript + Hono + Postgres + accounting adapters + email adapters + rules engine + audit log.

### Monetization
€39/month + usage; higher tiers based on invoice volume.

### Differentiator
Optymalizuje kolejność i moment kontaktu, a nie tylko generuje e-maile.
