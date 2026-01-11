"use strict";
/**
 * Battle state slice for Zustand
 * Manages battle state, events, and turn progression
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBattleSlice = void 0;
const BattleState_1 = require("../../core/models/BattleState");
const BattleService_1 = require("../../core/services/BattleService");
const AIService_1 = require("../../core/services/AIService");
const prng_1 = require("../../core/random/prng");
const constants_1 = require("../../core/constants");
const normalizeBattleState_1 = require("../../core/battle/normalizeBattleState");
const PREVIEW_SAMPLES = 16;
const PREVIEW_SHIFT_TURN = 8;
const PREVIEW_SHIFT_ABILITY_LEN = 16;
const PREVIEW_SHIFT_CASTER_LEN = 24;
const createBattleSlice = (set, get) => ({
    battle: null,
    events: [],
    rngSeed: constants_1.DEFAULT_RNG_SEED,
    turnNumber: 0,
    setBattle: (battle, seed) => {
        const normalized = battle ? (0, normalizeBattleState_1.normalizeBattleState)(battle) ?? battle : null;
        set({ battle: normalized, rngSeed: seed, turnNumber: 0, events: [] });
    },
    startTurnTick: () => {
        const { battle, rngSeed, turnNumber } = get();
        if (!battle)
            return;
        // Stable per-turn stream for status effects
        const rng = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.STATUS_EFFECTS));
        // Call service to process status effects
        const result = (0, BattleService_1.startTurnTick)(battle, rng);
        set((state) => ({ battle: result.updatedState, events: [...state.events, ...result.events] }));
    },
    perform: (casterId, abilityId, targetIds) => {
        const { battle, rngSeed, turnNumber } = get();
        if (!battle)
            return;
        // Separate substream for actions
        const rng = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.ACTIONS));
        const result = (0, BattleService_1.performAction)(battle, casterId, abilityId, targetIds, rng);
        if (!result.ok) {
            console.error('performAction failed:', result.error);
            return;
        }
        // Check for battle end
        const battleEnd = (0, BattleService_1.checkBattleEnd)(result.value.state);
        const newEvents = [...result.value.events];
        if (battleEnd) {
            newEvents.push({
                type: 'battle-end',
                result: battleEnd,
            });
            const normalizedEnd = (0, normalizeBattleState_1.normalizeBattleState)(result.value.state) ?? result.value.state;
            // If player victory, process rewards
            if (battleEnd === 'PLAYER_VICTORY') {
                const { processVictory } = get();
                processVictory(normalizedEnd);
            }
            // Emit encounter-finished event if we have an encounterId
            // This is a story-specific event, emitted alongside battle-end for story progression
            const encounterId = (0, BattleState_1.getEncounterId)(normalizedEnd);
            if (encounterId) {
                newEvents.push({
                    type: 'encounter-finished',
                    outcome: battleEnd,
                    encounterId,
                });
            }
            set((state) => ({ battle: normalizedEnd, events: [...state.events, ...newEvents] }));
            // Notify story slice of encounter completion if an encounterId exists
            // This mirrors the behavior performed in performAIAction and queue-based battles.
            const updatedEncounterId = (0, BattleState_1.getEncounterId)(result.value.state);
            if (updatedEncounterId) {
                const { onBattleEvents } = get();
                if (onBattleEvents) {
                    onBattleEvents(newEvents);
                }
            }
        }
        else {
            // Battle continues - advance to next turn
            const rngEndTurn = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.END_TURN));
            const endResult = (0, BattleService_1.endTurn)(result.value.state, rngEndTurn);
            if (!endResult.ok) {
                console.error('endTurn failed:', endResult.error);
                return;
            }
            {
                const normalizedEnd = (0, normalizeBattleState_1.normalizeBattleState)(endResult.value) ?? endResult.value;
                set((state) => ({
                    battle: normalizedEnd,
                    events: [...state.events, ...newEvents],
                    turnNumber: turnNumber + 1,
                }));
            }
        }
    },
    endTurn: () => {
        const { battle, rngSeed, turnNumber } = get();
        if (!battle)
            return;
        const rng = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.END_TURN));
        const result = (0, BattleService_1.endTurn)(battle, rng);
        if (!result.ok) {
            console.error('endTurn failed:', result.error);
            return;
        }
        {
            const normalized = (0, normalizeBattleState_1.normalizeBattleState)(result.value) ?? result.value;
            set({ battle: normalized, turnNumber: turnNumber + 1 });
        }
    },
    performAIAction: () => {
        const { battle, rngSeed, turnNumber } = get();
        if (!battle)
            return;
        const allUnits = [...battle.playerTeam.units, ...battle.enemies];
        const currentActorId = battle.turnOrder[battle.currentActorIndex];
        const currentActor = allUnits.find(u => u.id === currentActorId);
        if (!currentActor || !currentActorId)
            return;
        // Check if it's an enemy turn
        const isPlayerUnit = battle.playerTeam.units.some(u => u.id === currentActorId);
        if (isPlayerUnit)
            return; // Player turn - don't auto-execute
        // Make AI decision
        const rng = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.ACTIONS));
        try {
            const decision = (0, AIService_1.makeAIDecision)(battle, currentActorId, rng);
            // Execute the decision
            const result = (0, BattleService_1.performAction)(battle, currentActorId, decision.abilityId, decision.targetIds, rng);
            if (!result.ok) {
                console.error('AI performAction failed:', result.error);
                return;
            }
            // Check for battle end
            const battleEnd = (0, BattleService_1.checkBattleEnd)(result.value.state);
            const newEvents = [...result.value.events];
            if (battleEnd) {
                newEvents.push({
                    type: 'battle-end',
                    result: battleEnd,
                });
                const normalizedEnd = (0, normalizeBattleState_1.normalizeBattleState)(result.value.state) ?? result.value.state;
                // If player victory, process rewards
                if (battleEnd === 'PLAYER_VICTORY') {
                    const { processVictory } = get();
                    processVictory(normalizedEnd);
                }
                // Emit encounter-finished event for story progression
                const encounterId = (0, BattleState_1.getEncounterId)(normalizedEnd);
                if (encounterId) {
                    newEvents.push({
                        type: 'encounter-finished',
                        outcome: battleEnd,
                        encounterId,
                    });
                }
                set((state) => ({ battle: normalizedEnd, events: [...state.events, ...newEvents] }));
                // Notify story slice of encounter completion
                if (encounterId) {
                    const { onBattleEvents } = get();
                    if (onBattleEvents) {
                        onBattleEvents(newEvents);
                    }
                }
            }
            else {
                // Battle continues - advance to next turn
                const rngEndTurn = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.END_TURN));
                const endResult = (0, BattleService_1.endTurn)(result.value.state, rngEndTurn);
                if (!endResult.ok) {
                    console.error('AI endTurn failed:', endResult.error);
                    return;
                }
                {
                    const normalizedEnd = (0, normalizeBattleState_1.normalizeBattleState)(endResult.value) ?? endResult.value;
                    set((state) => ({
                        battle: normalizedEnd,
                        events: [...state.events, ...newEvents],
                        turnNumber: turnNumber + 1,
                    }));
                }
            }
        }
        catch (error) {
            console.error('AI decision failed:', error);
            // Fallback: end turn
            const rngFallback = (0, prng_1.makePRNG)((0, constants_1.createRNGStream)(rngSeed, turnNumber, constants_1.RNG_STREAMS.END_TURN));
            const fallbackResult = (0, BattleService_1.endTurn)(battle, rngFallback);
            if (fallbackResult.ok) {
                {
                    const normalized = (0, normalizeBattleState_1.normalizeBattleState)(fallbackResult.value) ?? fallbackResult.value;
                    set({ battle: normalized, turnNumber: turnNumber + 1 });
                }
            }
        }
    },
    dequeueEvent: () => {
        // Snapshot-based dequeue to prevent race conditions
        // If new events arrive during processing, we consume exactly what was there at start
        set((state) => {
            if (state.events.length === 0)
                return state;
            // Remove exactly the first event (snapshot-based: slice creates new array)
            const remaining = state.events.slice(1);
            return { events: remaining };
        });
    },
    preview: (casterId, abilityId, targets) => {
        const { battle, rngSeed, turnNumber } = get();
        if (!battle)
            return { avg: 0, min: 0, max: 0 };
        // Use a cloned deterministic stream so hovers never consume the live RNG
        const previewSeed = rngSeed ^
            (turnNumber << PREVIEW_SHIFT_TURN) ^
            (abilityId.length << PREVIEW_SHIFT_ABILITY_LEN) ^
            (casterId.length << PREVIEW_SHIFT_CASTER_LEN);
        const baseRng = (0, prng_1.makePRNG)(previewSeed);
        // Run N deterministic samples
        const N = PREVIEW_SAMPLES;
        let sum = 0;
        let min = Number.POSITIVE_INFINITY;
        let max = 0;
        let successes = 0;
        for (let i = 0; i < N; i++) {
            const r = baseRng.clone();
            const result = (0, BattleService_1.performAction)(battle, casterId, abilityId, targets, r);
            if (!result.ok) {
                continue; // Skip failed previews
            }
            successes += 1;
            const totalDamage = result.value.events
                .filter((e) => e.type === 'hit')
                .reduce((acc, ev) => acc + ev.amount, 0);
            sum += totalDamage;
            min = Math.min(min, totalDamage);
            max = Math.max(max, totalDamage);
        }
        if (successes === 0)
            return { avg: 0, min: 0, max: 0 };
        return { avg: Math.round(sum / successes), min, max };
    },
});
exports.createBattleSlice = createBattleSlice;
