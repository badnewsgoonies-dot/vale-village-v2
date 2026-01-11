import type { Enemy } from './models/Enemy';
import { computeBreakReduction, applyBreakReductionToGauge, BREAK_RULES } from './combat/breakRules';
import { markEnemyBroken } from './models/Enemy';
import type { BreakGauge } from './combat/breakGauge';
import { createBreakGauge, getBreakGauge, resetBreakGauge, reduceBreakGauge } from './combat/breakGauge';

/**
 * When an enemy is hit for `damage`, compute break reduction and apply it.
 * If the gauge reaches zero or below, marks the enemy as Broken (stun + multiplier).
 */
export function reduceEnemyBreakOnHit(enemy: Enemy, damage: number, isWeakness: boolean) {
  if (!enemy.breakGauge) return { enemy, reduced: 0, broken: false };
  const reduction = computeBreakReduction(damage, isWeakness);
  const applied = applyBreakReductionToGauge(enemy.breakGauge, reduction);
  let updatedEnemy = { ...enemy, breakGauge: applied.gauge };
  let broken = false;
  if (applied.broken) {
    updatedEnemy = markEnemyBroken(updatedEnemy);
    broken = true;
  }
  return { enemy: updatedEnemy, reduced: applied.gauge.max - applied.gauge.current, broken, reduction };
}

export { createBreakGauge, getBreakGauge, resetBreakGauge, reduceBreakGauge };
export { BREAK_RULES };
