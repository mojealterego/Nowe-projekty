# ARROW HEIST — PRD v0.1

## 1. Product definition

ARROW HEIST is a portrait Android hybrid-casual puzzle game in which the player routes a thief through compact security layouts. The puzzle determines movement; the heist layer adds timing, risk and reward.

The product must be understandable from one gameplay clip without requiring narrative exposition.

## 2. Target player

Primary:
- casual Android players aged approximately 18–44
- players who enjoy puzzle, escape, maze and light strategy mechanics
- users who prefer sessions under 3 minutes

Secondary:
- puzzle players who respond to collection/progression
- players acquired through short-form video ads

## 3. Core fantasy

The player should feel clever rather than mechanically fast:

> "I saw the trap, solved the route and got away."

## 4. First-session funnel

### 0:00–0:20
Show one rule: arrows determine movement.

### 0:20–1:00
Complete three deterministic levels.

### 1:00–2:30
Introduce the first guard/camera.

### 2:30–5:00
Introduce vault + escape.

### 5:00–10:00
Unlock first cosmetic and daily challenge entry point.

Do not introduce multiple currencies, clans, energy timers or complex menus during the first 10 minutes.

## 5. Core mechanics

### Arrow tile
A tile points in one direction. When activated, the thief follows that direction until a rule stops or redirects movement.

### Static obstacle
Blocks movement.

### Gate
Opens when its linked switch is activated.

### Switch
Changes one or more board states.

### Camera
Detects the thief along a defined line/cone. Detection can trigger an alarm.

### Guard
Follows a deterministic patrol route. Later levels introduce conditional patrol states.

### Laser
Active hazard occupying a known tile/line pattern.

### Vault
Primary objective. Reaching it is not always sufficient; the player must also reach an exit.

### Exit
Completes the heist after loot has been acquired.

## 6. Failure states

A run fails when:
- the thief is captured,
- an alarm reaches its terminal state,
- a level-specific timer expires.

Failure must resolve quickly and offer an immediate retry.

## 7. Level structure

### World 1 — Training Grounds
1. arrows
2. walls
3. dead ends
4. simple switches
5. first vault
6. first guard
7. camera
8. combined hazards
9. escape requirement
10. first heist finale

### World 2 — Night Museum
Introduce:
- multiple exits
- moving guards
- timed gates
- optional loot

### World 3 — Bank District
Introduce:
- security layers
- keycards
- multi-stage vaults

Further worlds are gated by production data, not by the initial design document.

## 8. Three-star scoring

Each completed level receives 0–3 stars based on:
- completion
- optional loot
- efficiency / move count / alarm state depending on level

Stars unlock content; they must not be sold directly.

## 9. Daily challenge

One deterministic challenge per day.

Requirements:
- same board for all players
- leaderboard-compatible score
- no paid gameplay advantage
- shareable result card

## 10. Meta progression

Primary progression:
- levels
- worlds
- stars

Secondary progression:
- thief cosmetics
- vault cosmetics
- escape effects

Utility boosts should be tested only after the base game proves strong retention. The MVP should avoid power creep.

## 11. Monetization design

### Rewarded ads
Optional only:
- reveal one legal move
- provide a limited hint
- post-failure bonus

### Interstitial ads
Only between suitable level boundaries and subject to frequency caps. Never interrupt an active puzzle.

### IAP
- Remove Ads
- cosmetic packs
- starter cosmetic bundle
- seasonal cosmetic pass after live retention validation

## 12. Economy

### Coins
Earned through play and optional rewarded ads. Used for cosmetic unlocks.

### Premium currency
Not required for MVP. Avoid introducing a second currency until player behavior demonstrates a real need.

## 13. Viral/UA design

Every level should produce a visually legible failure or success moment suitable for a 5–15 second vertical video.

Candidate hooks:
- "Can you escape before the camera turns?"
- "99% fail this vault."
- "Only one route works."

These are creative hypotheses, not claims to be used deceptively in advertising.

## 14. Accessibility

- color must never be the only signal
- high-contrast symbols
- haptic feedback optional
- reduced-motion setting
- scalable UI text where practical
- gameplay understandable without sound

## 15. Technical acceptance criteria for MVP

- deterministic simulation
- 60 FPS target on supported mid-range devices
- graceful performance degradation on low-end devices
- offline play for core levels
- cloud services never required to start a level
- crash-free session target >= 99.5% during soft launch
- no gameplay state loss after process death

## 16. MVP scope

Build first:
1. game board
2. arrow movement engine
3. collision/obstacle system
4. switches/gates
5. guard patrol
6. camera detection
7. vault/exit
8. 20 handcrafted levels
9. stars
10. local save
11. basic analytics
12. rewarded ad integration behind a feature flag
13. one cosmetic set
14. daily challenge prototype

Do not build initially:
- clans
- PvP
- complex story campaign
- procedural infinite world
- premium currency
- user-generated levels
- large inventory

## 17. Validation gates

### Gate A — mechanic
Players understand the arrow rule without instructions.

### Gate B — fun
Players voluntarily retry failed levels.

### Gate C — retention
Soft-launch cohorts show credible D1/D7 behavior against genre benchmarks.

### Gate D — monetization
Rewarded ads and IAP add value without materially damaging retention.

### Gate E — scale
UA test shows a plausible path to positive LTV/CAC.

No major content expansion should happen before Gate C.
