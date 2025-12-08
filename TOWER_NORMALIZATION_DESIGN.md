# Battle Tower Normalization Features - Design Document

## Executive Summary

Transform the Battle Tower from a pure challenge mode into a **progression safety net** that helps struggling players while maintaining skill-testing difficulty. Inspired by Pokemon Battle Tower, Golden Sun's Battle Mode, and player retention research showing 75% churn at difficulty walls.

## Current State Analysis

### What Exists
- **TowerService.ts**: Core tower logic with floor progression, battle tracking, enemy scaling
- **towerFloors.ts**: 30 floors with normal/rest/boss types, difficulty tiers 1-8
- **towerConfig.ts**: Configuration for rest intervals, healing, enemy scaling (4% per floor)
- **Reward System**: Equipment, djinn, and recruit rewards at milestone floors

### Current Problems
1. **No level normalization** - Player must have strong units at their current story level
2. **No rental teams** - Stuck players can't progress without grinding story mode
3. **Single difficulty bracket** - No easy mode for learning, no hard mode for mastery
4. **Sparse rewards** - Only 5 reward floors (6, 7, 10, 25, 30) across 30 floors

### Research Insights
- **Player Retention**: 75% churn at difficulty walls without recourse
- **Golden Sun Tower**: Had rental teams, skill-based challenge, normalized power
- **Pokemon Battle Tower**: Multiple brackets (Little Cup, Open Level, etc.), streak rewards
- **Flow Theory**: Challenge must match skill to avoid frustration or boredom

---

## Feature 1: Level Normalization

### Design
Scale all player units to a floor-appropriate level, removing story progression dependency.

### Implementation

#### 1.1 Schema Changes

**File**: `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerFloorSchema.ts`

```typescript
const TowerFloorBaseSchema = z.object({
  id: z.string().min(1),
  floorNumber: z.number().int().min(1),
  difficultyTier: z.number().int().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]).readonly(),
  // NEW: Level normalization for this floor
  normalizedLevel: z.number().int().min(1).max(50).optional(),
});
```

#### 1.2 Tower Config Changes

**File**: `/home/geni/Documents/vale-village-v2/src/core/config/towerConfig.ts`

```typescript
export interface TowerConfig {
  restFloorInterval: number;
  targetMaxFloor: number;
  healFractionAtRest: number;
  enemyScalingPerFloor: number;
  bossFloorInterval: number;
  maxTeamSize: number;
  // NEW: Level normalization settings
  enableLevelNormalization: boolean;
  levelNormalizationCurve: 'linear' | 'stepped' | 'exponential';
}

export const DEFAULT_TOWER_CONFIG: TowerConfig = {
  restFloorInterval: 4,
  targetMaxFloor: 100,
  healFractionAtRest: 0.5,
  enemyScalingPerFloor: 0.04,
  bossFloorInterval: 5,
  maxTeamSize: 4,
  // NEW defaults
  enableLevelNormalization: true,
  levelNormalizationCurve: 'stepped',
} as const;
```

#### 1.3 Level Normalization Service

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/LevelNormalizationService.ts` (NEW)

```typescript
import type { Unit } from '../../data/schemas/UnitSchema';
import type { TowerFloor } from '../../data/schemas/TowerFloorSchema';
import type { Stats } from '../../data/schemas/StatsSchema';

export interface NormalizedUnit extends Unit {
  originalLevel: number;
  normalizedLevel: number;
  normalizedStats: Stats;
}

/**
 * Calculate target level for a floor using stepped progression:
 * Floors 1-5: Level 5
 * Floors 6-10: Level 10
 * Floors 11-15: Level 15
 * Floors 16-20: Level 20
 * Floors 21-25: Level 25
 * Floors 26-30: Level 30
 */
export function calculateFloorTargetLevel(
  floorNumber: number,
  curve: 'linear' | 'stepped' | 'exponential' = 'stepped'
): number {
  switch (curve) {
    case 'stepped':
      return Math.ceil(floorNumber / 5) * 5;
    case 'linear':
      return floorNumber;
    case 'exponential':
      return Math.min(50, Math.floor(5 + (floorNumber * 1.5)));
    default:
      return Math.ceil(floorNumber / 5) * 5;
  }
}

/**
 * Calculate stat growth from base level to target level
 * Uses Golden Sun-style stat growth curves
 */
export function calculateLevelScaledStats(
  baseStats: Stats,
  fromLevel: number,
  toLevel: number
): Stats {
  if (fromLevel === toLevel) {
    return baseStats;
  }

  const levelDelta = toLevel - fromLevel;
  const growthRate = levelDelta > 0 ? 1 : -1;

  // Golden Sun growth rates: ~5 HP, ~1.5 PP, ~2-3 per level for combat stats
  const hpGrowth = Math.floor(5 * levelDelta);
  const ppGrowth = Math.floor(1.5 * levelDelta);
  const statGrowth = Math.floor(2.5 * levelDelta);

  return {
    hp: Math.max(1, baseStats.hp + hpGrowth),
    pp: Math.max(0, baseStats.pp + ppGrowth),
    atk: Math.max(1, baseStats.atk + statGrowth),
    def: Math.max(1, baseStats.def + statGrowth),
    mag: Math.max(1, baseStats.mag + statGrowth),
    spd: Math.max(1, baseStats.spd + Math.floor(1.5 * levelDelta)),
  };
}

/**
 * Normalize a unit to the target floor level
 */
export function normalizeUnitForFloor(
  unit: Unit,
  floor: TowerFloor,
  curve: 'linear' | 'stepped' | 'exponential' = 'stepped'
): NormalizedUnit {
  const targetLevel = floor.normalizedLevel ?? calculateFloorTargetLevel(floor.floorNumber, curve);
  const normalizedStats = calculateLevelScaledStats(unit.stats, unit.level, targetLevel);

  return {
    ...unit,
    originalLevel: unit.level,
    normalizedLevel: targetLevel,
    level: targetLevel, // Override current level
    stats: normalizedStats,
    normalizedStats,
  };
}

