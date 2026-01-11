"use strict";
/**
 * Battle Service
 * Coordinates battle algorithms and state management
 * Pure functions, deterministic with PRNG
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBattle = startBattle;
exports.performAction = performAction;
exports.executeAbility = executeAbility;
exports.endTurn = endTurn;
exports.checkBattleEnd = checkBattleEnd;
exports.startTurnTick = startTurnTick;
const BattleState_1 = require("../models/BattleState");
const Unit_1 = require("../models/Unit");
const damage_1 = require("../algorithms/damage");
const turn_order_1 = require("../algorithms/turn-order");
const status_1 = require("../algorithms/status");
const targeting_1 = require("../algorithms/targeting");
const constants_1 = require("../constants");
const result_1 = require("../utils/result");
const BattleTransaction_1 = require("./BattleTransaction");
const REMOVABLE_STATUS_TYPES = ['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'];
const isRemovableStatusType = (type) => REMOVABLE_STATUS_TYPES.includes(type);
/**
 * Start a new battle
 * Creates initial battle state with turn order
 */
function startBattle(playerTeam, enemies, rng) {
    if (!playerTeam.units || playerTeam.units.length === 0) {
        return (0, result_1.Err)('Player team must contain at least one unit');
    }
    if (!enemies || enemies.length === 0) {
        return (0, result_1.Err)('Battle requires at least one enemy');
    }
    const allUnits = [...playerTeam.units, ...enemies];
    const turnOrder = (0, turn_order_1.calculateTurnOrder)(allUnits, playerTeam, rng, 0); // Start at turn 0
    return (0, result_1.Ok)((0, BattleState_1.createBattleState)(playerTeam, enemies, turnOrder));
}
/**
 * Perform an action in battle
 * Executes ability and returns updated state and events
 * PERFORMANCE: Uses unitById index for O(1) lookups
 */
