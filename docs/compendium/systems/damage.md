# Damage Formulas

## Physical Damage

```
damage = max(1, basePower + ATK - (DEF × 0.5))
```

- `basePower` = ability's base damage
- `ATK` = attacker's effective ATK
- `DEF` = defender's effective DEF
- Floor of 1 (never 0 damage)

---

## Psynergy (Magic) Damage

```
damage = max(1, (basePower + MAG - (DEF × 0.3)) × elementModifier)
```

- `MAG` = attacker's effective MAG
- `DEF × 0.3` = magic partially ignores defense
- `elementModifier` = advantage/disadvantage

---

## Healing

```
heal = basePower + MAG
```

No defense reduction. Caps at target's max HP.

---

## Element Modifiers

| Matchup | Multiplier |
|---------|------------|
| Advantage | ×1.5 |
| Neutral | ×1.0 |
| Disadvantage | ×0.67 |

### Element Wheel
```
Venus (Earth) → Jupiter (Wind) → Mercury (Water) → Mars (Fire) → Venus
```

**Counter Pairs (opposite advantage):**
- Venus ↔ Jupiter
- Mars ↔ Mercury

---

## Damage Modifiers (Post-Calculation)

Applied in order:

1. **Element Advantage/Disadvantage**
2. **Elemental Resistance** (status/armor): `damage × (1 - resistance)`
3. **Damage Reduction** (status): `damage × (1 - reduction)`
4. **Shield Blocking**: If shield active, block up to shield value
5. **Invulnerability**: Blocks ALL damage
6. **Minimum Floor**: Always at least 1 damage

---

## Special Mechanics

### Ignore Defense
Some abilities have `ignoreDefensePercent`:
```
effectiveDEF = DEF × (1 - ignoreDefensePercent)
```

### Critical Hits
Every 10th hit crits (deterministic):
```
critDamage = baseDamage × critMultiplier
```

### Auto-Revive
On KO, if unit has auto-revive status:
```
reviveHP = maxHP × hpPercent
uses -= 1
```

---

## Target Ratios (from balance-spec.md)

| Metric | Early | Mid | Late |
|--------|-------|-----|------|
| Hero HP | 20 | 30-35 | 40-50 |
| Hero ATK | 8 | 12-15 | 18-22 |
| Enemy HP | 15-20 | 25-35 | 40-60 |
| Enemy ATK | 4-5 | 8-10 | 12-15 |
| Damage/hit (% enemy HP) | 40% | 35% | 30% |

---

## TTK (Time-to-Kill)

| Target | Hits |
|--------|------|
| Standard enemy | 2-4 (sweet spot: 3) |
| Elite/mini-boss | 5-8 |
| Boss | 10-15+ |
| Hero (by enemy) | 4 early → 3 late |

---

## Key Files

- `damage.ts` (1,816 lines)
- `status.ts` - Status effect modifiers
- `balance-spec.md` - Design ratios
