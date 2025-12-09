# Combat System

## Overview

**Type:** Queue-Based Deterministic Turn-Based Battle

---

## Battle Flow

```
1. PLANNING PHASE
   └→ Queue 1-4 actions (one per unit)
   └→ Mana pool shared across team
   └→ Can queue Djinn activations
   └→ "Execute Round" when ready

2. EXECUTION PHASE
   └→ Actions execute in SPD order
   └→ Damage calculated per action
   └→ Status effects applied
   └→ KO checks after each action

3. ROUND END
   └→ Status effect ticks (DoT, duration)
   └→ Djinn recovery checks
   └→ Victory/Defeat check
   └→ Return to Planning or end
```

---

## Turn Order

**Priority Tiers:**
1. Hermes' Sandals (equipment) = always first
2. Effective SPD (base + level + equipment + djinn + status)
3. Deterministic tiebreaker (unit ID)

**Formula:**
```
effectiveSPD = baseSPD + (level × growthRate) + equipmentBonus + djinnBonus + statusMod
```

---

## Mana System

- **Pool:** Team-wide (sum of all manaContribution)
- **Costs:** Each ability has manaCost
- **Refund:** Clearing queued action refunds mana
- **No regen:** Mana doesn't regenerate per round

**Unit Mana Contribution:**
| Role | Contribution |
|------|--------------|
| Tank/DPS | 1 |
| Mage/Healer | 2-3 |

---

## Action Queue

- **Slots:** 1-4 (one per living unit)
- **Structure:** `{unitId, abilityId, targetIds, manaCost}`
- **Validation:** Actor not KO'd, not frozen, can afford

---

## Deterministic Crit System

- **No random crits**
- Every 10th hit triggers crit
- Counter tracked per unit: `critCounter` / `critThreshold`
- Displayed via `CritMeter` component
- Resets to 0 after crit

---

## Status Effects

### Categories
| Type | Examples |
|------|----------|
| Buff | ATK up, DEF up, Regen |
| Debuff | ATK down, DEF down, Poison |
| CC | Frozen (skip turn), Paralyze (25% fail) |
| Shield | Block X damage, Invulnerable |

### Duration
- Most effects: X turns
- Some: X charges (consumed on trigger)
- Auto-revive: X uses

---

## Victory/Defeat

**Victory:** All enemies KO'd
**Defeat:** All player units KO'd

---

## Key Files

- `BattleService.ts` - Core battle execution
- `QueueBattleService.ts` - Queue mechanics
- `BattleState.ts` - State model
- `damage.ts` - Damage algorithms
- `status.ts` - Status effects