function performAction(state, actorId, abilityId, targetIds, rng, options = {}) {
    const transaction = new BattleTransaction_1.BattleTransaction();
    transaction.begin(state);
    // Find actor using index (O(1) instead of O(n))
    const actorEntry = state.unitById.get(actorId);
    if (!actorEntry || (0, Unit_1.isUnitKO)(actorEntry.unit)) {
        transaction.rollback();
        return (0, result_1.Err)(`Invalid actor: ${actorId}`);
    }
    const actor = actorEntry.unit;
    // Check if frozen
    if ((0, status_1.isFrozen)(actor)) {
        const freezeStatus = actor.statusEffects.find((e) => e.type === 'freeze');
        const events = freezeStatus ? [{
                type: 'status-applied',
                targetId: actorId,
                status: freezeStatus,
            }] : [];
        transaction.commit();
        return (0, result_1.Ok)({
            state,
            result: {
                message: `${actor.name} is frozen and cannot act!`,
                targetIds: [],
                updatedUnits: [...state.playerTeam.units, ...state.enemies],
            },
            events,
        });
    }
    // Check paralyze failure
    if ((0, status_1.checkParalyzeFailure)(actor, rng)) {
        const paralyzeStatus = actor.statusEffects.find((e) => e.type === 'paralyze');
        const events = paralyzeStatus ? [{
                type: 'status-applied',
                targetId: actorId,
                status: paralyzeStatus,
            }] : [];
        transaction.commit();
        return (0, result_1.Ok)({
            state,
            result: {
                message: `${actor.name} is paralyzed and cannot act!`,
                targetIds: [],
                updatedUnits: [...state.playerTeam.units, ...state.enemies],
            },
            events,
        });
    }
    // Find ability
    const ability = actor.abilities.find(a => a.id === abilityId);
    if (!ability) {
        transaction.rollback();
        return (0, result_1.Err)(`Ability ${abilityId} not found for unit ${actorId}`);
    }
    // Resolve targets
    const potentialTargets = (0, targeting_1.resolveTargets)(ability, actor, state.playerTeam.units, state.enemies);
    const validTargets = (0, targeting_1.filterValidTargets)(potentialTargets, ability);
    const targets = validTargets.filter(t => targetIds.includes(t.id));
    if (targets.length === 0) {
        transaction.rollback();
        return (0, result_1.Err)(`No valid targets for ability ${abilityId}`);
    }
    // Re-validate targets exist and check KO status (defensive check)
    const canTargetKO = ability.revive || ability.revivesFallen;
    const finalTargets = targets.filter(t => {
        const exists = state.unitById.has(t.id);
        return exists && (canTargetKO || !(0, Unit_1.isUnitKO)(t));
    });
    if (finalTargets.length === 0) {
        transaction.rollback();
        return (0, result_1.Err)(`All targets are KO'd or invalid`);
    }
    // Store status effects before execution (for status-applied event detection)
    const statusEffectsBefore = new Map();
    finalTargets.forEach(target => {
        statusEffectsBefore.set(target.id, target.statusEffects);
    });
    // Execute ability with validated targets
    // Pass team for effective stats calculation and RNG for status chance rolls
    const allUnits = [...state.playerTeam.units, ...state.enemies];
    const abilityResult = executeAbility(actor, ability, finalTargets, allUnits, state.playerTeam, state.enemies, rng, options);
    if (!abilityResult.ok) {
        transaction.rollback();
        return (0, result_1.Err)(abilityResult.error);
    }
    const result = abilityResult.value;
    // Update battle state with new units
    const updatedPlayerUnits = state.playerTeam.units.map(u => {
        const updated = result.updatedUnits.find(up => up.id === u.id);
        return updated || u;
    });
    const updatedEnemies = state.enemies.map(u => {
        const updated = result.updatedUnits.find(up => up.id === u.id);
        return updated || u;
    });
    const updatedTeam = {
        ...state.playerTeam,
        units: updatedPlayerUnits,
    };
    const updatedState = (0, BattleState_1.updateBattleState)(state, {
        playerTeam: updatedTeam,
        enemies: updatedEnemies,
        log: [...state.log, result.message],
    });
    // Build events from result
    const events = [{
            type: 'ability',
            casterId: actorId,
            abilityId,
            targets: targetIds,
        }];
    // Add hit/heal events
    if (result.targetResults) {
        Object.entries(result.targetResults).forEach(([targetId, targetResult]) => {
            if (targetResult.damage !== undefined) {
                events.push({
                    type: 'hit',
                    targetId,
                    amount: targetResult.damage,
                    element: ability.element,
                });
                // Check if target was KO'd and emit KO event
                const updatedTarget = result.updatedUnits.find(u => u.id === targetId);
                if (updatedTarget && updatedTarget.currentHp <= 0) {
                    events.push({ type: 'ko', unitId: targetId });
                }
            }
            if (targetResult.healing !== undefined) {
                events.push({
                    type: 'heal',
                    targetId,
                    amount: targetResult.healing,
                });
            }
        });
    }
    else {
        // Fallback for when targetResults is not present (defensive)
        if (result.damage !== undefined) {
            targetIds.forEach(targetId => {
                const target = targets.find(t => t.id === targetId);
                if (target) {
                    events.push({
                        type: 'hit',
                        targetId,
                        amount: result.damage || 0,
                        element: ability.element,
                    });
                    const updatedTarget = result.updatedUnits.find(u => u.id === targetId);
                    if (updatedTarget && updatedTarget.currentHp <= 0) {
                        events.push({ type: 'ko', unitId: targetId });
                    }
                }
            });
        }
        if (result.healing !== undefined) {
            targetIds.forEach(targetId => {
                events.push({
                    type: 'heal',
                    targetId,
                    amount: result.healing || 0,
                });
            });
        }
    }
    // Emit status-applied events for newly added status effects (on-hit statuses)
    // if (ability.statusEffect) {
    targetIds.forEach(targetId => {
        const beforeStatuses = statusEffectsBefore.get(targetId) || [];
        const afterUnit = result.updatedUnits.find(u => u.id === targetId);
        if (afterUnit) {
            const afterStatuses = afterUnit.statusEffects;
            // Find newly added statuses (compare by type)
            const beforeTypes = new Set(beforeStatuses.map(s => s.type));
            const newStatuses = afterStatuses.filter(s => !beforeTypes.has(s.type));
            // Emit event for each newly applied status
            newStatuses.forEach(status => {
                events.push({
                    type: 'status-applied',
                    targetId,
                    status,
                });
            });
        }
    });
    // }
    transaction.commit();
    return (0, result_1.Ok)({ state: updatedState, result, events });
}
/**
 * Phase 2: Apply shield granting and status cleanse to targets
 * This processes optional Phase 2 ability effects after main ability execution
 */
