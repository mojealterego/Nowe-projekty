# Agent Contract Obligations

## Agent #6 — Contract Obligation Agent

Agent, który zamienia umowy i aneksy na operacyjną listę zobowiązań: terminy, SLA, odnowienia, limity, wymagane dokumenty i właścicieli. Monitoruje ryzyko przegapienia obowiązku.

### Workflow
Contract ingestion → clause extraction → obligation graph → owner assignment → deadline monitoring → evidence request → escalation.

### Architecture
TypeScript, document parser, LLM extraction with structured output, Postgres, event scheduler, notifications, immutable audit log.

### Monetization
€99/month Starter; €399/month Business; enterprise volume pricing.

### Differentiator
Skupienie na wykonaniu zobowiązań po podpisaniu umowy, nie na samym streszczaniu kontraktów.
