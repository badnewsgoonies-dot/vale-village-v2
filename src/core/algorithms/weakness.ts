
import { Unit, updateUnit } from '../models/Unit';
import { Element } from '../models/types';
import { BATTLE_CONSTANTS } from '../constants';

export interface BreakResult {
  unit: Unit;
  broke: boolean;      // True if this hit CAUSED the break
  damageMultiplier: number; // 1.0 normally, 1.5 if broken
}

export function isWeakness(attack: Element, defense: Element): boolean {
  if (attack === 'Neutral' || defense === 'Neutral') return false;
  
  // Golden Sun Opposites: Venus <> Jupiter, Mars <> Mercury
  // We'll define 'Weakness' as being hit by the opposite element.
  if (attack === 'Venus' && defense === 'Jupiter') return true;
  if (attack === 'Jupiter' && defense === 'Venus') return true;
  if (attack === 'Mars' && defense === 'Mercury') return true;
  if (attack === 'Mercury' && defense === 'Mars') return true;
  
  return false;
}

/**
 * Apply break damage to a unit.
 * Reduces break gauge if the attack is effective.
 */
export function applyBreakDamage(
  target: Unit,
  damageElement: Element
): BreakResult {
  const weak = isWeakness(damageElement, target.element);

  // If already broken, just return extra damage multiplier
  if (target.isBroken) {
    return { unit: target, broke: false, damageMultiplier: BATTLE_CONSTANTS.BREAK_DAMAGE_MULTIPLIER };
  }

  // If unit has no break gauge, ignore
  if (target.breakGauge === undefined || target.breakThreshold === undefined) {
    return { unit: target, broke: false, damageMultiplier: 1.0 };
  }

  // Calculate break damage (10 point for normal hit, 25 for weakness)
  const breakDmg = weak 
    ? BATTLE_CONSTANTS.BREAK_GAUGE_REDUCTION_WEAKNESS 
    : BATTLE_CONSTANTS.BREAK_GAUGE_REDUCTION_NORMAL;
  
  let newGauge = target.breakGauge - breakDmg;
  let broke = false;

  if (newGauge <= 0) {
    newGauge = 0;
    broke = true;
  }

  const updated = updateUnit(target, {
    breakGauge: newGauge,
    isBroken: broke || target.isBroken // Keep broken if already broken
  });

  return {
    unit: updated,
    broke,
    damageMultiplier: broke ? BATTLE_CONSTANTS.BREAK_DAMAGE_MULTIPLIER : 1.0
  };
}

/**
 * Reset break state (e.g. at end of turn or after duration)
 */
export function recoverBreak(unit: Unit, recoveryAmount: number = BATTLE_CONSTANTS.BREAK_RECOVERY_DEFAULT): Unit {
  if (!unit.breakThreshold) return unit;

  // Simple logic: if broken, recover some gauge. If full, remove broken status.
  if (unit.isBroken) {
    return updateUnit(unit, {
      isBroken: false,
      breakGauge: Math.floor(unit.breakThreshold / 2) 
    });
  }
  
  return unit;
}
