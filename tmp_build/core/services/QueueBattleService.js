"use strict";
/**
 * Queue-Based Battle Service
 * PR-QUEUE-BATTLE: Manages planning and execution phases
 * Pure functions, deterministic with PRNG
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueBattleServiceInternals = void 0;
exports.queueAction = queueAction;
exports.clearQueuedAction = clearQueuedAction;
exports.queueDjinn = queueDjinn;
exports.unqueueDjinn = unqueueDjinn;
exports.refreshMana = refreshMana;
exports.executeRound = executeRound;
exports.getPlanningTurnOrder = getPlanningTurnOrder;
const BattleState_1 = require("../models/BattleState");
const Team_1 = require("../models/Team");
const Unit_1 = require("../models/Unit");
const constants_1 = require("../constants");
const mana_1 = require("../algorithms/mana");
const result_1 = require("../utils/result");
const djinn_1 = require("../algorithms/djinn");
const stats_1 = require("../algorithms/stats");
const BattleService_1 = require("./BattleService");
const AIService_1 = require("./AIService");
const djinnAbilities_1 = require("../algorithms/djinnAbilities");
const djinn_2 = require("../../data/definitions/djinn");
const abilities_1 = require("../../data/definitions/abilities");
const status_1 = require("../algorithms/status");
function isBasicAttack(action) {
    return action.abilityId === null;
}
function shouldGenerateMana(action, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
__actionResult) {
    return isBasicAttack(action);
}
/**
 * Queue an action for a unit
 * PR-QUEUE-BATTLE: Adds action to queue and deducts mana
 *
 * @param state - Current battle state
 * @param unitId - Unit ID to queue action for
 * @param abilityId - Ability ID (null for basic attack)
 * @param targetIds - Target unit IDs
 * @param ability - Ability definition (if not basic attack)
 * @returns Result with updated battle state or error message
 */
function queueAction(state, unitId, abilityId, targetIds, ability) {
    if (state.phase !== 'planning') {
        return (0, result_1.Err)('Can only queue actions during planning phase');
    }
    // Find unit index in team
    const unitIndex = state.playerTeam.units.findIndex(u => u.id === unitId);
    if (unitIndex === -1) {
        return (0, result_1.Err)(`Unit ${unitId} not found in player team`);
    }
    // Validate unitIndex is within bounds
    const teamSize = state.playerTeam.units.length;
    if (unitIndex < 0 || unitIndex >= teamSize) {
        return (0, result_1.Err)(`Unit index ${unitIndex} out of bounds for team size ${teamSize}`);
    }
    // If this unit already has an action queued, refund its mana before re-queuing.
    const previousAction = state.queuedActions[unitIndex];
    // Calculate mana cost
    try {
        const manaCost = (0, mana_1.getAbilityManaCost)(abilityId, ability);
        const availableMana = state.remainingMana + (previousAction?.manaCost ?? 0);
        // Check if affordable
        if (!(0, mana_1.canAffordAction)(availableMana, manaCost)) {
            return (0, result_1.Err)(`Cannot afford action: need ${manaCost} mana, have ${availableMana}`);
        }
        // Create queued action
        const action = {
            unitId,
            abilityId,
            targetIds,
            manaCost,
        };
        // Update queue
        const newQueuedActions = [...state.queuedActions];
        newQueuedActions[unitIndex] = action;
        return (0, result_1.Ok)((0, BattleState_1.updateBattleState)(state, {
            queuedActions: newQueuedActions,
            remainingMana: availableMana - manaCost,
        }));
    }
    catch (error) {
        // Handle errors from getAbilityManaCost (e.g., missing ability)
        return (0, result_1.Err)(error instanceof Error ? error.message : `Failed to queue action: ${String(error)}`);
    }
}
/**
 * Clear a queued action (refund mana)
 * PR-QUEUE-BATTLE: Removes action from queue and refunds mana
 *
 * @param state - Current battle state
 * @param unitIndex - Index of unit (0 to teamSize-1)
 * @returns Result with updated battle state or error message
 */
