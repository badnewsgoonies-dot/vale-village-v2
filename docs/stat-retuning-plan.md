# Vale Village v2 – Stat Retuning Plan

**Author:** Codex (@codex)  
**Context:** Handoff from Claude (`topic=handoff choice=@codex`)  
**Goal:** Bring hero/enemy stats closer to `docs/balance-spec.md` (low numbers, 2–4 hit TTK, deterministic crits every 10th hit) without rewriting the combat formulas.

---

## 1. Scaling Strategy (High Level)

- **Keep formulas and systems as‑is:**
  - Damage: `physical = basePower + ATK - DEF×0.5`, `psynergy = (basePower + MAG - DEF×0.3) × elementModifier`.
  - Element multipliers: 1.5× advantage, 0.67× disadvantage, 1.0× neutral.
  - Deterministic crits: every 10th basic attack crits (queueBattleSlice / QueueBattleView).
- **Change only numbers in data definitions**:
  - Heroes: `src/data/definitions/units.ts`.
  - Enemies: `src/data/definitions/enemies.ts`.
  - Ability base powers: `src/data/definitions/abilities.ts` (phase 2).
- **Targets (from `docs/balance-spec.md`):**
  - Hero HP: 20–50 across early → late game.
  - Enemy HP: 15–60 for standard foes at equal level.
  - Standard enemy dies in 2–4 hits; bosses in 10–15.
  - No one‑shots at full HP; heals restore ~50–70% of one enemy hit.

---

## 2. Concrete Scaling Formulas

These are the exact transforms I would apply to the current data.

### 2.1 Hero Stat Scaling (units.ts)

Let `HP₀, ATK₀, DEF₀` be current **baseStats** at level 1, and `ΔHP, ΔATK, ΔDEF` be current **growthRates**.

**Base stats (level 1):**
- `HP₁ = round(HP₀ ÷ 4)`  
  - Example: 120 → 30, 80 → 20, 90 → 23.
- `ATK₁ = max(4, round(ATK₀ ÷ 2))`
- `DEF₁ = max(4, round(DEF₀ ÷ 2))`

**Growth per level:**
- `ΔHP₁ = clamp(round(ΔHP ÷ 8), 2, 4)`  
  (Early heroes roughly +2–4 HP/level, matching spec’s ~3/level.)
- `ΔATK₁ = clamp(round(ΔATK ÷ 2), 1, 3)`
- `ΔDEF₁ = clamp(round(ΔDEF ÷ 2), 1, 3)`

Role tweaks (manual overrides after bulk scaling):
- Tanks (Adept, Sentinel, Felix): `HP₁ += 2`, `ΔHP₁ += 1`, `DEF₁ += 1`.
- Glass‑cannon casters (War Mage, Stormcaller): `ATK₁ += 1` or `MAG` focus, `HP₁ –= 2`.
- Rogues (Ranger, Tyrell): `SPD` kept high; HP slightly below average.

This keeps relative differences but pulls everyone into the 20–50 HP range and ~6–12 ATK/DEF by midgame.

### 2.2 Enemy Stat Scaling (enemies.ts)

Let `HP₀, ATK₀, DEF₀` be current **stats**.

**Normal enemies (no “5x HP” comment, HP₀ ≤ 150):**
- `HP₁ = clamp(round(HP₀ ÷ 2), 15, 60)`
- `ATK₁ = max(3, round(ATK₀ ÷ 2))`
- `DEF₁ = max(2, round(DEF₀ ÷ 2))`

**Inflated enemies (comments like “Increased from 55 (5x) for longer battles”):**
- Undo 5× inflation, then apply half‑scale:
  - `HP_base = round(HP₀ ÷ 5)`
  - `HP₁    = clamp(round(HP_base ÷ 2 × 3), 25, 60)`  
    (Roughly restores them to “chunky but mortal” 40–60 HP range.)
- `ATK₁ = max(4, round(ATK₀ ÷ 2))`
- `DEF₁ = max(3, round(DEF₀ ÷ 2))`

Bosses and elites:
- Start from normal/inflated rule, then:
  - Boss HP: multiply `HP₁` by 2–3 (target 80–150 HP) to hit 10–15‑turn fights.
  - Boss ATK: keep at or slightly above hero ATK at same level so they threaten 3‑hit KOs.

### 2.3 Ability Power Adjustments (phase 2)

Once stats are rescaled:
- Single‑target basic abilities (`STRIKE`, `HEAVY_STRIKE`, element 1‑target psynergy):
  - Tune `basePower` so typical damage ≈ 30–40% of equal‑level enemy HP.
- AoE abilities (`QUAKE`, `CHAIN_LIGHTNING`):
  - Target ≈ 20–25% of each enemy’s HP (per hit).
- Status‑on‑hit abilities:
  - Keep basePower slightly below raw damage skills (trade damage for status).

We can finalize these using a small script that plugs in effective stats and reports average damage vs. sample enemies.

---

## 3. Sample Before/After – Heroes

All values are **baseStats** at level 1.

### 3.1 ADEPT (Defensive Tank)

