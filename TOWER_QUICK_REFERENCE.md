# Battle Tower Normalization - Quick Reference

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOWER NORMALIZATION SYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   BRACKET    │  │    RENTAL    │  │    LEVEL     │          │
│  │   SYSTEM     │  │    TEAMS     │  │ NORMALIZATION│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│       8 tiers         8 teams        stepped/linear             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          PROGRESSIVE REWARDS (Every 5 Floors)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│   Floor 5    Floor 10   Floor 15   Floor 20   Floor 25  Floor 30│
│   500g+      Iron+      Steel+     Mythril+   Sol+      Excalibur│
│   potions    djinn      elixirs    djinn      title     legendary│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Level Normalization

### Stepped Curve (Default)
```
Floors 1-5   → Level 5
Floors 6-10  → Level 10
Floors 11-15 → Level 15
Floors 16-20 → Level 20
Floors 21-25 → Level 25
Floors 26-30 → Level 30
```

### Stat Growth Rates (per level)
```
HP:  +5 per level
PP:  +1.5 per level (rounded)
ATK: +2.5 per level (rounded)
DEF: +2.5 per level (rounded)
MAG: +2.5 per level (rounded)
SPD: +1.5 per level (rounded)
```

### Example
```
Unit: Isaac (Adept)
Original: Level 8, HP 80, ATK 25, DEF 22, MAG 18, SPD 15

Floor 15 Normalization (Level 15):
- Delta: 15 - 8 = 7 levels
- HP: 80 + (7 × 5) = 115
- ATK: 25 + (7 × 2.5) = 42
- DEF: 22 + (7 × 2.5) = 39
- MAG: 18 + (7 × 2.5) = 35
- SPD: 15 + (7 × 1.5) = 25 (rounded)

Normalized: Level 15, HP 115, ATK 42, DEF 39, MAG 35, SPD 25
```

---

## Rental Teams

### Beginner Teams (Floors 1-15)
```
1. Starter Squad
   - Units: Adept, War Mage, Mystic
   - Element: Mixed
   - Style: Balanced
   - Best for: Learning

2. Earth Guardians
   - Units: Adept, Sentinel, Master Warrior
   - Element: Venus
   - Style: Tank/Defense
   - Best for: Survivability
```

### Intermediate Teams (Floors 5-20)
```
3. Blaze Brigade
   - Units: War Mage, Blaze, Tyrell
   - Element: Mars
   - Style: Glass Cannon DPS
   - Best for: Fast clears

4. Tidal Healers
   - Units: Mystic, Karis, Versatile Scholar
   - Element: Mercury
   - Style: Sustain/Support
   - Best for: Long battles

5. Storm Strikers
   - Units: Ranger, Stormcaller, Rogue Assassin
   - Element: Jupiter
   - Style: Speed/Multi-hit
   - Best for: Speedruns
```

### Advanced Teams (Floors 15-30)
```
6. Elemental Harmony
   - Units: Master Warrior, Tyrell, Karis, Stormcaller
   - Element: Mixed (one of each)
   - Style: Versatile
   - Best for: Adaptability

7. Djinn Masters
   - Units: Versatile Scholar, Elemental Mage, Mystic, Ranger
   - Element: Mixed
   - Style: Summon-focused
   - Djinn: 12 total
   - Best for: Burst damage

8. Tower Legends
   - Units: Master Warrior, Versatile Scholar, Karis, Stormcaller
   - Element: Mixed
   - Style: Endgame optimized
   - Equipment: Excalibur, Zodiac Wand, Lachesis Rule, Atropos Rod
   - Best for: Final floors 25-30
```

---

## Tower Brackets

### Standard Progression Brackets
```
┌────────────────────────────────────────────────────────────┐
│ Training Grounds (Easy)                                     │
│ - 10 floors, Level 10 cap                                   │
│ - Unlock: Always available                                  │
│ - Rewards: 0.8x multiplier                                  │
│ - Purpose: Learn mechanics                                  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Beginner Tower (Easy)                                       │
│ - 20 floors, Level 15 cap                                   │
│ - Unlock: Complete House 5                                  │
│ - Rewards: 1.0x multiplier                                  │
│ - Purpose: Main tower for early players                     │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Standard Tower (Medium) ⭐ CLASSIC                          │
│ - 30 floors, Level 20 cap                                   │
│ - Unlock: Complete House 10                                 │
│ - Rewards: 1.2x multiplier                                  │
│ - Purpose: Main tower experience                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Advanced Tower (Hard)                                       │
│ - 30 floors, Level 25 cap                                   │
│ - Unlock: Complete House 15 + Beat Standard Floor 20       │
│ - Rewards: 1.5x multiplier                                  │
│ - Purpose: Challenge for skilled players                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Master's Challenge (Extreme)                                │
│ - 50 floors, Level 30 cap                                   │
│ - Unlock: Complete House 20 + Beat Advanced Floor 30       │
│ - Rewards: 2.0x multiplier                                  │
│ - Purpose: Ultimate endgame challenge                       │
└────────────────────────────────────────────────────────────┘
```

