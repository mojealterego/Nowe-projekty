# Agent Customer Operations

## Agent #10 — Customer Operations Agent

Agent operacyjny dla SMB obsługujący zgłoszenia, umawianie terminów, statusy spraw i eskalacje. Łączy customer service z działaniem w systemach, zamiast ograniczać się do rozmowy.

### Workflow
Request intake → intent/entity extraction → knowledge lookup → customer/account context → action plan → tool execution → confirmation → follow-up/escalation.

### Architecture
TypeScript + Hono + Postgres + knowledge retrieval + calendar/CRM/helpdesk adapters + policy gateway + human handoff.

### Monetization
€69/month Starter; €249/month Business; usage tier by resolved interactions.

### Differentiator
Mierzy zakończone sprawy, nie liczbę wygenerowanych odpowiedzi. Wszystkie działania zmieniające dane lub rezerwacje przechodzą przez policy/approval rules.