| Stat | Current | Proposed (HP₀/4, ATK₀/2, DEF₀/2 + tank tweaks) |
|------|---------|-----------------------------------------------|
| HP   | 120     | **30** (120 ÷ 4)                             |
| ATK  | 14      | **7**  (14 ÷ 2)                              |
| DEF  | 16      | **9**  (16 ÷ 2 = 8, +1 tank bonus)           |

Growth (per level):
- Current: `ΔHP=25, ΔATK=3, ΔDEF=4`
- Proposed: `ΔHP=4` (25 ÷ 8 ≈ 3.1 → +1 tank), `ΔATK=2` (3 ÷ 2), `ΔDEF=3` (4 ÷ 2, clamped).

### 3.2 WAR MAGE (Elemental Mage)

| Stat | Current | Proposed |
|------|---------|----------|
| HP   | 80      | **20** (80 ÷ 4) |
| ATK  | 10      | **5**  (10 ÷ 2) |
| DEF  | 8       | **4**  (8 ÷ 2)  |

Growth:
- Current: `ΔHP=15, ΔATK=2, ΔDEF=2`
- Proposed: `ΔHP=2` (15 ÷ 8 ≈ 1.9), `ΔATK=1`, `ΔDEF=1`.

### 3.3 MYSTIC (Healer)

| Stat | Current | Proposed |
|------|---------|----------|
| HP   | 90      | **23** (90 ÷ 4 ≈ 22.5 → 23) |
| ATK  | 8       | **4**  (8 ÷ 2)              |
| DEF  | 10      | **5**  (10 ÷ 2)             |

Growth:
- Current: `ΔHP=18, ΔATK=1, ΔDEF=2`
- Proposed: `ΔHP=2` (18 ÷ 8 ≈ 2.25), `ΔATK=1`, `ΔDEF=1`.

These land early heroes near the spec’s “Hero HP ~20, ATK ~8, DEF ~5–8” band once level bonuses and equipment are applied.

---

## 4. Sample Before/After – Enemies

All values from `src/data/definitions/enemies.ts`.

### 4.1 MERCURY_SLIME (L1, baseline)

Current:
- HP 40, ATK 4, DEF 5

Proposed (normal enemy rule, ÷2):
- `HP₁ = clamp(round(40 ÷ 2), 15, 60) = 20`
- `ATK₁ = round(4 ÷ 2) = 2`
- `DEF₁ = round(5 ÷ 2) = 3`

This makes the slime ~2–3 hits to kill for a level‑1 hero using basic attacks.

### 4.2 VENUS_WOLF (L1, inflated 5×)

Current:
- HP 275, ATK 16, DEF 7  
  (Comment: “Increased from 55 (5x) for longer battles”.)

Proposed (inflated rule):
- Undo inflation: `HP_base = round(275 ÷ 5) = 55`
- Scale slightly for low‑number spec: `HP₁ = clamp(round(55), 25, 60) = 55`
- `ATK₁ = round(16 ÷ 2) = 8`
- `DEF₁ = round(7 ÷ 2) = 4`

Result: Venus Wolf is now a chunky early‑game threat (~3–4 hits) instead of a 20+ hit sponge.

### 4.3 MARS_BANDIT (L2)

Current:
- HP 60, ATK 13, DEF 6

Proposed (normal rule):
- `HP₁ = clamp(round(60 ÷ 2), 15, 60) = 30`
- `ATK₁ = round(13 ÷ 2) = 7`
- `DEF₁ = round(6 ÷ 2) = 3`

This leaves the bandit slightly tougher than a slime but well within the 2–4 hit window for early heroes.

---

## 5. Interaction with Deterministic Crits

The queue battle UI already implements **every 10th basic attack as a crit**:
- `queueBattleSlice.ts` initializes `critThresholds[unit.id] = 10`, `critCounters[unit.id] = 0`.
- `QueueBattleView.tsx` increments the counter for each basic attack `ability` event from player units and triggers crit when `nextCount ≥ threshold` (no RNG).
- `CritMeter` / `BattlePortraitRow` show `currentHits/threshold` and flash when ready.

Implications for tuning:
- With new, lower HP, crits become a **predictable spike** rather than a random swing.
- Plan: keep crit multiplier as‑is (in damage formulas) but:
  - Ensure a crit on a standard enemy does **not** exceed 80–90% of its HP from full.
  - Use crits to finish enemies slightly early (2 hits + 1 crit) rather than turning every 10th turn into a one‑shot.

We can validate by sampling effective stats post‑retune and simulating sequences of 10 basic attacks per hero.

---

## 6. Next Steps

1. **Batch apply scaling formulas** to `units.ts` and `enemies.ts` (script or manual pass), keeping comments that reference old values but adding “retuned in v2” notes.
2. **Re‑run balance smoke tests**:
   - Quick CLI harness using `BattleService` + `testBattle.ts` to measure average hits‑to‑kill for representative encounters.
   - Verify targets from `docs/balance-spec.md` (2–4 hits, 4–8 turns) hold roughly true.
3. **Phase 2:** Adjust `abilities.ts` base powers and key boss stats once initial TTK feels good.

This document is intended as the concrete blueprint for that retuning pass; no code has been changed yet.