/**
 * Normalize a party (array of units) for a floor
 */
export function normalizePartyForFloor(
  party: readonly Unit[],
  floor: TowerFloor,
  curve: 'linear' | 'stepped' | 'exponential' = 'stepped'
): NormalizedUnit[] {
  return party.map(unit => normalizeUnitForFloor(unit, floor, curve));
}
```

#### 1.4 TowerService Integration

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerService.ts`

Add new function:

```typescript
import { normalizePartyForFloor, type NormalizedUnit } from './LevelNormalizationService';

export interface PrepareFloorBattleParams {
  run: TowerRunState;
  floors: readonly TowerFloor[];
  party: readonly Unit[];
}

export interface PreparedFloorBattle {
  floor: TowerFloor;
  normalizedParty: readonly NormalizedUnit[];
  enemyScaling: ScalingParams;
  isNormalized: boolean;
}

/**
 * Prepare a floor battle with level normalization and enemy scaling
 */
export function prepareFloorBattle({
  run,
  floors,
  party,
}: PrepareFloorBattleParams): PreparedFloorBattle | null {
  const floor = getCurrentFloor(run, floors);
  if (!floor || floor.type === 'rest') {
    return null;
  }

  const enemyScaling = calculateEnemyScaling(floor.floorNumber, run.difficulty, run.config);

  if (run.config.enableLevelNormalization) {
    const normalizedParty = normalizePartyForFloor(
      party,
      floor,
      run.config.levelNormalizationCurve
    );
    return {
      floor,
      normalizedParty,
      enemyScaling,
      isNormalized: true,
    };
  }

  return {
    floor,
    normalizedParty: party as readonly NormalizedUnit[],
    enemyScaling,
    isNormalized: false,
  };
}
```

---

## Feature 2: Rental Team System

### Design
Pre-built, balanced teams available for players who don't have strong rosters. Inspired by Pokemon Battle Tower rental system.

### Implementation

#### 2.1 Rental Team Schema

**File**: `/home/geni/Documents/vale-village-v2/src/data/schemas/RentalTeamSchema.ts` (NEW)

```typescript
import { z } from 'zod';
import type { Element } from './UnitSchema';

export const RentalTeamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  theme: z.enum(['balanced', 'offensive', 'defensive', 'elemental', 'specialized']),
  element: z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter', 'Mixed']),
  unitIds: z.array(z.string().min(1)).min(1).max(4),
  equipment: z.record(z.string(), z.array(z.string())).optional(), // unitId -> equipmentIds
  djinn: z.record(z.string(), z.array(z.string())).optional(), // unitId -> djinnIds
  recommendedForFloors: z.object({
    min: z.number().int().min(1),
    max: z.number().int().min(1),
  }),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()).default([]).readonly(),
});

export type RentalTeam = z.infer<typeof RentalTeamSchema>;
```

#### 2.2 Rental Team Definitions

**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/rentalTeams.ts` (NEW)

```typescript
import type { RentalTeam } from '../schemas/RentalTeamSchema';

/**
 * Rental teams for Battle Tower
 * Provides pre-built, balanced teams for players without strong rosters
 */
