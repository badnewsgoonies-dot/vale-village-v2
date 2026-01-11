/**
 * Enemy AI helper utilities
 * Pure functions for target selection logic
 */

import type { Unit } from '../models/Unit';
import { calculateMaxHp, isUnitKO } from '../models/Unit';

/**
 * Select the living enemy with the lowest HP percentage.
 * Returns null if no valid enemies remain.
 */
export function selectLowHPTarget(enemies: readonly Unit[]): Unit | null {
  const livingEnemies = enemies.filter(enemy => !isUnitKO(enemy));
  if (livingEnemies.length === 0) {
    return null;
  }

  return livingEnemies.reduce((lowest, enemy) => {
    const lowestHpPct = lowest.currentHp / calculateMaxHp(lowest);
    const enemyHpPct = enemy.currentHp / calculateMaxHp(enemy);
    return enemyHpPct < lowestHpPct ? enemy : lowest;
  }, livingEnemies[0]!);
}
