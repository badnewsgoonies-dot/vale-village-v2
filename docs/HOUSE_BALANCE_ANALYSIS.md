# House Balance Analysis: Win Equations (Houses 1-12)

**Generated:** 2025-12-08
**Purpose:** Calculate minimum player stats/turns needed to beat each House encounter in vale-village-v2

## Methodology

### Damage Formulas (from damage.ts)

**Physical Damage:**
```
damage = basePower + effective_ATK - (effective_DEF × 0.5)
minimum = 1
```

**Psynergy (Magic) Damage:**
```
damage = (basePower + effective_MAG - (effective_DEF × 0.3)) × elementModifier
elementModifier = 1.5 (advantage) | 0.67 (disadvantage) | 1.0 (neutral)
minimum = 1
```

**Healing:**
```
heal = basePower + effective_MAG
minimum = 1
```

### Assumptions

1. **Player Party:** Starting with Isaac (Adept, Level 1), progressively adding units
2. **Starting Stats (Level 1 Adept):**
   - HP: 120, PP: 15, ATK: 14, DEF: 16, MAG: 8, SPD: 10
3. **Growth Rates (per level):**
   - HP: +25, PP: +4, ATK: +3, DEF: +4, MAG: +2, SPD: +1
4. **No equipment bonuses** for baseline calculations (conservative estimate)
5. **Elemental advantages/disadvantages** are factored in
6. **Party size:** 1-4 units depending on house progression

---

## House-by-House Analysis

### House 1: Garet's Liberation (VS1 Tutorial)

**Enemies:**
- Garet Enemy (War Mage, Level 2, Mars)
  - HP: 240 (modified 3×)
  - ATK: 14, DEF: 10, MAG: 23, SPD: 14

**Enemy DPS (average per turn):**
- Physical (Strike): 14 + 14 - (16 × 0.5) = 20 damage
- Magic (Flame Burst): (45 + 23 - (16 × 0.3)) × 1.0 ≈ 63 damage (Mars vs Venus = neutral)

**Total Enemy HP:** 240

**Win Equation (Level 1 Isaac):**
- Player DPS (Physical): 0 + 14 - (10 × 0.5) = 9 damage/turn
- Player DPS (Earth Spike): (35 + 8 - (10 × 0.3)) × 1.5 ≈ 60 damage/turn (Venus → Mars advantage)
- **Turns to Win:** 240 ÷ 60 = 4 turns (using Earth Spike)
- **Survival HP Needed:** 63 × 4 = 252 HP
- **Reality:** Isaac starts with 120 HP → **requires healing or higher level**

**Recommended Level:** 3
- Level 3 Isaac: HP = 120 + (25×2) = 170, ATK = 14 + (3×2) = 20, MAG = 8 + (2×2) = 12, DEF = 16 + (4×2) = 24
- Player DPS: (35 + 12 - 3) × 1.5 = 66 damage/turn
- Turns to Win: 240 ÷ 66 = 4 turns
- Enemy DPS: (45 + 23 - 7.2) × 1.0 = 61 damage/turn
- Survival: 61 × 4 = 244 HP (needs healing mid-battle)

---

### House 2: The Bronze Trial

**Enemies:**
- Earth Scout (Level 1, Venus): HP 250, ATK 14, DEF 8, MAG 5
- Venus Wolf (Level 1, Venus): HP 275, ATK 16, DEF 7, MAG 3

**Total Enemy HP:** 525

**Enemy DPS (average per turn, focusing fire):**
- Earth Scout: 14 + 14 - 8 = 20 damage
- Venus Wolf: 0 + 16 - 8 = 8 damage (Heavy Strike)
- **Total:** ~28 damage/turn (if both alive)

**Win Equation (Level 3 Isaac + Level 2 Garet):**
- Isaac (Venus): Earth Spike → (35 + 12 - 2.4) × 1.0 = 45 damage/turn (neutral vs Venus)
- Garet (Mars): Flame Burst → (45 + 28 - 2.4) × 0.67 ≈ 47 damage/turn (Mars → Venus advantage)
- **Combined DPS:** 92 damage/turn
- **Turns to Win:** 525 ÷ 92 = 6 turns
- **Survival HP Needed:** 28 × 6 = 168 HP (split across 2 units)

**Recommended Level:** 3 (Isaac), 2 (Garet)

---

### House 3: Iron Bonds

