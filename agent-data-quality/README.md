# Agent Data Quality

## Agent #7 — Data Quality Agent

Autonomiczny agent operacyjny wykrywający duplikaty, sprzeczności, brakujące pola i anomalie w danych SMB. Zamiast tylko raportować problemy, proponuje poprawki i uruchamia je według polityki.

### Workflow
Profile → detect → explain → propose patch → confidence/risk check → approve/auto-apply → verify → audit.

### Architecture
TypeScript, Postgres, connector SDK, deterministic validators, statistical anomaly layer, LLM explanation layer, policy gateway.

### Monetization
€59/month + records processed; enterprise private deployment.

### Moat
Historia korekt i reguł organizacji pozwala budować specyficzny dla firmy model jakości danych.
