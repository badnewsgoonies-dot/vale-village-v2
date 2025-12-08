# Battle Tower Normalization - Implementation Roadmap

## Phase 1: Core Services (Priority: HIGH, Time: 6-8 hours)

### Task 1.1: Level Normalization Service
**File**: `/home/geni/Documents/vale-village-v2/src/core/services/LevelNormalizationService.ts`

```bash
# Implementation steps:
1. Create LevelNormalizationService.ts
2. Implement calculateFloorTargetLevel() with stepped/linear/exponential curves
3. Implement calculateLevelScaledStats() with Golden Sun growth rates
4. Implement normalizeUnitForFloor() and normalizePartyForFloor()
5. Write unit tests: test each curve type, stat scaling edge cases
6. Run: pnpm typecheck && pnpm test
```

**Success Criteria**:
- All curve types work correctly
- Level 10 → 20 scaling matches Golden Sun stat growth
- Units can be normalized up or down
- No negative stats

### Task 1.2: Tower Service Integration
**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerService.ts`

```bash
# Implementation steps:
1. Add prepareFloorBattle() function
2. Import normalizePartyForFloor from LevelNormalizationService
3. Extend TowerRunState interface (bracketId, rentalTeamId, isUsingRentalTeam)
4. Update createTowerRun() signature
5. Write integration tests
6. Run: pnpm typecheck
```

**Success Criteria**:
- prepareFloorBattle returns normalized party when enabled
- TowerRunState tracks rental/bracket metadata
- Backward compatible with existing tower runs

---

## Phase 2: Schemas & Data (Priority: HIGH, Time: 4-5 hours)

### Task 2.1: Schema Updates
**Files**:
- `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerFloorSchema.ts`
- `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerRewardSchema.ts`
- `/home/geni/Documents/vale-village-v2/src/core/config/towerConfig.ts`

```bash
# Implementation steps:
1. Add normalizedLevel field to TowerFloorBaseSchema
2. Add consumable/currency/cosmetic to TowerRewardTypeSchema
3. Add quantity and rarity fields to TowerRewardEntrySchema
4. Add enableLevelNormalization and levelNormalizationCurve to TowerConfig
5. Update DEFAULT_TOWER_CONFIG
6. Run: pnpm typecheck
```

**Success Criteria**:
- All schemas parse correctly
- No breaking changes to existing data
- Zod validation passes

### Task 2.2: Update Floor Definitions
**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/towerFloors.ts`

```bash
# Implementation steps:
1. Add normalizedLevel to all 30 floors
2. Pattern: floors 1-5 = level 5, 6-10 = level 10, etc.
3. Add 'milestone' tag to floors 5, 10, 15, 20, 25, 30
4. Run: pnpm validate:data
```

**Success Criteria**:
- All floors have normalizedLevel
- Stepped progression (5/10/15/20/25/30)
- Data validation passes

### Task 2.3: Expand Reward Definitions
**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/towerRewards.ts`

```bash
# Implementation steps:
1. Add rewards for floors 5, 15 (currently missing)
2. Enhance existing rewards (6, 7, 10, 20, 25, 30) with rarity/quantity
3. Add consumable rewards (potions, elixirs)
4. Add currency rewards (gold scaling 500→10000)
5. Add cosmetic rewards (titles, sprites) at 25/30
6. Run: pnpm validate:data
```

**Success Criteria**:
- 6 reward milestones (every 5 floors)
- Progression curve feels balanced
- Includes all new reward types

---

## Phase 3: Rental Teams (Priority: MEDIUM, Time: 5-6 hours)

### Task 3.1: Rental Team Schema
**File**: `/home/geni/Documents/vale-village-v2/src/data/schemas/RentalTeamSchema.ts`

```bash
# Implementation steps:
1. Create RentalTeamSchema.ts
2. Define schema with id, name, theme, unitIds, equipment, djinn, etc.
3. Add recommendedForFloors and difficulty fields
4. Run: pnpm typecheck
```

### Task 3.2: Rental Team Definitions
**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/rentalTeams.ts`

