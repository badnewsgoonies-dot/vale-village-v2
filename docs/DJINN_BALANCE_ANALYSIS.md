# Djinn Balance Analysis - Vale Village v2

**Date:** 2025-12-08
**Purpose:** Analyze djinn combinations for optimal battle performance

## Executive Summary

This analysis calculates optimal djinn loadouts for different combat scenarios based on the Vale Village v2 battle system. The analysis considers stat bonuses, summon power, and elemental counter-element advantages.

## System Mechanics

### Djinn Element Pairs (Tetra System)
- **Venus (Earth) counters Jupiter (Wind)**
- **Jupiter (Wind) counters Venus (Earth)**
- **Mars (Fire) counters Mercury (Water)**
- **Mercury (Water) counters Mars (Fire)**

### Djinn State Mechanics

1. **SET**: Djinn provides stat bonuses and grants abilities
   - Same element: +4 ATK, +3 DEF (grants 2 abilities)
   - Neutral element: +2 ATK, +2 DEF (grants 1 ability)
   - Counter element: -3 ATK, -2 DEF (NO abilities while SET)

2. **STANDBY**: Djinn ready for summoning
   - Counter element djinn unlock 2 STRONGER abilities (only in Standby state)
   - Same/neutral abilities are lost

3. **RECOVERY**: 2 turns before returning to SET

### Combat Damage Formulas

**Physical Damage:**
```
damage = basePower + ATK - (DEF × 0.5)
```

**Psynergy (Magic) Damage:**
```
damage = (basePower + MAG - (DEF × 0.3)) × elementModifier
```

**Element Advantage Multipliers:**
- Advantage: **×1.5** (50% more damage)
- Disadvantage: **×0.67** (33% less damage)
- Neutral: ×1.0

## Complete Djinn Roster

### Venus (Earth) - 4 Djinn
| Name | Tier | Summon Type | Summon Power | Notes |
|------|------|-------------|--------------|-------|
| Flint | 1 | Damage | 80 | Stone Barrage (all foes) |
| Granite | 2 | Buff | DEF +10 | Terra Wall (party DEF boost) |
| Bane | 3 | Damage | 300 | Earthquake (all foes) |
| Rockling | 1 | Damage | 46 | Earth spike (single foe, VS1 demo) |

### Mars (Fire) - 5 Djinn
| Name | Tier | Summon Type | Summon Power | Notes |
|------|------|-------------|--------------|-------|
| Forge | 1 | Damage | 120 | Firebolt barrage (all foes) |
| Corona | 2 | Buff | MAG +8 | Flame field (party MAG boost) |
| Fury | 3 | Damage | 220 | Blazing torrent (all foes) |
| Ember | 1 | Damage | 46 | Fire burst (single foe, VS1 demo) |
| Nova | 3 | Damage | 320 | Starfire nova (all foes, tower-exclusive) |

### Mercury (Water) - 5 Djinn
| Name | Tier | Summon Type | Summon Power | Notes |
|------|------|-------------|--------------|-------|
| Fizz | 1 | Damage | 100 | Ice shards (all foes) |
| Tonic | 2 | Heal | 80 HP | Healing mist (party heal) |
| Crystal | 3 | Buff | MAG +12 | Crystal prism (party MAG boost) |
| Surge | 2 | Damage | 180 | Tidal wave (all foes) |
| Chill | 3 | Special | Stun | Absolute zero (stuns all foes) |

### Jupiter (Wind) - 6 Djinn
| Name | Tier | Summon Type | Summon Power | Notes |
|------|------|-------------|--------------|-------|
| Breeze | 1 | Damage | 110 | Gale shards (all foes) |
| Squall | 2 | Damage | 160 | Storm burst (all foes) |
| Storm | 3 | Special | Chaos | Tempest swirl (chaos + lightning) |
| Gust | 1 | Buff | SPD +8 | Swift winds (party speed boost) |
| Bolt | 2 | Damage | 200 | Chain lightning (all foes) |
| Tempest | 3 | Damage | 350 | Ultimate storm (tower-exclusive) |

## Enemy Element Distribution

