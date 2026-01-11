"use strict";
/**
 * Utility to convert UnitDefinition to Enemy definition
 * Calculates stats at a given level: baseStats + (level - 1) * growthRates
 *
 * This ensures enemy stats match what the unit would have at that level
 * when recruited (for consistency).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitDefinitionToEnemy = unitDefinitionToEnemy;
/**
 * Calculate unit stats at a specific level
 * Formula: baseStats + (level - 1) * growthRates
 *
 * @param unitDef - Unit definition
 * @param level - Target level (1-20)
 * @returns Stats at that level
 */
function calculateStatsAtLevel(unitDef, level) {
    const levelBonus = level - 1; // Level 1 = 0 bonus, Level 2 = 1 bonus, etc.
    return {
        hp: unitDef.baseStats.hp + (levelBonus * unitDef.growthRates.hp),
        pp: unitDef.baseStats.pp + (levelBonus * unitDef.growthRates.pp),
        atk: unitDef.baseStats.atk + (levelBonus * unitDef.growthRates.atk),
        def: unitDef.baseStats.def + (levelBonus * unitDef.growthRates.def),
        mag: unitDef.baseStats.mag + (levelBonus * unitDef.growthRates.mag),
        spd: unitDef.baseStats.spd + (levelBonus * unitDef.growthRates.spd),
    };
}
function unitDefinitionToEnemy(unitDef, level = 2, baseXp = 60, baseGold = 19, options = {}) {
    // Calculate stats at target level
    const statsAtLevel = calculateStatsAtLevel(unitDef, level);
    // Apply stat overrides if provided
    const finalStats = options.stats
        ? { ...statsAtLevel, ...options.stats }
        : statsAtLevel;
    // Get abilities unlocked at this level
    const abilitiesAtLevel = unitDef.abilities.filter(ability => level >= (ability.unlockLevel ?? 1));
    // Ensure at least 1 ability (fallback to first ability if none unlocked)
    const enemyAbilities = abilitiesAtLevel.length > 0
        ? abilitiesAtLevel
        : [unitDef.abilities[0]];
    return {
        id: options.id ?? `${unitDef.id}-enemy`,
        name: unitDef.name, // Use same name (e.g., "Garet" not "Garet Enemy")
        level,
        element: unitDef.element,
        stats: finalStats,
        abilities: enemyAbilities,
        baseXp,
        baseGold,
    };
}