function clearQueuedAction(state, unitIndex) {
    if (state.phase !== 'planning') {
        return (0, result_1.Err)('Can only clear actions during planning phase');
    }
    const action = state.queuedActions[unitIndex];
    if (!action) {
        return (0, result_1.Ok)(state); // Nothing to clear
    }
    // Refund mana
    const newQueuedActions = [...state.queuedActions];
    newQueuedActions[unitIndex] = null;
    return (0, result_1.Ok)((0, BattleState_1.updateBattleState)(state, {
        queuedActions: newQueuedActions,
        remainingMana: state.remainingMana + action.manaCost,
    }));
}
/**
 * Queue Djinn activation
 * PR-DJINN-CORE: Adds Djinn to activation queue
 *
 * @param state - Current battle state
 * @param djinnId - Djinn ID to activate
 * @returns Result with updated battle state or error message
 */
function queueDjinn(state, djinnId) {
    if (state.phase !== 'planning') {
        return (0, result_1.Err)('Can only queue Djinn during planning phase');
    }
    if (!(0, djinn_1.canActivateDjinn)(state.playerTeam, djinnId)) {
        return (0, result_1.Err)(`Djinn ${djinnId} cannot be activated (not Set)`);
    }
    if (state.queuedDjinn.includes(djinnId)) {
        return (0, result_1.Ok)(state); // Already queued
    }
    return (0, result_1.Ok)((0, BattleState_1.updateBattleState)(state, {
        queuedDjinn: [...state.queuedDjinn, djinnId],
    }));
}
/**
 * Unqueue Djinn activation
 * PR-DJINN-CORE: Removes Djinn from activation queue
 *
 * @param state - Current battle state
 * @param djinnId - Djinn ID to unqueue
 * @returns Result with updated battle state or error message
 */
function unqueueDjinn(state, djinnId) {
    if (state.phase !== 'planning') {
        return (0, result_1.Err)('Can only unqueue Djinn during planning phase');
    }
    return (0, result_1.Ok)((0, BattleState_1.updateBattleState)(state, {
        queuedDjinn: state.queuedDjinn.filter(id => id !== djinnId),
    }));
}
/**
 * Refresh mana pool at start of planning phase
 * PR-MANA-QUEUE: Resets mana to max
 *
 * @param state - Current battle state
 * @returns Updated battle state
 */
function refreshMana(state) {
    return (0, BattleState_1.updateBattleState)(state, {
        remainingMana: state.maxMana,
    });
}
/**
 * Validate queue is ready for execution
 * Returns Result instead of throwing so UI can handle failures gracefully
 */
function validateQueueForExecution(state) {
    if (state.phase !== 'planning') {
        return (0, result_1.Err)('Can only execute round from planning phase');
    }
    // BUG FIX: Only require actions for ALIVE units, not all units
    // Dead units don't need actions queued
    const aliveUnits = state.playerTeam.units.filter(u => !(0, Unit_1.isUnitKO)(u));
    const aliveUnitCount = aliveUnits.length;
    // Check that we have actions for all alive units
    // Note: queuedActions array may have null entries for dead units, which is fine
    const aliveUnitActions = state.queuedActions.filter((action, index) => {
        const unit = state.playerTeam.units[index];
        return unit && !(0, Unit_1.isUnitKO)(unit) && action !== null;
    });
    if (aliveUnitActions.length !== aliveUnitCount) {
        return (0, result_1.Err)(`Cannot execute: queue incomplete. Expected ${aliveUnitCount} actions for alive units, got ${aliveUnitActions.length}`);
    }
    // BUG FIX: Validate against maxMana, not remainingMana
    // remainingMana was already decremented during queueing, so we need to check
    // the total cost against the original pool
    if (!(0, mana_1.validateQueuedActions)(state.maxMana, state.queuedActions)) {
        return (0, result_1.Err)('Cannot execute: actions exceed mana budget');
    }
    return (0, result_1.Ok)(state);
}
/**
 * Transition battle state to executing phase
 */
function transitionToExecutingPhase(state) {
    return (0, BattleState_1.updateBattleState)(state, {
        phase: 'executing',
        executionIndex: 0,
    });
}
/**
 * Execute all actions (player and enemy) in SPD order
 * FIX: Interleaves player and enemy actions by speed instead of running all player actions first
 */