### Special Brackets
```
┌────────────────────────────────────────────────────────────┐
│ Little Cup (Medium)                                         │
│ - 15 floors, Level 5 cap, 3-unit teams                      │
│ - Unlock: Complete House 10                                 │
│ - Rewards: 1.3x XP, 0.9x Gold                               │
│ - Purpose: Strategy over stats                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Mono-Element Gauntlet (Hard)                                │
│ - 20 floors, Level 20 cap                                   │
│ - Restriction: All units must share one element             │
│ - Unlock: Complete House 15                                 │
│ - Rewards: 1.8x multiplier                                  │
│ - Purpose: Element mastery challenge                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Rental Championship (Medium)                                │
│ - 25 floors, Level 20 cap                                   │
│ - Restriction: MUST use rental teams                        │
│ - Unlock: Complete House 12                                 │
│ - Rewards: 1.4x multiplier                                  │
│ - Purpose: Pure skill test (no grinding advantage)          │
└────────────────────────────────────────────────────────────┘
```

---

## Progressive Rewards

### Milestone Breakdown
```
Floor 5  ✓
├─ 500 gold
├─ 3× Potion
└─ Rarity: Common

Floor 10 ✓
├─ Iron Sword (Tier 2 weapon)
├─ Granite Djinn (Venus)
├─ 1,000 gold
└─ Rarity: Uncommon

Floor 15 ✓
├─ Steel Blade (Tier 3 weapon)
├─ 2× Elixir
├─ 1,500 gold
└─ Rarity: Rare

Floor 20 ✓
├─ Mythril Sword + Mythril Armor
├─ Squall Djinn (Jupiter)
├─ 2,500 gold
└─ Rarity: Rare

Floor 25 ✓
├─ Sol Blade (Legendary Mars weapon)
├─ Bane Djinn
├─ 5,000 gold
├─ Title: "Tower Champion"
└─ Rarity: Epic

Floor 30 ✓✓✓ GRAND PRIZE
├─ Excalibur (Legendary sword)
├─ Aegis Armor (Legendary armor)
├─ Zeus Crown (Legendary helm)
├─ Storm Djinn + Celestial Djinn
├─ 10,000 gold
├─ Title: "Tower Master"
├─ Cosmetic: Golden Aura sprite
└─ Rarity: Legendary
```

### Reward Value Progression
```
Floor:   5     10    15    20    25    30
Gold:    500   1K    1.5K  2.5K  5K    10K
Value:   ★     ★★    ★★★   ★★★★  ★★★★★ ★★★★★★
```

---

## Player Flow Examples

### Example 1: Stuck Early Player
```
Player State:
- Story Progress: House 6 (stuck on boss)
- Party Level: 7-8
- Roster: Isaac, Garet, Mystic (3 units)

Solution Path:
1. Select "Training Grounds" bracket (Level 10 cap)
2. Choose "Starter Squad" rental team OR use own team (normalized to 10)
3. Complete 10 floors
4. Earn rewards: potions, Iron Sword, gold, djinn
5. Use resources to beat House 6 boss
6. Progress unlocked!

Outcome: No grinding needed, learned tower mechanics, got gear upgrade
```

### Example 2: Mid-Game Player Seeking Challenge
```
Player State:
- Story Progress: House 15 completed
- Party Level: 18-20
- Roster: 8 units, decent equipment

Solution Path:
1. Unlock "Advanced Tower" (beat Standard Floor 20 first)
2. Use own team, normalized to Level 25
3. Face harder enemies with 1.5x reward multiplier
4. Complete 30 floors over multiple runs
5. Earn mythril gear, rare djinn, 5K+ gold
6. Unlock "Master's Challenge"

Outcome: Engaged with endgame content, tested skill, big rewards
```

### Example 3: Veteran Player Testing Limits
```
Player State:
- Story Progress: House 20 completed
- Party Level: 25+
- Roster: All units unlocked

Solution Path:
1. Attempt "Little Cup" (Level 5 cap, strategy test)
2. Try "Mono-Element Gauntlet" with all-Venus team
3. Complete "Rental Championship" using Tower Legends rental
4. Tackle "Master's Challenge" 50-floor marathon
5. Speedrun Standard Tower with Storm Strikers rental

Outcome: Infinite replayability, varied challenges, mastery expression
```

---

## UI Mockup Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      TOWER HUB SCREEN                        │
│                                                               │
│  Current Bracket: Standard Tower (20/30 floors)              │
│  Next Reward: Floor 25 (5 floors away) → Sol Blade + Title  │
│                                                               │
│  [Select Bracket]  [View Rewards]  [Continue Run]           │
└─────────────────────────────────────────────────────────────┘
                              ↓
                      (Click Select Bracket)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   BRACKET SELECTION SCREEN                   │
