# Balance Simulation Workflow

Guide for running deterministic battle simulations to validate and tune game balance.

---

## Overview

Vale Village v2 uses a **fully deterministic combat system** (no RNG in damage, counter-based crits, seeded PRNG for status effects). This enables running thousands of identical battles to measure balance metrics precisely.

### Key Tools
- `pnpm sim:battle` - CLI for batch simulations
- `BattleSimRunner` - Headless battle executor
- `docs/balance-scenarios.json` - Scenario definitions
- `docs/sims/` - Generated reports

---

## 1. Defining Scenarios

Scenarios define battle conditions to test. Create or edit `docs/balance-scenarios.json`:

```json
{
  "scenarios": [
    {
      "id": "early-game-standard",
      "name": "L1 Party vs House 1",
      "encounterId": "house-01",
      "playerTeam": {
        "units": ["adept"],
        "level": 1,
        "equipment": "starter"
      },
      "expectedWinRate": [0.85, 0.95],
      "expectedTurns": [2, 4]
    },
    {
      "id": "mid-game-elite",
      "name": "L5 Party vs House 10",
      "encounterId": "house-10",
      "playerTeam": {
        "units": ["adept", "war-mage", "mystic"],
        "level": 5,
        "equipment": "act1-drops"
      },
      "expectedWinRate": [0.70, 0.85],
      "expectedTurns": [5, 8]
    },
    {
      "id": "boss-overseer",
      "name": "L8 Full Party vs Overseer",
      "encounterId": "house-20",
      "playerTeam": {
        "units": ["adept", "war-mage", "mystic", "ranger"],
        "level": 8,
        "equipment": "act3-drops",
        "djinn": ["flint", "forge", "breeze", "fizz"]
      },
      "expectedWinRate": [0.50, 0.70],
      "expectedTurns": [10, 15]
    },
    {
      "id": "tower-floor-10",
      "name": "Tower F10 (Sentinel Boss)",
      "encounterId": "house-08",
      "playerTeam": {
        "units": ["adept", "war-mage", "mystic"],
        "level": 4,
        "equipment": "tower-rental"
      },
      "expectedWinRate": [0.60, 0.80],
      "expectedTurns": [6, 10]
    }
  ]
}
```

### Scenario Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (used in CLI) |
| `name` | Yes | Human-readable description |
| `encounterId` | Yes | Reference to encounters.ts |
| `playerTeam.units` | Yes | Array of unit IDs |
| `playerTeam.level` | Yes | Party level |
| `playerTeam.equipment` | No | Equipment preset or "none" |
| `playerTeam.djinn` | No | Djinn loadout |
| `expectedWinRate` | No | [min, max] acceptable range |
| `expectedTurns` | No | [min, max] average turns |

### Scenario Categories

| Category | Description | Example Scenarios |
|----------|-------------|-------------------|
| **Early Game** | L1-3, Houses 1-5 | tutorial, first-boss |
| **Mid Game** | L4-7, Houses 6-14 | act2-standard, mini-boss |
| **Late Game** | L8+, Houses 15-20 | overseer, finale |
| **Tower** | Floor-specific | tower-f5, tower-f15, tower-f30 |
| **Stress Test** | Edge cases | under-leveled, no-djinn |

---

## 2. Running Simulations

### Basic Usage

```bash
# Run 100 battles for a specific scenario
pnpm sim:battle --scenario early-game-standard --runs 100

# Run with specific seed (for reproducibility)
pnpm sim:battle --scenario mid-game-elite --runs 1000 --seed 12345

# Run all scenarios
pnpm sim:battle --all --runs 100

# Quick smoke test (10 runs each)
pnpm sim:battle --all --runs 10
```

### CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `--scenario <id>` | Run specific scenario | - |
| `--all` | Run all defined scenarios | false |
| `--runs <n>` | Number of battles per scenario | 100 |
| `--seed <n>` | Base RNG seed | random |
| `--output <dir>` | Output directory | docs/sims/ |
| `--format <type>` | json, md, or both | both |
| `--verbose` | Show per-battle details | false |

### Output Files

Each run generates:
- `docs/sims/<scenario-id>.json` - Raw metrics data
- `docs/sims/<scenario-id>.md` - Human-readable summary

---

## 3. Interpreting Metrics

### Key Metrics

| Metric | Target | Action if Off |
|--------|--------|---------------|
| **Win Rate** | Per scenario spec | Adjust enemy stats or player power |
| **Avg Turns** | 4-8 standard, 10-15 boss | Tune HP pools |
| **TTK (Time-to-Kill)** | 2-4 hits standard | Adjust ATK/DEF ratio |
| **Crit Frequency** | 10% (every 10th hit) | Verify counter working |
| **Status Application** | Per ability design | Check status chance values |
| **Status Break Rate** | 25% paralyze, 30% freeze | PRNG validation |

### Example Report

```markdown
# Simulation: early-game-standard
**Runs:** 1000 | **Seed:** 12345

## Results
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Win Rate | 91.2% | 85-95% | ✅ PASS |
| Avg Turns | 3.1 | 2-4 | ✅ PASS |
| Median Turns | 3 | - | - |
| Total Damage Dealt | 45.2 avg | - | - |
| Total Damage Taken | 12.8 avg | - | - |
| Crits Landed | 4.5 avg | - | - |

## Turn Distribution
| Turns | Count | Percentage |
|-------|-------|------------|
| 2 | 234 | 23.4% |
| 3 | 512 | 51.2% |
| 4 | 198 | 19.8% |
| 5+ | 56 | 5.6% |

## Notes
- Win rate within expected band
- Most battles resolve in 3 turns (sweet spot)
```