Based on analysis of enemy definitions (`enemies.ts`), the game features:

**Most Common Enemy Elements:**
- **Mars (Fire):** 22 enemies (~23%)
- **Jupiter (Wind):** 25 enemies (~26%)
- **Mercury (Water):** 25 enemies (~26%)
- **Venus (Earth):** 24 enemies (~25%)

Distribution is nearly balanced across all elements. Key encounters:
- Early game (Lvl 1-3): Mix of all elements, slight Mars bias (Flame Scout, Flame Bandit)
- Mid game (Lvl 4-7): Balanced distribution
- Late game (Lvl 8-15): Heavy Jupiter/Mercury presence in tower floors

## Optimal Djinn Loadouts

### 1. Pure Damage Build (Offensive Powerhouse)

**Setup:** Mars/Jupiter Focus (Fire/Wind elements)
**Djinn:** Fury (Mars-3), Tempest (Jupiter-3), Forge (Mars-1), Bolt (Jupiter-2)

| Stat | Bonus Calculation | Total |
|------|------------------|-------|
| ATK | (4+4) same + (4+4) same = +16 | **+16 ATK** |
| DEF | (3+3) same + (3+3) same = +12 | **+12 DEF** |
| **Summon Power** | 220 + 350 + 120 + 200 = **890** | **Highest** |
| **Best Against** | Mercury/Venus enemies | Element advantage |

**Rationale:**
- Maximum summon damage potential (890 total)
- All same-element djinn for maximum stat bonuses
- Fury + Tempest are the strongest damage summons
- Mars counters Mercury, Jupiter counters Venus
- Grants 8 offensive abilities (2 per djinn)

**Weaknesses:**
- No healing capability
- No defensive utility
- Vulnerable to counter-elements

---

### 2. Tank/Survival Build (Maximum Durability)

**Setup:** Venus/Mercury Focus (Earth/Water elements)
**Djinn:** Granite (Venus-2), Crystal (Mercury-3), Tonic (Mercury-2), Flint (Venus-1)

| Stat | Bonus Calculation | Total |
|------|------------------|-------|
| ATK | (4+4) same + (4+4) same = +16 | **+16 ATK** |
| DEF | (3+3) same + (3+3) same = +12 | **+12 DEF** |
| **Summon Power** | DEF+10, MAG+12, 80 HP heal, 80 dmg | **Utility-focused** |
| **Best Against** | Jupiter/Mars enemies | Element advantage |

**Rationale:**
- Granite provides party-wide DEF +10 (massive survivability)
- Tonic heals 80 HP to entire party
- Crystal boosts MAG +12 for healing/damage
- Venus counters Jupiter, Mercury counters Mars
- Same-element bonuses maximize stats
- Grants healing and defensive abilities

**Strengths:**
- Best survivability (DEF buff + healing)
- Strong against aggressive Mars/Jupiter enemies
- MAG boost enhances healing effectiveness

---

### 3. Balanced 4-Djinn Setup (All-Rounder)

**Setup:** Mixed Elements for Versatility
**Djinn:** Fury (Mars-3), Bane (Venus-3), Bolt (Jupiter-2), Tonic (Mercury-2)

| Stat | Bonus Calculation | Total |
|------|------------------|-------|
| ATK | (4+4+4+4) same = +16 | **+16 ATK** |
| DEF | (3+3+3+3) same = +12 | **+12 DEF** |
| **Summon Power** | 220 + 300 + 200 + 80 HP | **800 + healing** |
| **Best Against** | All enemy types | Coverage |

**Rationale:**
- One djinn from each element (full coverage)
- Tier 2-3 djinn for strong summon effects
- Balanced damage output (720) + healing (80 HP)
- Covers all element matchups
- Maximum versatility

**Strengths:**
- No elemental weaknesses
- Healing capability (Tonic)
- High summon damage (800 total)
- Same-element bonuses across the board

---

### 4. Counter-Element Strike Team (Anti-Meta)

**Setup:** Jupiter/Mercury (Counter-Heavy vs Mars/Venus)
**Djinn:** Tempest (Jupiter-3), Bolt (Jupiter-2), Surge (Mercury-2), Chill (Mercury-3)