function applyPhase2Effects(ability, targets) {
    return targets.map(target => {
        let modifiedTarget = target;
        // 1. Shield granting
        if (ability.shieldCharges) {
            const shieldStatus = {
                type: 'shield',
                remainingCharges: ability.shieldCharges,
                duration: ability.duration || 3, // Default 3 turns if not specified
            };
            modifiedTarget = {
                ...modifiedTarget,
                statusEffects: [...modifiedTarget.statusEffects, shieldStatus],
            };
        }
        // 2. Damage reduction granting
        if (ability.damageReductionPercent !== undefined) {
            const damageReductionStatus = {
                type: 'damageReduction',
                percent: ability.damageReductionPercent,
                duration: ability.duration || 3,
            };
            modifiedTarget = {
                ...modifiedTarget,
                statusEffects: [...modifiedTarget.statusEffects, damageReductionStatus],
            };
        }
        // 4. Immunity granting
        if (ability.grantImmunity) {
            const immunityStatus = {
                type: 'immunity',
                all: ability.grantImmunity.all,
                types: ability.grantImmunity.types,
                duration: ability.grantImmunity.duration,
            };
            modifiedTarget = {
                ...modifiedTarget,
                statusEffects: [...modifiedTarget.statusEffects, immunityStatus],
            };
        }
        // 5. Status cleanse
        if (ability.removeStatusEffects) {
            const removeSpec = ability.removeStatusEffects;
            let filteredStatuses = modifiedTarget.statusEffects;
            if (removeSpec.type === 'all') {
                // Remove all status effects
                filteredStatuses = [];
            }
            else if (removeSpec.type === 'negative') {
                // Remove only negative status effects
                filteredStatuses = filteredStatuses.filter(s => !(0, status_1.isNegativeStatus)(s));
            }
            else if (removeSpec.type === 'byType') {
                // Remove specific status types
                const typesToRemove = new Set(removeSpec.statuses);
                filteredStatuses = filteredStatuses.filter(status => {
                    if (!isRemovableStatusType(status.type)) {
                        return true;
                    }
                    return !typesToRemove.has(status.type);
                });
            }
            modifiedTarget = {
                ...modifiedTarget,
                statusEffects: filteredStatuses,
            };
        }
        return modifiedTarget;
    });
}
/**
 * Execute an ability in battle (internal helper)
 * Phase 2: Added enemies parameter for splash damage targeting, added rng for status chance rolls
 */
