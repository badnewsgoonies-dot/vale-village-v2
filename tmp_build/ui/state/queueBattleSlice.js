"use strict";
/**
 * Queue-based battle state slice for Zustand
 * PR-QUEUE-BATTLE: Manages planning and execution phases
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueueBattleSlice = void 0;
exports.normalizeBattleState = normalizeBattleState;
const QueueBattleService_1 = require("../../core/services/QueueBattleService");
const prng_1 = require("../../core/random/prng");
const healing_1 = require("../../core/algorithms/healing");
const Team_1 = require("../../core/models/Team");
const BattleState_1 = require("../../core/models/BattleState");
const constants_1 = require("../../core/constants");
const Unit_1 = require("../../core/models/Unit");
const critFlashTimeouts = new Map();
function computePendingMana(battle) {
    let pendingThisRound = 0;
    let pendingManaNextRound = 0;
    battle.queuedActions.forEach((action, index) => {
        if (!action || action.abilityId !== null) {
            return;
        }
        const unit = battle.playerTeam.units[index];
        if (!unit || (0, Unit_1.isUnitKO)(unit)) {
            return;
        }
        const timing = unit.autoAttackTiming ?? 'same-turn';
        if (timing === 'next-turn') {
            pendingManaNextRound += 1;
        }
        else {
            pendingThisRound += 1;
        }
    });
    return { pendingThisRound, pendingManaNextRound };
}
function sumBattleStat(units, key) {
    return units.reduce((total, unit) => total + (unit.battleStats?.[key] ?? 0), 0);
}
function normalizeBattleState(battle) {
    if (!battle.playerTeam || !Array.isArray(battle.playerTeam.units) || !Array.isArray(battle.enemies)) {
        console.error('Invalid battle state: missing player team or enemies');
        return null;
    }
    const teamSize = battle.playerTeam.units.length;
    const safeTeamSize = Math.min(Math.max(teamSize, constants_1.MIN_PARTY_SIZE), constants_1.MAX_PARTY_SIZE);
    const baseQueue = (0, constants_1.createEmptyQueue)(safeTeamSize);
    const queuedActions = Array.isArray(battle.queuedActions) ? [...battle.queuedActions] : [...baseQueue];
    if (queuedActions.length < safeTeamSize) {
        for (let i = queuedActions.length; i < safeTeamSize; i += 1) {
            queuedActions.push(null);
        }
    }
    else if (queuedActions.length > safeTeamSize) {
        queuedActions.length = safeTeamSize;
    }
    const maxMana = Number.isFinite(battle.maxMana) ? battle.maxMana : (0, BattleState_1.calculateTeamManaPool)(battle.playerTeam);
    const remainingMana = Number.isFinite(battle.remainingMana) ? battle.remainingMana : maxMana;
    const currentTurn = Number.isFinite(battle.currentTurn) ? battle.currentTurn : 0;
    const roundNumber = Number.isFinite(battle.roundNumber) ? battle.roundNumber : 1;
    const currentQueueIndex = Number.isFinite(battle.currentQueueIndex) ? battle.currentQueueIndex : 0;
    const executionIndex = Number.isFinite(battle.executionIndex) ? battle.executionIndex : 0;
    const phase = ['planning', 'executing', 'victory', 'defeat'].includes(battle.phase ?? '')
        ? battle.phase
        : 'planning';
    const status = battle.status ?? 'ongoing';
    return {
        ...battle,
        queuedActions,
        queuedDjinn: Array.isArray(battle.queuedDjinn) ? battle.queuedDjinn : [],
        maxMana,
        remainingMana,
        currentTurn,
        roundNumber,
        currentQueueIndex,
        executionIndex,
        phase,
        status,
        log: Array.isArray(battle.log) ? battle.log : [],
        turnOrder: Array.isArray(battle.turnOrder) ? battle.turnOrder : [],
        djinnRecoveryTimers: battle.djinnRecoveryTimers ?? {},
        unitById: battle.unitById instanceof Map
            ? battle.unitById
            : (0, BattleState_1.buildUnitIndex)(battle.playerTeam.units, battle.enemies),
    };
}
const createQueueBattleSlice = (set, get) => ({
    battle: null,
    events: [],
    rngSeed: 1337,
    activePortraitIndex: null,
    isActionMenuOpen: true,
    isSummonScreenOpen: false,
    tutorialMessage: null,
    currentMana: 0,
    maxMana: 0,
    pendingManaThisRound: 0,
    pendingManaNextRound: 0,
    pendingUpdate: null,
    critCounters: {},
    critThresholds: {},
    critFlash: {},
    lastError: null,
    setBattle: (battle, seed) => {
        // Clear any pending crit flash timeouts from previous battle
        critFlashTimeouts.forEach((timeout) => clearTimeout(timeout));
        critFlashTimeouts.clear();
        const critThresholds = {};
        const critCounters = {};
        const clonedBattle = battle ? structuredClone(battle) : null;
        const battleState = clonedBattle ? normalizeBattleState(clonedBattle) : null;
        const battleError = clonedBattle && !battleState
            ? 'Battle data is missing required fields. Try starting a new battle.'
            : null;
        if (battleState) {
            battleState.playerTeam.units.forEach((unit) => {
                critThresholds[unit.id] = critThresholds[unit.id] ?? 10;
                critCounters[unit.id] = 0;
            });
        }
        set({
            battle: battleState,
            rngSeed: seed,
            events: [],
            activePortraitIndex: null, // allow speed-based auto-selection in view
            currentMana: battleState?.remainingMana ?? 0,
            maxMana: battleState?.maxMana ?? 0,
            pendingManaThisRound: 0,
            pendingManaNextRound: 0,
            pendingUpdate: null,
            critCounters,
            critThresholds,
            critFlash: {},
            lastError: battleError,
        });
    },
    setActivePortrait: (index) => {
        set({ activePortraitIndex: index });
    },
    setActionMenuOpen: (open) => set({ isActionMenuOpen: open }),
    setSummonScreenOpen: (open) => set({ isSummonScreenOpen: open }),
    showTutorialMessage: (message) => set({ tutorialMessage: message }),
    updateManaState: (current, pending, pendingNext) => {
        set({
            currentMana: current,
            pendingManaThisRound: pending,
            pendingManaNextRound: pendingNext,
        });
    },
    incrementCritCounter: (unitId) => {
        set((state) => ({
            critCounters: {
                ...state.critCounters,
                [unitId]: (state.critCounters[unitId] ?? 0) + 1,
            },
        }));
    },
    resetCritCounter: (unitId) => {
        set((state) => ({
            critCounters: {
                ...state.critCounters,
                [unitId]: 0,
            },
        }));
    },
    triggerCritFlash: (unitId) => {
        const existingTimeout = critFlashTimeouts.get(unitId);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        set((state) => ({
            critFlash: { ...state.critFlash, [unitId]: true },
        }));
        const timeoutId = setTimeout(() => {
            set((state) => {
                const { [unitId]: _removed, ...rest } = state.critFlash;
                void _removed; // Intentionally unused - destructuring to exclude key
                return { critFlash: rest };
            });
            critFlashTimeouts.delete(unitId);
        }, 200);
        critFlashTimeouts.set(unitId, timeoutId);
    },
    clearError: () => set({ lastError: null }),
    queueUnitAction: (unitIndex, abilityId, targetIds, ability) => {
        const { battle } = get();
        if (!battle || battle.phase !== 'planning') {
            set({ lastError: 'Cannot queue action: battle not in planning phase.' });
            return false;
        }
        const unit = battle.playerTeam.units[unitIndex];
        if (!unit) {
            set({ lastError: `Cannot queue action: invalid unit index ${unitIndex}.` });
            return false;
        }
        const result = (0, QueueBattleService_1.queueAction)(battle, unit.id, abilityId, targetIds, ability);
        if (!result.ok) {
            // Log error for UI feedback (could be enhanced with toast notifications)
            // [REMOVED] console.warn(`Failed to queue action: ${result.error}`);
            set({ lastError: `Failed to queue action: ${result.error}` });
            return false;
        }
        const { pendingThisRound, pendingManaNextRound } = computePendingMana(result.value);
        set({
            battle: result.value,
            currentMana: result.value.remainingMana,
            maxMana: result.value.maxMana,
            pendingManaThisRound: pendingThisRound,
            pendingManaNextRound,
            lastError: null,
        });
        return true;
    },
    clearUnitAction: (unitIndex) => {
        const { battle } = get();
        if (!battle || battle.phase !== 'planning') {
            set({ lastError: 'Cannot clear action: battle not in planning phase.' });
            return;
        }
        const result = (0, QueueBattleService_1.clearQueuedAction)(battle, unitIndex);
        if (!result.ok) {
            // [REMOVED] console.warn(`Failed to clear action: ${result.error}`);
            set({ lastError: `Failed to clear action: ${result.error}` });
            return;
        }
        const { pendingThisRound, pendingManaNextRound } = computePendingMana(result.value);
        set({
            battle: result.value,
            currentMana: result.value.remainingMana,
            maxMana: result.value.maxMana,
            pendingManaThisRound: pendingThisRound,
            pendingManaNextRound,
            lastError: null,
        });
    },
    queueDjinnActivation: (djinnId) => {
        const { battle } = get();
        if (!battle || battle.phase !== 'planning') {
            set({ lastError: 'Cannot queue Djinn: battle not in planning phase.' });
            return;
        }
        const result = (0, QueueBattleService_1.queueDjinn)(battle, djinnId);
        if (!result.ok) {
            // [REMOVED] console.warn(`Failed to queue Djinn: ${result.error}`);
            set({ lastError: `Failed to queue Djinn: ${result.error}` });
            return;
        }
        set({ battle: result.value, lastError: null });
    },
    unqueueDjinnActivation: (djinnId) => {
        const { battle } = get();
        if (!battle || battle.phase !== 'planning') {
            set({ lastError: 'Cannot unqueue Djinn: battle not in planning phase.' });
            return;
        }
        const result = (0, QueueBattleService_1.unqueueDjinn)(battle, djinnId);
        if (!result.ok) {
            // [REMOVED] console.warn(`Failed to unqueue Djinn: ${result.error}`);
            set({ lastError: `Failed to unqueue Djinn: ${result.error}` });
            return;
        }
        set({ battle: result.value, lastError: null });
    },
    executeQueuedRound: () => {
        const { battle, rngSeed, godMode } = get();
        if (!battle || battle.phase !== 'planning') {
            set({ lastError: 'Cannot execute round: battle not in planning phase.' });
            return;
        }
        const rng = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, battle.roundNumber, constants_1.RNG_STREAMS.QUEUE_ROUND));
        const result = (0, QueueBattleService_1.executeRound)(battle, rng, { godMode });
        if (result.state === battle && result.events.length === 0) {
            set({ lastError: 'Cannot execute round: queued actions are invalid for execution.' });
            return;
        }
        const previousEvents = get().events;
        const battleEvents = [...previousEvents, ...result.events];
        const { pendingThisRound, pendingManaNextRound } = computePendingMana(result.state);
        set({
            battle: result.state,
            events: battleEvents,
            pendingManaThisRound: pendingThisRound,
            pendingManaNextRound,
            lastError: null,
        });
        const encounterId = (0, BattleState_1.getEncounterId)(result.state);
        const towerEncounterId = get().activeTowerEncounterId;
        const isTowerBattle = get().towerStatus === 'in-run' &&
            towerEncounterId !== null &&
            encounterId === towerEncounterId;
        // Sync Djinn trackers to team state (after round execution)
        if (result.state.playerTeam.djinnTrackers) {
            const { updateTeam: updateTeamState } = get();
            updateTeamState({
                djinnTrackers: result.state.playerTeam.djinnTrackers,
            });
        }
        // Tower battles are resolved by the UI (post-battle overlays + rewards flow).
        // We intentionally avoid story progression, auto-heal, and auto-save here.
        if (isTowerBattle && (result.state.phase === 'victory' || result.state.phase === 'defeat')) {
            return;
        }
        if (result.state.phase === 'victory') {
            const { onBattleEvents, updateTeamUnits, } = get();
            const healedUnits = (0, healing_1.autoHealUnits)(result.state.playerTeam.units);
            const healedTeam = (0, Team_1.updateTeam)(result.state.playerTeam, { units: healedUnits });
            const healedState = (0, BattleState_1.updateBattleState)(result.state, { playerTeam: healedTeam });
            const healEvent = {
                type: 'auto-heal',
                message: 'All units restored to full health!',
            };
            set({
                battle: healedState,
                events: [...battleEvents, healEvent],
            });
            updateTeamUnits(healedUnits);
            const totalDamage = sumBattleStat(healedState.playerTeam.units, 'damageDealt');
            get().incrementBattleStats({ outcome: 'win', damageDealt: totalDamage, healingDone: 0 });
            // Auto-save after battle victory
            try {
                void Promise.resolve(get().autoSave()).catch(() => {
                    // auto-save failure ignored
                });
            }
            catch (error) {
                // auto-save failure ignored
            }
            const encounterId = (0, BattleState_1.getEncounterId)(healedState);
            if (encounterId && onBattleEvents) {
                onBattleEvents([
                    {
                        type: 'battle-end',
                        result: 'PLAYER_VICTORY',
                    },
                    {
                        type: 'encounter-finished',
                        outcome: 'PLAYER_VICTORY',
                        encounterId,
                    },
                ]);
            }
            return;
        }
        if (result.state.phase === 'defeat') {
            const { onBattleEvents, updateTeamUnits } = get();
            const healedUnits = (0, healing_1.autoHealUnits)(result.state.playerTeam.units);
            const healedTeam = (0, Team_1.updateTeam)(result.state.playerTeam, { units: healedUnits });
            const healedState = (0, BattleState_1.updateBattleState)(result.state, { playerTeam: healedTeam });
            const healEvent = {
                type: 'auto-heal',
                message: 'All units restored to full health!',
            };
            set({
                battle: healedState,
                events: [...battleEvents, healEvent],
            });
            updateTeamUnits(healedUnits);
            const encounterId = (0, BattleState_1.getEncounterId)(healedState);
            if (encounterId && onBattleEvents) {
                onBattleEvents([
                    {
                        type: 'battle-end',
                        result: 'PLAYER_DEFEAT',
                    },
                    {
                        type: 'encounter-finished',
                        outcome: 'PLAYER_DEFEAT',
                        encounterId,
                    },
                ]);
            }
            return;
        }
    },
    dequeueEvent: () => {
        // Use functional update to avoid race conditions with concurrent dequeue calls
        set((state) => {
            if (state.events.length === 0)
                return state;
            const nextEvents = state.events.slice(1);
            // If queue is now empty and we have a pending update, apply it
            if (nextEvents.length === 0 && state.pendingUpdate) {
                const { battle, currentMana, maxMana, pendingManaThisRound, pendingManaNextRound } = state.pendingUpdate;
                return {
                    events: [],
                    battle,
                    currentMana,
                    maxMana,
                    pendingManaThisRound,
                    pendingManaNextRound,
                    pendingUpdate: null,
                };
            }
            // MANA FIX: Sync currentMana with battle.remainingMana after dequeuing event
            // This ensures UI shows accurate mana during event processing (e.g., mana-generated events)
            const updates = { events: nextEvents };
            if (state.battle) {
                updates.currentMana = state.battle.remainingMana;
            }
            return updates;
        });
    },
});
exports.createQueueBattleSlice = createQueueBattleSlice;
