"use strict";
/**
 * Shop Service
 * Handles buying equipment
 * REFACTORED: Element-based equipment system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAffordItem = canAffordItem;
exports.buyItem = buyItem;
exports.purchaseStarterKit = purchaseStarterKit;
exports.purchaseUnitEquipment = purchaseUnitEquipment;
exports.getPriceByTier = getPriceByTier;
const result_1 = require("../utils/result");
const equipment_1 = require("../../data/definitions/equipment");
const starterKits_1 = require("../../data/definitions/starterKits");
const equipment_2 = require("../algorithms/equipment");
/**
 * Check if player can afford an item
 */
function canAffordItem(gold, itemId) {
    const item = equipment_1.EQUIPMENT[itemId];
    if (!item) {
        return false;
    }
    return gold >= item.cost;
}
/**
 * Buy an item
 * Returns new gold amount and success status
 */
function buyItem(gold, itemId) {
    const item = equipment_1.EQUIPMENT[itemId];
    if (!item) {
        return (0, result_1.Err)(`Item ${itemId} not found`);
    }
    if (gold < item.cost) {
        return (0, result_1.Err)(`Cannot afford ${item.name}. Need ${item.cost}g, have ${gold}g`);
    }
    return (0, result_1.Ok)({
        success: true,
        newGold: gold - item.cost,
        item,
    });
}
/**
 * Purchase starter kit for a unit based on element
 * REFACTORED: Element-based kit system (not unit-specific)
 */
function purchaseStarterKit(unit, currentGold) {
    const kit = (0, starterKits_1.getStarterKit)(unit);
    if (currentGold < kit.cost) {
        return (0, result_1.Err)(`Insufficient gold. Need ${kit.cost}g, have ${currentGold}g`);
    }
    const equipmentIds = Object.values(kit.equipment);
    const equipmentList = [];
    for (const id of equipmentIds) {
        const item = equipment_1.EQUIPMENT[id];
        if (!item) {
            return (0, result_1.Err)(`Equipment ${id} not found for ${kit.name}`);
        }
        equipmentList.push(item);
    }
    return (0, result_1.Ok)({
        newGold: currentGold - kit.cost,
        equipment: equipmentList,
    });
}
function purchaseUnitEquipment(unit, gold, itemId) {
    const item = equipment_1.EQUIPMENT[itemId];
    if (!item) {
        return (0, result_1.Err)(`Item ${itemId} not found`);
    }
    if (!(0, equipment_2.canEquipItem)(unit, item)) {
        return (0, result_1.Err)(`${unit.name} cannot equip ${item.name}`);
    }
    if (gold < item.cost) {
        return (0, result_1.Err)(`Cannot afford ${item.name}. Need ${item.cost}g, have ${gold}g`);
    }
    return (0, result_1.Ok)({
        newGold: gold - item.cost,
        item,
    });
}
/**
 * Get price for an item by tier (for reference)
 * Tier 1 = 100g, Tier 2 = 300g, Tier 3 = 800g, Tier 4 = 2000g
 */
function getPriceByTier(tier) {
    const tierPrices = {
        basic: 100,
        bronze: 300,
        iron: 800,
        steel: 2000,
        silver: 2000, // Same as steel
        mythril: 2000, // Same as steel
        legendary: 2000, // Same as steel
        artifact: 2000, // Same as steel
    };
    return tierPrices[tier] ?? 100;
}
