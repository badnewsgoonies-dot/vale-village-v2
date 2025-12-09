# Vale Village v2 - Combat Balance Specification

**Version:** 1.0
**Date:** 2025-12-08
**Source:** Game design research + existing DJINN_BALANCE_ANALYSIS.md

---

## Core Design Philosophy

### 1. Deterministic Combat (No Randomness)
- **No random crits, no misses** - every action has predictable outcomes
- **Deterministic Crit System:** Every 10th hit crits (counter-based, not RNG)
  - Each unit has `critCounter` (starts at 0) and `critThreshold` (default 10)
  - Counter increments on each attack during execution phase
  - When counter reaches threshold → crit triggers → counter resets to 0
  - UI shows progress via `CritMeter` component
- Uncertainty comes from:
  - Enemy AI behavior (priority targeting, adaptive strategy)
  - Hidden information (enemy intents revealed per-turn like StS)
  - Decision complexity (combo setups, positioning)
- Player skill determines outcomes, not dice rolls

### 2. Low Numbers for Clarity
- All stats in **single/double digits** where possible
- Every point matters (~10% of a stat)
- Mental math should be instant (no calculators needed)
- Avoid inflation - progression via abilities, not stat bloat

### 3. Meaningful Choices
- No dominant "no-brainer" strategies
- Multiple viable builds/approaches
- Trade-offs for every decision (djinn SET vs STANDBY)

---

## Numerical Ratios

### Time-to-Kill (TTK)

| Target | Hits to Kill | Notes |
|--------|--------------|-------|
| Standard enemy (equal level) | **2-4** (sweet spot: 3) | Fast but tactical |
| Elite/mini-boss | **5-8** | Requires planning |
| Boss | **10-15+** | Multi-phase, strategic |
| Player hero (by enemy) | **4 early → 3 late** | Converging danger |

### Damage vs HP Ratios

| Metric | Early Game (L1-3) | Mid Game (L4-7) | Late Game (L8+) |
|--------|-------------------|-----------------|-----------------|
| Hero HP | 20 | 30-35 | 40-50 |
| Hero ATK | 8 | 12-15 | 18-22 |
| Enemy HP | 15-20 | 25-35 | 40-60 |
| Enemy ATK | 4-5 | 8-10 | 12-15 |
| Dmg per hit (% of enemy HP) | 40% | 35% | 30% |

### Key Breakpoints (NEVER violate)
- **No one-shots at full HP** - strongest single hit ≤ 80-90% of target HP
- **Minimum damage floor** = 1 (never 0, even with high DEF)
- **Healing < Damage efficiency** - heal restores ~50-70% of one enemy hit

---

## Damage Formulas

### Physical Damage
```
damage = max(1, basePower + ATK - (DEF × 0.5))
```
*From existing DJINN_BALANCE_ANALYSIS.md*

### Psynergy (Magic) Damage
```
damage = max(1, (basePower + MAG - (DEF × 0.3)) × elementModifier)
```

### Element Modifiers
| Matchup | Multiplier |
|---------|------------|
| Advantage | ×1.5 |
| Neutral | ×1.0 |
| Disadvantage | ×0.67 |

### Tetra Element Wheel
```
Venus (Earth) ←→ Jupiter (Wind)
Mars (Fire)   ←→ Mercury (Water)
```

---

## Stat Scaling Per Level

Using diminishing returns to prevent late-game trivialization:

```typescript
// Hero stat growth
HP  = 15 + (level × 3)     // L1: 18, L5: 30, L10: 45
ATK = 5 + (level × 1.5)    // L1: 6.5→7, L5: 12.5→13, L10: 20
DEF = 3 + (level × 1.2)    // L1: 4.2→4, L5: 9, L10: 15
MAG = 4 + (level × 1.3)    // L1: 5.3→5, L5: 10.5→11, L10: 17

// Enemy stat growth (slightly behind heroes early, catches up late)
HP  = 10 + (level × 4)     // L1: 14, L5: 30, L10: 50
ATK = 3 + (level × 1.2)    // L1: 4.2→4, L5: 9, L10: 15
DEF = 2 + (level × 1.0)    // L1: 3, L5: 7, L10: 12
```

---

## Djinn Balance (from existing analysis)

### SET State Bonuses
| Alignment | ATK | DEF | Abilities |
|-----------|-----|-----|-----------|
| Same element | +4 | +3 | 2 |
| Neutral | +2 | +2 | 1 |
| Counter element | -3 | -2 | 0 (unlocks in Standby) |

### Summon Tiers
| Tier | Djinn Required | Power Range | Example |
|------|----------------|-------------|---------|
| 1 | 1 | 46-120 | Flint (80), Ember (46) |
| 2 | 2 | 160-200 | Surge (180), Bolt (200) |
| 3 | 3+ | 220-350 | Bane (300), Tempest (350) |

---

## Healing & Defense Economy

### Healing Spells
| Type | HP Restored | Cost | Notes |
|------|-------------|------|-------|
| Basic heal | 6-8 | Low | ~1 enemy hit |
| Group heal | 4-5 each | Medium | Spread value |
| Full heal | 15-20 | High/limited | Emergency only |

**Rule:** A single heal should NOT fully negate an enemy's turn damage output. Player must combine defense + heal + offense strategically.

### Block/Defense Cards (if deck-builder layer)
| Type | Block Value | Notes |
|------|-------------|-------|
| Basic Defend | 5 | Absorbs 1 standard hit |
| Strong Block | 8-10 | Lets 2-4 dmg through vs heavy attacks |
| Perfect Guard | 12-15 | High cost, near-full mitigation |

---

## Combat Pacing Goals

| Phase | Turns | What Happens |
|-------|-------|--------------|
| Early (turns 1-2) | Setup | Buffs, positioning, djinn management |
| Mid (turns 3-5) | Attrition | Trading damage, resource decisions |
| Late (turns 6+) | Resolution | Summons, finishers, clutch plays |

**Target battle length:** 4-8 turns for standard encounters, 10-15 for bosses.

---

## Anti-Patterns to Avoid

1. **Stat inflation** - Don't scale HP to 1000s just for "big numbers feel"
2. **One-shot builds** - No combo should kill from 100% without setup cost
3. **Heal-stall** - Healing should delay death, not prevent it indefinitely
4. **Dump stats** - Every stat (ATK/DEF/MAG/SPD) should matter for some build
5. **Dead djinn** - Every djinn should have a viable use case

---

## Testing Checklist

- [ ] L1 hero kills L1 enemy in 2-3 hits
- [ ] L1 enemy kills L1 hero in 4-5 hits
- [ ] Element advantage feels impactful (+50% noticeable)
- [ ] No single ability does >80% of target HP
- [ ] Battles last 4-8 turns on average
- [ ] All djinn have at least one viable loadout scenario
- [ ] Late-game enemies still pose threat (not trivialized)

---

## References

- DJINN_BALANCE_ANALYSIS.md - Djinn roster and element mechanics
- HOUSE_BALANCE_ANALYSIS.md - House/class balance
- TOWER_NORMALIZATION_DESIGN.md - Tower progression balance