**Enemies:**
- Flame Scout (Level 1, Mars): HP 225, ATK 15, DEF 6, MAG 8
- Mars Wolf (Level 2, Mars): HP 290, ATK 18, DEF 6, MAG 5

**Total Enemy HP:** 515

**Enemy DPS (average per turn):**
- Flame Scout: Fireball → (35 + 8 - 4.8) × 1.5 ≈ 57 damage (Mars → Venus advantage)
- Mars Wolf: Heavy Strike → 15 + 18 - 8 = 25 damage
- **Total:** ~82 damage/turn (high threat!)

**Win Equation (Level 4 party):**
- Isaac + Garet + Mystic (Mercury, Level 3)
- Focus fire Mars Wolf first (higher DPS threat)
- **Combined DPS:** ~150 damage/turn (3 units)
- **Turns to Win:** 515 ÷ 150 = 4 turns
- **Survival HP Needed:** 82 × 4 = 328 HP (split across 3 units)

**Recommended Level:** 4 (Isaac/Mystic), 3 (Garet)

---

### House 4: Arcane Power

**Enemies:**
- Frost Scout (Level 1, Mercury): HP 240, ATK 14, DEF 7, MAG 7
- Mercury Wolf (Level 2, Mercury): HP 280, ATK 17, DEF 7, MAG 6

**Total Enemy HP:** 520

**Enemy DPS (average per turn):**
- Frost Scout: Ice Shard → (32 + 7 - 4.8) × 1.0 ≈ 34 damage
- Mercury Wolf: Heavy Strike → 15 + 17 - 8 = 24 damage
- **Total:** ~58 damage/turn

**Win Equation (Level 4 party with 3 units):**
- **Combined DPS:** ~160 damage/turn
- **Turns to Win:** 520 ÷ 160 = 4 turns
- **Survival HP Needed:** 58 × 4 = 232 HP

**Recommended Level:** 4

---

### House 5: The Blazing Warrior

**Enemies:**
- Gale Scout (Level 1, Jupiter): HP 210, ATK 15, DEF 6, MAG 9
- Jupiter Wolf (Level 2, Jupiter): HP 260, ATK 18, DEF 6, MAG 7

**Total Enemy HP:** 470

**Enemy DPS (average per turn):**
- Gale Scout: Gust → (30 + 9 - 4.8) × 1.5 ≈ 51 damage (Jupiter → Mercury advantage)
- Jupiter Wolf: Precise Jab → 12 + 18 - 8 = 22 damage
- **Total:** ~73 damage/turn

**Win Equation (Level 5 party with 4 units):**
- Full party: Isaac, Garet, Mystic, Ranger (Jupiter, Level 4)
- **Combined DPS:** ~200 damage/turn
- **Turns to Win:** 470 ÷ 200 = 3 turns
- **Survival HP Needed:** 73 × 3 = 219 HP

**Recommended Level:** 5 (Isaac/Mystic), 4 (Garet/Ranger)

---

### House 6: The Steel Guardian

**Enemies:**
- Earth Scout (Level 1, Venus): HP 250, ATK 14, DEF 8
- Flame Scout (Level 1, Mars): HP 225, ATK 15, DEF 6
- Venus Wolf (Level 1, Venus): HP 275, ATK 16, DEF 7

**Total Enemy HP:** 750

**Enemy DPS (average per turn, 3 enemies):**
- Combined physical/magic: ~90 damage/turn

**Win Equation (Level 5-6 party):**
- **Combined DPS:** ~220 damage/turn (4 units with AoE)
- **Turns to Win:** 750 ÷ 220 = 4 turns
- **Survival HP Needed:** 90 × 4 = 360 HP

**Recommended Level:** 6

---

### House 7: Winds of Liberation (Summons Unlock!)

**Enemies:**
- Terra Soldier (Level 3, Venus): HP 85, ATK 14, DEF 13, MAG 7
- Venus Bear (Level 4, Venus): HP 110, ATK 14, DEF 18, MAG 6

**Total Enemy HP:** 195

**Enemy DPS (average per turn):**
- Terra Soldier: Heavy Strike → 15 + 14 - 8 = 21 damage
- Venus Bear: Quake (AoE) → (30 + 6 - 4.8) × 1.0 ≈ 31 damage (hits all)
- **Total:** ~52 damage/turn (per unit if AoE hits all)

**Win Equation (Level 6-7 party):**
- **Combined DPS:** ~250 damage/turn
- **Turns to Win:** 195 ÷ 250 = 1 turn (Quake + focus fire)
- **Survival HP Needed:** ~52 HP (minimal)

