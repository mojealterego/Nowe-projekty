# PRD — Agent Ops Control Tower

## Cel
Zapewnić operatorowi firmy jedno miejsce do nadzorowania autonomicznych agentów AI działających w wielu systemach.

## Problem
Wdrożenie agentów zwiększa liczbę procesów wykonywanych automatycznie, ale jednocześnie rozprasza odpowiedzialność. Organizacja potrzebuje widoczności: który agent działa, co robi, ile kosztuje, gdzie wystąpił błąd i które działanie wymaga człowieka.

## Użytkownicy
1. właściciel małej firmy;
2. operator AI;
3. administrator IT;
4. kierownik operacyjny;
5. dostawca usług automatyzacji.

## Historie użytkownika
- Jako operator chcę zobaczyć wszystkie aktywne agenty.
- Jako operator chcę otrzymać alert, gdy agent przestanie odpowiadać.
- Jako manager chcę zatwierdzić kosztowną lub ryzykowną operację.
- Jako właściciel chcę zobaczyć koszt działania agentów per workflow.
- Jako administrator chcę mieć pełny dziennik działań.

## Encje
`Agent`, `Workflow`, `Execution`, `Approval`, `Event`, `Policy`, `CostRecord`, `User`.

## API MVP
`POST /api/agents`
`GET /api/agents`
`POST /api/events`
`GET /api/executions`
`GET /api/approvals`
`POST /api/approvals/:id/approve`
`POST /api/approvals/:id/reject`
`GET /api/metrics/costs`
`GET /api/audit`

## Reguły
- agent bez heartbeat przez 120 sekund otrzymuje status `degraded`;
- po 300 sekundach `offline`;
- operacja oznaczona jako wymagająca zatwierdzenia trafia do kolejki approval;
- każde zatwierdzenie i odrzucenie jest nieusuwalnym zdarzeniem audytowym;
- koszt musi być przypisany do agenta i workflow;
- zdarzenia są idempotentne po `event_id`.

## Niefunkcjonalne
- API p95 < 300 ms dla operacji odczytu;
- obsługa co najmniej 1000 agentów w jednej instancji;
- szyfrowanie sekretów;
- RBAC;
- izolacja tenantów;
- audyt wszystkich operacji administracyjnych.

## KPI
- aktywni agenci / konto;
- wykonania / dzień;
- approval response time;
- failure rate;
- koszt / workflow;
- miesięczna retencja kont;
- konwersja Free → Pro.

## Ryzyka
Największym ryzykiem jest wejście platform agentowych w funkcje obserwowalności. Odpowiedzią jest neutralność dostawcy, API-first, polityki oraz rozliczanie kosztów i wyników ponad pojedynczym ekosystemem.