export const RENTAL_TEAMS: RentalTeam[] = [
  // Beginner Teams (Floors 1-10)
  {
    id: 'rental-starter-balanced',
    name: 'Starter Squad',
    description: 'Balanced team for beginners. Isaac leads with Garet and Mystic support.',
    theme: 'balanced',
    element: 'Mixed',
    unitIds: ['adept', 'war-mage', 'mystic'],
    equipment: {
      'adept': ['bronze-sword', 'leather-vest', 'leather-cap'],
      'war-mage': ['bronze-mace', 'padded-armor', 'leather-gloves'],
      'mystic': ['wooden-staff', 'cloth-robe', 'circlet'],
    },
    djinn: {
      'adept': ['flint'],
      'war-mage': ['forge'],
    },
    recommendedForFloors: { min: 1, max: 10 },
    difficulty: 'beginner',
    tags: ['tutorial', 'balanced'],
  },
  {
    id: 'rental-earth-defense',
    name: 'Earth Guardians',
    description: 'Tanky Venus team. High defense, sustained damage.',
    theme: 'defensive',
    element: 'Venus',
    unitIds: ['adept', 'sentinel', 'master-warrior'],
    equipment: {
      'adept': ['iron-sword', 'iron-shield', 'iron-helm'],
      'sentinel': ['war-hammer', 'knight-armor', 'guardian-ring'],
      'master-warrior': ['steel-blade', 'steel-armor', 'war-gloves'],
    },
    djinn: {
      'adept': ['flint', 'granite'],
      'sentinel': ['quartz'],
    },
    recommendedForFloors: { min: 1, max: 15 },
    difficulty: 'beginner',
    tags: ['tank', 'venus'],
  },
  {
    id: 'rental-fire-burst',
    name: 'Blaze Brigade',
    description: 'Aggressive Mars team. High damage output, glass cannon.',
    theme: 'offensive',
    element: 'Mars',
    unitIds: ['war-mage', 'blaze', 'tyrell'],
    equipment: {
      'war-mage': ['flame-sword', 'fire-mail', 'burning-circlet'],
      'blaze': ['inferno-axe', 'pyro-armor', 'ember-ring'],
      'tyrell': ['magma-blade', 'molten-plate', 'phoenix-helm'],
    },
    djinn: {
      'war-mage': ['forge', 'kindle'],
      'blaze': ['ember'],
    },
    recommendedForFloors: { min: 5, max: 20 },
    difficulty: 'intermediate',
    tags: ['dps', 'mars'],
  },
  {
    id: 'rental-water-sustain',
    name: 'Tidal Healers',
    description: 'Mercury support team. Healing, buffs, and control.',
    theme: 'defensive',
    element: 'Mercury',
    unitIds: ['mystic', 'karis', 'versatile-scholar'],
    equipment: {
      'mystic': ['frost-staff', 'water-robe', 'healing-circlet'],
      'karis': ['ice-rod', 'aqua-dress', 'mermaid-gloves'],
      'versatile-scholar': ['coral-wand', 'sea-cloak', 'pearl-ring'],
    },
    djinn: {
      'mystic': ['fizz', 'mist'],
      'karis': ['tonic'],
    },
    recommendedForFloors: { min: 5, max: 20 },
    difficulty: 'intermediate',
    tags: ['healer', 'mercury'],
  },
  {
    id: 'rental-wind-speed',
    name: 'Storm Strikers',
    description: 'Jupiter speed team. High SPD, multi-hit attacks.',
    theme: 'offensive',
    element: 'Jupiter',
    unitIds: ['ranger', 'stormcaller', 'rogue-assassin'],
    equipment: {
      'ranger': ['gale-bow', 'wind-mail', 'feather-cap'],
      'stormcaller': ['thunder-staff', 'storm-robe', 'bolt-ring'],
      'rogue-assassin': ['swift-daggers', 'ninja-garb', 'agility-boots'],
    },
    djinn: {
      'ranger': ['breeze', 'squall'],
      'stormcaller': ['zephyr'],
    },
    recommendedForFloors: { min: 5, max: 20 },
    difficulty: 'intermediate',
    tags: ['speed', 'jupiter'],
  },

  // Advanced Teams (Floors 15-30)
  {
    id: 'rental-rainbow-comp',
    name: 'Elemental Harmony',
    description: 'One of each element. Diverse toolkit for any situation.',
    theme: 'balanced',
    element: 'Mixed',
    unitIds: ['master-warrior', 'tyrell', 'karis', 'stormcaller'],
    equipment: {
      'master-warrior': ['mythril-sword', 'gaia-plate', 'titan-helm'],
      'tyrell': ['sol-blade', 'dragon-mail', 'flame-crown'],
      'karis': ['mercury-rod', 'ocean-robe', 'frost-circlet'],
      'stormcaller': ['storm-brand', 'sky-armor', 'thunder-crown'],
    },
    djinn: {
      'master-warrior': ['granite', 'quartz'],
      'tyrell': ['forge', 'ember'],
      'karis': ['fizz', 'mist'],
      'stormcaller': ['breeze', 'squall'],
    },
    recommendedForFloors: { min: 15, max: 30 },
    difficulty: 'advanced',
    tags: ['balanced', 'mixed'],
  },
  {
    id: 'rental-djinn-mastery',
    name: 'Djinn Masters',
    description: 'Summon-focused team with maximum djinn coverage.',
    theme: 'specialized',
    element: 'Mixed',
    unitIds: ['versatile-scholar', 'elemental-mage', 'mystic', 'ranger'],
    equipment: {
      'versatile-scholar': ['sage-staff', 'ancient-robe', 'wisdom-circlet'],
      'elemental-mage': ['astral-rod', 'mage-vestment', 'djinn-amulet'],
      'mystic': ['divine-staff', 'holy-robe', 'oracle-crown'],
      'ranger': ['artemis-bow', 'hunter-mail', 'eagle-helm'],
    },
    djinn: {
      'versatile-scholar': ['flint', 'forge', 'fizz', 'breeze'],
      'elemental-mage': ['granite', 'ember', 'mist', 'squall'],
      'mystic': ['quartz', 'kindle', 'tonic'],
      'ranger': ['gust', 'zephyr'],
    },
    recommendedForFloors: { min: 20, max: 30 },
    difficulty: 'advanced',
    tags: ['djinn', 'summons', 'advanced'],
  },
  {
    id: 'rental-endgame-comp',
    name: 'Tower Legends',
    description: 'Elite team for final floors. Optimized for boss encounters.',
    theme: 'specialized',
    element: 'Mixed',
    unitIds: ['master-warrior', 'versatile-scholar', 'karis', 'stormcaller'],
    equipment: {
      'master-warrior': ['excalibur', 'aegis-armor', 'dragon-helm'],
      'versatile-scholar': ['zodiac-wand', 'iris-robe', 'oracle-crown'],
      'karis': ['lachesis-rule', 'divine-dress', 'guardian-ring'],
      'stormcaller': ['atropos-rod', 'celestial-armor', 'zeus-crown'],
    },
    djinn: {
      'master-warrior': ['flint', 'granite', 'quartz'],
      'versatile-scholar': ['forge', 'ember', 'kindle'],
      'karis': ['fizz', 'mist', 'tonic'],
      'stormcaller': ['breeze', 'squall', 'zephyr', 'gust'],
    },
    recommendedForFloors: { min: 25, max: 30 },
    difficulty: 'advanced',
    tags: ['endgame', 'boss', 'optimized'],
  },
];
```

#### 2.3 Rental Team Service

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/RentalTeamService.ts` (NEW)