function executeAllActionsPhase(state, rng, options) {
    // Gather player actions
    const playerActions = state.queuedActions.filter((a) => a !== null);
    // Generate enemy actions
    const enemyActions = generateEnemyActions(state, rng);
    // Combine and sort all actions by SPD
    const allActions = [...playerActions, ...enemyActions];
    const sortedActions = sortActionsBySPD(allActions, state.playerTeam, state.enemies);
    let currentState = state;
    const events = [];
    for (const action of sortedActions) {
        // Find actor in either team
        const allUnits = [...currentState.playerTeam.units, ...currentState.enemies];
        const actor = allUnits.find(u => u.id === action.unitId);
        if (!actor || (0, Unit_1.isUnitKO)(actor)) {
            continue;
        }
        const validTargets = resolveValidTargets(action, currentState);
        if (validTargets.length === 0) {
            continue;
        }
        const actionResult = (0, BattleService_1.performAction)(currentState, action.unitId, action.abilityId || 'strike', validTargets, rng, options);
        if (!actionResult.ok) {
            // Action failed, skip to next
            continue;
        }
        currentState = actionResult.value.state;
        events.push(...actionResult.value.events);
        // Only generate mana for player basic attacks
        const isPlayerAction = currentState.playerTeam.units.some(u => u.id === action.unitId);
        if (isPlayerAction && shouldGenerateMana(action, actionResult.value)) {
            const manaGained = 1;
            const newMana = Math.min(currentState.remainingMana + manaGained, currentState.maxMana);
            currentState = (0, BattleState_1.updateBattleState)(currentState, {
                remainingMana: newMana,
            });
            events.push({
                type: 'mana-generated',
                amount: manaGained,
                source: action.unitId,
                newTotal: newMana,
            });
        }
    }
    return { state: currentState, events };
}
/**
 * Check if battle has ended (victory or defeat)
 * Returns battle result or null if battle continues
 */
function checkBattleEndPhase(state) {
    return checkBattleEnd(state);
}
/**
 * Transition to victory or defeat phase
 */
function transitionToVictoryOrDefeat(state, result) {
    return (0, BattleState_1.updateBattleState)(state, {
        phase: result === 'PLAYER_VICTORY' ? 'victory' : 'defeat',
        status: result,
    });
}
/**
 * Transition back to planning phase for next round
 */
function transitionToPlanningPhase(state) {
    const updatedTimers = { ...state.djinnRecoveryTimers };
    const updatedTrackers = { ...state.playerTeam.djinnTrackers };
    for (const [djinnId, timer] of Object.entries(updatedTimers)) {
        if (timer > 0) {
            updatedTimers[djinnId] = timer - 1;
            if (updatedTimers[djinnId] === 0) {
                delete updatedTimers[djinnId];
                const tracker = updatedTrackers[djinnId];
                if (tracker) {
                    updatedTrackers[djinnId] = {
                        ...tracker,
                        state: 'Set',
                    };
                }
            }
        }
        else {
            delete updatedTimers[djinnId];
        }
    }
    let updatedTeam = (0, Team_1.updateTeam)(state.playerTeam, {
        djinnTrackers: updatedTrackers,
    });
    const unitsWithUpdatedAbilities = updatedTeam.units.map(unit => (0, djinnAbilities_1.mergeDjinnAbilitiesIntoUnit)(unit, updatedTeam));
    // Clamp HP/PP after Djinn recovery (stat bonuses may have changed)
    const unitsWithClampedStats = unitsWithUpdatedAbilities.map(unit => {
        const effectiveStats = (0, stats_1.calculateEffectiveStats)(unit, updatedTeam);
        const newMaxHp = effectiveStats.hp;
        let updated = unit;
        if (unit.currentHp > newMaxHp) {
            updated = { ...updated, currentHp: newMaxHp };
        }
        // Note: PP system removed, no need to clamp currentPp
        return updated;
    });
    updatedTeam = (0, Team_1.updateTeam)(updatedTeam, {
        units: unitsWithClampedStats,
    });
    const nextState = (0, BattleState_1.updateBattleState)(state, {
        phase: 'planning',
        roundNumber: state.roundNumber + 1,
        currentQueueIndex: 0,
        queuedActions: (0, constants_1.createEmptyQueue)(updatedTeam.units.length),
        queuedDjinn: [],
        executionIndex: 0,
        playerTeam: updatedTeam,
        djinnRecoveryTimers: updatedTimers,
    });
    return nextState;
}
/**
 * Execute a complete round
 * PR-QUEUE-BATTLE: Executes Djinn → all actions interleaved by SPD
 * FIX: Player and enemy actions now execute in SPD order, not in separate phases
 *
 * @param state - Current battle state
 * @param rng - PRNG instance
 * @returns Updated battle state and events
 */
