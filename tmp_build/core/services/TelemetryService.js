"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const store_1 = require("../../ui/state/store");
const Unit_1 = require("../models/Unit");
exports.TelemetryService = {
    /**
     * Read public selectors from the UI store and populate window.__TELEMETRY__ with a
     * sanitized snapshot. Designed to be safe to call every frame and never mutates state.
     */
    updateFrame: (extras) => {
        try {
            const s = store_1.store.getState();
            const battle = s.battle;
            const party = battle
                ? (battle.playerTeam?.units ?? []).map((u) => ({
                    id: u.id,
                    hp: u.currentHp,
                    maxHp: (0, Unit_1.calculateMaxHp)(u)
                }))
                : [];
            const enemies = battle
                ? (battle.enemies ?? []).map((e) => ({
                    id: e.id,
                    hp: e.currentHp,
                    maxHp: (0, Unit_1.calculateMaxHp)(e)
                }))
                : [];
            const activeTurn = battle
                ? (() => {
                    const idx = (typeof battle.currentActorIndex === 'number') ? battle.currentActorIndex : (battle.currentTurn ?? null);
                    const currentActorId = Array.isArray(battle.turnOrder) && idx != null ? battle.turnOrder[idx] ?? null : null;
                    return { currentActorId, currentTurn: idx };
                })()
                : null;
            const battlePhase = battle ? battle.phase : null;
            const location = {
                mapId: s.currentMapId ?? null,
                playerPosition: s.playerPosition ?? null,
            };
            const navigationAssist = {
                currentTrigger: s.currentTrigger ?? null,
                nearestDoorId: extras?.navigationAssist?.nearestDoorId ?? null,
            };
            const telemetry = {
                timestamp: Date.now(),
                party,
                enemies,
                activeTurn,
                battlePhase,
                location,
                navigationAssist,
            };
            window.__TELEMETRY__ = telemetry;
        }
        catch (err) {
            // Never throw from telemetry to avoid breaking game loop
        }
    },
    // Alias for backward compatibility
    update(extras) {
        return this.updateFrame(extras);
    },
};