| Stat | Bonus Calculation | Total |
|------|------------------|-------|
| ATK | (4+4) Jupiter + (4+4) Mercury = +16 | **+16 ATK** |
| DEF | (3+3) Jupiter + (3+3) Mercury = +12 | **+12 DEF** |
| **Summon Power** | 350 + 200 + 180 + Stun | **730 + Stun** |
| **Best Against** | Mars/Venus enemies | **×1.5 damage** |

**Damage vs Mars/Venus Enemies:**
- Psynergy damage formula: `(basePower + MAG - DEF×0.3) × 1.5`
- With MAG ~20-30 and element advantage, expect **~50% more damage**
- Example: 100 base damage → 150 damage vs Mars/Venus

**Rationale:**
- Dominates Mars (Fire) and Venus (Earth) enemies
- Jupiter counters Venus (most common early game)
- Mercury counters Mars (high burst damage enemies)
- Chill's stun effect provides crowd control
- Surge provides strong AoE damage (180)

**Strengths:**
- Massive damage vs 50% of enemy roster
- Stun utility (Chill)
- Strong mid-late game when Mars/Venus are common
- All same-element bonuses

---

### 5. Counter-Element Standby Strategy (Advanced)

**Setup:** Use counter-element djinn for STANDBY abilities
**Djinn:** Mars djinn on Venus unit, Mercury djinn on Mars unit

**Example:** Venus Adept with Forge (Mars-1) + Fury (Mars-3)

| State | ATK Bonus | DEF Bonus | Abilities |
|-------|----------|----------|-----------|
| **SET** | -6 | -4 | None (counter penalty) |
| **STANDBY** | -6 | -4 | **4 strong counter abilities** |
| After Summon | -6 | -4 | Damage: 120 + 220 = 340 |

**Rationale:**
- Counter djinn grant STRONGER abilities only when in Standby
- Sacrifice stats (-6 ATK, -4 DEF) for powerful counter-element moves
- Use summons for massive burst damage, then leverage unlocked abilities
- High skill ceiling, requires careful turn planning

**Best Use Case:**
- Boss fights where burst summons are critical
- When counter-element abilities outweigh stat penalties
- Teams with stat buffs to offset penalties

**Weaknesses:**
- Stat penalties while SET (before using djinn)
- Requires precise timing
- No abilities while djinn are in Recovery

---

## Summon Power Rankings

### Highest Damage Summons
1. **Tempest (Jupiter-3):** 350 damage - Ultimate storm
2. **Nova (Mars-3):** 320 damage - Starfire nova (tower-exclusive)
3. **Bane (Venus-3):** 300 damage - Earthquake
4. **Fury (Mars-3):** 220 damage - Blazing torrent
5. **Bolt (Jupiter-2):** 200 damage - Chain lightning

### Utility Summons
1. **Chill (Mercury-3):** Stun all enemies (CC)
2. **Storm (Jupiter-3):** Chaos + lightning (disruption)
3. **Crystal (Mercury-3):** MAG +12 (party buff)
4. **Granite (Venus-2):** DEF +10 (party buff)
5. **Tonic (Mercury-2):** 80 HP heal (party sustain)

## Stat Bonus Summary

### Maximum Possible Bonuses (4 Same-Element Djinn)
- **ATK:** +16 (4 djinn × +4 each)
- **DEF:** +12 (4 djinn × +3 each)

### Penalty from Counter-Element (4 Counter Djinn)
- **ATK:** -12 (4 djinn × -3 each)
- **DEF:** -8 (4 djinn × -2 each)

### Neutral-Element (4 Neutral Djinn)
- **ATK:** +8 (4 djinn × +2 each)
- **DEF:** +8 (4 djinn × +2 each)

## Damage Calculation Examples

### Scenario: Venus Adept (Level 5) with Balanced Build

**Base Stats:** ATK 18, DEF 15, MAG 12
**Djinn Bonus:** +16 ATK, +12 DEF
**Effective Stats:** ATK 34, DEF 27

