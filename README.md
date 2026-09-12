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

## Ranking 10 aplikacji desktopowych — 2026

| Rank | Produkt | Score |
|---:|---|---:|
| **1** | **Private AI Workstation** | **9.25/10** |
| **2** | **Desktop Workflow Miner** | **9.10/10** |
| **3** | **AI Quote & Margin Desk** | **8.95/10** |
| **4** | **Local Data Guardian** | **8.85/10** |
| **5** | **AI Developer Command Center** | **8.75/10** |
| **6** | **Desktop Business Autopilot** | **8.60/10** |
| **7** | **AI Research & Evidence Desktop** | **8.35/10** |
| **8** | **Freelancer Profit OS** | **8.05/10** |
| **9** | **Smart Desktop Backup & Recovery** | **7.95/10** |
| **10** | **Creator Production OS** | **7.80/10** |

Pełna analiza: [`DESKTOP-APP-RANKING.md`](./DESKTOP-APP-RANKING.md).

## Android Games — portfolio badawcze

Pierwszym projektem skierowanym do faktycznej produkcji jest **Arrow Heist** — Android-first hybrid-casual puzzle/heist game.

| Rank | Projekt | Model | Score | Status |
|---:|---|---|---:|---|
| **1** | **Arrow Heist** | Puzzle + heist / hybrid-casual | **9.7/10** | **IN DESIGN** |
| **2** | **Repair District** | Merge + simulation | **9.6/10** | Research |
| **3** | **Street Empire** | Tycoon / simulation | **9.4/10** | Research |
| **4** | **Frontier: 30 Days** | Strategy-lite / survival | **9.3/10** | Research |
| **5** | **Dungeon Draft** | Roguelite / deckbuilder | **9.2/10** | Research |
| **6** | **House Flip Wars** | Restoration simulation | **9.0/10** | Research |
| **7** | **Who Is Lying?** | Social deduction | **8.9/10** | Research |
| **8** | **Idle Syndicate** | Idle / business | **8.8/10** | Research |
| **9** | **Pocket League Manager** | Sports management | **8.7/10** | Research |
| **10** | **Worlds in Your Pocket** | Mini-game / UGC platform | **8.6/10** | Research |

### Arrow Heist

**Core promise:** Solve the route. Beat the security. Escape with the loot.

The project combines a deterministic directional puzzle with a lightweight heist layer. MVP documentation lives in [`games/android/arrow-heist/`](./games/android/arrow-heist/).

## Metoda selekcji

Projekty są wybierane na podstawie:
1. realnego problemu lub potrzeby użytkownika,
2. rosnącego popytu,
3. możliwości wykonania działania przez system/agent,
4. mierzalnego rezultatu,
5. powtarzalnego przychodu lub wysokiego LTV,
6. możliwości zbudowania przewagi danych/workflow/game economy,
7. kosztu wejścia możliwego do zweryfikowania przez MVP.

## Zasada architektoniczna

Każdy agent powinien posiadać własny katalog, PRD, jawny stack, działający punkt wejścia, testy dla logiki krytycznej, audit trail oraz jasno zdefiniowaną granicę human-in-the-loop.

Dla gier obowiązuje analogiczna zasada: deterministyczny gameplay, data-driven content, telemetryka KPI, kontrolowana ekonomia, feature flags i wyraźne bramki soft-launch przed skalowaniem UA.
