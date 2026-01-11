"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBattleState = normalizeBattleState;
const BattleState_1 = require("../models/BattleState");
const constants_1 = require("../constants");
// Named defaults to avoid magic numbers and centralize semantics for normalization
const DEFAULT_CURRENT_TURN = 0;
const DEFAULT_ROUND_NUMBER = 1;
const DEFAULT_CURRENT_QUEUE_INDEX = 0;
const DEFAULT_EXECUTION_INDEX = 0;
const DEFAULT_PHASE = 'planning';
const DEFAULT_STATUS = 'ongoing';
const VALID_PHASES = ['planning', 'executing', 'victory', 'defeat'];
const VALID_PHASES_SET = new Set(VALID_PHASES);
/**
 * Pure utility: normalize a BattleState into a well-formed, immutable-compatible object.
 * Returns a new BattleState instance without mutating the input.
 */
function normalizeBattleState(state) {
    if (!state || !state.playerTeam || !Array.isArray(state.playerTeam.units) || !Array.isArray(state.enemies)) {
        throw new Error('Invalid BattleState: missing playerTeam or enemies');
    }
    const teamSize = state.playerTeam.units.length;
    const safeTeamSize = Math.min(Math.max(teamSize, constants_1.MIN_PARTY_SIZE), constants_1.MAX_PARTY_SIZE);
    const baseQueue = (0, constants_1.createEmptyQueue)(safeTeamSize);
    const queuedActions = Array.isArray(state.queuedActions) ? [...state.queuedActions] : [...baseQueue];
    if (queuedActions.length < safeTeamSize) {
        while (queuedActions.length < safeTeamSize)
            queuedActions.push(null);
    }
    else if (queuedActions.length > safeTeamSize) {
        queuedActions.length = safeTeamSize;
    }
    const maxMana = Number.isFinite(state.maxMana) ? state.maxMana : (0, BattleState_1.calculateTeamManaPool)(state.playerTeam);
    const remainingMana = Number.isFinite(state.remainingMana) ? state.remainingMana : maxMana;
    const currentTurn = Number.isFinite(state.currentTurn) ? state.currentTurn : DEFAULT_CURRENT_TURN;
    const roundNumber = Number.isFinite(state.roundNumber) ? state.roundNumber : DEFAULT_ROUND_NUMBER;
    const currentQueueIndex = Number.isFinite(state.currentQueueIndex) ? state.currentQueueIndex : DEFAULT_CURRENT_QUEUE_INDEX;
    const executionIndex = Number.isFinite(state.executionIndex) ? state.executionIndex : DEFAULT_EXECUTION_INDEX;
    const phase = VALID_PHASES_SET.has(state.phase) ? state.phase : DEFAULT_PHASE;
    const status = state.status ?? DEFAULT_STATUS;
    const queuedDjinn = Array.isArray(state.queuedDjinn) ? state.queuedDjinn : [];
    const log = Array.isArray(state.log) ? state.log : [];
    const turnOrder = Array.isArray(state.turnOrder) ? state.turnOrder : [];
    const djinnRecoveryTimers = state.djinnRecoveryTimers ?? {};
    const unitById = state.unitById instanceof Map ? state.unitById : (0, BattleState_1.buildUnitIndex)(state.playerTeam.units, state.enemies);
    return {
        ...state,
        queuedActions: queuedActions,
        queuedDjinn: queuedDjinn,
        maxMana,
        remainingMana,
        currentTurn,
        roundNumber,
        currentQueueIndex,
        executionIndex,
        phase,
        status,
        log: log,
        turnOrder: turnOrder,
        djinnRecoveryTimers: djinnRecoveryTimers,
        unitById,
    };
}