```bash
# Implementation steps:
1. Create 8 rental teams:
   - rental-starter-balanced (beginner)
   - rental-earth-defense (beginner)
   - rental-fire-burst (intermediate)
   - rental-water-sustain (intermediate)
   - rental-wind-speed (intermediate)
   - rental-rainbow-comp (advanced)
   - rental-djinn-mastery (advanced)
   - rental-endgame-comp (advanced)
2. Assign equipment loadouts for each unit
3. Assign djinn loadouts
4. Run: pnpm validate:data
```

**Success Criteria**:
- 8 teams covering beginner/intermediate/advanced
- Each element represented
- Equipment/djinn references valid
- Floor ranges don't overlap too much

### Task 3.3: Rental Team Service
**File**: `/home/geni/Documents/vale-village-v2/src/core/services/RentalTeamService.ts`

```bash
# Implementation steps:
1. Implement getRentalTeamsForFloor()
2. Implement calculateTeamMatchScore()
3. Implement getRecommendedRentalTeams()
4. Implement instantiateRentalTeam() (stub for now)
5. Write unit tests
6. Run: pnpm test
```

**Success Criteria**:
- Recommendation algorithm works
- Match scoring is sensible
- Teams filtered correctly by floor

---

## Phase 4: Bracket System (Priority: MEDIUM, Time: 5-6 hours)

### Task 4.1: Bracket Schema
**File**: `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerBracketSchema.ts`

```bash
# Implementation steps:
1. Create TowerBracketSchema.ts
2. Define schema with id, difficulty, maxFloors, levelCap, restrictions, rewards
3. Add unlockCondition (storyProgress, previousBracketFloor)
4. Run: pnpm typecheck
```

### Task 4.2: Bracket Definitions
**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/towerBrackets.ts`

```bash
# Implementation steps:
1. Create 8 brackets:
   - bracket-training (10 floors, level 10)
   - bracket-beginner (20 floors, level 15)
   - bracket-standard (30 floors, level 20)
   - bracket-advanced (30 floors, level 25)
   - bracket-masters (50 floors, level 30)
   - bracket-little-cup (15 floors, level 5)
   - bracket-mono-element (20 floors, level 20)
   - bracket-rental-only (25 floors, level 20)
2. Set unlock conditions
3. Set reward multipliers
4. Run: pnpm validate:data
```

**Success Criteria**:
- 8 brackets with varied gameplay
- Unlock progression makes sense
- Reward multipliers balanced

### Task 4.3: Bracket Service
**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerBracketService.ts`

```bash
# Implementation steps:
1. Implement isBracketUnlocked()
2. Implement getBracketUnlockStatuses()
3. Implement getRecommendedBracket()
4. Write unit tests
5. Run: pnpm test
```

**Success Criteria**:
- Unlock logic works correctly
- Recommendations match player level
- Edge cases handled (no brackets unlocked, etc.)

---

## Phase 5: Reward Preview (Priority: LOW, Time: 2-3 hours)