function executeAbility(caster, ability, targets, allUnits, team, enemies, rng, options = {}) {
    const targetIds = targets.map(t => t.id);
    let message = `${caster.name} uses ${ability.name}!`;
    const updatedUnits = [];
    const targetResults = {};
    // Execute based on ability type
    switch (ability.type) {
        case 'physical':
        case 'psynergy': {
            let totalDamage = 0;
            const hitCount = ability.hitCount || 1; // Multi-hit support
            for (const target of targets) {
                // Re-validate target exists and is alive (may have been KO'd by previous hits)
                let currentTarget = updatedUnits.find(u => u.id === target.id) ||
                    allUnits.find(u => u.id === target.id);
                if (!currentTarget || (0, Unit_1.isUnitKO)(currentTarget)) {
                    continue;
                }
                let targetDamage = 0;
                // Multi-hit logic
                for (let hit = 0; hit < hitCount; hit++) {
                    if ((0, Unit_1.isUnitKO)(currentTarget))
                        break; // Stop hitting if target is KO'd
                    let damage = ability.type === 'physical'
                        ? (0, damage_1.calculatePhysicalDamage)(caster, currentTarget, team, ability)
                        : (0, damage_1.calculatePsynergyDamage)(caster, currentTarget, team, ability);
                    // God Mode Overrides
                    if (options.godMode) {
                        const isPlayerCaster = team.units.some(u => u.id === caster.id);
                        const isPlayerTarget = team.units.some(u => u.id === currentTarget.id);
                        if (isPlayerCaster && !isPlayerTarget) {
                            damage = 9999; // One-hit kill enemies
                        }
                        else if (!isPlayerCaster && isPlayerTarget) {
                            damage = 0; // Invincible player
                        }
                    }
                    // Phase 2: Apply damage with shield/invulnerability checks
                    const { updatedUnit, actualDamage } = (0, damage_1.applyDamageWithShields)(currentTarget, damage);
                    currentTarget = updatedUnit;
                    targetDamage += actualDamage;
                    // Update in the working set
                    const existingIndex = updatedUnits.findIndex(u => u.id === currentTarget.id);
                    if (existingIndex >= 0) {
                        updatedUnits[existingIndex] = currentTarget;
                    }
                    else {
                        updatedUnits.push(currentTarget);
                    }
                }
                totalDamage += targetDamage;
                targetResults[target.id] = { ...targetResults[target.id], damage: targetDamage };
                // Apply status effect (if any)
                if (ability.statusEffect) {
                    const statusType = ability.statusEffect.type;
                    const statusDuration = ability.statusEffect.duration;
                    const statusChance = ability.statusEffect.chance ?? 1.0; // Default 100% chance
                    // Phase 2: Use RNG for status chance roll
                    const roll = rng.next(); // Returns [0, 1)
                    if (roll < statusChance) {
                        // First, remove existing status of the same type
                        const filteredStatuses = currentTarget.statusEffects.filter(s => s.type !== statusType);
                        currentTarget = {
                            ...currentTarget,
                            statusEffects: filteredStatuses,
                        };
                        // Create new status
                        let newStatus;
                        if (statusType === 'poison') {
                            newStatus = {
                                type: 'poison',
                                damagePerTurn: 8,
                                duration: statusDuration,
                            };
                        }
                        else if (statusType === 'burn') {
                            newStatus = {
                                type: 'burn',
                                damagePerTurn: 10,
                                duration: statusDuration,
                            };
                        }
                        else if (statusType === 'freeze') {
                            newStatus = {
                                type: 'freeze',
                                duration: statusDuration,
                            };
                        }
                        else if (statusType === 'stun') {
                            newStatus = {
                                type: 'stun',
                                duration: statusDuration,
                            };
                        }
                        else {
                            newStatus = {
                                type: 'paralyze',
                                duration: statusDuration,
                            };
                        }
                        // Phase 2: Apply status with immunity check
                        currentTarget = (0, status_1.applyStatusToUnit)(currentTarget, newStatus);
                        const existingIndex = updatedUnits.findIndex(u => u.id === currentTarget.id);
                        if (existingIndex >= 0) {
                            updatedUnits[existingIndex] = currentTarget;
                        }
                        else {
                            updatedUnits.push(currentTarget);
                        }
                    }
                }
                // Apply debuff effect (if any)
                if (ability.debuffEffect) {
                    const newDebuffs = [];
                    const validStats = ['hp', 'pp', 'atk', 'def', 'mag', 'spd'];
                    for (const [stat, modifier] of Object.entries(ability.debuffEffect)) {
                        if (typeof modifier === 'number' && validStats.includes(stat)) {
                            newDebuffs.push({
                                type: 'debuff',
                                stat: stat,
                                modifier: -Math.abs(modifier), // Ensure negative for debuff
                                duration: ability.duration || 3,
                            });
                        }
                    }
                    // Phase 2: Apply each debuff with immunity check
                    if (newDebuffs.length > 0) {
                        for (const debuff of newDebuffs) {
                            currentTarget = (0, status_1.applyStatusToUnit)(currentTarget, debuff);
                        }
                        const existingIndex = updatedUnits.findIndex(u => u.id === currentTarget.id);
                        if (existingIndex >= 0) {
                            updatedUnits[existingIndex] = currentTarget;
                        }
                        else {
                            updatedUnits.push(currentTarget);
                        }
                    }
                }
            }
            // Phase 2: Splash damage for single-target abilities
            if (ability.splashDamagePercent && ability.targets === 'single-enemy' && targets.length === 1) {
                const primaryTargetId = targets[0]?.id;
                const splashPercent = ability.splashDamagePercent;
                // Find all alive enemies excluding primary target
                const secondaryTargets = enemies.filter(enemy => enemy.id !== primaryTargetId && !(0, Unit_1.isUnitKO)(enemy));
                for (const secondaryTarget of secondaryTargets) {
                    // Get current state of secondary target
                    let currentSecondary = updatedUnits.find(u => u.id === secondaryTarget.id) ||
                        allUnits.find(u => u.id === secondaryTarget.id);
                    if (!currentSecondary || (0, Unit_1.isUnitKO)(currentSecondary)) {
                        continue;
                    }
                    // Calculate splash damage (reduced by splashPercent)
                    const baseDamage = ability.type === 'physical'
                        ? (0, damage_1.calculatePhysicalDamage)(caster, currentSecondary, team, ability)
                        : (0, damage_1.calculatePsynergyDamage)(caster, currentSecondary, team, ability);
                    const splashDamage = Math.floor(baseDamage * splashPercent);
                    // Apply splash damage with shields/invulnerability
                    const { updatedUnit, actualDamage } = (0, damage_1.applyDamageWithShields)(currentSecondary, splashDamage);
                    currentSecondary = updatedUnit;
                    totalDamage += actualDamage;
                    targetResults[secondaryTarget.id] = { ...targetResults[secondaryTarget.id], damage: actualDamage };
                    // Update in the working set
                    const existingIndex = updatedUnits.findIndex(u => u.id === currentSecondary.id);
                    if (existingIndex >= 0) {
                        updatedUnits[existingIndex] = currentSecondary;
                    }
                    else {
                        updatedUnits.push(currentSecondary);
                    }
                }
            }
            // Phase 2: Apply shield granting and status cleanse to affected units
            const unitsWithPhase2Effects = applyPhase2Effects(ability, updatedUnits);
            updatedUnits.splice(0, updatedUnits.length, ...unitsWithPhase2Effects);
            message += ` Deals ${totalDamage} damage!`;
            const finalUnits = allUnits.map(u => {
                const updated = updatedUnits.find(up => up.id === u.id);
                return updated || u;
            });
            return (0, result_1.Ok)({
                damage: totalDamage,
                message,
                targetIds,
                updatedUnits: finalUnits,
                hit: totalDamage > 0,
                targetResults,
            });
        }
        case 'healing': {
            let totalHealing = 0;
            for (const target of targets) {
                let currentTarget = target;
                let targetHealing = 0;
                // Handle revive
                if ((ability.revivesFallen || ability.revive) && (0, Unit_1.isUnitKO)(target)) {
                    const maxHp = target.baseStats.hp + (target.level - 1) * target.growthRates.hp;
                    const reviveHPPercent = ability.reviveHPPercent ?? constants_1.BATTLE_CONSTANTS.REVIVE_HP_PERCENTAGE;
                    currentTarget = {
                        ...target,
                        currentHp: Math.floor(maxHp * reviveHPPercent),
                    };
                    targetHealing = currentTarget.currentHp;
                }
                else if (!(0, Unit_1.isUnitKO)(target)) {
                    // Use effective MAG for healing calculation
                    const healAmount = (0, damage_1.calculateHealAmount)(caster, team, ability);
                    currentTarget = (0, damage_1.applyHealing)(target, healAmount, ability.revivesFallen || ability.revive || false);
                    targetHealing = currentTarget.currentHp - target.currentHp;
                }
                totalHealing += targetHealing;
                targetResults[target.id] = { ...targetResults[target.id], healing: targetHealing };
                // Apply heal-over-time effect (if any)
                if (ability.healOverTime && !(0, Unit_1.isUnitKO)(currentTarget)) {
                    const hotEffect = {
                        type: 'healOverTime',
                        healPerTurn: ability.healOverTime.amount,
                        duration: ability.healOverTime.duration,
                    };
                    // Remove existing heal-over-time effects
                    const filteredStatuses = currentTarget.statusEffects.filter(s => s.type !== 'healOverTime');
                    currentTarget = {
                        ...currentTarget,
                        statusEffects: [...filteredStatuses, hotEffect],
                    };
                }
                updatedUnits.push(currentTarget);
            }
            // Phase 2: Apply shield granting and status cleanse
            const unitsWithPhase2Effects = applyPhase2Effects(ability, updatedUnits);
            updatedUnits.splice(0, updatedUnits.length, ...unitsWithPhase2Effects);
            message += ` Restores ${totalHealing} HP!`;
            const finalUnits = allUnits.map(u => {
                const updated = updatedUnits.find(up => up.id === u.id);
                return updated || u;
            });
            return (0, result_1.Ok)({
                healing: totalHealing,
                message,
                targetIds,
                updatedUnits: finalUnits,
                hit: false,
                targetResults,
            });
        }
        case 'buff':
        case 'debuff': {
            for (const target of targets) {
                if (ability.buffEffect) {
                    let modifiedTarget = target;
                    const validStats = ['hp', 'pp', 'atk', 'def', 'mag', 'spd'];
                    for (const [stat, modifier] of Object.entries(ability.buffEffect)) {
                        if (typeof modifier === 'number' && validStats.includes(stat)) {
                            const newStatus = {
                                type: ability.type === 'buff' ? 'buff' : 'debuff',
                                stat: stat,
                                modifier: modifier,
                                duration: ability.duration || 3,
                            };
                            // Phase 2: Apply status with immunity check
                            modifiedTarget = (0, status_1.applyStatusToUnit)(modifiedTarget, newStatus);
                        }
                    }
                    updatedUnits.push(modifiedTarget);
                }
                else {
                    updatedUnits.push(target);
                }
            }
            // Phase 2: Apply shield granting and status cleanse
            const unitsWithPhase2Effects = applyPhase2Effects(ability, updatedUnits);
            updatedUnits.splice(0, updatedUnits.length, ...unitsWithPhase2Effects);
            message += ` Applied ${ability.type}!`;
            const finalUnits = allUnits.map(u => {
                const updated = updatedUnits.find(up => up.id === u.id);
                return updated || u;
            });
            return (0, result_1.Ok)({
                message,
                targetIds,
                updatedUnits: finalUnits,
                hit: false,
            });
        }
        case 'summon': {
            // Summon abilities are handled separately by the Djinn system
            // This case exists for type safety but shouldn't be called directly
            return (0, result_1.Ok)({
                message: `${caster.name} summons ${ability.name}!`,
                targetIds,
                updatedUnits: [...allUnits],
                hit: false,
            });
        }
        default: {
            // Exhaustive check - ensures all ability types are handled
            const _exhaustive = ability.type;
            return (0, result_1.Err)(`Unhandled ability type: ${String(_exhaustive)}`);
        }
    }
}
/**
 * End turn and advance to next actor
 * Recalculates turn order if needed
 * PERFORMANCE: Uses unitById index for O(1) lookup
 */