function executeRound(state, rng, options = {}) {
    const validation = validateQueueForExecution(state);
    if (!validation.ok) {
        // In development, surface a warning but do not throw to avoid crashing the UI
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            // [REMOVED] console.warn(validation.error);
        }
        return { state, events: [] };
    }
    let currentState = transitionToExecutingPhase(state);
    const allEvents = [];
    if (currentState.queuedDjinn.length > 0) {
        const djinnResult = executeDjinnSummons(currentState, rng);
        currentState = djinnResult.state;
        allEvents.push(...djinnResult.events);
    }
    // Execute all actions (player and enemy) interleaved by SPD
    const actionsResult = executeAllActionsPhase(currentState, rng, options);
    currentState = actionsResult.state;
    allEvents.push(...actionsResult.events);
    const battleEnd = checkBattleEndPhase(currentState);
    if (battleEnd) {
        currentState = transitionToVictoryOrDefeat(currentState, battleEnd);
        allEvents.push({
            type: 'battle-end',
            result: battleEnd,
        });
    }
    else {
        const prePlanningState = currentState;
        currentState = transitionToPlanningPhase(currentState);
        const recoveredDjinnIds = getRecoveredDjinnIds(prePlanningState.playerTeam, currentState.playerTeam);
        if (recoveredDjinnIds.length > 0) {
            const preBonuses = snapshotDjinnBonuses(prePlanningState.playerTeam);
            const postBonuses = snapshotDjinnBonuses(currentState.playerTeam);
            const recoveryEvents = buildDjinnStateChangeEvents(preBonuses, postBonuses, currentState.playerTeam.units, 'djinn-recovered', recoveredDjinnIds);
            allEvents.push(...recoveryEvents);
        }
    }
    return {
        state: currentState,
        events: allEvents,
    };
}
/**
 * Execute Djinn summons
 * PR-DJINN-CORE: Handles Djinn activation and damage
 */
