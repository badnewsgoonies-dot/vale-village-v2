"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldScene = void 0;
const maps_1 = require("../data/definitions/maps");
const SceneTransitionManager_1 = require("../systems/SceneTransitionManager");
const store_1 = require("../ui/state/store");
const clonePosition = (position) => ({ x: position.x, y: position.y });
const coerceFacing = (value) => {
    if (value === 'up' || value === 'down' || value === 'left' || value === 'right')
        return value;
    return undefined;
};
/**
 * OverworldScene
 *
 * Centralizes overworld map transitions with stable, resumable spawn logic.
 * In particular, House 01 entry/exit uses `SceneTransitionManager` return-points
 * so exiting the interior returns the player to their last exterior position.
 */
class OverworldScene {
    constructor(options = {}) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
    }
    destroy() {
        this.options.setInputEnabled?.(true);
    }
    /**
     * Convenience: enter House 01 interior, recording an exterior return-point.
     */
    enterFirstHouse() {
        const toMapId = 'house-01-interior';
        const fallback = maps_1.MAPS[toMapId]?.spawnPoint ?? { x: 5, y: 7 };
        this.transition({
            toMapId,
            toPosition: fallback,
            toFacing: 'up',
            reason: 'enter-house-01',
        });
    }
    /**
     * Convenience: exit House 01 interior back to Vale Village.
     * Uses the return-point recorded on entry, falling back to the map spawnPoint.
     */
    exitFirstHouse() {
        const toMapId = 'vale-village';
        const fallback = maps_1.MAPS[toMapId]?.spawnPoint ?? { x: 7, y: 13 };
        this.transition({
            toMapId,
            toPosition: undefined,
            toFacing: undefined,
            reason: 'exit-house-01',
            fallbackPosition: fallback,
        });
    }
    /**
     * Handle a transition trigger, with special handling for House 01 entry/exit.
     * Safe to call from either overworld UI implementation (DOM grid or canvas engine).
     */
    handleTransitionTrigger(trigger) {
        if (trigger.type !== 'transition')
            return;
        const data = trigger.data;
        const targetMap = data?.targetMap;
        if (!targetMap)
            return;
        const store = this.getStore();
        const fromMapId = store.currentMapId;
        if (trigger.id === 'house-01-door' && fromMapId === 'vale-village') {
            this.enterFirstHouse();
            return;
        }
        if (trigger.id === 'house-01-exit' && fromMapId === 'house-01-interior') {
            this.exitFirstHouse();
            return;
        }
        this.transition({
            toMapId: targetMap,
            toPosition: data?.targetPos,
            triggerId: trigger.id,
            reason: 'map-trigger-transition',
        });
    }
    getStore() {
        return store_1.useStore.getState();
    }
    getCurrentLocation() {
        const store = this.getStore();
        return {
            mapId: store.currentMapId,
            position: clonePosition(store.playerPosition),
            facing: coerceFacing(store.facing),
        };
    }
    applyTeleport(toMapId, position, facing) {
        const store = this.getStore();
        store.teleportPlayer(toMapId, position);
        if (facing) {
            store.setFacing(facing);
        }
    }
    transition(params) {
        const from = this.getCurrentLocation();
        SceneTransitionManager_1.sceneTransitionManager.beginTransition({
            from,
            toMapId: params.toMapId,
            toPosition: params.toPosition,
            toFacing: params.toFacing,
            triggerId: params.triggerId,
            reason: params.reason,
        });
        const fallback = params.fallbackPosition ?? maps_1.MAPS[params.toMapId]?.spawnPoint ?? { x: 0, y: 0 };
        const resolved = SceneTransitionManager_1.sceneTransitionManager.resolveSpawn(params.toMapId, fallback, params.toFacing);
        this.applyTeleport(params.toMapId, resolved.position, resolved.facing);
        SceneTransitionManager_1.sceneTransitionManager.consumePendingTransitionForMap(params.toMapId);
    }
}
exports.OverworldScene = OverworldScene;
