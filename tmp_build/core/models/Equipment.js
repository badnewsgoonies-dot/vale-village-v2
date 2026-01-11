"use strict";
/**
 * Equipment model (POJO)
 * Following ADR 003: Plain objects with readonly properties
 * REFACTORED: Element-based equipment restrictions (allowedElements, not allowedUnits)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyLoadout = createEmptyLoadout;
exports.calculateEquipmentBonuses = calculateEquipmentBonuses;
/**
 * Create empty equipment loadout
 */
function createEmptyLoadout() {
    return {
        weapon: null,
        armor: null,
        helm: null,
        boots: null,
        accessory: null,
    };
}
/**
 * Calculate total stat bonuses from equipment
 */
function calculateEquipmentBonuses(loadout) {
    const totals = {};
    for (const item of Object.values(loadout)) {
        if (!item)
            continue;
        for (const stat of Object.keys(item.statBonus)) {
            const value = item.statBonus[stat];
            if (value !== undefined && value !== null && typeof value === 'number') {
                totals[stat] = (totals[stat] ?? 0) + value;
            }
        }
    }
    return totals;
}