**Physical Attack vs Venus Wolf (DEF 7):**
```
damage = 34 - (7 × 0.5) = 34 - 3.5 = 30.5 → 30 damage
```

**Psynergy Attack (Earth-based, 50 power) vs Mars Bandit (Jupiter element, DEF 6):**
```
Element: Venus → Mars (neutral, ×1.0)
damage = (50 + 12 - (6 × 0.3)) × 1.0 = (50 + 12 - 1.8) = 60.2 → 60 damage
```

**Psynergy Attack (Earth-based, 50 power) vs Jupiter Sprite (Venus counters Jupiter, DEF 5):**
```
Element: Venus → Jupiter (advantage, ×1.5)
damage = (50 + 12 - (5 × 0.3)) × 1.5 = (50 + 12 - 1.5) × 1.5 = 60.5 × 1.5 = 90.75 → 90 damage
```

**Damage Increase from Element Advantage:** 90 vs 60 = **50% more damage**

---

## Recommendations by Enemy Type

### vs Mars-Heavy Encounters (Flame Scouts, Fire Commanders)
**Best Build:** Tank/Survival (Mercury focus)
- Mercury counters Mars (×1.5 damage)
- Tonic provides healing against burst damage
- DEF buffs mitigate fire attacks

### vs Venus-Heavy Encounters (Earth Scouts, Stone Captains)
**Best Build:** Counter-Element Strike Team (Jupiter focus)
- Jupiter counters Venus (×1.5 damage)
- High summon damage (Tempest: 350)
- Speed advantage (Jupiter units are fast)

### vs Mixed Encounters (Tower, Multi-Element Battles)
**Best Build:** Balanced 4-Djinn Setup
- Coverage against all elements
- Healing capability
- No elemental weaknesses

### vs Boss Fights (Overseer, Chimera)
**Best Build:** Pure Damage + Counter-Standby Strategy
- Maximize summon burst (Fury + Tempest = 570 damage)
- Use counter djinn for powerful abilities after summon
- Focus damage output over sustainability

---

## Advanced Strategy: Djinn Cycling

**Concept:** Rotate djinn through SET → STANDBY → RECOVERY to maintain ability access

**Example Rotation (4 djinn):**
- Turn 1: Use Djinn A (summon) → Standby
- Turn 2: Use Djinn B (summon) → Standby
- Turn 3: Djinn A returns to SET
- Turn 4: Use Djinn A again

**Benefits:**
- Consistent summon pressure every 2-3 turns
- Maintain ability access (some djinn always SET)
- Flexible response to enemy composition

**Drawbacks:**
- Complex turn tracking
- Reduced stat bonuses (djinn in Recovery)
- Requires 3+ djinn for smooth rotation

---

## Conclusion

### Top 3 Loadouts

1. **Best Overall:** Balanced 4-Djinn Setup
   - Most versatile
   - No major weaknesses
   - Healing + damage

2. **Best Offense:** Pure Damage Build (Mars/Jupiter)
   - Highest summon power (890)
   - Maximum element coverage
   - Best for speedruns

3. **Best Defense:** Tank/Survival Build (Venus/Mercury)
   - DEF +10 party buff
   - 80 HP party heal
   - Counters aggressive enemies

### Key Takeaways

- **Same-element djinn** provide best stat bonuses (+16 ATK, +12 DEF)
- **Element advantage** gives 50% more damage (×1.5)
- **Counter-element djinn** are high-risk, high-reward (stat penalties, but strong abilities when Standby)
- **Tier 3 djinn** have the strongest summons (300-350 damage)
- **Mercury djinn** offer best utility (healing, buffs, stuns)
- **Jupiter djinn** offer highest burst damage (Tempest: 350)

### Meta Analysis

The Vale Village v2 djinn system rewards:
- **Planning:** Same-element stacking for stats vs counter-element for damage
- **Timing:** Knowing when to use summons vs save djinn for abilities
- **Composition:** Matching djinn elements to enemy weaknesses
- **Flexibility:** Balanced loadouts handle more situations than min-maxed builds

The most successful strategy is **adaptive loadout switching** based on upcoming encounters rather than one "best" loadout.
