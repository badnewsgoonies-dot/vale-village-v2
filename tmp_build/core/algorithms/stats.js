"use strict";
/**
 * Effective Stats Pipeline
 * PR-STATS-EFFECTIVE: Calculate effective stats combining base + level + equipment + Djinn + status
 *
 * All functions are pure and deterministic (no RNG, no side effects)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLevelBonuses = calculateLevelBonuses;
exports.calculateStatusModifiers = calculateStatusModifiers;
exports.calculateEffectiveStats = calculateEffectiveStats;
exports.getEffectiveSPD = getEffectiveSPD;
const Equipment_1 = require("../models/Equipment");
const djinnAbilities_1 = require("./djinnAbilities");
/**
 * Calculate level-based stat bonuses
 * Stats increase by growthRates per level above 1
 *
 * @param unit - Unit to calculate bonuses for
 * @returns Partial stats with level bonuses
 */
function calculateLevelBonuses(unit) {
    const levelBonus = unit.level - 1; // Level 1 = 0 bonus, Level 20 = 19 bonuses
    return {
        hp: levelBonus * unit.growthRates.hp,
        pp: levelBonus * unit.growthRates.pp,
        atk: levelBonus * unit.growthRates.atk,
        def: levelBonus * unit.growthRates.def,
        mag: levelBonus * unit.growthRates.mag,
        spd: levelBonus * unit.growthRates.spd,
    };
}
/**
 * Calculate status effect stat modifiers
 * Sums all buff/debuff stat deltas
 * Clamps to prevent negative stats
 *
 * @param unit - Unit with status effects
 * @returns Partial stats with status modifiers
 */
function calculateStatusModifiers(unit) {
    const modifiers = {};
    for (const status of unit.statusEffects) {
        if (status.type === 'buff' || status.type === 'debuff') {
            const statKey = status.stat;
            const modifier = status.modifier;
            // Only process if stat and modifier are defined
            if (statKey && modifier !== undefined) {
                // Sum modifiers (buffs are positive, debuffs are negative)
                const current = modifiers[statKey] ?? 0;
                modifiers[statKey] = current + modifier;
            }
        }
    }
    return modifiers;
}
/**
 * Calculate effective stats for a unit
 * Combines: base + level + equipment + Djinn + status
 * Rounds to integers to avoid floating-point differences
 *
 * @param unit - Unit to calculate effective stats for
 * @param team - Team (for Djinn bonuses)
 * @returns Complete effective stats
 */
function calculateEffectiveStats(unit, team) {
    const base = unit.baseStats;
    const level = calculateLevelBonuses(unit);
    const equipment = (0, Equipment_1.calculateEquipmentBonuses)(unit.equipment);
    const djinn = (0, djinnAbilities_1.calculateDjinnBonusesForUnit)(unit, team);
    const status = calculateStatusModifiers(unit);
    // Combine all bonuses
    const effective = {
        hp: Math.max(1, Math.floor(base.hp + (level.hp ?? 0) + (equipment.hp ?? 0) + (status.hp ?? 0))),
        pp: Math.max(0, Math.floor(base.pp + (level.pp ?? 0) + (equipment.pp ?? 0) + (status.pp ?? 0))),
        atk: Math.max(1, Math.floor(base.atk + (level.atk ?? 0) + (equipment.atk ?? 0) + (djinn.atk ?? 0) + (status.atk ?? 0))),
        def: Math.max(0, Math.floor(base.def + (level.def ?? 0) + (equipment.def ?? 0) + (djinn.def ?? 0) + (status.def ?? 0))),
        mag: Math.max(1, Math.floor(base.mag + (level.mag ?? 0) + (equipment.mag ?? 0) + (djinn.mag ?? 0) + (status.mag ?? 0))),
        spd: Math.max(1, Math.floor(base.spd + (level.spd ?? 0) + (equipment.spd ?? 0) + (djinn.spd ?? 0) + (status.spd ?? 0))),
    };
    return effective;
}
/**
 * Get effective SPD for a unit
 * Convenience wrapper for turn order calculations
 *
 * @param unit - Unit to get effective SPD for
 * @param team - Team (for Djinn bonuses)
 * @returns Effective SPD value
 */
function getEffectiveSPD(unit, team) {
    const effective = calculateEffectiveStats(unit, team);
    return effective.spd;
}