### Task 5.1: Reward Preview Service
**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerRewardPreviewService.ts`

```bash
# Implementation steps:
1. Implement getNextRewardMilestone()
2. Implement getUpcomingRewards()
3. Implement calculateRewardValue()
4. Implement formatRewardDescription()
5. Write unit tests
6. Run: pnpm test
```

**Success Criteria**:
- Next milestone calculated correctly
- Upcoming rewards filtered by range
- Value calculation reasonable
- Descriptions formatted nicely

---

## Phase 6: UI Integration (Priority: MEDIUM, Time: 8-10 hours)

### Task 6.1: Bracket Selection Screen
**File**: `/home/geni/Documents/vale-village-v2/src/ui/screens/TowerBracketSelectScreen.tsx` (NEW)

```bash
# Implementation steps:
1. Create bracket selection component
2. Show all brackets with lock status
3. Display unlock requirements for locked brackets
4. Show recommended bracket with highlight
5. Allow player to select bracket
6. Navigate to rental team select or use own team
```

**Success Criteria**:
- Shows all 8 brackets
- Locked brackets grayed out with unlock text
- Recommended bracket highlighted
- Selection persists to tower run

### Task 6.2: Rental Team Picker
**File**: `/home/geni/Documents/vale-village-v2/src/ui/screens/RentalTeamSelectScreen.tsx` (NEW)

```bash
# Implementation steps:
1. Create rental team picker component
2. Show recommended teams at top
3. Display team composition (units, equipment, djinn)
4. Show theme/element tags
5. Allow "Use My Team" option
6. Normalize player team if selected
```

**Success Criteria**:
- Displays all rental teams for current floor
- Shows full team details
- Recommendations at top
- Can toggle between rental and own team

### Task 6.3: Reward Preview Widget
**File**: `/home/geni/Documents/vale-village-v2/src/ui/components/TowerRewardPreview.tsx` (NEW)

```bash
# Implementation steps:
1. Create reward preview component
2. Show next milestone floor and rewards
3. Display progress bar to next milestone
4. Show upcoming rewards (next 2-3 milestones)
5. Add rarity color coding
```

**Success Criteria**:
- Next milestone always visible
- Progress bar accurate
- Rewards formatted nicely
- Rarity colors intuitive

### Task 6.4: Level Normalization Indicator
**File**: `/home/geni/Documents/vale-village-v2/src/ui/components/UnitCard.tsx` (MODIFY)

```bash
# Implementation steps:
1. Add "normalized level" badge to unit cards
2. Show original level vs. normalized level
3. Highlight stat changes due to normalization
4. Add tooltip explaining normalization
```

**Success Criteria**:
- Clear visual indicator on normalized units
- Shows both levels (original → normalized)
- Doesn't clutter UI

### Task 6.5: Update Tower Hub Screen
**File**: `/home/geni/Documents/vale-village-v2/src/ui/screens/TowerHubScreen.tsx` (MODIFY)

```bash
# Implementation steps:
1. Add "Select Bracket" button
2. Show current bracket and level cap
3. Display progress in current bracket
4. Add "View Rewards" button
5. Show personal best for each bracket
```

**Success Criteria**:
- Bracket selection accessible
- Current progress visible
- Can view all brackets and rewards

---

## Phase 7: Testing & Polish (Priority: HIGH, Time: 4-5 hours)

### Task 7.1: Unit Tests

```bash
# Test coverage goals:
- LevelNormalizationService: 90%+ coverage
- RentalTeamService: 80%+ coverage
- TowerBracketService: 80%+ coverage
- TowerRewardPreviewService: 80%+ coverage
- TowerService (modified functions): 90%+ coverage

# Run: pnpm test --coverage
```

### Task 7.2: Integration Tests

```bash
# Test scenarios:
1. Create tower run with rental team
2. Normalize party for each floor
3. Unlock brackets based on progress
4. Calculate rewards at milestones
5. Switch between brackets mid-run
6. Handle edge cases (level 1 unit normalized to 30, etc.)

# Run: pnpm test:integration
```

### Task 7.3: Playtesting

```bash
# Manual testing checklist:
- [ ] Start Training Grounds bracket (level 10 cap)
- [ ] Select rental team
- [ ] Verify units normalized to level 10
- [ ] Complete floor 5, receive rewards
- [ ] Check reward preview shows floor 10
- [ ] Unlock Beginner bracket
- [ ] Switch to Beginner, verify level 15 normalization
- [ ] Use own team, verify normalization works
- [ ] Complete multiple brackets
- [ ] Test all 8 rental teams
- [ ] Test special brackets (Little Cup, Mono-Element, Rental-Only)
```

### Task 7.4: Balance Tuning

```bash
# Review and adjust:
- Stat growth rates (5 HP, 1.5 PP, 2.5 combat stats per level)
- Reward quantities (500g → 10000g progression)
- Bracket unlock requirements (too easy? too hard?)
- Rental team power levels (balanced across difficulty tiers?)
- Enemy scaling interaction with normalization

