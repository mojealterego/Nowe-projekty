# ARROW HEIST — GAMEPLAY SPEC v0.1

## Board model

The MVP board is a rectangular grid. Every cell has a type and optional state.

Suggested initial size: 7x9 cells in portrait presentation.

## Movement resolution

1. Player selects the thief's available route/action.
2. The simulation advances in discrete steps.
3. Each step evaluates the destination cell.
4. Obstacles, gates and hazards resolve deterministically.
5. Guard/camera state is evaluated after the player's movement according to the level's turn order.
6. Win/fail is checked.

The exact turn order must be fixed globally for the MVP and never vary between levels without an explicit rule.

## Puzzle principles

Every handcrafted level must have:
- one intended solution
- zero accidental soft-locks
- a readable visual explanation of the failure
- a short retry path
- at least one opportunity for mastery beyond simply discovering the solution

## Difficulty curve

### Tier 1
Single mechanic.

### Tier 2
Two mechanics combined.

### Tier 3
Timing/observation introduced.

### Tier 4
Multiple interacting systems.

### Tier 5
Optional loot and efficiency optimization.

Difficulty should come from reasoning, not arbitrary hidden information.

## Level authoring format

Levels should be data-driven. The runtime loads a versioned level definition containing:
- dimensions
- cell layout
- entity positions
- entity parameters
- linked switches/gates
- guard paths
- camera cones
- objectives
- scoring rules
- tutorial flags

This allows remote/content iteration without rewriting simulation code.

## Puzzle readability

Before the player acts, they must be able to identify:
- the thief
- the objective
- legal movement
- hazards
- interactive objects
- the exit

Animation may communicate state changes but must not be required to infer basic rules.

## Fail feedback

On failure:
1. freeze the simulation briefly;
2. highlight the causal hazard;
3. show concise feedback;
4. provide Retry as the primary action.

Do not force the player through a long failure animation.

## Reward cadence

Early levels should deliver frequent completion rewards. Later levels should increase decision density rather than simply increasing board size.

## Daily challenge rules

Daily boards are deterministic and identical for all players in the same ruleset/version.

Leaderboard score should be based on an auditable combination of:
- completion
- moves
- optional loot
- alarm state

No paid item can alter the daily leaderboard result.

## Content pipeline

MVP target:
- 20 handcrafted levels
- 5 tutorial/intro levels
- 10 standard levels
- 5 challenge levels

Then expand in batches of 10–20 levels based on telemetry.

## Future systems — explicitly deferred

- procedural generation
- user-generated levels
- asynchronous competition
- PvP
- narrative dialogue system
- complex stealth AI

These are expansion options, not MVP dependencies.