**Recommended Level:** 6-7

---

### House 8: The Frozen Sentinel (Complete T1 Djinn Set!)

**Enemies:**
- Wind Soldier (Level 3, Jupiter): HP 70, ATK 13, DEF 9, MAG 13
- Jupiter Bear (Level 4, Jupiter): HP 100, ATK 15, DEF 15, MAG 10

**Total Enemy HP:** 170

**Enemy DPS (average per turn):**
- Wind Soldier: Gust → (30 + 13 - 4.8) × 1.5 ≈ 57 damage (Jupiter → Mercury)
- Jupiter Bear: Gust → (30 + 10 - 4.8) × 1.5 ≈ 53 damage
- **Total:** ~110 damage/turn (high magic threat)

**Win Equation (Level 7 party with Djinn):**
- **Combined DPS:** ~280 damage/turn (Djinn summons available)
- **Turns to Win:** 170 ÷ 280 = 1 turn
- **Survival HP Needed:** ~110 HP

**Recommended Level:** 7

---

### House 9: Inferno's Rage

**Enemies:**
- Tide Soldier (Level 3, Mercury): HP 80, ATK 12, DEF 12, MAG 10
- Mercury Bear (Level 4, Mercury): HP 115, ATK 13, DEF 19, MAG 7
- Ice Elemental (Level 6, Mercury): HP 130, ATK 12, DEF 18, MAG 18

**Total Enemy HP:** 325

**Enemy DPS (average per turn, 3 enemies):**
- Combined: ~120 damage/turn (Ice Elemental has high MAG)

**Win Equation (Level 8 party):**
- **Combined DPS:** ~320 damage/turn
- **Turns to Win:** 325 ÷ 320 = 2 turns
- **Survival HP Needed:** 120 × 2 = 240 HP

**Recommended Level:** 8

---

### House 10: The Burning Gauntlet

**Enemies:**
- Blaze Soldier (Level 3, Mars): HP 75, ATK 15, DEF 10, MAG 12
- Mars Bear (Level 4, Mars): HP 105, ATK 16, DEF 16, MAG 8
- Flame Elemental (Level 6, Mars): HP 120, ATK 14, DEF 14, MAG 20

**Total Enemy HP:** 300

**Enemy DPS (average per turn):**
- Combined: ~140 damage/turn (Flame Elemental threat)

**Win Equation (Level 8-9 party):**
- **Combined DPS:** ~340 damage/turn
- **Turns to Win:** 300 ÷ 340 = 1 turn
- **Survival HP Needed:** ~140 HP

**Recommended Level:** 8-9

---

### House 11: The Scholar's Trial

**Enemies:**
- Stone Captain (Level 5, Venus): HP 130, ATK 18, DEF 18, MAG 10
- Rock Elemental (Level 6, Venus): HP 140, ATK 16, DEF 22, MAG 12

**Total Enemy HP:** 270

**Enemy DPS (average per turn):**
- Stone Captain: Quake → (30 + 10 - 4.8) × 1.0 ≈ 35 damage (AoE)
- Rock Elemental: Quake → (30 + 12 - 4.8) × 1.0 ≈ 37 damage (AoE)
- **Total:** ~72 damage/turn (per unit if both AoE)

**Win Equation (Level 9 party with Karis):**
- **Combined DPS:** ~360 damage/turn
- **Turns to Win:** 270 ÷ 360 = 1 turn
- **Survival HP Needed:** ~72 HP

**Recommended Level:** 9

---

### House 12: The Granite Fortress (First T2 Djinn!)

**Enemies:**
- Inferno Captain (Level 5, Mars): HP 115, ATK 20, DEF 14, MAG 16
- Phoenix (Level 8, Mars): HP 180, ATK 22, DEF 18, MAG 26

**Total Enemy HP:** 295

**Enemy DPS (average per turn):**
- Inferno Captain: Fireball → (35 + 16 - 4.8) × 1.5 ≈ 69 damage (Mars → Venus)
- Phoenix: Fireball → (35 + 26 - 4.8) × 1.5 ≈ 84 damage
- **Total:** ~153 damage/turn (VERY HIGH)

**Win Equation (Level 10 party with T2 Djinn):**
- **Combined DPS:** ~400 damage/turn (T2 Djinn summons)
- **Turns to Win:** 295 ÷ 400 = 1 turn
- **Survival HP Needed:** ~153 HP (requires good positioning/healing)