```typescript
import type { RentalTeam } from '../../data/schemas/RentalTeamSchema';
import type { Unit } from '../../data/schemas/UnitSchema';
import { RENTAL_TEAMS } from '../../data/definitions/rentalTeams';

export interface RentalTeamRecommendation {
  team: RentalTeam;
  matchScore: number;
  reason: string;
}

/**
 * Get all rental teams suitable for a floor number
 */
export function getRentalTeamsForFloor(floorNumber: number): RentalTeam[] {
  return RENTAL_TEAMS.filter(team =>
    floorNumber >= team.recommendedForFloors.min &&
    floorNumber <= team.recommendedForFloors.max
  );
}

/**
 * Get rental teams by difficulty bracket
 */
export function getRentalTeamsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): RentalTeam[] {
  return RENTAL_TEAMS.filter(team => team.difficulty === difficulty);
}

/**
 * Calculate how well a rental team matches player needs
 */
export function calculateTeamMatchScore(
  team: RentalTeam,
  floorNumber: number,
  playerLevel: number
): number {
  let score = 0;

  // Floor match (0-40 points)
  const floorMid = (team.recommendedForFloors.min + team.recommendedForFloors.max) / 2;
  const floorDiff = Math.abs(floorNumber - floorMid);
  score += Math.max(0, 40 - floorDiff * 2);

  // Level appropriate (0-30 points)
  if (team.difficulty === 'beginner' && playerLevel < 10) score += 30;
  else if (team.difficulty === 'intermediate' && playerLevel >= 10 && playerLevel < 20) score += 30;
  else if (team.difficulty === 'advanced' && playerLevel >= 20) score += 30;
  else score += 10;

  // Bonus for exact floor match (0-30 points)
  if (floorNumber >= team.recommendedForFloors.min &&
      floorNumber <= team.recommendedForFloors.max) {
    score += 30;
  }

  return score;
}

/**
 * Get recommended rental teams with explanations
 */
export function getRecommendedRentalTeams(
  floorNumber: number,
  playerLevel: number,
  limit: number = 3
): RentalTeamRecommendation[] {
  const availableTeams = getRentalTeamsForFloor(floorNumber);

  const recommendations = availableTeams.map(team => {
    const matchScore = calculateTeamMatchScore(team, floorNumber, playerLevel);
    let reason = '';

    if (team.difficulty === 'beginner') {
      reason = 'Great for learning tower mechanics';
    } else if (team.difficulty === 'intermediate') {
      reason = 'Balanced team for mid-tier floors';
    } else {
      reason = 'Optimized for challenging encounters';
    }

    if (team.theme === 'balanced') {
      reason += '. Versatile against all enemy types.';
    } else if (team.theme === 'offensive') {
      reason += '. High damage for quick victories.';
    } else if (team.theme === 'defensive') {
      reason += '. Sustainable for long battles.';
    }

    return {
      team,
      matchScore,
      reason,
    };
  });

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Instantiate a rental team as actual Unit objects
 * (This would integrate with your unit loading system)
 */
export function instantiateRentalTeam(
  team: RentalTeam,
  unitDefinitions: Map<string, Unit>,
  level: number
): Unit[] {
  // Implementation would depend on your unit instantiation system
  // This is a placeholder showing the concept
  return team.unitIds.map(unitId => {
    const unitDef = unitDefinitions.get(unitId);
    if (!unitDef) {
      throw new Error(`Rental team references unknown unit: ${unitId}`);
    }

    // Clone unit and set to rental level
    const rentalUnit = {
      ...unitDef,
      level,
      // Apply rental equipment if specified
      // Apply rental djinn if specified
    };

    return rentalUnit;
  });
}
```

#### 2.4 TowerRunState Extension

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerService.ts`

Add to TowerRunState:

```typescript
export interface TowerRunState {
  seed: number;
  difficulty: TowerDifficulty;
  floorIndex: number;
  floorIds: readonly string[];
  isCompleted: boolean;
  isFailed: boolean;
  stats: TowerRunStats;
  history: readonly TowerFloorHistoryEntry[];
  pendingRewards: readonly TowerRewardEntry[];
  config: TowerConfig;
  // NEW: Rental team tracking
  isUsingRentalTeam: boolean;
  rentalTeamId?: string;
}
```

Update createTowerRun:

```typescript
export function createTowerRun(
  seed: number,
  difficulty: TowerDifficulty,
  floors: readonly TowerFloor[],
  config: TowerConfig = DEFAULT_TOWER_CONFIG,
  rentalTeamId?: string // NEW
): TowerRunState {
  // ... existing code ...
  return {
    seed,
    difficulty,
    floorIndex: 0,
    floorIds,
    isCompleted: false,
    isFailed: false,
    stats: { /* ... */ },
    history: sortedFloors.map(/* ... */),
    pendingRewards: [],
    config,
    // NEW
    isUsingRentalTeam: Boolean(rentalTeamId),
    rentalTeamId,
  };
}
```

---

## Feature 3: Bracket System (Easy/Medium/Hard)

### Design
Multiple difficulty brackets allow players to choose their challenge level, similar to Pokemon Battle Tower's various formats.

### Implementation

#### 3.1 Bracket Schema

**File**: `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerBracketSchema.ts` (NEW)

```typescript
import { z } from 'zod';

export const TowerBracketSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard', 'extreme']),
  maxFloors: z.number().int().min(1),
  levelCap: z.number().int().min(1).max(50),
  restrictions: z.object({
    maxTeamSize: z.number().int().min(1).max(4).optional(),
    allowedElements: z.array(z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter'])).optional(),
    bannedUnits: z.array(z.string()).optional(),
    requiredRental: z.boolean().default(false),
  }).optional(),
  rewards: z.object({
    xpMultiplier: z.number().positive(),
    goldMultiplier: z.number().positive(),
    bonusRewardChance: z.number().min(0).max(1),
  }),
  unlockCondition: z.object({
    storyProgress: z.number().int().min(0).optional(),
    previousBracketFloor: z.number().int().min(0).optional(),
  }).optional(),
});

export type TowerBracket = z.infer<typeof TowerBracketSchema>;
```

#### 3.2 Bracket Definitions

**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/towerBrackets.ts` (NEW)