### Red Flags

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Win rate < 50% | Player underpowered | Boost ATK or nerf enemy DEF |
| Win rate > 95% | Encounter too easy | Increase enemy HP/ATK |
| Avg turns < 2 | One-shot builds | Cap max damage per hit |
| Avg turns > 10 | Heal-stall or low damage | Reduce healing or boost ATK |
| Crit rate ≠ 10% | Counter bug | Check critCounter logic |
| Status never breaks | PRNG issue | Verify break chance code |

---

## 4. Tuning Stats

### Workflow

1. **Identify problem** via simulation metrics
2. **Hypothesize fix** (e.g., "reduce Mercury Slime HP by 5")
3. **Edit data file** (`src/data/definitions/enemies.ts`)
4. **Re-run simulation** with same seed
5. **Compare results** - did metric improve?
6. **Iterate** until target met

### Common Adjustments

| Goal | Adjustment |
|------|------------|
| Increase win rate | Lower enemy HP or ATK |
| Decrease win rate | Raise enemy HP or ATK |
| Shorten battles | Increase player ATK or lower enemy HP |
| Lengthen battles | Increase enemy HP or DEF |
| Make element matter more | Increase element modifier (1.5 → 1.75) |
| Reduce crit impact | Lower crit damage multiplier |

### Stat Tuning Reference

From `balance-spec.md`:

```
Physical Damage = max(1, basePower + ATK - (DEF × 0.5))
Psynergy Damage = max(1, (basePower + MAG - (DEF × 0.3)) × elementMod)
```

**Key levers:**
- `basePower` - Ability base damage (affects all users)
- Unit `ATK/MAG` - Per-unit scaling
- Enemy `HP/DEF` - Survivability
- `elementMod` - 1.5×/1.0×/0.67× advantage system

---

## 5. CI Integration (Optional)

Add simulation checks to CI pipeline:

```yaml
# .github/workflows/balance-check.yml
name: Balance Check

on: [push, pull_request]

jobs:
  sim-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm sim:battle --all --runs 10 --output /tmp/sims
      - name: Verify metrics
        run: |
          # Check all scenarios passed expected bounds
          node scripts/check-sim-results.js /tmp/sims
```

### CI Thresholds

Minimal runs (10) catch major regressions without slowing CI:
- Win rate within ±20% of expected
- Avg turns within ±2 of expected
- No crashes or infinite loops

---

## 6. Determinism Validation

### Verify Same Seed = Same Result

```bash
# Run twice with same seed
pnpm sim:battle --scenario early-game-standard --runs 1 --seed 99999 --output /tmp/a
pnpm sim:battle --scenario early-game-standard --runs 1 --seed 99999 --output /tmp/b

# Compare outputs (should be identical)
diff /tmp/a/early-game-standard.json /tmp/b/early-game-standard.json
```

### Automated Test

```typescript
// tests/sim/determinism.test.ts
import { describe, it, expect } from 'vitest';
import { runSimulation } from '../../scripts/run-battles';

describe('Determinism', () => {
  it('same seed produces identical results', async () => {
    const seed = 12345;
    const scenario = 'early-game-standard';

    const result1 = await runSimulation(scenario, { seed, runs: 10 });
    const result2 = await runSimulation(scenario, { seed, runs: 10 });

    expect(result1).toEqual(result2);
  });
});
```

---

## 7. RNG Documentation

### Seeded RNG Sources

All randomness uses XorShift32 PRNG from `src/core/random/prng.ts`:

| Source | Usage | Deterministic? |
|--------|-------|----------------|
| Damage calculation | None | ✅ Fully deterministic |
| Crit system | Counter-based | ✅ Fully deterministic |
| Turn order | SPD + unit ID tiebreak | ✅ Fully deterministic |
| AI decisions | Scoring + seeded tiebreak | ✅ Seeded PRNG |
| Paralyze fail | 25% chance | ✅ Seeded PRNG |
| Freeze break | 30% chance | ✅ Seeded PRNG |

### Seed Derivation

```typescript
// Per-turn, per-stream isolation
const streamSeed = baseSeed + turnNumber * 1_000_000 + RNG_STREAMS.ACTIONS;
const rng = makePRNG(streamSeed);
```

This ensures:
- Same base seed = same battle outcome
- Different turns use non-overlapping RNG streams
- Status RNG is isolated from AI RNG

---

## Quick Reference

```bash
# Smoke test all scenarios
pnpm sim:battle --all --runs 10

# Deep analysis of one scenario
pnpm sim:battle --scenario boss-overseer --runs 1000 --seed 42

# Reproducible regression test
pnpm sim:battle --scenario early-game-standard --runs 100 --seed 12345

# Check determinism
pnpm sim:battle --scenario mid-game-elite --runs 1 --seed 99999 --verbose
```

---

## See Also

- `balance-spec.md` - Core balance ratios and formulas
- `compendium/encounters.md` - All encounter definitions
- `compendium/enemies.md` - Enemy stat reference
- `compendium/units.md` - Hero stat reference