# May require iteration based on playtest feedback
```

---

## Phase 8: Documentation (Priority: LOW, Time: 2 hours)

### Task 8.1: Update Game Manual

```bash
# Add sections to game manual:
1. Tower Normalization System
2. How to Use Rental Teams
3. Bracket System Overview
4. Reward Milestone Guide
5. Strategy Tips for Each Bracket

# File: /home/geni/Documents/vale-village-v2/docs/GAME_MANUAL.md
```

### Task 8.2: API Documentation

```bash
# Document new services:
- LevelNormalizationService API
- RentalTeamService API
- TowerBracketService API
- TowerRewardPreviewService API

# Add JSDoc comments to all public functions
```

### Task 8.3: Changelog

```bash
# Create changelog entry:
## v2.1.0 - Tower Normalization Update

### Added
- Level normalization system (stepped/linear/exponential curves)
- 8 rental teams with pre-built loadouts
- 8 tower brackets (Training to Master's Challenge)
- Progressive rewards every 5 floors
- Reward preview widget
- Bracket unlock system

### Changed
- Tower rewards now include consumables, currency, cosmetics
- Floor definitions include normalizedLevel field
- TowerRunState tracks rental team and bracket metadata

### Fixed
- Tower progression no longer requires story grinding
- Players stuck at difficulty walls have clear path forward

# File: /home/geni/Documents/vale-village-v2/CHANGELOG.md
```

---

## Implementation Timeline

### Week 1: Core + Data (16-19 hours)
- Day 1-2: Phase 1 (Core Services) - 6-8 hours
- Day 3-4: Phase 2 (Schemas & Data) - 4-5 hours
- Day 5: Phase 3 Part 1 (Rental Schemas + Data) - 3-4 hours
- Day 6-7: Phase 3 Part 2 (Rental Service) - 2-3 hours

### Week 2: Brackets + UI Foundation (13-16 hours)
- Day 8-9: Phase 4 (Bracket System) - 5-6 hours
- Day 10: Phase 5 (Reward Preview) - 2-3 hours
- Day 11-12: Phase 6 Part 1 (Bracket Select + Rental Picker) - 5-6 hours

### Week 3: UI Polish + Testing (14-17 hours)
- Day 13-14: Phase 6 Part 2 (Reward Preview + Normalization UI) - 4-5 hours
- Day 15: Phase 6 Part 3 (Tower Hub Updates) - 2-3 hours
- Day 16-17: Phase 7 (Testing & Polish) - 4-5 hours
- Day 18: Phase 8 (Documentation) - 2 hours

**Total Estimated Time**: 43-52 hours (roughly 2.5-3 weeks at 20 hours/week)

---

## Risk Mitigation

### Risk 1: Unit Instantiation Complexity
**Problem**: Rental team instantiation may be complex depending on unit system
**Mitigation**: Stub instantiateRentalTeam() in Phase 3, implement fully in Phase 6 after UI is clearer

### Risk 2: Balance Issues
**Problem**: Stat scaling or reward progression may feel off
**Mitigation**: Build tuning pass into Phase 7, gather playtest feedback early

### Risk 3: UI Complexity
**Problem**: Bracket + rental selection may overwhelm new players
**Mitigation**: Add "Quick Start" option that auto-selects recommended bracket and rental team

### Risk 4: Performance
**Problem**: Normalizing party every floor could be slow
**Mitigation**: Memoize normalized units, only recalculate on floor change or party swap

### Risk 5: Save Compatibility
**Problem**: New TowerRunState fields may break existing saves
**Mitigation**: Add migration logic, default rentalTeamId/bracketId to null for old runs

---

## Success Metrics

### Quantitative
- 0 typecheck errors
- 85%+ test coverage on new services
- 0 data validation errors
- <100ms normalization time for 4-unit party
- All 8 brackets playable end-to-end

### Qualitative
- Stuck players can progress via Training Grounds
- Rental teams feel balanced vs. player teams
- Reward progression feels motivating
- Bracket variety adds replayability
- UI is intuitive without tutorial

### Player Impact
- Reduced churn at difficulty walls (target: <25% from 75%)
- Increased tower engagement (target: 50%+ of players try tower)
- Positive sentiment on normalization system
- Rental teams used by 30%+ of players

---

## Post-Launch Iteration

### v2.2 Potential Features
1. **Daily/Weekly Tower Challenges**: Rotating modifiers (double damage, all crits, djinn-only)
2. **Leaderboards**: Fastest clear times per bracket
3. **Custom Brackets**: Let players create brackets with custom rules
4. **More Rental Teams**: Community-designed teams, seasonal teams
5. **Cosmetic Rewards**: More titles, unit skins, victory animations
6. **Co-op Tower**: 2-player teams tackle floors together
7. **Tower Editor**: Design custom floor sequences

---

## Appendix: File Checklist

### New Files (8)
- [ ] `/home/geni/Documents/vale-village-v2/src/core/services/LevelNormalizationService.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/data/schemas/RentalTeamSchema.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/data/definitions/rentalTeams.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/core/services/RentalTeamService.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerBracketSchema.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/data/definitions/towerBrackets.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/core/services/TowerBracketService.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/core/services/TowerRewardPreviewService.ts`

### Modified Files (5)
- [ ] `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerFloorSchema.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/core/config/towerConfig.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/core/services/TowerService.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerRewardSchema.ts`
- [ ] `/home/geni/Documents/vale-village-v2/src/data/definitions/towerRewards.ts`

### UI Files (5 new, 2 modified)
- [ ] `/home/geni/Documents/vale-village-v2/src/ui/screens/TowerBracketSelectScreen.tsx` (NEW)
- [ ] `/home/geni/Documents/vale-village-v2/src/ui/screens/RentalTeamSelectScreen.tsx` (NEW)
- [ ] `/home/geni/Documents/vale-village-v2/src/ui/components/TowerRewardPreview.tsx` (NEW)
- [ ] `/home/geni/Documents/vale-village-v2/src/ui/components/UnitCard.tsx` (MODIFY)
- [ ] `/home/geni/Documents/vale-village-v2/src/ui/screens/TowerHubScreen.tsx` (MODIFY)

---

## Quick Start Commands

```bash
# Phase 1: Core Services
cd /home/geni/Documents/vale-village-v2
touch src/core/services/LevelNormalizationService.ts
# ... implement ...
pnpm typecheck && pnpm test

# Phase 2: Schemas
# ... edit schema files ...
pnpm validate:data

# Phase 3: Rental Teams
touch src/data/schemas/RentalTeamSchema.ts
touch src/data/definitions/rentalTeams.ts
touch src/core/services/RentalTeamService.ts
# ... implement ...
pnpm typecheck && pnpm validate:data

# Phase 4: Brackets
touch src/data/schemas/TowerBracketSchema.ts
touch src/data/definitions/towerBrackets.ts
touch src/core/services/TowerBracketService.ts
# ... implement ...
pnpm typecheck && pnpm validate:data

# Phase 5: Reward Preview
touch src/core/services/TowerRewardPreviewService.ts
# ... implement ...
pnpm test

# Phase 6: UI
touch src/ui/screens/TowerBracketSelectScreen.tsx
touch src/ui/screens/RentalTeamSelectScreen.tsx
touch src/ui/components/TowerRewardPreview.tsx
# ... implement ...
pnpm dev  # Test in browser

# Phase 7: Testing
pnpm test --coverage
pnpm test:integration
# Manual playtesting

# Phase 8: Documentation
# Update GAME_MANUAL.md, CHANGELOG.md
```

---

## Contact & Questions

For implementation questions or design clarifications, refer to:
- Design Document: `/home/geni/Documents/vale-village-v2/TOWER_NORMALIZATION_DESIGN.md`
- Memory System: `./mem-db.py query topic=tower-normalization`
- Original Context: Memory entries on tower-audit, game-design-theory

Good luck with implementation!
