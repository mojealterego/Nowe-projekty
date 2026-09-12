# Agent Ops Control Tower

## Koncepcja
Panel operacyjny dla firm posiadających wiele agentów AI. Łączy rejestr agentów, stan połączeń, koszty, wykonane zadania, błędy, wymagane zatwierdzenia i ślad audytowy w jednym miejscu.

## Luka rynkowa
Rynek szybko przechodzi od pojedynczych asystentów do agentów wykonujących pracę w wielu systemach. OpenAI raportuje wzrost wykorzystania pracy agentowej w przedsiębiorstwach, a Gartner wskazuje dużą lukę między oczekiwaniami a faktycznym wdrożeniem agentów. Jednocześnie Gartner szacuje, że do 2030 r. nawet 234 mld USD wydatków na aplikacje enterprise będzie narażone na agentic arbitrage. citeturn0news18turn0search2turn0search0

Najbardziej atrakcyjna nisza nie polega więc na budowaniu kolejnego agenta, lecz na warstwie **operacyjnej pomiędzy agentami a przedsiębiorstwem**: obserwowaniu, zatwierdzaniu, rozliczaniu i egzekwowaniu polityk.

## Produkt
- katalog agentów i ich właścicieli;
- heartbeat i status online/offline/degraded;
- kolejka zadań;
- historia wykonania;
- koszty per agent, workflow i klient;
- approval inbox dla operacji wymagających człowieka;
- alerty SLA i błędów;
- audyt działań;
- podstawowe polityki dostępu;
- API-first oraz gotowość do integracji MCP/webhook.

## Model biznesowy
- Free: 3 agenty;
- Pro: 39 EUR/mies.;
- Team: 149 EUR/mies.;
- Business: 499 EUR/mies.;
- Enterprise: indywidualnie;
- dodatkowo usage za wykonania ponad limit.

Model hybrydowy odpowiada kierunkowi rynku, w którym klasyczne seat-based SaaS przechodzi w stronę usage/outcome-based pricing. citeturn0search3

## MVP
Pierwszy etap: dashboard, rejestr agentów, event ingestion, statusy, approval queue, audit log i metryki kosztowe.

## Stack
- Next.js + TypeScript;
- PostgreSQL;
- Redis/BullMQ;
- API REST;
- WebSocket/SSE dla zdarzeń;
- Docker;
- testy Vitest + Playwright.

## Ocena
**Potencjał: 9/10**

Przewaga: produkt jest komplementarny wobec agentów różnych dostawców, więc nie wymaga wygrania wojny o najlepszy model językowy.