function endTurn(state, rng) {
    const transaction = new BattleTransaction_1.BattleTransaction();
    transaction.begin(state);
    let workingState = state;
    const currentActorId = workingState.turnOrder[workingState.currentActorIndex];
    if (!currentActorId) {
        // No current actor, just advance
        let nextIndex = workingState.currentActorIndex + 1;
        if (nextIndex >= workingState.turnOrder.length) {
            nextIndex = 0;
        }
        const updated = (0, BattleState_1.updateBattleState)(workingState, { currentActorIndex: nextIndex });
        transaction.commit();
        return (0, result_1.Ok)(updated);
    }
    // Advance to next actor
    let nextIndex = workingState.currentActorIndex + 1;
    // If we've gone through all units, start new round
    if (nextIndex >= workingState.turnOrder.length) {
        nextIndex = 0;
        const newTurn = workingState.currentTurn + 1;
        const newTurnOrder = (0, turn_order_1.calculateTurnOrder)([...workingState.playerTeam.units, ...workingState.enemies], workingState.playerTeam, rng, newTurn);
        const updated = (0, BattleState_1.updateBattleState)(workingState, {
            currentTurn: newTurn,
            turnOrder: newTurnOrder,
            currentActorIndex: 0,
        });
        transaction.commit();
        return (0, result_1.Ok)(updated);
    }
    const updated = (0, BattleState_1.updateBattleState)(workingState, {
        currentActorIndex: nextIndex,
    });
    transaction.commit();
    return (0, result_1.Ok)(updated);
}
/**
 * Check if battle has ended
 */
