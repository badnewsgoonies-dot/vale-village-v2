# Progression Schema (Vale Village v2)

This doc is the single source of truth for **what the player earns**, **when they earn it**, and **how the UI should communicate it**.

## 1) Core Loop

1. Explore overworld → trigger encounter.
2. Win battle → show Rewards screen.
3. Rewards screen communicates:
   - XP gained (and how it’s split)
   - Gold gained
   - Equipment gained (fixed or choose-one)
   - Level-ups (stat gains + new abilities)
   - Story rewards (e.g., newly collected Djinn)

## 2) Rewards (Battle Victory)

### Sources of truth
- Encounter reward data: `src/data/definitions/encounters.ts`
- Reward math + distribution: `src/core/algorithms/rewards.ts`
- Post-battle processing: `src/core/services/RewardsService.ts`

### What a victory can award
- **XP**: deterministic per encounter.
- **Gold**: deterministic per encounter.
- **Equipment**:
  - none / fixed drop / choose-one (deterministic options)
- **Story-driven rewards** (not handled by RewardsService):
  - Djinn collection + recruit joins are currently handled via story/dialogue flows.

## 3) XP Rules

### Split rule
- **XP is split evenly across the active party** (1–4 units).
- Units still receive XP **even if knocked out** at battle end.

### Level cap
- Units stop gaining XP at **level 20** (current cap).

## 4) Level Ups → Ability Unlocks

### How unlocks work
- When a unit’s level increases, `addXp()` returns any newly unlocked ability IDs.
- Ability definitions (name/type/cost/description) live in:
  - `src/data/definitions/abilities.ts`
  - `src/data/definitions/djinnAbilities.ts`

### How the player uses unlocked abilities
- In battle: **Actions → PSYNERGY** → select ability → select target.
- Rewards screen should show **ability name + short details**, not raw IDs.

## 5) Djinn (Team-wide)

### Key rule
- Djinn are **team-wide**, not per-unit:
  - Up to **3 equipped** at a time.
  - Apply bonuses and unlock Djinn abilities.

### How to manage
- Pause menu: **Esc → Djinn Collection (D)**.
- Pre-battle: choose which Djinn travel into battle.
- In battle: use **Summon** flow to spend Djinn.

## 6) Battle Tower (Current Behavior)

- The Tower is currently a **practice/sandbox** run with its own temporary economy.
- Milestone rewards (equipment/djinn/recruits) are committed back to campaign on exit:
  - `src/ui/state/towerSlice.ts`
- Campaign **XP/Gold catch-up** via Tower is not implemented yet (decision required).

## 7) UX Requirements (Non-negotiables)

- The player must always see:
  - **what** they earned,
  - **why** they earned it,
  - and **how to use** the new thing immediately (1-line instruction).

