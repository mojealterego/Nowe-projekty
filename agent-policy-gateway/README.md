# Agent Policy Gateway

## Status

Wersja inicjalna: 0.1.0. Projekt jest autonomiczną warstwą kontroli dla agentów AI wykonujących działania w systemach firmowych.

## Hipoteza rynkowa

W 2026 r. adopcja agentów AI w małych i średnich firmach rośnie szybciej niż dojrzałość kontroli. Badanie Upwork Research Institute wskazuje, że 34% badanych SMB aktywnie pilotażuje automatyzację workflow agentami, 30% autonomiczne wykonywanie zadań, a 49% wskazuje prywatność i bezpieczeństwo danych jako istotną barierę. citeturn0search2

Deloitte przewiduje dalsze przechodzenie SaaS w kierunku autonomicznych workflow i modeli hybrydowych łączących abonament, zużycie i wynik. citeturn0search1

Jednocześnie rynek aplikacji AI pokazuje, że sama funkcja AI nie tworzy trwałej wartości: RevenueCat raportuje wyższe przychody na płatnika, ale słabszą retencję AI-apps. citeturn0search6

### Luka

Wiele małych firm może uruchomić agenta, ale nie posiada prostej, niezależnej od dostawcy warstwy:

- polityk dopuszczających lub blokujących działania,
- obowiązkowego zatwierdzania operacji wysokiego ryzyka,
- niezmiennego dziennika audytowego,
- limitów kosztowych i liczby wywołań,
- identyfikacji agenta i użytkownika inicjującego działanie,
- jednolitego interfejsu dla wielu dostawców modeli i narzędzi.

## Produkt

**Agent Policy Gateway** jest lekkim API typu policy-as-code. Agent lub aplikacja wywołuje `POST /v1/decisions`, a gateway ocenia operację przed jej wykonaniem.

Decyzja może być:

- `allow` — operacja dozwolona,
- `deny` — operacja odrzucona,
- `review` — wymagana akceptacja człowieka.

Każda decyzja jest zapisywana w dzienniku audytowym.

## Model monetyzacji

1. **Free** — lokalnie, 1 000 decyzji/miesiąc.
2. **Pro — 29 EUR/miesiąc** — 100 000 decyzji, polityki zespołowe, eksport audytu.
3. **Business — 149 EUR/miesiąc** — 1 mln decyzji, SSO, zespoły, limity kosztowe, retencja audytu 12 miesięcy.
4. **Usage overage** — opłata za dodatkowe decyzje.
5. **Enterprise** — umowa roczna, prywatne wdrożenie, SLA i integracje compliance.

Rekomendowany model jest hybrydowy: niska opłata bazowa + zużycie, ponieważ agentic SaaS przesuwa się w stronę usage/outcome pricing. citeturn0search1

## Architektura

```text
Agent / SaaS / MCP Tool
          |
          v
   POST /v1/decisions
          |
          v
   Policy Engine
    /    |     \
 allow review deny
    \     |      /
      Audit Store
          |
          v
     JSONL Audit Log
```

## Stos technologiczny

- Node.js 22+
- TypeScript 5+
- natywny `node:http` — brak zbędnego frameworka w warstwie rdzeniowej
- `node:test` — testy bez dodatkowego runnera
- JSONL — prosty, przenośny zapis audytowy MVP
- Docker — opcjonalne uruchomienie kontenera

## Uruchomienie

```bash
npm install
npm run build
npm test
npm start
```

Serwer domyślnie nasłuchuje na `127.0.0.1:8787`.

Przykład decyzji:

```bash
curl -X POST http://127.0.0.1:8787/v1/decisions \
  -H 'content-type: application/json' \
  -d '{"agentId":"sales-agent","actorId":"user-123","action":"send_email","resource":"customer@example.com","risk":"medium","estimatedCostEur":0.02}'
```

## Następne moduły komercyjne

- panel webowy,
- logowanie i RBAC,
- PostgreSQL,
- Redis dla rate-limitingu,
- OIDC/SSO,
- webhooki zatwierdzające,
- integracje MCP,
- konektory do Slack, Gmail, CRM i ERP,
- billing Stripe,
- multi-tenancy,
- podpisywanie i szyfrowanie dzienników audytowych.

Rdzeń polityk pozostaje niezależny od dostawcy modelu.
