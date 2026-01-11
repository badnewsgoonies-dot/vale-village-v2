"use strict";
/**
 * Enemy AI helper utilities
 * Pure functions for target selection logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectLowHPTarget = selectLowHPTarget;
const Unit_1 = require("../models/Unit");
/**
 * Select the living enemy with the lowest HP percentage.
 * Returns null if no valid enemies remain.
 */
function selectLowHPTarget(enemies) {
    const livingEnemies = enemies.filter(enemy => !(0, Unit_1.isUnitKO)(enemy));
    if (livingEnemies.length === 0) {
        return null;
    }
    return livingEnemies.reduce((lowest, enemy) => {
        const lowestHpPct = lowest.currentHp / (0, Unit_1.calculateMaxHp)(lowest);
        const enemyHpPct = enemy.currentHp / (0, Unit_1.calculateMaxHp)(enemy);
        return enemyHpPct < lowestHpPct ? enemy : lowest;
    }, livingEnemies[0]);
}