**Recommended Level:** 10

---

## Summary Table: Houses 1-12

| House | Enemies | Total Enemy HP | Enemy DPS | Min Player DPS | Min Player HP | Rec Level | Notes |
|-------|---------|----------------|-----------|----------------|---------------|-----------|-------|
| 1 | Garet Enemy | 240 | 63 | 60 | 252 | 3 | Tutorial, high magic damage |
| 2 | Earth Scout + Venus Wolf | 525 | 28 | 92 | 168 | 3 | First 2-enemy fight |
| 3 | Flame Scout + Mars Wolf | 515 | 82 | 150 | 328 | 4 | High DPS threat |
| 4 | Frost Scout + Mercury Wolf | 520 | 58 | 160 | 232 | 4 | Moderate threat |
| 5 | Gale Scout + Jupiter Wolf | 470 | 73 | 200 | 219 | 5 | Full 4-unit party |
| 6 | 3 Scouts + Wolf | 750 | 90 | 220 | 360 | 6 | First 3-enemy fight |
| 7 | Terra Soldier + Venus Bear | 195 | 52 | 250 | 52 | 6-7 | AoE unlock |
| 8 | Wind Soldier + Jupiter Bear | 170 | 110 | 280 | 110 | 7 | Djinn summons |
| 9 | Tide Soldier + Mercury Bear + Ice Elemental | 325 | 120 | 320 | 240 | 8 | Elemental intro |
| 10 | Blaze Soldier + Mars Bear + Flame Elemental | 300 | 140 | 340 | 140 | 8-9 | High magic DPS |
| 11 | Stone Captain + Rock Elemental | 270 | 72 | 360 | 72 | 9 | AoE heavy |
| 12 | Inferno Captain + Phoenix | 295 | 153 | 400 | 153 | 10 | T2 Djinn needed |

---

## Key Insights

### Difficulty Spikes
1. **House 1 → 3:** Sharp DPS increase from 63 → 82 damage/turn
2. **House 8:** Magic-heavy enemies (110 DPS) require strong healing
3. **House 12:** Final boss of Act 2, requires T2 Djinn summons (153 DPS)

### Progression Curve
- **Level 1-5:** Linear growth, party size increases
- **Level 6-7:** Summons unlock (House 7), DPS doubles
- **Level 8-10:** Elemental encounters, requires elemental strategy
- **Level 10+:** T2 Djinn mandatory for survival

### Critical Thresholds
- **200 HP:** Required by House 3 to survive Mars Wolf focus fire
- **300 HP:** Required by House 6 for 3-enemy encounters
- **400 DPS:** Required by House 12 to one-shot Phoenix

### Equipment Impact
- **Bronze Sword (House 2):** +10 ATK → +10 DPS
- **Iron Armor (House 3):** +8 DEF → -4 damage taken per hit
- **Steel Helm (House 6):** +6 DEF → -3 damage taken per hit
- **Valkyrie Mail (House 12):** +12 DEF + 20% elemental resist → critical survival boost

---

## Recommendations for Balance

### Early Game (Houses 1-4)
- ✅ **Well-balanced:** Enemy HP scales with party growth
- ⚠️ **House 1 HP:** 240 HP might be too high for solo Isaac (requires 4 turns)
- ✅ **House 3 DPS:** 82 damage/turn is a good difficulty spike

### Mid Game (Houses 5-8)
- ✅ **Party expansion:** 4 units by House 5 is well-timed
- ✅ **Djinn unlock:** House 7 summons provide satisfying power spike
- ⚠️ **House 8 DPS:** 110 damage/turn might one-shot low-HP units (Garet: ~110 HP at L7)

### Late Game (Houses 9-12)
- ✅ **Elemental variety:** Forces strategic element matching
- ⚠️ **House 12 DPS:** 153 damage/turn requires perfect play or overleveling
- 💡 **Suggestion:** Add equipment drops at Houses 9-11 for defensive scaling

---

## Win Equation Formula

For any House N:
```
turns_to_win = ceil(total_enemy_hp / player_dps)
survival_hp = enemy_dps * turns_to_win * survival_factor
survival_factor = 0.8 (with healing) | 1.2 (no healing)

recommended_level = min_level where:
  player_dps >= (total_enemy_hp / target_turns)
  player_hp * party_size >= survival_hp
  target_turns = 3-5 (early) | 2-3 (mid) | 1-2 (late)
```

---

**End of Analysis**
