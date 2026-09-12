# ARROW HEIST

Android-first hybrid-casual puzzle game designed around a highly legible core mechanic, short sessions and hybrid monetization.

## Product thesis

**Solve the route. Beat the security. Escape with the loot.**

The game combines an arrow-routing puzzle with a lightweight heist layer. A player should understand the basic rule in seconds, complete an initial level in under a minute, and immediately understand why the next level is more difficult.

## Target platform

- Android first
- Portrait orientation
- Phones first; tablets supported later
- Low-end device compatibility is a product requirement

## Core loop

1. Read the board.
2. Tap/select an arrow path.
3. Resolve movement.
4. Avoid guards, lasers, cameras and alarms.
5. Reach the vault/loot.
6. Escape.
7. Receive coins, stars and progression XP.
8. Upgrade cosmetics/utility and start the next heist.

## Session design

- Tutorial level: <30 seconds
- Normal level: 30–90 seconds
- Challenge level: 1–3 minutes
- Daily challenge: <3 minutes

## MVP pillars

### Puzzle
- Directional arrows
- Walls
- Locked tiles
- One-way gates
- Switches
- Exit/goal

### Heist
- Guard patrols
- Security cameras
- Laser zones
- Alarm tiles
- Vault
- Escape route

### Progression
- World map
- Level stars
- Coins
- Cosmetic thief skins
- Vault skins
- Daily challenge

### Monetization
- Rewarded ad for optional hint
- Rewarded ad for retry/revive where appropriate
- Interstitials only at controlled frequency and never during active play
- No-Ads purchase
- Cosmetic/IAP bundles
- Seasonal pass after retention is proven

## Design constraints

- No pay-to-win in competitive/daily leaderboard systems.
- No forced ad before the player understands the core loop.
- Gameplay must remain readable without audio.
- Every level must be solvable deterministically.
- The first 10 minutes must contain no unnecessary meta complexity.

## Success criteria for soft launch

The first objective is not revenue scale. It is validation of the retention and monetization loop.

Track at minimum:

- tutorial completion
- D1/D3/D7/D14/D30 retention
- level completion rate
- fail/retry rate
- average session length
- sessions per DAU
- rewarded-ad opt-in rate
- ad ARPDAU
- payer conversion
- IAP ARPPU
- LTV by acquisition cohort
- crash-free users
- frame-time/device distribution

Scale acquisition only after cohort economics demonstrate a credible path to positive LTV/CAC.

## Architecture direction

Recommended initial stack:

- Kotlin
- Jetpack Compose for menus/HUD and Android-native surfaces
- LibGDX or another lightweight 2D runtime for the deterministic game scene
- Room for local progression/state
- Play Games Services for achievements/leaderboards where useful
- Google Play Billing for IAP
- Firebase Crashlytics + Analytics or an equivalent privacy-conscious telemetry layer
- Remote Config for live tuning after launch

The game simulation must be deterministic and separated from rendering, monetization and analytics.

## Repository roadmap

- `PRD.md` — product specification
- `GAMEPLAY-SPEC.md` — exact mechanics and level rules
- `ECONOMY.md` — currencies, progression and monetization
- `TECHNICAL-ARCHITECTURE.md` — implementation architecture
- `ANALYTICS.md` — event taxonomy and KPI definitions
- `LEVEL-DESIGN.md` — level-generation and handcrafted-level strategy
- `ROADMAP.md` — production phases