```typescript
import type { TowerBracket } from '../schemas/TowerBracketSchema';

/**
 * Tower brackets - multiple difficulty tiers for player choice
 */
export const TOWER_BRACKETS: TowerBracket[] = [
  {
    id: 'bracket-training',
    name: 'Training Grounds',
    description: 'Learn tower mechanics in a forgiving environment. Rental teams available.',
    difficulty: 'easy',
    maxFloors: 10,
    levelCap: 10,
    restrictions: {
      maxTeamSize: 4,
    },
    rewards: {
      xpMultiplier: 0.8,
      goldMultiplier: 0.8,
      bonusRewardChance: 0.1,
    },
  },
  {
    id: 'bracket-beginner',
    name: 'Beginner Tower',
    description: 'Balanced challenge for developing players. Level 15 normalized.',
    difficulty: 'easy',
    maxFloors: 20,
    levelCap: 15,
    restrictions: {
      maxTeamSize: 4,
    },
    rewards: {
      xpMultiplier: 1.0,
      goldMultiplier: 1.0,
      bonusRewardChance: 0.15,
    },
    unlockCondition: {
      storyProgress: 5, // Completed House 5
    },
  },
  {
    id: 'bracket-standard',
    name: 'Standard Tower',
    description: 'The classic 30-floor challenge. Level 20 normalized.',
    difficulty: 'medium',
    maxFloors: 30,
    levelCap: 20,
    restrictions: {
      maxTeamSize: 4,
    },
    rewards: {
      xpMultiplier: 1.2,
      goldMultiplier: 1.2,
      bonusRewardChance: 0.2,
    },
    unlockCondition: {
      storyProgress: 10, // Completed House 10
    },
  },
  {
    id: 'bracket-advanced',
    name: 'Advanced Tower',
    description: 'Harder enemies, boss floors every 5. Level 25 normalized.',
    difficulty: 'hard',
    maxFloors: 30,
    levelCap: 25,
    restrictions: {
      maxTeamSize: 4,
    },
    rewards: {
      xpMultiplier: 1.5,
      goldMultiplier: 1.5,
      bonusRewardChance: 0.3,
    },
    unlockCondition: {
      storyProgress: 15, // Completed House 15
      previousBracketFloor: 20, // Beat floor 20 of Standard
    },
  },
  {
    id: 'bracket-masters',
    name: "Master's Challenge",
    description: 'Elite difficulty with brutal scaling. Level 30 normalized. For veterans only.',
    difficulty: 'extreme',
    maxFloors: 50,
    levelCap: 30,
    restrictions: {
      maxTeamSize: 4,
    },
    rewards: {
      xpMultiplier: 2.0,
      goldMultiplier: 2.0,
      bonusRewardChance: 0.5,
    },
    unlockCondition: {
      storyProgress: 20, // Completed House 20
      previousBracketFloor: 30, // Beat floor 30 of Advanced
    },
  },
  {
    id: 'bracket-little-cup',
    name: 'Little Cup',
    description: 'Low-level challenge. All units set to level 5. Tests strategy over stats.',
    difficulty: 'medium',
    maxFloors: 15,
    levelCap: 5,
    restrictions: {
      maxTeamSize: 3,
    },
    rewards: {
      xpMultiplier: 1.3,
      goldMultiplier: 0.9,
      bonusRewardChance: 0.25,
    },
    unlockCondition: {
      storyProgress: 10,
    },
  },
  {
    id: 'bracket-mono-element',
    name: 'Mono-Element Gauntlet',
    description: 'Choose one element. All team members must share it. High rewards.',
    difficulty: 'hard',
    maxFloors: 20,
    levelCap: 20,
    restrictions: {
      maxTeamSize: 4,
      // Would require UI to select which element
    },
    rewards: {
      xpMultiplier: 1.8,
      goldMultiplier: 1.6,
      bonusRewardChance: 0.35,
    },
    unlockCondition: {
      storyProgress: 15,
    },
  },
  {
    id: 'bracket-rental-only',
    name: 'Rental Championship',
    description: 'Must use rental teams. Pure skill test - no grinding advantage.',
    difficulty: 'medium',
    maxFloors: 25,
    levelCap: 20,
    restrictions: {
      maxTeamSize: 4,
      requiredRental: true,
    },
    rewards: {
      xpMultiplier: 1.4,
      goldMultiplier: 1.3,
      bonusRewardChance: 0.28,
    },
    unlockCondition: {
      storyProgress: 12,
    },
  },
];
```

#### 3.3 Bracket Service

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerBracketService.ts` (NEW)

```typescript
import type { TowerBracket } from '../../data/schemas/TowerBracketSchema';
import { TOWER_BRACKETS } from '../../data/definitions/towerBrackets';

export interface BracketUnlockStatus {
  bracket: TowerBracket;
  isUnlocked: boolean;
  unlockReason?: string;
}

/**
 * Check if player has unlocked a bracket
 */
export function isBracketUnlocked(
  bracket: TowerBracket,
  playerStoryProgress: number,
  towerProgress: Map<string, number> // bracketId -> highest floor reached
): boolean {
  if (!bracket.unlockCondition) {
    return true; // No unlock condition = always available
  }

  const { storyProgress, previousBracketFloor } = bracket.unlockCondition;

  if (storyProgress && playerStoryProgress < storyProgress) {
    return false;
  }

  if (previousBracketFloor) {
    // Would need to check specific bracket - simplified here
    const hasReachedFloor = Array.from(towerProgress.values())
      .some(floor => floor >= previousBracketFloor);
    if (!hasReachedFloor) {
      return false;
    }
  }

  return true;
}

/**
 * Get all brackets with unlock status
 */
