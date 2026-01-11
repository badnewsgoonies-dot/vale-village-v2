"use strict";
/**
 * Team model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeam = createTeam;
exports.updateTeam = updateTeam;
const constants_1 = require("../constants");
/**
 * Create a new team
 */
function createTeam(units) {
    if (units.length < constants_1.MIN_PARTY_SIZE || units.length > constants_1.MAX_PARTY_SIZE) {
        throw new Error(`Team must have between ${constants_1.MIN_PARTY_SIZE} and ${constants_1.MAX_PARTY_SIZE} units, got ${units.length}`);
    }
    return {
        equippedDjinn: [],
        djinnTrackers: {},
        units,
        collectedDjinn: [],
        currentTurn: 0,
        activationsThisTurn: {},
        djinnStates: {},
    };
}
/**
 * Update team (returns new object - immutability)
 * Handles nested objects properly
 * Validates Djinn equipments for duplicates
 *
 * @throws Error if equippedDjinn contains duplicates or exceeds 3 slots
 */
function updateTeam(team, updates) {
    // Validate equippedDjinn if being updated
    if (updates.equippedDjinn !== undefined) {
        // Check for duplicates
        const djinnSet = new Set(updates.equippedDjinn);
        if (djinnSet.size !== updates.equippedDjinn.length) {
            throw new Error(`Cannot equip duplicate Djinn. Equipped: ${updates.equippedDjinn.join(', ')}`);
        }
        // Check max slots (3)
        if (updates.equippedDjinn.length > 3) {
            throw new Error(`Cannot equip more than 3 Djinn. Attempted: ${updates.equippedDjinn.length}`);
        }
    }
    return {
        ...team,
        ...updates,
        djinnTrackers: updates.djinnTrackers ? { ...team.djinnTrackers, ...updates.djinnTrackers } : team.djinnTrackers,
        activationsThisTurn: updates.activationsThisTurn ? { ...team.activationsThisTurn, ...updates.activationsThisTurn } : team.activationsThisTurn,
        djinnStates: updates.djinnStates ? { ...team.djinnStates, ...updates.djinnStates } : team.djinnStates,
    };
}