function executeDjinnSummons(state, rng) {
    const events = [];
    let currentState = state;
    let updatedTeam = state.playerTeam;
    if (state.queuedDjinn.length === 0) {
        return { state, events };
    }
    const djinnCount = state.queuedDjinn.length;
    const preBonuses = snapshotDjinnBonuses(state.playerTeam);
    const queuedDjinnData = state.queuedDjinn
        .map((id) => djinn_2.DJINN[id])
        .filter((djinn) => Boolean(djinn));
    const activationCount = state.queuedDjinn.length;
    const recoveryTime = activationCount + 1;
    // Update Djinn states to Standby
    const updatedTrackers = { ...updatedTeam.djinnTrackers };
    for (const djinnId of state.queuedDjinn) {
        const tracker = updatedTrackers[djinnId];
        if (tracker) {
            updatedTrackers[djinnId] = {
                ...tracker,
                state: 'Standby',
                lastActivatedTurn: state.roundNumber,
            };
        }
    }
    updatedTeam = (0, Team_1.updateTeam)(updatedTeam, {
        djinnTrackers: updatedTrackers,
    });
    const unitsWithUpdatedAbilities = updatedTeam.units.map(unit => (0, djinnAbilities_1.mergeDjinnAbilitiesIntoUnit)(unit, updatedTeam));
    // Clamp HP after Djinn state change (stat bonuses may have changed)
    const unitsWithClampedHP = unitsWithUpdatedAbilities.map(unit => {
        const effectiveStats = (0, stats_1.calculateEffectiveStats)(unit, updatedTeam);
        const newMaxHp = effectiveStats.hp;
        if (unit.currentHp > newMaxHp) {
            return { ...unit, currentHp: newMaxHp };
        }
        return unit;
    });
    updatedTeam = (0, Team_1.updateTeam)(updatedTeam, {
        units: unitsWithClampedHP,
    });
    const postBonuses = snapshotDjinnBonuses(updatedTeam);
    const standbyEvents = buildDjinnStateChangeEvents(preBonuses, postBonuses, updatedTeam.units, 'djinn-standby', state.queuedDjinn);
    events.push(...standbyEvents);
    const newRecoveryTimers = { ...state.djinnRecoveryTimers };
    for (const djinnId of state.queuedDjinn) {
        newRecoveryTimers[djinnId] = recoveryTime;
    }
    currentState = (0, BattleState_1.updateBattleState)(currentState, {
        playerTeam: updatedTeam,
        djinnRecoveryTimers: newRecoveryTimers,
    });
    for (const djinn of queuedDjinnData) {
        const summonEffect = djinn.summonEffect;
        const targetsHit = [];
        const targetsHealed = [];
        if (summonEffect.type === 'damage') {
            const damageAmount = summonEffect.damage ?? (0, djinn_1.calculateSummonDamage)(djinnCount);
            if (djinnCount === 3) {
                const updatedEnemies = currentState.enemies.map(enemy => {
                    if ((0, Unit_1.isUnitKO)(enemy))
                        return enemy;
                    const newHp = Math.max(0, enemy.currentHp - damageAmount);
                    events.push({
                        type: 'hit',
                        targetId: enemy.id,
                        amount: damageAmount,
                    });
                    targetsHit.push(enemy.id);
                    return { ...enemy, currentHp: newHp };
                });
                currentState = (0, BattleState_1.updateBattleState)(currentState, {
                    enemies: updatedEnemies,
                });
            }
            else {
                const aliveEnemies = currentState.enemies.filter(e => !(0, Unit_1.isUnitKO)(e));
                if (aliveEnemies.length > 0) {
                    const targetIndex = Math.floor(rng.next() * aliveEnemies.length);
                    const target = aliveEnemies[targetIndex];
                    const newHp = Math.max(0, target.currentHp - damageAmount);
                    events.push({
                        type: 'hit',
                        targetId: target.id,
                        amount: damageAmount,
                    });
                    targetsHit.push(target.id);
                    const updatedEnemies = currentState.enemies.map(e => e.id === target.id ? { ...e, currentHp: newHp } : e);
                    currentState = (0, BattleState_1.updateBattleState)(currentState, {
                        enemies: updatedEnemies,
                    });
                }
            }
        }
        else if (summonEffect.type === 'heal') {
            const healAmount = summonEffect.healAmount;
            const healedUnits = currentState.playerTeam.units.map((unit) => {
                if ((0, Unit_1.isUnitKO)(unit))
                    return unit;
                const maxHp = (0, stats_1.calculateEffectiveStats)(unit, currentState.playerTeam).hp;
                const newHp = Math.min(unit.currentHp + healAmount, maxHp);
                if (newHp !== unit.currentHp) {
                    targetsHealed.push(unit.id);
                }
                return { ...unit, currentHp: newHp };
            });
            const updatedTeamAfterHeal = (0, Team_1.updateTeam)(currentState.playerTeam, { units: healedUnits });
            currentState = (0, BattleState_1.updateBattleState)(currentState, { playerTeam: updatedTeamAfterHeal });
        }
        else if (summonEffect.type === 'buff') {
            const statBonus = summonEffect.statBonus;
            const buffedUnits = currentState.playerTeam.units.map((unit) => {
                let updated = unit;
                Object.entries(statBonus).forEach(([stat, value]) => {
                    if (value !== undefined) {
                        const status = {
                            type: 'buff',
                            stat: stat,
                            modifier: value,
                            duration: 3,
                        };
                        updated = (0, status_1.applyStatusToUnit)(updated, status);
                    }
                });
                return updated;
            });
            const updatedTeamAfterBuff = (0, Team_1.updateTeam)(currentState.playerTeam, { units: buffedUnits });
            currentState = (0, BattleState_1.updateBattleState)(currentState, { playerTeam: updatedTeamAfterBuff });
        }
        else if (summonEffect.type === 'special') {
            // Apply a light paralyze effect to all enemies as a placeholder special
            const updatedEnemies = currentState.enemies.map((enemy) => {
                if ((0, Unit_1.isUnitKO)(enemy))
                    return enemy;
                const status = {
                    type: 'paralyze',
                    duration: 1,
                };
                return (0, status_1.applyStatusToUnit)(enemy, status);
            });
            currentState = (0, BattleState_1.updateBattleState)(currentState, { enemies: updatedEnemies });
        }
        const abilityTargets = summonEffect.type === 'heal'
            ? targetsHealed
            : summonEffect.type === 'damage'
                ? targetsHit
                : summonEffect.type === 'buff'
                    ? currentState.playerTeam.units.map((u) => u.id)
                    : currentState.enemies.filter((e) => !(0, Unit_1.isUnitKO)(e)).map((e) => e.id);
        if (abilityTargets.length > 0) {
            events.push({
                type: 'ability',
                casterId: 'djinn-summon',
                abilityId: `summon-${djinn.id}`,
                targets: abilityTargets,
            });
        }
        if (summonEffect.type === 'heal') {
            for (const id of targetsHealed) {
                events.push({ type: 'heal', targetId: id, amount: summonEffect.healAmount });
            }
        }
    }
    return { state: currentState, events };
}
/**
 * Sort actions by SPD (fastest first)
 * PR-QUEUE-BATTLE: Orders actions by effective SPD
 * BUG FIX: Correctly calculate SPD for enemy units without applying player team Djinn bonuses
 */
