"use strict";
/**
 * Djinn Service
 * Handles Djinn collection, equipping, and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDjinn = collectDjinn;
exports.equipDjinn = equipDjinn;
exports.unequipDjinn = unequipDjinn;
const Team_1 = require("../models/Team");
const djinn_1 = require("../../data/definitions/djinn");
const result_1 = require("../utils/result");
/**
 * Add a Djinn to collected list
 * @throws Error if Djinn doesn't exist or already collected
 */
function collectDjinn(team, djinnId) {
    // Validate Djinn exists
    if (!djinn_1.DJINN[djinnId]) {
        return (0, result_1.Err)(`Djinn ${djinnId} does not exist`);
    }
    // Check if already collected
    if (team.collectedDjinn.includes(djinnId)) {
        return (0, result_1.Err)(`Djinn ${djinnId} already collected`);
    }
    // Check max collection limit (12)
    if (team.collectedDjinn.length >= 12) {
        return (0, result_1.Err)('Cannot collect more than 12 Djinn');
    }
    // Add to collected list
    const newCollectedDjinn = [...team.collectedDjinn, djinnId];
    return (0, result_1.Ok)((0, Team_1.updateTeam)(team, {
        collectedDjinn: newCollectedDjinn,
    }));
}
/**
 * Equip a Djinn to team slot (max 3)
 * @throws Error if Djinn not collected, already equipped, or slots full
 */
function equipDjinn(team, djinnId, slotIndex = -1) {
    // Validate Djinn is collected
    if (!team.collectedDjinn.includes(djinnId)) {
        return (0, result_1.Err)(`Djinn ${djinnId} not collected`);
    }
    // Check if already equipped
    if (team.equippedDjinn.includes(djinnId)) {
        return (0, result_1.Err)(`Djinn ${djinnId} already equipped`);
    }
    // Check max slots (3)
    if (team.equippedDjinn.length >= 3) {
        if (slotIndex < 0 || slotIndex >= 3) {
            return (0, result_1.Err)('All 3 Djinn slots are full. Unequip one first.');
        }
        // Replace Djinn at slotIndex
        const newEquippedDjinn = [...team.equippedDjinn];
        const oldDjinnId = newEquippedDjinn[slotIndex];
        newEquippedDjinn[slotIndex] = djinnId;
        // Update trackers
        const newTrackers = { ...team.djinnTrackers };
        if (oldDjinnId) {
            delete newTrackers[oldDjinnId];
        }
        if (!newTrackers[djinnId]) {
            newTrackers[djinnId] = {
                djinnId,
                state: 'Set',
                lastActivatedTurn: -1,
            };
        }
        return (0, result_1.Ok)((0, Team_1.updateTeam)(team, {
            equippedDjinn: newEquippedDjinn,
            djinnTrackers: newTrackers,
        }));
    }
    // Add to next available slot
    const newEquippedDjinn = [...team.equippedDjinn, djinnId];
    const newTrackers = { ...team.djinnTrackers };
    if (!newTrackers[djinnId]) {
        newTrackers[djinnId] = {
            djinnId,
            state: 'Set',
            lastActivatedTurn: -1,
        };
    }
    return (0, result_1.Ok)((0, Team_1.updateTeam)(team, {
        equippedDjinn: newEquippedDjinn,
        djinnTrackers: newTrackers,
    }));
}
/**
 * Unequip a Djinn from team
 */
function unequipDjinn(team, djinnId) {
    if (!team.equippedDjinn.includes(djinnId)) {
        return (0, result_1.Err)(`Djinn ${djinnId} not equipped`);
    }
    const newEquippedDjinn = team.equippedDjinn.filter(id => id !== djinnId);
    const newTrackers = { ...team.djinnTrackers };
    delete newTrackers[djinnId];
    return (0, result_1.Ok)((0, Team_1.updateTeam)(team, {
        equippedDjinn: newEquippedDjinn,
        djinnTrackers: newTrackers,
    }));
}
