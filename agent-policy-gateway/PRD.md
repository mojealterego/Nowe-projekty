# PRD — Agent Policy Gateway

## 1. Problem

Firmy wdrażają agentów AI, ale wraz ze wzrostem autonomii rośnie ryzyko niekontrolowanych działań, kosztów i dostępu do danych. SMB wskazują bezpieczeństwo i prywatność jako jedną z głównych barier adopcji agentów. citeturn0search2

## 2. Użytkownik docelowy

- właściciel SMB,
- COO/Operations Manager,
- CTO małej firmy,
- integrator automatyzacji,
- twórca aplikacji wykorzystującej agentów AI.

## 3. Job-to-be-done

„Chcę pozwolić agentowi wykonywać realną pracę, ale przed każdą operacją ryzykowną chcę mieć przewidywalną politykę, możliwość zatwierdzenia i pełny ślad audytowy.”

## 4. Zakres MVP

### Wejście

`agentId`, `actorId`, `action`, `resource`, `risk`, `estimatedCostEur`, `metadata`.

### Reguły

- dopasowanie operacji do polityki,
- limit ryzyka,
- limit kosztu,
- decyzja `allow` / `deny` / `review`,
- identyfikator decyzji.

### Audyt

Każda decyzja jest zapisywana jako kompletne zdarzenie JSONL.

## 5. Poza MVP

- wielodzierżawność,
- baza SQL,
- SSO,
- panel administracyjny,
- workflow zatwierdzania,
- webhooki,
- billing,
- integracje z dostawcami modeli.

## 6. KPI

- liczba chronionych operacji,
- odsetek operacji wymagających review,
- liczba zablokowanych operacji,
- średni koszt operacji agenta,
- czas od żądania do decyzji,
- MRR na aktywną organizację,
- retencja organizacji po 90 dniach.

## 7. Kryteria sukcesu

MVP musi zwracać deterministyczną decyzję dla prawidłowego żądania, zapisywać każdy wynik w audycie i działać bez zależności od konkretnego dostawcy LLM.

## 8. Ryzyka biznesowe

Największym ryzykiem jest konkurencja ze strony platform agentowych posiadających własne mechanizmy bezpieczeństwa. Strategią obronną jest niezależność od modelu, prosty deployment, policy-as-code oraz możliwość używania gatewaya między wieloma dostawcami.

## 9. Strategia wejścia na rynek

1. Open-source rdzeń policy engine.
2. Darmowy self-hosted gateway.
3. Płatny cloud z panelem i audytem.
4. Integracje MCP jako kanał dystrybucji.
5. Partnerstwa z integratorami automatyzacji SMB.
