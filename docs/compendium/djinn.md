# Djinn Compendium

**Total:** 20 djinn across 4 elements

---

## Djinn System Overview

- **Team-wide:** 3 Djinn slots affect ALL party members
- **States:** Set → Standby (activated) → Recovery (2+ turn cooldown)
- **Collection:** Up to 12 total per team

---

## Venus Djinn (Earth) - 4

| Name | Tier | Summon Effect | Damage/Effect |
|------|------|---------------|---------------|
| **Flint** | 1 | Stone Barrage | 80 damage AoE |
| **Granite** | 2 | Terra Wall | DEF +10 buff |
| **Bane** | 3 | Earthquake | 300 damage AoE |
| **Rockling** | 1 | Earth Spike | 46 damage single |

**Compatible Units:** Adept, Sentinel, Felix (same-element bonus)
**Counter Units:** War Mage (counter-element = stronger Standby abilities)

---

## Mars Djinn (Fire) - 5

| Name | Tier | Summon Effect | Damage/Effect |
|------|------|---------------|---------------|
| **Forge** | 1 | Firebolt Barrage | 120 damage AoE |
| **Corona** | 2 | Flame Field | MAG +8 buff |
| **Fury** | 3 | Blazing Torrent | 220 damage AoE |
| **Ember** | 1 | Fire Burst | 46 damage single |
| **Nova** | 3 | Starfire | 320 damage AoE (Tower) |

**Compatible Units:** War Mage, Blaze, Tyrell (same-element bonus)
**Counter Units:** Adept, Sentinel, Felix (counter-element)

---

## Mercury Djinn (Water/Ice) - 5

| Name | Tier | Summon Effect | Damage/Effect |
|------|------|---------------|---------------|
| **Fizz** | 1 | Ice Shards | 100 damage AoE |
| **Tonic** | 2 | Healing Mist | 80 HP heal |
| **Crystal** | 3 | Crystal Prism | MAG +12 buff |
| **Surge** | 2 | Tidal Wave | 180 damage AoE |
| **Chill** | 3 | Absolute Zero | Stun effect |

**Compatible Units:** Mystic, Karis (same-element bonus)
**Counter Units:** Ranger, Stormcaller (counter-element)

---

## Jupiter Djinn (Wind/Lightning) - 6

| Name | Tier | Summon Effect | Damage/Effect |
|------|------|---------------|---------------|
| **Breeze** | 1 | Gale Shards | 110 damage AoE |
| **Squall** | 2 | Storm Burst | 160 damage AoE |
| **Storm** | 3 | Tempest Swirl | Chaos + lightning debuff |
| **Gust** | 1 | Swift Winds | SPD +8 buff |
| **Bolt** | 2 | Chain Lightning | 200 damage AoE |
| **Tempest** | 3 | Ultimate Storm | 350 damage AoE (Tower) |

**Compatible Units:** Ranger, Stormcaller (same-element bonus)
**Counter Units:** Mystic, Karis (counter-element)

---

## Synergy System

### By Djinn Count
| Djinn | Bonus | Class |
|-------|-------|-------|
| 1 (any) | +4 ATK, +3 DEF | Adept |
| 2 (same) | +8 ATK, +5 DEF | {Element} Warrior |
| 2 (different) | +5 ATK, +5 DEF | Hybrid |
| 3 (all same) | +12 ATK, +8 DEF | {Element} Adept |
| 3 (2+1) | +8 ATK, +6 DEF | {Element} Knight |
| 3 (all different) | +4 ATK, +4 DEF, +4 SPD | Mystic |

### Element Compatibility
| Compatibility | Stat Effect | Abilities (when Set) |
|--------------|-------------|---------------------|
| Same Element | BONUS | 2 abilities |
| Neutral | Small bonus | 1 ability |
| Counter Element | -3 ATK, -2 DEF | 2 STRONGER abilities (Standby) |

### Counter Pairs
```
Venus (Earth) ↔ Jupiter (Wind)
Mars (Fire)   ↔ Mercury (Water)
```

---

## Summon Tiers

| Tier | Djinn Required | Power Range | Examples |
|------|----------------|-------------|----------|
| 1 | 1 | 46-120 | Flint (80), Ember (46) |
| 2 | 2 | 160-200 | Surge (180), Bolt (200) |
| 3 | 3+ | 220-350 | Bane (300), Tempest (350) |

---

## Recovery Mechanics

- After activation: Djinn enters **Standby** state
- Must wait **2+ turns** to recover
- Recovery tracked via `djinnTrackers[djinnId].lastActivatedTurn`
- Auto-checks each turn: `currentRound - lastActivatedTurn >= 2`
