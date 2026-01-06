import type { Unit } from '../../core/models/Unit';
import type { TowerFloor } from '../../data/schemas/TowerFloorSchema';
import { produce } from 'immer';
import { getXpForLevel } from '../algorithms/xp';

export type NormalizationCurve = 'stepped' | 'linear' | 'exponential';

export interface NormalizedUnit extends Unit {
  originalLevel: number;
  isNormalized: boolean;
}

// Golden Sun inspired growth rates (fallback if unit doesn't have them)
const FALLBACK_GROWTH = {
  hp: 5.5,
  pp: 1.8,
  atk: 2.8,
  def: 2.8,
  agi: 2.8,
  luk: 0.1
};

/**
 * Calculates the target level for a given floor number.
 * Uses a stepped progression:
 * Floors 1-5: Level 5
 * Floors 6-10: Level 10
 * ...
 * Floors 26-30: Level 30
 */
export function calculateFloorTargetLevel(floorNumber: number): number {
  if (floorNumber <= 0) return 1;
  const bracket = Math.ceil(floorNumber / 5);
  return Math.min(bracket * 5, 20); // Clamped to 20 per XP_CURVE limits
}

/**
 * Scales a unit's stats to a target level.
 * tailored for the UnitSchema structure.
 */
export function calculateLevelScaledStats(unit: Unit, targetLevel: number): NormalizedUnit {
  // If already at target level, just tag it
  if (unit.level === targetLevel) {
    return { ...unit, originalLevel: unit.level, isNormalized: false };
  }

  return produce(unit as NormalizedUnit, draft => {
    draft.originalLevel = unit.level;
    draft.isNormalized = true;
    draft.level = targetLevel;

    // Recalculate derived current stats if needed
    // For now, we assume full heal on normalization to avoid 'current > max' issues
    const growth = unit.growthRates || FALLBACK_GROWTH;
    
    // Calculate new Max HP
    const newMaxHp = unit.baseStats.hp + (targetLevel - 1) * growth.hp;
    draft.currentHp = Math.floor(newMaxHp);
    
    // Use canonical XP for level
    draft.xp = getXpForLevel(targetLevel);
  });
}

/**
 * Normalizes a party of units to the target level for a specific floor.
 */
export function normalizePartyForFloor(
  party: readonly Unit[], 
  floor: TowerFloor, 
  _curve: NormalizationCurve = 'stepped'
): NormalizedUnit[] {
  // Currently we only support stepped curve logic embedded in calculateFloorTargetLevel
  // Future expansion: use 'curve' param to switch logic
  const targetLevel = calculateFloorTargetLevel(floor.floorNumber);
  return party.map(unit => calculateLevelScaledStats(unit, targetLevel));
}