export function getBracketUnlockStatuses(
  playerStoryProgress: number,
  towerProgress: Map<string, number>
): BracketUnlockStatus[] {
  return TOWER_BRACKETS.map(bracket => {
    const isUnlocked = isBracketUnlocked(bracket, playerStoryProgress, towerProgress);
    let unlockReason: string | undefined;

    if (!isUnlocked && bracket.unlockCondition) {
      const { storyProgress, previousBracketFloor } = bracket.unlockCondition;
      if (storyProgress && playerStoryProgress < storyProgress) {
        unlockReason = `Complete House ${storyProgress}`;
      } else if (previousBracketFloor) {
        unlockReason = `Reach floor ${previousBracketFloor} in another bracket`;
      }
    }

    return {
      bracket,
      isUnlocked,
      unlockReason,
    };
  });
}

/**
 * Get unlocked brackets only
 */
export function getUnlockedBrackets(
  playerStoryProgress: number,
  towerProgress: Map<string, number>
): TowerBracket[] {
  return TOWER_BRACKETS.filter(bracket =>
    isBracketUnlocked(bracket, playerStoryProgress, towerProgress)
  );
}

/**
 * Get bracket by ID
 */
export function getBracketById(bracketId: string): TowerBracket | null {
  return TOWER_BRACKETS.find(b => b.id === bracketId) ?? null;
}

/**
 * Get recommended bracket for player
 */
export function getRecommendedBracket(
  playerLevel: number,
  playerStoryProgress: number,
  towerProgress: Map<string, number>
): TowerBracket | null {
  const unlocked = getUnlockedBrackets(playerStoryProgress, towerProgress);

  // Recommend based on player level
  if (playerLevel < 10) {
    return unlocked.find(b => b.id === 'bracket-training') ?? unlocked[0] ?? null;
  } else if (playerLevel < 15) {
    return unlocked.find(b => b.id === 'bracket-beginner') ?? unlocked[0] ?? null;
  } else if (playerLevel < 20) {
    return unlocked.find(b => b.id === 'bracket-standard') ?? unlocked[0] ?? null;
  } else if (playerLevel < 25) {
    return unlocked.find(b => b.id === 'bracket-advanced') ?? unlocked[0] ?? null;
  } else {
    return unlocked.find(b => b.id === 'bracket-masters') ?? unlocked[0] ?? null;
  }
}
```

#### 3.4 TowerRunState Bracket Integration

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerService.ts`

Update TowerRunState:

```typescript
export interface TowerRunState {
  seed: number;
  difficulty: TowerDifficulty;
  floorIndex: number;
  floorIds: readonly string[];
  isCompleted: boolean;
  isFailed: boolean;
  stats: TowerRunStats;
  history: readonly TowerFloorHistoryEntry[];
  pendingRewards: readonly TowerRewardEntry[];
  config: TowerConfig;
  isUsingRentalTeam: boolean;
  rentalTeamId?: string;
  // NEW: Bracket support
  bracketId: string;
}
```

Update createTowerRun:

```typescript
export function createTowerRun(
  seed: number,
  difficulty: TowerDifficulty,
  floors: readonly TowerFloor[],
  config: TowerConfig = DEFAULT_TOWER_CONFIG,
  rentalTeamId?: string,
  bracketId: string = 'bracket-standard' // NEW
): TowerRunState {
  // ... existing code ...
  return {
    // ... existing fields ...
    bracketId,
  };
}
```

---

## Feature 4: Progressive Reward System

### Design
Meaningful rewards every 5 floors to maintain motivation and provide constant sense of progress.

### Implementation

#### 4.1 Update towerFloors.ts

**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/towerFloors.ts`

Add normalized levels and update floor definitions:

```typescript
export const TOWER_FLOORS: TowerFloor[] = [
  // Floors 1-5: Level 5
  {
    id: 'tower-floor-001',
    floorNumber: 1,
    type: 'normal',
    encounterId: 'vs1-garet',
    difficultyTier: 1,
    normalizedLevel: 5,
    tags: ['tutorial'],
  },
  {
    id: 'tower-floor-002',
    floorNumber: 2,
    type: 'normal',
    encounterId: 'house-02',
    difficultyTier: 1,
    normalizedLevel: 5,
    tags: [],
  },
  {
    id: 'tower-floor-003',
    floorNumber: 3,
    type: 'normal',
    encounterId: 'house-03',
    difficultyTier: 1,
    normalizedLevel: 5,
    tags: [],
  },
  {
    id: 'tower-floor-004',
    floorNumber: 4,
    type: 'rest',
    difficultyTier: 1,
    normalizedLevel: 5,
    tags: [],
    rest: {
      allowLoadoutChange: true,
    },
  },
  {
    id: 'tower-floor-005',
    floorNumber: 5,
    type: 'boss',
    encounterId: 'house-04',
    difficultyTier: 2,
    normalizedLevel: 5,
    tags: ['milestone'],
  },
  // Floors 6-10: Level 10
  {
    id: 'tower-floor-006',
    floorNumber: 6,
    type: 'normal',
    encounterId: 'house-05',
    difficultyTier: 2,
    normalizedLevel: 10,
    tags: [],
  },
  // ... continue pattern ...
];
```

#### 4.2 Enhanced Reward Schema

**File**: `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerRewardSchema.ts`

Update to support more reward types:

```typescript
import { z } from 'zod';

const TowerRewardTypeSchema = z.enum([
  'equipment',
  'djinn',
  'recruit',
  'consumable', // NEW: potions, items
  'currency',   // NEW: gold, gems
  'cosmetic',   // NEW: titles, sprites
]);

export const TowerRewardEntrySchema = z.object({
  type: TowerRewardTypeSchema,
  ids: z.array(z.string().min(1)).min(1),
  quantity: z.number().int().positive().optional(), // For stackable items
  notes: z.string().optional(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).optional(),
});

