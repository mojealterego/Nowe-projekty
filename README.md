# Nowe-projekty

Repozytorium projektów generowanych na podstawie analizy popytu, trendów technologicznych i modeli monetyzacji.

## Portfolio 10 agentów

| # | Projekt | Typ | Główna wartość |
|---|---|---|---|
| 1 | `agent-policy-gateway` | AI infrastructure | Kontrola działań agentów |
| 2 | `agent-ops-control-tower` | AI infrastructure | Observability, approvals, koszt |
| 3 | `agent-compliance-evidence` | B2B compliance | Automatyczne pozyskiwanie dowodów |
| 4 | `agent-procurement-scout` | B2B procurement | Dostawcy, TCO i sourcing |
| 5 | `agent-cashflow-collections` | FinOps/finance | Należności i cash flow |
| 6 | `agent-contract-obligations` | Legal/operations | Wykonanie zobowiązań z umów |
| 7 | `agent-data-quality` | Data operations | Jakość i bezpieczna korekta danych |
| 8 | `agent-inventory-replenishment` | Retail/manufacturing | Replenishment i ryzyko dostaw |
| 9 | `agent-ai-finops` | AI infrastructure/finance | Koszt agentów i modeli |
| 10 | `agent-customer-operations` | SMB operations | Rozwiązywanie spraw przez działanie |

Pełna strategia: [`AGENT-PORTFOLIO.md`](./AGENT-PORTFOLIO.md).

## Metoda selekcji

Projekty są wybierane na podstawie:
1. realnego problemu biznesowego,
2. rosnącego popytu,
3. możliwości wykonania działania przez agenta,
4. mierzalnego rezultatu,
5. powtarzalnego przychodu,
6. możliwości zbudowania przewagi danych/workflow.

W 2026 r. SMB-y intensywnie pilotażują agentów w customer service, administracji, analityce i automatyzacji workflow, ale bezpieczeństwo, prywatność i ROI pozostają kluczowymi barierami. Deloitte i BCG wskazują dodatkowo na znaczenie interoperacyjności, obserwowalności, danych, governance i integracji z istniejącymi systemami.

## Zasada architektoniczna

Każdy agent powinien posiadać własny katalog, PRD, jawny stack, działający punkt wejścia, testy dla logiki krytycznej, audit trail oraz jasno zdefiniowaną granicę human-in-the-loop.