│                                                               │
│  ✓ Training Grounds     (Easy)     [Select]                 │
│  ✓ Beginner Tower       (Easy)     [Select]                 │
│  ✓ Standard Tower       (Medium)   [Select] ⭐ Recommended  │
│  ✓ Advanced Tower       (Hard)     [Select]                 │
│  🔒 Master's Challenge  (Extreme)  Unlock: Beat Adv Floor 30│
│  ✓ Little Cup           (Medium)   [Select]                 │
│  ✓ Mono-Element Gauntlet (Hard)    [Select]                 │
│  ✓ Rental Championship  (Medium)   [Select]                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
                      (Select Standard Tower)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  TEAM SELECTION SCREEN                       │
│                                                               │
│  [Use My Team]  [Use Rental Team] ← Select one              │
│                                                               │
│  Recommended Rental Teams for Floor 20:                      │
│  ┌────────────────────────────────────────────────┐         │
│  │ 1. Elemental Harmony (Advanced, Mixed)         │         │
│  │    Master Warrior, Tyrell, Karis, Stormcaller  │         │
│  │    "Versatile team for any situation"          │  [Pick] │
│  └────────────────────────────────────────────────┘         │
│  ┌────────────────────────────────────────────────┐         │
│  │ 2. Tower Legends (Advanced, Mixed)             │         │
│  │    Endgame gear, optimized for boss floors     │  [Pick] │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              ↓
                   (Select Elemental Harmony)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   PRE-BATTLE SCREEN                          │
│                                                               │
│  Floor 20: Boss - Overseer (Difficulty Tier 5)              │
│  Level Cap: 20 (Your units normalized from level 18)        │
│                                                               │
│  Your Team:                                                  │
│  ┌──────────────────────────────────────────────┐           │
│  │ Master Warrior  Lvl 18→20 ⬆  HP 115  ATK 42  │           │
│  │ Tyrell         Lvl 18→20 ⬆  HP 105  ATK 45  │           │
│  │ Karis          Lvl 18→20 ⬆  HP 95   MAG 48  │           │
│  │ Stormcaller    Lvl 18→20 ⬆  HP 90   MAG 50  │           │
│  └──────────────────────────────────────────────┘           │
│                                                               │
│  Next Reward: Floor 25 (5 more floors!)                      │
│  → Sol Blade + Bane Djinn + "Tower Champion" title          │
│                                                               │
│  [Start Battle]                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Architecture

```
src/
├── core/
│   ├── config/
│   │   └── towerConfig.ts                  (MODIFIED)
│   │       - enableLevelNormalization
│   │       - levelNormalizationCurve
│   │
│   └── services/
│       ├── TowerService.ts                 (MODIFIED)
│       │   - prepareFloorBattle()
│       │   - TowerRunState: bracketId, rentalTeamId
│       │
│       ├── LevelNormalizationService.ts    (NEW)
│       │   - calculateFloorTargetLevel()
│       │   - normalizeUnitForFloor()
│       │   - normalizePartyForFloor()
│       │
│       ├── RentalTeamService.ts            (NEW)
│       │   - getRentalTeamsForFloor()
│       │   - getRecommendedRentalTeams()
│       │   - instantiateRentalTeam()
│       │
│       ├── TowerBracketService.ts          (NEW)
│       │   - isBracketUnlocked()
│       │   - getRecommendedBracket()
│       │
│       └── TowerRewardPreviewService.ts    (NEW)
│           - getNextRewardMilestone()
│           - getUpcomingRewards()
│
├── data/
│   ├── schemas/
│   │   ├── TowerFloorSchema.ts             (MODIFIED)
│   │   │   - Add normalizedLevel field
│   │   │
│   │   ├── TowerRewardSchema.ts            (MODIFIED)
│   │   │   - Add consumable/currency/cosmetic types
│   │   │   - Add quantity, rarity fields
│   │   │
│   │   ├── RentalTeamSchema.ts             (NEW)
│   │   └── TowerBracketSchema.ts           (NEW)
│   │
│   └── definitions/
│       ├── towerFloors.ts                  (MODIFIED)
│       │   - Add normalizedLevel to all 30 floors
│       │
│       ├── towerRewards.ts                 (MODIFIED)
│       │   - Expand to 6 milestones (every 5 floors)
│       │
│       ├── rentalTeams.ts                  (NEW)
│       │   - Define 8 rental teams
│       │
│       └── towerBrackets.ts                (NEW)
│           - Define 8 brackets
│
└── ui/
    ├── screens/
    │   ├── TowerBracketSelectScreen.tsx   (NEW)
    │   ├── RentalTeamSelectScreen.tsx     (NEW)
    │   └── TowerHubScreen.tsx              (MODIFIED)
    │
    └── components/
        ├── TowerRewardPreview.tsx          (NEW)
        └── UnitCard.tsx                    (MODIFIED)
            - Show normalization indicator
```