// Rest remains the same...
```

#### 4.3 Progressive Reward Definitions

**File**: `/home/geni/Documents/vale-village-v2/src/data/definitions/towerRewards.ts`

Expand rewards to cover every 5 floors:

```typescript
import type { TowerReward } from '../schemas/TowerRewardSchema';

/**
 * Tower rewards - every 5 floors for constant progression feedback
 */
export const TOWER_REWARDS: TowerReward[] = [
  {
    floorNumber: 5,
    rewards: [
      {
        type: 'currency',
        ids: ['gold'],
        quantity: 500,
        rarity: 'common',
        notes: 'First milestone reward',
      },
      {
        type: 'consumable',
        ids: ['potion'],
        quantity: 3,
        rarity: 'common',
      },
    ],
  },
  {
    floorNumber: 6,
    rewards: [
      {
        type: 'djinn',
        ids: ['forge'],
        rarity: 'uncommon',
      },
    ],
  },
  {
    floorNumber: 7,
    rewards: [
      {
        type: 'recruit',
        ids: ['war-mage'],
        rarity: 'rare',
      },
    ],
  },
  {
    floorNumber: 10,
    rewards: [
      {
        type: 'equipment',
        ids: ['iron-sword'],
        rarity: 'uncommon',
        notes: 'Tier 2 weapon',
      },
      {
        type: 'djinn',
        ids: ['granite'],
        rarity: 'uncommon',
      },
      {
        type: 'currency',
        ids: ['gold'],
        quantity: 1000,
        rarity: 'uncommon',
      },
    ],
  },
  {
    floorNumber: 15,
    rewards: [
      {
        type: 'equipment',
        ids: ['steel-blade'],
        rarity: 'rare',
        notes: 'Tier 3 weapon',
      },
      {
        type: 'consumable',
        ids: ['elixir'],
        quantity: 2,
        rarity: 'uncommon',
      },
      {
        type: 'currency',
        ids: ['gold'],
        quantity: 1500,
        rarity: 'rare',
      },
    ],
  },
  {
    floorNumber: 20,
    rewards: [
      {
        type: 'equipment',
        ids: ['mythril-sword', 'mythril-armor'],
        rarity: 'rare',
        notes: 'Mythril set',
      },
      {
        type: 'djinn',
        ids: ['squall'],
        rarity: 'rare',
      },
      {
        type: 'currency',
        ids: ['gold'],
        quantity: 2500,
        rarity: 'rare',
      },
    ],
  },
  {
    floorNumber: 25,
    rewards: [
      {
        type: 'equipment',
        ids: ['sol-blade'],
        rarity: 'epic',
        notes: 'Legendary Mars weapon',
      },
      {
        type: 'djinn',
        ids: ['bane'],
        rarity: 'rare',
      },
      {
        type: 'currency',
        ids: ['gold'],
        quantity: 5000,
        rarity: 'epic',
      },
      {
        type: 'cosmetic',
        ids: ['title-tower-champion'],
        rarity: 'epic',
        notes: 'Player title: Tower Champion',
      },
    ],
  },
  {
    floorNumber: 30,
    rewards: [
      {
        type: 'equipment',
        ids: ['excalibur', 'aegis-armor', 'zeus-crown'],
        rarity: 'legendary',
        notes: 'Ultimate equipment set',
      },
      {
        type: 'djinn',
        ids: ['storm', 'celestial'],
        rarity: 'epic',
      },
      {
        type: 'currency',
        ids: ['gold'],
        quantity: 10000,
        rarity: 'legendary',
      },
      {
        type: 'cosmetic',
        ids: ['title-tower-master', 'sprite-golden-glow'],
        rarity: 'legendary',
        notes: 'Title: Tower Master + Golden aura sprite',
      },
    ],
  },
];
```

#### 4.4 Reward Preview Service

**File**: `/home/geni/Documents/vale-village-v2/src/core/services/TowerRewardPreviewService.ts` (NEW)

```typescript
import type { TowerReward, TowerRewardEntry } from '../../data/schemas/TowerRewardSchema';
import { TOWER_REWARDS } from '../../data/definitions/towerRewards';

export interface RewardMilestone {
  floorNumber: number;
  rewards: readonly TowerRewardEntry[];
  isUpcoming: boolean;
  distance: number;
}

/**
 * Get next upcoming reward milestone
 */
export function getNextRewardMilestone(currentFloor: number): RewardMilestone | null {
  const upcoming = TOWER_REWARDS
    .filter(r => r.floorNumber > currentFloor)
    .sort((a, b) => a.floorNumber - b.floorNumber);

  if (upcoming.length === 0) {
    return null;
  }

  const next = upcoming[0]!;
  return {
    floorNumber: next.floorNumber,
    rewards: next.rewards,
    isUpcoming: true,
    distance: next.floorNumber - currentFloor,
  };
}

/**
 * Get all upcoming rewards within range
 */
export function getUpcomingRewards(
  currentFloor: number,
  lookAheadFloors: number = 10
): RewardMilestone[] {
  return TOWER_REWARDS
    .filter(r => r.floorNumber > currentFloor && r.floorNumber <= currentFloor + lookAheadFloors)
    .map(r => ({
      floorNumber: r.floorNumber,
      rewards: r.rewards,
      isUpcoming: true,
      distance: r.floorNumber - currentFloor,
    }))
    .sort((a, b) => a.floorNumber - b.floorNumber);
}

/**
 * Get reward for specific floor
 */
export function getRewardForFloor(floorNumber: number): TowerReward | null {
  return TOWER_REWARDS.find(r => r.floorNumber === floorNumber) ?? null;
}

/**
 * Calculate total value of rewards (simplified scoring)
 */
