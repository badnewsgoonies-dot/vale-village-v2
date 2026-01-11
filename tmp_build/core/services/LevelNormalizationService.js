"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFloorTargetLevel = calculateFloorTargetLevel;
exports.calculateLevelScaledStats = calculateLevelScaledStats;
exports.normalizePartyForFloor = normalizePartyForFloor;
const Unit_1 = require("../../core/models/Unit");
const immer_1 = require("immer");
const xp_1 = require("../algorithms/xp");
// Golden Sun inspired growth rates (fallback if unit doesn't have them)
const FALLBACK_GROWTH = {
    hp: 5.5,
    pp: 1.8,
    atk: 2.8,
    def: 2.8,
    agi: 2.8,
    luk: 0.1
};
// Reference to satisfy no-unused-vars during typecheck; kept for future growth logic
void FALLBACK_GROWTH;
const FLOOR_BRACKET_SIZE = 5;
const MAX_NORMALIZED_LEVEL = 20;
/**
 * Calculates the target level for a given floor number.
 * Uses a stepped progression:
 * Floors 1-5: Level 5
 * Floors 6-10: Level 10
 * ...
 * Floors 26-30: Level 30
 */
function calculateFloorTargetLevel(floorNumber) {
    if (floorNumber <= 0)
        return 1;
    const bracket = Math.ceil(floorNumber / FLOOR_BRACKET_SIZE);
    return Math.min(bracket * FLOOR_BRACKET_SIZE, MAX_NORMALIZED_LEVEL);
}
/**
 * Scales a unit's stats to a target level.
 * tailored for the UnitSchema structure.
 */
function calculateLevelScaledStats(unit, targetLevel) {
    // If already at target level, just tag it
    if (unit.level === targetLevel) {
        return { ...unit, originalLevel: unit.level, isNormalized: false };
    }
    return (0, immer_1.produce)(unit, draft => {
        draft.originalLevel = unit.level;
        draft.isNormalized = true;
        // Set the normalized level and canonical XP
        draft.level = targetLevel;
        draft.xp = (0, xp_1.getXpForLevel)(targetLevel);
        // Recalculate derived current stats using canonical helper so equipment/status are respected
        const maxHp = (0, Unit_1.calculateMaxHp)(draft);
        draft.currentHp = Math.max(1, Math.floor(maxHp));
    });
}
/**
 * Normalizes a party of units to the target level for a specific floor.
 */
function normalizePartyForFloor(party, floor, _curve = 'stepped') {
    // Currently we only support stepped curve logic embedded in calculateFloorTargetLevel
    // Future expansion: use 'curve' param to switch logic
    const targetLevel = floor.normalizedLevel ?? calculateFloorTargetLevel(floor.floorNumber);
    return party.map(unit => calculateLevelScaledStats(unit, targetLevel));
}