function checkBattleEnd(state) {
    // Guard against empty arrays (.every() returns true for empty arrays)
    if (state.enemies.length === 0) {
        console.error('[Battle] BUG: checkBattleEnd called with empty enemies array!');
        return null;
    }
    if (state.playerTeam.units.length === 0) {
        console.error('[Battle] BUG: checkBattleEnd called with empty player team!');
        return null;
    }
    const allPlayerKO = state.playerTeam.units.every(u => (0, Unit_1.isUnitKO)(u));
    const allEnemiesKO = state.enemies.every(u => (0, Unit_1.isUnitKO)(u));
    // If both teams are KO'd simultaneously, treat as defeat (player loses ties)
    if (allEnemiesKO && allPlayerKO) {
        return 'PLAYER_DEFEAT';
    }
    if (allEnemiesKO)
        return 'PLAYER_VICTORY';
    if (allPlayerKO)
        return 'PLAYER_DEFEAT';
    return null;
}
/**
 * Process status effects for current actor at turn start
 * Returns updated battle state and events generated
 */
function startTurnTick(state, rng) {
    const currentActorId = state.turnOrder[state.currentActorIndex];
    if (!currentActorId) {
        return { updatedState: state, events: [] };
    }
    const allUnits = [...state.playerTeam.units, ...state.enemies];
    const currentActor = allUnits.find(u => u.id === currentActorId);
    if (!currentActor) {
        return { updatedState: state, events: [] };
    }
    // Process status effects
    const statusResult = (0, status_1.processStatusEffectTick)(currentActor, rng);
    // Update actor with status effects
    const updatedAllUnits = allUnits.map(u => u.id === currentActorId ? statusResult.updatedUnit : u);
    const updatedPlayerUnits = updatedAllUnits.filter(u => state.playerTeam.units.some(pu => pu.id === u.id));
    const updatedEnemies = updatedAllUnits.filter(u => state.enemies.some(e => e.id === u.id));
    const updatedBattle = {
        ...state,
        playerTeam: {
            ...state.playerTeam,
            units: updatedPlayerUnits,
        },
        enemies: updatedEnemies,
    };
    // Generate events for status effects
    const newEvents = [];
    if (statusResult.damage > 0) {
        newEvents.push({
            type: 'hit',
            targetId: currentActorId,
            amount: statusResult.damage,
        });
    }
    // Check for expired statuses by comparing old and new status effects
    const makeStatusKey = (s) => `${s.type}-${'duration' in s ? s.duration : 'usesRemaining' in s ? s.usesRemaining : 'permanent'}`;
    const oldStatusIds = new Set(currentActor.statusEffects.map(makeStatusKey));
    const newStatusIds = new Set(statusResult.updatedUnit.statusEffects.map(makeStatusKey));
    currentActor.statusEffects.forEach(status => {
        const statusKey = makeStatusKey(status);
        if (oldStatusIds.has(statusKey) && !newStatusIds.has(statusKey)) {
            newEvents.push({
                type: 'status-expired',
                targetId: currentActorId,
                status,
            });
        }
    });
    return { updatedState: updatedBattle, events: newEvents };
}