function sortActionsBySPD(actions, playerTeam, enemies) {
    const allUnits = [...playerTeam.units, ...enemies];
    // Create an empty team for enemy stat calculations (no Djinn bonuses)
    const emptyTeam = {
        equippedDjinn: [],
        djinnTrackers: {},
        units: [],
        collectedDjinn: [],
        currentTurn: 0,
        activationsThisTurn: {},
        djinnStates: {},
    };
    return [...actions].sort((a, b) => {
        const unitA = allUnits.find(u => u.id === a.unitId);
        const unitB = allUnits.find(u => u.id === b.unitId);
        if (!unitA || !unitB)
            return 0;
        // Determine if each unit is a player unit or enemy
        const isPlayerA = playerTeam.units.some(u => u.id === a.unitId);
        const isPlayerB = playerTeam.units.some(u => u.id === b.unitId);
        // Calculate SPD with correct team context
        // Player units: use playerTeam for Djinn bonuses
        // Enemy units: use emptyTeam (no Djinn bonuses)
        const spdA = isPlayerA
            ? (0, stats_1.getEffectiveSPD)(unitA, playerTeam)
            : (0, stats_1.getEffectiveSPD)(unitA, emptyTeam);
        const spdB = isPlayerB
            ? (0, stats_1.getEffectiveSPD)(unitB, playerTeam)
            : (0, stats_1.getEffectiveSPD)(unitB, emptyTeam);
        if (spdB !== spdA) {
            return spdB - spdA; // Descending (fastest first)
        }
        // Tie-breaker: player units before enemies, then by ID
        if (isPlayerA !== isPlayerB) {
            return isPlayerA ? -1 : 1;
        }
        return a.unitId.localeCompare(b.unitId);
    });
}
/**
 * Resolve valid targets for an action
 * PR-QUEUE-BATTLE: Retargets if original target is KO'd, preserving ability target type
 */
