# Agent Inventory Replenishment

## Agent #8 — Inventory Replenishment Agent

Agent dla handlu i małej produkcji, który łączy sprzedaż, zapasy, lead time i niezawodność dostawców, aby rekomendować zamówienia uzupełniające i reagować na anomalie.

### Workflow
Sales/stock ingestion → demand baseline → lead-time risk → reorder proposal → supplier selection → approval → order tracking → variance learning.

### Architecture
TypeScript + Postgres + event worker + ERP/e-commerce adapters + forecasting module + procurement agent integration.

### Monetization
€79/month Starter; €249/month Business; volume pricing.

### Differentiator
Łączy prognozę popytu z ryzykiem dostawcy i rzeczywistym czasem dostawy, zamiast używać wyłącznie prostego minimum magazynowego.