export function calculateRewardValue(rewards: readonly TowerRewardEntry[]): number {
  let value = 0;

  for (const reward of rewards) {
    // Rarity multipliers
    const rarityMult = {
      common: 1,
      uncommon: 2,
      rare: 4,
      epic: 8,
      legendary: 16,
    }[reward.rarity ?? 'common'];

    // Type base values
    const typeValue = {
      currency: (reward.quantity ?? 1) / 100, // Gold is plentiful
      consumable: 2,
      equipment: 5,
      djinn: 10,
      recruit: 15,
      cosmetic: 3,
    }[reward.type];

    value += typeValue * rarityMult * reward.ids.length;
  }

  return value;
}

/**
 * Format reward description for UI
 */
export function formatRewardDescription(reward: TowerRewardEntry): string {
  const qty = reward.quantity ? `${reward.quantity}x ` : '';
  const items = reward.ids.join(', ');
  return `${qty}${reward.type}: ${items}`;
}
```

---

## Summary of Code Changes

### New Files Created (7)

1. `/home/geni/Documents/vale-village-v2/src/core/services/LevelNormalizationService.ts`
2. `/home/geni/Documents/vale-village-v2/src/data/schemas/RentalTeamSchema.ts`
3. `/home/geni/Documents/vale-village-v2/src/data/definitions/rentalTeams.ts`
4. `/home/geni/Documents/vale-village-v2/src/core/services/RentalTeamService.ts`
5. `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerBracketSchema.ts`
6. `/home/geni/Documents/vale-village-v2/src/data/definitions/towerBrackets.ts`
7. `/home/geni/Documents/vale-village-v2/src/core/services/TowerBracketService.ts`
8. `/home/geni/Documents/vale-village-v2/src/core/services/TowerRewardPreviewService.ts`

### Files Modified (5)

1. `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerFloorSchema.ts` - Add normalizedLevel
2. `/home/geni/Documents/vale-village-v2/src/core/config/towerConfig.ts` - Add normalization settings
3. `/home/geni/Documents/vale-village-v2/src/core/services/TowerService.ts` - Add prepareFloorBattle, rental/bracket tracking
4. `/home/geni/Documents/vale-village-v2/src/data/schemas/TowerRewardSchema.ts` - Expand reward types
5. `/home/geni/Documents/vale-village-v2/src/data/definitions/towerRewards.ts` - Add progressive rewards

---

## Integration Checklist

- [ ] Create all new service files
- [ ] Update schemas with new fields
- [ ] Modify TowerService with new functions
- [ ] Update towerFloors.ts with normalizedLevel values
- [ ] Expand towerRewards.ts for every 5 floors
- [ ] Create rental team definitions (8 teams)
- [ ] Create bracket definitions (8 brackets)
- [ ] Update UI components to show:
  - [ ] Bracket selection screen
  - [ ] Rental team picker
  - [ ] Reward preview (next milestone)
  - [ ] Level normalization indicator
- [ ] Run typecheck: `pnpm typecheck`
- [ ] Add unit tests for new services
- [ ] Update game design manual

---

## Expected Player Experience

### Before Enhancements
- Player stuck at House 12 with level 8 units
- Tower requires level 20 units
- No way to progress without grinding story
- Feels like hitting a wall

### After Enhancements
- Player selects "Beginner Tower" (level 15 normalized)
- Chooses "Starter Squad" rental team or uses own units (auto-scaled to 15)
- Every 5 floors: guaranteed reward (gold, items, equipment)
- Clear progression: Floor 5 → 500g, Floor 10 → Iron Sword + Djinn
- If still struggling: "Training Grounds" bracket (level 10, easier enemies)
- Success unlocks story resources without grinding

### Retention Impact
- **Difficulty walls eliminated**: Always have a bracket you can complete
- **Constant progress**: Rewards every 5 floors maintain dopamine loop
- **Skill expression**: Rental teams test strategy over stats
- **Player agency**: Choice of bracket, team, difficulty

---

## Design Rationale

### Why Level Normalization?
- Removes grinding requirement
- Tests player skill, not time investment
- Matches Pokemon Battle Tower model (all Pokemon set to level 50/100)
- Allows early-game players to engage with endgame content

### Why Rental Teams?
- Zero-barrier entry for stuck players
- Teaches optimal team compositions
- Removes "I don't have the right units" excuse
- Provides curated, balanced experiences

### Why Brackets?
- Player choice = player agency
- "Easy" bracket prevents frustration
- "Hard" bracket provides challenge for veterans
- Special brackets (Little Cup, Mono-Element) add variety

### Why Progressive Rewards?
- Psychology: rewards every 5 floors > sparse mega-rewards
- Prevents "13 floors with nothing" demotivation
- Creates "just one more floor" engagement loop
- Matches mobile game best practices

---

## Next Steps

1. **Implement Core Services** (4-6 hours)
   - LevelNormalizationService
   - RentalTeamService
   - TowerBracketService
   - TowerRewardPreviewService

2. **Create Data Definitions** (2-3 hours)
   - 8 rental teams
   - 8 tower brackets
   - Progressive rewards for floors 5/10/15/20/25/30

3. **Update Schemas** (1 hour)
   - Add normalizedLevel to TowerFloorSchema
   - Expand TowerRewardSchema
   - Create new schemas for rentals/brackets

4. **Modify Existing Services** (2-3 hours)
   - TowerService: prepareFloorBattle, rental tracking
   - TowerConfig: normalization settings

5. **UI Integration** (6-8 hours)
   - Bracket selection screen
   - Rental team picker with recommendations
   - Reward milestone preview
   - Normalization indicator in battle

6. **Testing** (3-4 hours)
   - Unit tests for all services
   - Integration tests for tower flow
   - Playtesting each bracket

**Total Estimated Time**: 18-25 hours