function resolveValidTargets(action, state) {
    const allUnits = [...state.playerTeam.units, ...state.enemies];
    const actor = allUnits.find(u => u.id === action.unitId);
    // Resolve ability early to know if KO targets are allowed (revival abilities)
    let ability;
    if (actor && action.abilityId) {
        ability = actor.abilities.find(a => a.id === action.abilityId);
    }
    if (!ability && action.abilityId) {
        ability = abilities_1.ABILITIES[action.abilityId];
    }
    const canTargetKO = Boolean(ability?.revivesFallen || ability?.revive);
    // Filter out KO'd targets unless ability revives fallen units
    const validTargets = action.targetIds.filter(id => {
        const unit = allUnits.find(u => u.id === id);
        return unit && (canTargetKO || !(0, Unit_1.isUnitKO)(unit));
    });
    // If we have valid targets, return them
    if (validTargets.length > 0) {
        return validTargets;
    }
    let targetSide = 'enemy'; // Default to enemy targeting
    let targetMode = 'single'; // Default to single-target
    const isPlayerAction = state.playerTeam.units.some(u => u.id === action.unitId);
    if (actor && action.abilityId) {
        // ability variable already resolved above (actor abilities or global ABILITIES)
        if (!ability) {
            // Fallback to find ability in actor abilities or global ABILITIES
            ability = actor.abilities.find(a => a.id === action.abilityId) ?? abilities_1.ABILITIES[action.abilityId];
        }
        if (ability) {
            // Determine target side and mode based on ability's targets field
            const targets = ability.targets;
            if (targets === 'single-ally' || targets === 'all-allies' || targets === 'self') {
                targetSide = 'ally';
            }
            else {
                targetSide = 'enemy';
            }
            if (targets === 'all-enemies' || targets === 'all-allies') {
                targetMode = 'all';
            }
            else {
                targetMode = 'single';
            }
        }
        else {
            // Ability not found anywhere - fall back to the action's original target side
            // This prevents ally/heal actions from flipping to enemy targeting.
            const allyIds = new Set((isPlayerAction ? state.playerTeam.units : state.enemies).map(u => u.id));
            const enemyIds = new Set((isPlayerAction ? state.enemies : state.playerTeam.units).map(u => u.id));
            if (action.targetIds.some(id => allyIds.has(id))) {
                targetSide = 'ally';
            }
            else if (action.targetIds.some(id => enemyIds.has(id))) {
                targetSide = 'enemy';
            }
            else {
                targetSide = 'ally';
            }
            // [REMOVED] console.warn(`[QueueBattle] Ability ${action.abilityId} not found for actor ${actor.id}`);
        }
    }
    else if (action.abilityId === null) {
        // Basic attack is always single-target enemy
        targetSide = 'enemy';
        targetMode = 'single';
    }
    // Retarget based on ability's intended target side, NOT action side
    if (targetSide === 'ally') {
        // Ability targets allies - retarget to actor's allies
        const allies = isPlayerAction
            ? state.playerTeam.units.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u))
            : state.enemies.filter(e => canTargetKO || !(0, Unit_1.isUnitKO)(e));
        if (allies.length === 0) {
            return [];
        }
        if (targetMode === 'all') {
            // Multi-target: return all alive allies
            return allies.map(u => u.id);
        }
        else {
            // Single-target: return first alive ally
            return [allies[0].id];
        }
    }
    else {
        // Ability targets enemies - retarget to actor's enemies
        const enemies = isPlayerAction
            ? state.enemies.filter(e => canTargetKO || !(0, Unit_1.isUnitKO)(e))
            : state.playerTeam.units.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        if (enemies.length === 0) {
            return [];
        }
        if (targetMode === 'all') {
            // Multi-target: return all alive enemies
            return enemies.map(u => u.id);
        }
        else {
            // Single-target: return first alive enemy
            return [enemies[0].id];
        }
    }
}
/**
 * Generate enemy actions using AI
 * PR-QUEUE-BATTLE: Creates queued actions for all enemies
 */
function generateEnemyActions(state, rng) {
    const actions = [];
    for (const enemy of state.enemies) {
        if ((0, Unit_1.isUnitKO)(enemy))
            continue;
        try {
            const decision = (0, AIService_1.makeAIDecision)(state, enemy.id, rng);
            if (decision) {
                actions.push({
                    unitId: enemy.id,
                    abilityId: decision.abilityId,
                    targetIds: decision.targetIds,
                    manaCost: 0, // Enemies don't use mana
                });
            }
        }
        catch (error) {
            // Fallback to basic attack if AI decision fails (e.g., no usable abilities)
            // [REMOVED] console.warn(`AI decision failed for enemy ${enemy.id}, using basic attack:`, error);
            const alivePlayers = state.playerTeam.units.filter(u => !(0, Unit_1.isUnitKO)(u));
            if (alivePlayers.length > 0) {
                actions.push({
                    unitId: enemy.id,
                    abilityId: null,
                    targetIds: [alivePlayers[0].id],
                    manaCost: 0,
                });
            }
        }
    }
    return actions;
}
/**
 * Check if battle has ended
 * PR-QUEUE-BATTLE: Determines victory/defeat
 */
