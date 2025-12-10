// [BT-NORM][BT-01] Level Normalization Service for Battle Tower
// Scales units to floor-appropriate levels, removing story progression dependency

import type { Unit } from '../../data/schemas/UnitSchema';
import type { TowerFloor } from '../../data/schemas/TowerFloorSchema';
import type { Stats } from '../../data/schemas/StatsSchema';

export interface NormalizedUnit extends Unit {
  originalLevel: number;
  normalizedLevel: number;
  normalizedStats: Stats;
}

export type NormalizationCurve = 'linear' | 'stepped' | 'exponential';

/**
 * Calculate target level for a floor using specified progression curve
 *
 * @param floorNumber - The floor number (1-based)
 * @param curve - Progression curve type (default: 'stepped')
 * @returns Target level for this floor
 *
 * @example
 * // Stepped curve (default):
 * // Floors 1-5: Level 5
 * // Floors 6-10: Level 10
 * // Floors 11-15: Level 15
 * calculateFloorTargetLevel(3, 'stepped') // => 5
 * calculateFloorTargetLevel(7, 'stepped') // => 10
 *
 * // Linear curve: floorNumber = level
 * calculateFloorTargetLevel(7, 'linear') // => 7
 *
 * // Exponential curve: faster scaling
 * calculateFloorTargetLevel(10, 'exponential') // => 20
 */
export function calculateFloorTargetLevel(
  floorNumber: number,
  curve: NormalizationCurve = 'stepped'
): number {
  switch (curve) {
    case 'stepped':
      // Every 5 floors = +5 levels (5, 10, 15, 20, 25, 30)
      return Math.ceil(floorNumber / 5) * 5;

    case 'linear':
      // Direct 1:1 mapping
      return floorNumber;

    case 'exponential':
      // Faster scaling: 5 + (floorNumber * 1.5), capped at 50
      return Math.min(50, Math.floor(5 + (floorNumber * 1.5)));

    default:
      return Math.ceil(floorNumber / 5) * 5;
  }
}

/**
 * Calculate stat growth from base level to target level
 * Uses Golden Sun-style stat growth curves
 *
 * @param baseStats - Original stats at current level
 * @param fromLevel - Current level
 * @param toLevel - Target level
 * @returns Scaled stats
 *
 * @remarks
 * Growth rates per level (Golden Sun inspired):
 * - HP: +5 per level
 * - PP: +1.5 per level
 * - ATK: +2.5 per level
 * - DEF: +2.5 per level
 * - MAG: +2.5 per level
 * - SPD: +1.5 per level
 *
 * Supports both upscaling and downscaling
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

  // Golden Sun growth rates: ~5 HP, ~1.5 PP, ~2.5 per level for combat stats
  const hpGrowth = Math.floor(5 * levelDelta);
  const ppGrowth = Math.floor(1.5 * levelDelta);
  const statGrowth = Math.floor(2.5 * levelDelta);
  const spdGrowth = Math.floor(1.5 * levelDelta);

  return {
    hp: Math.max(1, baseStats.hp + hpGrowth),
    pp: Math.max(0, baseStats.pp + ppGrowth),
    atk: Math.max(1, baseStats.atk + statGrowth),
    def: Math.max(1, baseStats.def + statGrowth),
    mag: Math.max(1, baseStats.mag + statGrowth),
    spd: Math.max(1, baseStats.spd + spdGrowth),
  };
}

/**
 * Normalize a unit to the target floor level
 *
 * @param unit - The unit to normalize
 * @param floor - The tower floor (contains normalizedLevel or uses calculated level)
 * @param curve - Normalization curve to use (default: 'stepped')
 * @returns Normalized unit with scaled stats
 *
 * @remarks
 * The normalized unit retains all original properties except:
 * - level: Set to target level
 * - stats: Scaled based on level difference
 * - originalLevel: Stored for reference
 * - normalizedLevel: Target level
 * - normalizedStats: The scaled stats
 *
 * Current HP is NOT scaled - unit retains damage state
 */
export function normalizeUnitForFloor(
  unit: Unit,
  floor: TowerFloor,
  curve: NormalizationCurve = 'stepped'
): NormalizedUnit {
  // Use floor's explicit normalizedLevel if available, otherwise calculate
  const targetLevel =
    (floor as any).normalizedLevel ??
    calculateFloorTargetLevel(floor.floorNumber, curve);

  const normalizedStats = calculateLevelScaledStats(
    unit.baseStats,
    unit.level,
    targetLevel
  );

  return {
    ...unit,
    originalLevel: unit.level,
    normalizedLevel: targetLevel,
    level: targetLevel, // Override current level
    baseStats: normalizedStats, // Use normalized stats as base
    normalizedStats,
  };
}

/**
 * Normalize a party (array of units) for a floor
 *
 * @param party - Array of units to normalize
 * @param floor - The tower floor
 * @param curve - Normalization curve to use (default: 'stepped')
 * @returns Array of normalized units
 *
 * @example
 * const normalizedParty = normalizePartyForFloor(
 *   playerParty,
 *   currentFloor,
 *   'stepped'
 * );
 */
export function normalizePartyForFloor(
  party: readonly Unit[],
  floor: TowerFloor,
  curve: NormalizationCurve = 'stepped'
): NormalizedUnit[] {
  return party.map(unit => normalizeUnitForFloor(unit, floor, curve));
}

/**
 * Calculate max HP for a unit at a specific level
 * Used for UI display and HP calculations
 *
 * @param baseStats - Unit's base stats
 * @param growthRates - Unit's growth rates per level
 * @param level - Target level
 * @returns Maximum HP at this level
 */
export function calculateMaxHpAtLevel(
  baseStats: Stats,
  growthRates: Stats,
  level: number
): number {
  return baseStats.hp + (level - 1) * growthRates.hp;
}

/**
 * Calculate all stats for a unit at a specific level
 * Uses unit's growth rates for precise calculation
 *
 * @param baseStats - Unit's base stats
 * @param growthRates - Unit's growth rates per level
 * @param fromLevel - Current level
 * @param toLevel - Target level
 * @returns Computed stats at target level
 *
 * @remarks
 * This uses the unit's ACTUAL growth rates from their definition,
 * rather than the simplified Golden Sun averages used in calculateLevelScaledStats
 */
export function calculateStatsWithGrowthRates(
  baseStats: Stats,
  growthRates: Stats,
  fromLevel: number,
  toLevel: number
): Stats {
  if (fromLevel === toLevel) {
    return baseStats;
  }

  const levelDelta = toLevel - fromLevel;

  return {
    hp: Math.max(1, baseStats.hp + levelDelta * growthRates.hp),
    pp: Math.max(0, baseStats.pp + levelDelta * growthRates.pp),
    atk: Math.max(1, baseStats.atk + levelDelta * growthRates.atk),
    def: Math.max(1, baseStats.def + levelDelta * growthRates.def),
    mag: Math.max(1, baseStats.mag + levelDelta * growthRates.mag),
    spd: Math.max(1, baseStats.spd + levelDelta * growthRates.spd),
  };
}

/**
 * Check if a unit has been normalized
 * Type guard for NormalizedUnit
 */
export function isNormalizedUnit(unit: Unit | NormalizedUnit): unit is NormalizedUnit {
  return 'normalizedLevel' in unit && 'originalLevel' in unit;
}
