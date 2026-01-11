"use strict";
/**
 * Unit model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMaxHp = calculateMaxHp;
exports.isUnitKO = isUnitKO;
exports.createUnit = createUnit;
exports.updateUnit = updateUnit;
const Equipment_1 = require("./Equipment");
/**
 * Calculate max HP for a unit based on level and base stats
 */
function calculateMaxHp(unit) {
    const levelBonus = (unit.level - 1) * unit.growthRates.hp;
    const equipment = (0, Equipment_1.calculateEquipmentBonuses)(unit.equipment);
    // Calculate status modifiers for HP
    let statusHp = 0;
    for (const status of unit.statusEffects) {
        if ((status.type === 'buff' || status.type === 'debuff') && status.stat === 'hp' && status.modifier) {
            statusHp += status.modifier;
        }
    }
    return Math.max(1, Math.floor(unit.baseStats.hp + levelBonus + (equipment.hp ?? 0) + statusHp));
}
/**
 * Check if unit is KO'd
 */
function isUnitKO(unit) {
    return unit.currentHp <= 0;
}
/**
 * Create a new Unit from definition
 */
function createUnit(definition, level = 1, initialXp = 0) {
    const maxHp = definition.baseStats.hp + (level - 1) * definition.growthRates.hp;
    // Auto-unlock abilities based on level
    const unlockedAbilityIds = definition.abilities
        .filter(ability => level >= (ability.unlockLevel ?? 1))
        .map(ability => ability.id);
    return {
        id: definition.id,
        name: definition.name,
        element: definition.element,
        role: definition.role,
        baseStats: definition.baseStats,
        growthRates: definition.growthRates,
        description: definition.description,
        autoAttackTiming: definition.autoAttackTiming ?? 'same-turn',
        manaContribution: definition.manaContribution,
        level,
        xp: initialXp,
        currentHp: maxHp,
        equipment: {
            weapon: null,
            armor: null,
            helm: null,
            boots: null,
            accessory: null,
        },
        storeUnlocked: false,
        djinn: [],
        djinnStates: {},
        abilities: definition.abilities,
        unlockedAbilityIds,
        statusEffects: [],
        actionsTaken: 0,
        battleStats: {
            damageDealt: 0,
            damageTaken: 0,
        },
    };
}
/**
 * Update unit (returns new object - immutability)
 * Handles nested objects properly
 */
function updateUnit(unit, updates) {
    return {
        ...unit,
        ...updates,
        equipment: updates.equipment ? { ...unit.equipment, ...updates.equipment } : unit.equipment,
        battleStats: updates.battleStats ? { ...unit.battleStats, ...updates.battleStats } : unit.battleStats,
    };
}
