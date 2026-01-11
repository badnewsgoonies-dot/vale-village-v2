"use strict";
/**
 * BattleState model (POJO)
 * Following ADR 003: Plain objects with readonly properties where possible
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUnitIndex = buildUnitIndex;
exports.calculateTeamManaPool = calculateTeamManaPool;
exports.createBattleState = createBattleState;
exports.updateBattleState = updateBattleState;
exports.getEncounterId = getEncounterId;
const constants_1 = require("../constants");
const Team_1 = require("./Team");
const djinnAbilities_1 = require("../algorithms/djinnAbilities");
/**
 * Build unit index for O(1) lookups
 * PERFORMANCE: Eliminates O(n) array searches
 */
function buildUnitIndex(playerUnits, enemyUnits) {
    const index = new Map();
    for (const unit of playerUnits) {
        index.set(unit.id, { unit, isPlayer: true });
    }
    for (const unit of enemyUnits) {
        index.set(unit.id, { unit, isPlayer: false });
    }
    return index;
}
/**
 * Calculate team mana pool from unit contributions
 */
function calculateTeamManaPool(team) {
    return team.units.reduce((total, unit) => total + unit.manaContribution, 0);
}
/**
 * Create initial battle state
 * PR-QUEUE-BATTLE: Initializes queue-based battle system
 * PERFORMANCE: Builds unitById index for O(1) lookups
 */
function createBattleState(playerTeam, enemies, turnOrder = []) {
    const unitsWithDjinnAbilities = playerTeam.units.map(unit => (0, djinnAbilities_1.mergeDjinnAbilitiesIntoUnit)(unit, playerTeam));
    const updatedTeam = (0, Team_1.updateTeam)(playerTeam, {
        units: unitsWithDjinnAbilities,
    });
    const maxMana = calculateTeamManaPool(updatedTeam);
    const unitById = buildUnitIndex(updatedTeam.units, enemies);
    return {
        playerTeam: updatedTeam,
        enemies,
        unitById,
        currentTurn: 0,
        roundNumber: 1,
        phase: 'planning',
        turnOrder: turnOrder.length > 0 ? turnOrder : [],
        currentActorIndex: 0,
        status: 'ongoing',
        log: [],
        // Queue-based fields
        currentQueueIndex: 0,
        queuedActions: (0, constants_1.createEmptyQueue)(playerTeam.units.length),
        queuedDjinn: [],
        remainingMana: maxMana,
        maxMana,
        executionIndex: 0,
        djinnRecoveryTimers: {},
    };
}
/**
 * Update battle state (returns new object - immutability)
 * PERFORMANCE: Automatically rebuilds unitById index when units change
 * DEV MODE: Validates state invariants to catch impossible states early
 */
function updateBattleState(state, updates) {
    const newState = { ...state, ...updates };
    // Rebuild index if units changed
    if (updates.playerTeam || updates.enemies) {
        newState.unitById = buildUnitIndex(newState.playerTeam.units, newState.enemies);
    }
    // Validate invariants in development mode
    if (process.env.NODE_ENV !== 'production') {
        try {
            // Dynamic import to avoid bundling in production
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { validateBattleState } = require('../validation/battleStateInvariants');
            validateBattleState(newState);
        }
        catch (error) {
            // Re-throw validation errors
            if (error instanceof Error && error.name === 'BattleStateInvariantError') {
                throw error;
            }
            // Ignore module loading errors (validation module might not exist in some builds)
            if (error instanceof Error && !error.message.includes('Cannot find module') && !error.message.includes('require is not defined')) {
                // [REMOVED] console.warn('Battle state validation failed:', error);
            }
        }
    }
    return newState;
}
/**
 * Get encounter ID from battle state
 * Uses canonical meta.encounterId, falls back to deprecated encounterId field
 */
function getEncounterId(battle) {
    return battle.meta?.encounterId ?? battle.encounterId;
}