---

## Testing Checklist

### Unit Tests
- [ ] LevelNormalizationService
  - [ ] calculateFloorTargetLevel: stepped/linear/exponential curves
  - [ ] calculateLevelScaledStats: stat growth rates
  - [ ] normalizeUnitForFloor: up-scaling and down-scaling
  - [ ] Edge cases: level 1→50, level 50→1

- [ ] RentalTeamService
  - [ ] getRentalTeamsForFloor: correct filtering
  - [ ] calculateTeamMatchScore: scoring algorithm
  - [ ] getRecommendedRentalTeams: top 3 recommendations

- [ ] TowerBracketService
  - [ ] isBracketUnlocked: unlock conditions
  - [ ] getRecommendedBracket: player level matching
  - [ ] Edge cases: no brackets unlocked

- [ ] TowerRewardPreviewService
  - [ ] getNextRewardMilestone: next floor calculation
  - [ ] getUpcomingRewards: range filtering
  - [ ] calculateRewardValue: value scoring

### Integration Tests
- [ ] Create tower run with rental team
- [ ] Normalize party for each floor (1-30)
- [ ] Switch brackets mid-progression
- [ ] Unlock brackets based on story progress
- [ ] Calculate rewards at milestone floors
- [ ] Handle edge cases (empty party, null bracket)

### Playtesting Scenarios
- [ ] Training Grounds: Complete 10 floors with rental team
- [ ] Beginner Tower: Complete 20 floors with own team
- [ ] Standard Tower: Reach floor 30 and claim grand prize
- [ ] Little Cup: Win with level 5 units
- [ ] Mono-Element: Complete with all-Mars team
- [ ] Rental Championship: Clear 25 floors using only rentals
- [ ] Verify all reward milestones grant items
- [ ] Check normalization UI displays correctly
- [ ] Test bracket unlock progression
- [ ] Verify save/load works with new fields

---

## Common Issues & Solutions

### Issue: Units don't normalize
**Solution**: Check `config.enableLevelNormalization = true` in TowerConfig

### Issue: Rental team missing units
**Solution**: Verify all unitIds exist in unit definitions

### Issue: Bracket won't unlock
**Solution**: Check storyProgress and previousBracketFloor in save data

### Issue: Rewards not appearing
**Solution**: Verify floorNumber matches reward definition exactly

### Issue: Stats after normalization are negative
**Solution**: calculateLevelScaledStats uses Math.max(1, ...) for safety

### Issue: Normalization too slow
**Solution**: Memoize normalized units, only recalculate on floor change

---

## Performance Benchmarks

### Target Performance
- Normalize 4-unit party: <100ms
- Calculate floor target level: <1ms
- Get recommended rental teams: <10ms
- Check bracket unlock status: <5ms
- Render reward preview: <50ms

### Optimization Tips
1. Memoize normalized units per floor
2. Pre-calculate bracket unlock status on load
3. Cache rental team recommendations
4. Lazy-load reward definitions
5. Use React.memo for UI components

---

## Future Enhancements (v2.2+)

### Potential Features
1. **Daily Challenges**: Rotating modifiers (double damage, crit mode, djinn-only)
2. **Leaderboards**: Fastest clear times per bracket
3. **Custom Brackets**: Player-created rule sets
4. **More Rentals**: Seasonal teams, community designs
5. **Co-op Mode**: 2-player teams tackle floors together
6. **Tower Editor**: Design custom floor sequences
7. **Achievement System**: Titles for special clears (flawless, solo, speedrun)
8. **Cosmetic Shop**: Spend tower currency on skins/emotes

---

## Quick Commands

```bash
# Run typecheck
pnpm typecheck

# Validate data
pnpm validate:data

# Run tests
pnpm test
pnpm test --coverage

# Start dev server
pnpm dev

# Query memory for tower design
./mem-db.sh query topic=tower-normalization limit=10

# Check implementation progress
./mem-db.sh query topic=tower-implementation recent=7d
```

---

## Document References

- **Design Document**: `/home/geni/Documents/vale-village-v2/TOWER_NORMALIZATION_DESIGN.md`
- **Implementation Roadmap**: `/home/geni/Documents/vale-village-v2/TOWER_IMPLEMENTATION_ROADMAP.md`
- **This Quick Reference**: `/home/geni/Documents/vale-village-v2/TOWER_QUICK_REFERENCE.md`

---

**Last Updated**: 2025-12-08
**Status**: Design Complete, Implementation Pending
**Estimated Completion**: 2.5-3 weeks (43-52 hours)
