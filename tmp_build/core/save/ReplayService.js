"use strict";
/**
 * Replay Service
 * Deterministic replay of battles from ReplayTape
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.playReplay = playReplay;
const BattleState_1 = require("../models/BattleState");
const prng_1 = require("../random/prng");
const constants_1 = require("../constants");
const BattleService_1 = require("../services/BattleService");
const status_1 = require("../algorithms/status");
/**
 * Create initial battle state from snapshot
 */
function createBattleFromSnapshot(snapshot) {
    if (!snapshot.battle) {
        return null;
    }
    // Recreate battle state from snapshot
    // Note: This assumes battle state is fully serializable
    // In a real implementation, you might need to reconstruct units from IDs
    return snapshot.battle;
}
/**
 * Apply a player command to battle state
 */
function applyPlayerCommand(state, command, rng) {
    if (command.type === 'ability' && command.abilityId && command.targetIds) {
        const result = (0, BattleService_1.performAction)(state, command.actorId, command.abilityId, command.targetIds, rng);
        if (!result.ok) {
            throw new Error(`Action failed: ${result.error}`);
        }
        const battleEnd = (0, BattleService_1.checkBattleEnd)(result.value.state);
        const events = [...result.value.events];
        if (battleEnd) {
            events.push({
                type: 'battle-end',
                result: battleEnd,
            });
            // Emit encounter-finished if we have encounterId
            const encounterId = (0, BattleState_1.getEncounterId)(result.value.state);
            if (encounterId) {
                events.push({
                    type: 'encounter-finished',
                    outcome: battleEnd,
                    encounterId,
                });
            }
        }
        return { state: result.value.state, events };
    }
    else if (command.type === 'end-turn') {
        const endResult = (0, BattleService_1.endTurn)(state, rng);
        if (!endResult.ok) {
            throw new Error(`End turn failed: ${endResult.error}`);
        }
        return { state: endResult.value, events: [] };
    }
    throw new Error(`Unknown command type: ${command.type}`);
}
/**
 * Apply a system tick to battle state
 */
function applySystemTick(state, tick, rng) {
    if (tick.type === 'status-tick') {
        const allUnits = [...state.playerTeam.units, ...state.enemies];
        const actor = allUnits.find(u => u.id === tick.actorId);
        if (!actor) {
            return { state, events: [] };
        }
        const statusResult = (0, status_1.processStatusEffectTick)(actor, rng);
        const updatedAllUnits = allUnits.map(u => u.id === tick.actorId ? statusResult.updatedUnit : u);
        const updatedPlayerUnits = updatedAllUnits.filter(u => state.playerTeam.units.some(pu => pu.id === u.id));
        const updatedEnemies = updatedAllUnits.filter(u => state.enemies.some(e => e.id === u.id));
        const updatedState = {
            ...state,
            playerTeam: {
                ...state.playerTeam,
                units: updatedPlayerUnits,
            },
            enemies: updatedEnemies,
        };
        const events = [];
        if (statusResult.damage > 0) {
            events.push({
                type: 'hit',
                targetId: tick.actorId,
                amount: statusResult.damage,
            });
        }
        return { state: updatedState, events };
    }
    else if (tick.type === 'ai-action' && tick.abilityId && tick.targetIds) {
        const result = (0, BattleService_1.performAction)(state, tick.actorId, tick.abilityId, tick.targetIds, rng);
        if (!result.ok) {
            throw new Error(`AI action failed: ${result.error}`);
        }
        const battleEnd = (0, BattleService_1.checkBattleEnd)(result.value.state);
        const events = [...result.value.events];
        if (battleEnd) {
            events.push({
                type: 'battle-end',
                result: battleEnd,
            });
            // Emit encounter-finished if we have encounterId
            const encounterId = (0, BattleState_1.getEncounterId)(result.value.state);
            if (encounterId) {
                events.push({
                    type: 'encounter-finished',
                    outcome: battleEnd,
                    encounterId,
                });
            }
        }
        return { state: result.value.state, events };
    }
    return { state, events: [] };
}
/**
 * Play a replay tape deterministically
 */
function playReplay(tape) {
    try {
        // Create initial battle state
        let battleState = createBattleFromSnapshot(tape.initial);
        if (!battleState) {
            return {
                finalState: null,
                events: [],
                success: false,
                error: 'No battle state in snapshot',
            };
        }
        const allEvents = [];
        // Process each input
        for (const input of tape.inputs) {
            // Use deterministic per-turn RNG substream using centralized constants
            let streamOffset;
            if (input.type === 'status-tick') {
                streamOffset = constants_1.RNG_STREAMS.STATUS_EFFECTS;
            }
            else if (input.type === 'ai-action') {
                streamOffset = constants_1.RNG_STREAMS.ACTIONS;
            }
            else if (input.type === 'ability') {
                streamOffset = constants_1.RNG_STREAMS.ACTIONS;
            }
            else {
                // end-turn and other player-driven offsets
                streamOffset = constants_1.RNG_STREAMS.END_TURN;
            }
            const turnSeed = (0, constants_1.createRNGStream)(tape.seed, input.turn, streamOffset);
            const turnRng = (0, prng_1.makePRNG)(turnSeed);
            if (input.type === 'ability' || input.type === 'end-turn') {
                const result = applyPlayerCommand(battleState, input, turnRng);
                battleState = result.state;
                allEvents.push(...result.events);
                // Check if battle ended
                if (battleState.status !== 'ongoing') {
                    break;
                }
            }
            else {
                const result = applySystemTick(battleState, input, turnRng);
                battleState = result.state;
                allEvents.push(...result.events);
                // Check if battle ended
                if (battleState.status !== 'ongoing') {
                    break;
                }
            }
        }
        return {
            finalState: battleState,
            events: allEvents,
            success: true,
        };
    }
    catch (error) {
        return {
            finalState: null,
            events: [],
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