function checkBattleEnd(state) {
    // Guard against empty arrays (.every() returns true for empty arrays)
    if (state.enemies.length === 0) {
        console.error('[QueueBattle] BUG: checkBattleEnd called with empty enemies array!');
        return null; // Battle should not have been created with no enemies
    }
    if (state.playerTeam.units.length === 0) {
        console.error('[QueueBattle] BUG: checkBattleEnd called with empty player team!');
        return null; // Battle should not have been created with no players
    }
    const allEnemiesKO = state.enemies.every(e => (0, Unit_1.isUnitKO)(e));
    const allPlayersKO = state.playerTeam.units.every(u => (0, Unit_1.isUnitKO)(u));
    // BUG FIX: Defensive check - verify that allPlayersKO is actually correct
    // If we detect a mismatch (allPlayersKO is true but some units have HP > 0),
    // this indicates a bug - log and return null to prevent incorrect defeat
    const aliveUnits = state.playerTeam.units.filter(u => !(0, Unit_1.isUnitKO)(u));
    if (allPlayersKO && aliveUnits.length > 0) {
        // Inconsistent KO state detected; skipping false-positive defeat (development-only diagnostic removed).
        return null; // Continue battle - this is a false positive
    }
    // Check for simultaneous wipe-out (rare but possible)
    if (allEnemiesKO && allPlayersKO) {
        return 'PLAYER_DEFEAT'; // Treat simultaneous wipe-out as defeat
    }
    if (allEnemiesKO) {
        return 'PLAYER_VICTORY';
    }
    if (allPlayersKO) {
        return 'PLAYER_DEFEAT';
    }
    return null;
}
function snapshotDjinnBonuses(team) {
    const snapshot = {};
    for (const unit of team.units) {
        snapshot[unit.id] = (0, djinnAbilities_1.calculateDjinnBonusesForUnit)(unit, team);
    }
    return snapshot;
}
function buildDjinnStateChangeEvents(before, after, units, type, djinnIds) {
    if (djinnIds.length === 0) {
        return [];
    }
    const events = [];
    for (const unit of units) {
        const prev = before[unit.id];
        const next = after[unit.id];
        const atkDelta = (next?.atk ?? 0) - (prev?.atk ?? 0);
        const defDelta = (next?.def ?? 0) - (prev?.def ?? 0);
        if (atkDelta === 0 && defDelta === 0) {
            continue;
        }
        events.push({
            type,
            unitId: unit.id,
            djinnIds,
            atkDelta,
            defDelta,
        });
    }
    return events;
}
function getRecoveredDjinnIds(before, after) {
    const recovered = [];
    for (const [djinnId, tracker] of Object.entries(after.djinnTrackers)) {
        const previousState = before.djinnTrackers[djinnId]?.state;
        if (previousState && previousState !== 'Set' && tracker.state === 'Set') {
            recovered.push(djinnId);
        }
    }
    return recovered;
}
/**
 * Get planning phase turn order (indices of player units sorted by SPD)
 * PR-QUEUE-BATTLE: Helps UI guide player through units in speed order
 */
function getPlanningTurnOrder(state) {
    // Create array of { index, spd } objects
    const unitSpeeds = state.playerTeam.units.map((unit, index) => ({
        index,
        spd: (0, Unit_1.isUnitKO)(unit) ? -1 : (0, stats_1.getEffectiveSPD)(unit, state.playerTeam),
        isKo: (0, Unit_1.isUnitKO)(unit)
    }));
    // Sort by SPD descending
    unitSpeeds.sort((a, b) => {
        // Move KO'd units to end
        if (a.isKo && !b.isKo)
            return 1;
        if (!a.isKo && b.isKo)
            return -1;
        if (b.spd !== a.spd) {
            return b.spd - a.spd; // Descending
        }
        // Stable sort by index for ties
        return a.index - b.index;
    });
    return unitSpeeds.map(u => u.index);
}
exports.queueBattleServiceInternals = {
    validateQueueForExecution,
    transitionToExecutingPhase,
    executeAllActionsPhase,
    checkBattleEndPhase,
    transitionToVictoryOrDefeat,
    transitionToPlanningPhase,
};
