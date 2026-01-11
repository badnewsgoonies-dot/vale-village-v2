"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canEquipItem = canEquipItem;
exports.getEquippableItems = getEquippableItems;
/**
 * Determine whether a unit can equip the specified item.
 * REFACTORED: Element-based restrictions (not unit-specific)
 * Pure helper used by UI/service layers before applying equipment.
 */
function canEquipItem(unit, equipment) {
    return equipment.allowedElements.includes(unit.element);
}
/**
 * Filter the provided equipment list by unit element.
 * REFACTORED: Uses element instead of unit ID
 */
function getEquippableItems(equipmentList, unit) {
    return equipmentList.filter(eq => eq.allowedElements.includes(unit.element));
}
