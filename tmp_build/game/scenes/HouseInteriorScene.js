"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.houseInteriorScene = exports.HouseInteriorScene = void 0;
const maps_1 = require("@/data/definitions/maps");
const STORAGE_KEY = 'vv2:house-interior-scene:v1';
const now = () => Date.now();
const isFacing = (value) => value === 'up' || value === 'down' || value === 'left' || value === 'right';
const isPosition = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const candidate = value;
    return (typeof candidate.x === 'number' &&
        Number.isInteger(candidate.x) &&
        candidate.x >= 0 &&
        typeof candidate.y === 'number' &&
        Number.isInteger(candidate.y) &&
        candidate.y >= 0);
};
const isWorldPosition = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const candidate = value;
    return (typeof candidate.x === 'number' &&
        Number.isFinite(candidate.x) &&
        typeof candidate.y === 'number' &&
        Number.isFinite(candidate.y));
};
const clonePosition = (pos) => ({ x: pos.x, y: pos.y });
const cloneWorldPosition = (pos) => ({ x: pos.x, y: pos.y });
const safeSessionStorage = () => {
    if (typeof window === 'undefined')
        return null;
    try {
        return window.sessionStorage ?? null;
    }
    catch {
        return null;
    }
};
const isHouseInteriorMapId = (mapId) => /^house-\d{2}-interior$/.test(mapId);
const clampPositionToMap = (map, pos) => ({
    x: Math.max(0, Math.min(map.width - 1, pos.x)),
    y: Math.max(0, Math.min(map.height - 1, pos.y)),
});
const getTile = (map, pos) => map.tiles[pos.y]?.[pos.x];
const isWalkable = (map, pos) => Boolean(getTile(map, pos)?.walkable);
const isDoorTile = (map, pos) => getTile(map, pos)?.type === 'door';
const comparePosition = (a, b) => (a.y - b.y !== 0 ? a.y - b.y : a.x - b.x);
const oppositeFacing = (facing) => {
    switch (facing) {
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
    }
};
const applyFacingDelta = (pos, facing) => {
    switch (facing) {
        case 'up':
            return { x: pos.x, y: pos.y - 1 };
        case 'down':
            return { x: pos.x, y: pos.y + 1 };
        case 'left':
            return { x: pos.x - 1, y: pos.y };
        case 'right':
            return { x: pos.x + 1, y: pos.y };
    }
};
const computeExteriorReturnPosition = (params) => {
    const { exteriorMap, exteriorDoorPosition, enteredFacing } = params;
    if (enteredFacing) {
        const candidate = clampPositionToMap(exteriorMap, applyFacingDelta(exteriorDoorPosition, oppositeFacing(enteredFacing)));
        if (isWalkable(exteriorMap, candidate))
            return candidate;
    }
    const neighbors = [
        { x: exteriorDoorPosition.x, y: exteriorDoorPosition.y + 1 },
        { x: exteriorDoorPosition.x, y: exteriorDoorPosition.y - 1 },
        { x: exteriorDoorPosition.x - 1, y: exteriorDoorPosition.y },
        { x: exteriorDoorPosition.x + 1, y: exteriorDoorPosition.y },
    ]
        .map((candidate) => clampPositionToMap(exteriorMap, candidate))
        .filter((candidate) => candidate.x !== exteriorDoorPosition.x || candidate.y !== exteriorDoorPosition.y);
    const nonDoor = neighbors.find((pos) => isWalkable(exteriorMap, pos) && getTile(exteriorMap, pos)?.type !== 'door');
    if (nonDoor)
        return nonDoor;
    const anyWalkable = neighbors.find((pos) => isWalkable(exteriorMap, pos));
    if (anyWalkable)
        return anyWalkable;
    return clampPositionToMap(exteriorMap, exteriorDoorPosition);
};
const resolveNearestWalkablePosition = (map, preferred) => {
    const clampedPreferred = clampPositionToMap(map, preferred);
    if (isWalkable(map, clampedPreferred))
        return clampedPreferred;
    const neighbors = [
        { x: clampedPreferred.x, y: clampedPreferred.y + 1 },
        { x: clampedPreferred.x, y: clampedPreferred.y - 1 },
        { x: clampedPreferred.x - 1, y: clampedPreferred.y },
        { x: clampedPreferred.x + 1, y: clampedPreferred.y },
    ].map((pos) => clampPositionToMap(map, pos));
    const nonDoor = neighbors.find((pos) => isWalkable(map, pos) && !isDoorTile(map, pos));
    if (nonDoor)
        return nonDoor;
    const anyWalkable = neighbors.find((pos) => isWalkable(map, pos));
    if (anyWalkable)
        return anyWalkable;
    return clampedPreferred;
};
const resolveInteriorDoorSpawnFromMap = (map) => {
    if (isPosition(map.spawnPoint))
        return { position: clonePosition(map.spawnPoint), source: 'map-spawn' };
    const transitionPositions = map.triggers
        .filter((trigger) => trigger.type === 'transition')
        .map((trigger) => trigger.position)
        .filter(isPosition)
        .map((pos) => clampPositionToMap(map, pos))
        .sort(comparePosition);
    const doorTriggerPos = transitionPositions.find((pos) => isDoorTile(map, pos));
    if (doorTriggerPos)
        return { position: clonePosition(doorTriggerPos), source: 'exit-trigger' };
    if (transitionPositions.length > 0)
        return { position: clonePosition(transitionPositions[0]), source: 'exit-trigger' };
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            const pos = { x, y };
            if (isDoorTile(map, pos))
                return { position: pos, source: 'fallback' };
        }
    }
    return { position: { x: 0, y: 0 }, source: 'fallback' };
};
const resolveExitTriggerFallback = (map) => {
    const candidates = map.triggers
        .filter((trigger) => trigger.type === 'transition')
        .map((trigger) => {
        const data = trigger.data;
        const targetMap = typeof data?.targetMap === 'string' ? data.targetMap : null;
        const targetPos = isPosition(data?.targetPos) ? data?.targetPos : null;
        if (!targetMap || !targetPos)
            return null;
        const clampedTriggerPos = isPosition(trigger.position) ? clampPositionToMap(map, trigger.position) : null;
        return {
            targetMap,
            targetPos: clonePosition(targetPos),
            triggerId: typeof trigger.id === 'string' ? trigger.id : '',
            triggerPos: clampedTriggerPos,
        };
    })
        .filter((value) => Boolean(value));
    if (candidates.length === 0)
        return null;
    const scored = candidates
        .map((candidate) => {
        const isExitNamed = candidate.triggerId.toLowerCase().includes('exit');
        const isDoor = candidate.triggerPos ? isDoorTile(map, candidate.triggerPos) : false;
        const score = (isExitNamed ? 2 : 0) + (isDoor ? 1 : 0);
        return { ...candidate, score };
    })
        .sort((a, b) => {
        if (b.score !== a.score)
            return b.score - a.score;
        if (a.triggerPos && b.triggerPos)
            return comparePosition(a.triggerPos, b.triggerPos);
        if (a.triggerPos)
            return -1;
        if (b.triggerPos)
            return 1;
        return a.triggerId.localeCompare(b.triggerId);
    });
    const best = scored[0];
    return { mapId: best.targetMap, position: clonePosition(best.targetPos) };
};
const sanitizeStoredReturnPoint = (value) => {
    if (!value || typeof value !== 'object')
        return null;
    const candidate = value;
    if (typeof candidate.exteriorMapId !== 'string')
        return null;
    if (!isPosition(candidate.exteriorPosition))
        return null;
    if (typeof candidate.updatedAt !== 'number' || !Number.isFinite(candidate.updatedAt))
        return null;
    return {
        exteriorMapId: candidate.exteriorMapId,
        exteriorPosition: clonePosition(candidate.exteriorPosition),
        exteriorFacing: isFacing(candidate.exteriorFacing) ? candidate.exteriorFacing : undefined,
        exteriorWorldPosition: isWorldPosition(candidate.exteriorWorldPosition)
            ? cloneWorldPosition(candidate.exteriorWorldPosition)
            : undefined,
        updatedAt: candidate.updatedAt,
    };
};
const sanitizeStateV1 = (value) => {
    if (!value || typeof value !== 'object')
        return null;
    const candidate = value;
    if (candidate.version !== 1)
        return null;
    const returnPointByInteriorMapId = {};
    if (candidate.returnPointByInteriorMapId && typeof candidate.returnPointByInteriorMapId === 'object') {
        for (const [interiorMapId, raw] of Object.entries(candidate.returnPointByInteriorMapId)) {
            if (!isHouseInteriorMapId(interiorMapId))
                continue;
            const sanitized = sanitizeStoredReturnPoint(raw);
            if (!sanitized)
                continue;
            returnPointByInteriorMapId[interiorMapId] = sanitized;
        }
    }
    return { version: 1, returnPointByInteriorMapId };
};
/**
 * HouseInteriorScene
 *
 * Centralizes house interior spawn and exit return-point behavior.
 *
 * Goals:
 * - Deterministic interior "door spawn" (never inherits stale positions).
 * - Preserve the last known valid overworld position when exiting the interior.
 *
 * This is intentionally UI-agnostic: callers may additionally track world-pixel
 * positions via `exteriorWorldPosition`, but the authoritative validation is
 * based on map tile positions.
 */
class HouseInteriorScene {
    constructor(maps = maps_1.MAPS) {
        Object.defineProperty(this, "maps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: maps
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                version: 1,
                returnPointByInteriorMapId: {},
            }
        });
        this.hydrate();
    }
    /**
     * Resolve the interior spawn position for a house.
     * Defaults to the interior map spawnPoint (door tile) and is deterministic.
     */
    resolveDoorSpawn(interiorMapId, facing = 'up') {
        const map = this.maps[interiorMapId];
        if (!map) {
            return { mapId: interiorMapId, position: { x: 0, y: 0 }, facing, source: 'fallback' };
        }
        const spawn = resolveInteriorDoorSpawnFromMap(map);
        const resolved = resolveNearestWalkablePosition(map, spawn.position);
        return { mapId: interiorMapId, position: clonePosition(resolved), facing, source: spawn.source };
    }
    /**
     * Record an exterior return-point for a house interior, computing a stable
     * "outside the door" position from an exterior door tile.
     *
     * Use this when the overworld engine can't reliably provide a "last tile"
     * position (e.g., free-movement pixel engines).
     */
    recordEntryFromDoor(params) {
        if (!isHouseInteriorMapId(params.interiorMapId))
            return;
        const exteriorMap = this.maps[params.exteriorMapId];
        if (!exteriorMap)
            return;
        const door = clampPositionToMap(exteriorMap, params.exteriorDoorPosition);
        const returnPos = computeExteriorReturnPosition({
            exteriorMap,
            exteriorDoorPosition: door,
            enteredFacing: params.enteredFacing,
        });
        this.setReturnPoint(params.interiorMapId, {
            exteriorMapId: params.exteriorMapId,
            exteriorPosition: returnPos,
            exteriorFacing: params.enteredFacing ? oppositeFacing(params.enteredFacing) : undefined,
            exteriorWorldPosition: params.exteriorWorldPosition,
        });
    }
    /**
     * Record an explicit exterior return-point (e.g. precise tile position in a grid overworld).
     */
    setReturnPoint(interiorMapId, value) {
        if (!isHouseInteriorMapId(interiorMapId))
            return;
        const exteriorMap = this.maps[value.exteriorMapId];
        if (!exteriorMap)
            return;
        const clamped = clampPositionToMap(exteriorMap, value.exteriorPosition);
        if (!isWalkable(exteriorMap, clamped))
            return;
        this.state.returnPointByInteriorMapId[interiorMapId] = {
            exteriorMapId: value.exteriorMapId,
            exteriorPosition: clonePosition(clamped),
            exteriorFacing: value.exteriorFacing,
            exteriorWorldPosition: value.exteriorWorldPosition ? cloneWorldPosition(value.exteriorWorldPosition) : undefined,
            updatedAt: now(),
        };
        this.persist();
    }
    /**
     * Resolve where to place the player when exiting a house interior.
     * Prioritizes the persisted return-point; falls back to the interior map's exit trigger.
     */
    resolveExit(interiorMapId) {
        const interiorMap = this.maps[interiorMapId];
        if (!interiorMap)
            return null;
        const saved = this.state.returnPointByInteriorMapId[interiorMapId];
        if (saved) {
            const exteriorMap = this.maps[saved.exteriorMapId];
            if (exteriorMap) {
                const clamped = clampPositionToMap(exteriorMap, saved.exteriorPosition);
                if (isWalkable(exteriorMap, clamped)) {
                    return {
                        mapId: saved.exteriorMapId,
                        position: clonePosition(clamped),
                        facing: saved.exteriorFacing,
                        worldPosition: saved.exteriorWorldPosition ? cloneWorldPosition(saved.exteriorWorldPosition) : undefined,
                        source: 'return-point',
                    };
                }
            }
        }
        const triggerFallback = resolveExitTriggerFallback(interiorMap);
        if (triggerFallback) {
            const exteriorMap = this.maps[triggerFallback.mapId];
            const clamped = exteriorMap ? clampPositionToMap(exteriorMap, triggerFallback.position) : triggerFallback.position;
            if (!exteriorMap || isWalkable(exteriorMap, clamped)) {
                return {
                    mapId: triggerFallback.mapId,
                    position: clonePosition(clamped),
                    source: 'exit-trigger',
                };
            }
        }
        return {
            mapId: 'vale-village',
            position: clonePosition(this.maps['vale-village']?.spawnPoint ?? { x: 0, y: 0 }),
            source: 'fallback',
        };
    }
    getReturnPoint(interiorMapId) {
        const saved = this.state.returnPointByInteriorMapId[interiorMapId];
        if (!saved)
            return null;
        return {
            exteriorMapId: saved.exteriorMapId,
            position: clonePosition(saved.exteriorPosition),
            facing: saved.exteriorFacing,
            worldPosition: saved.exteriorWorldPosition ? cloneWorldPosition(saved.exteriorWorldPosition) : undefined,
        };
    }
    clearReturnPoint(interiorMapId) {
        if (!this.state.returnPointByInteriorMapId[interiorMapId])
            return;
        delete this.state.returnPointByInteriorMapId[interiorMapId];
        this.persist();
    }
    reset() {
        this.state = { version: 1, returnPointByInteriorMapId: {} };
        this.persist(true);
    }
    hydrate() {
        const storage = safeSessionStorage();
        if (!storage)
            return;
        try {
            const raw = storage.getItem(STORAGE_KEY);
            if (!raw)
                return;
            const parsed = JSON.parse(raw);
            const sanitized = sanitizeStateV1(parsed);
            if (!sanitized)
                return;
            this.state = sanitized;
        }
        catch {
            // Ignore malformed storage
        }
    }
    persist(clear = false) {
        const storage = safeSessionStorage();
        if (!storage)
            return;
        try {
            if (clear) {
                storage.removeItem(STORAGE_KEY);
                return;
            }
            storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
        catch {
            // Ignore quota/security errors
        }
    }
}
exports.HouseInteriorScene = HouseInteriorScene;
exports.houseInteriorScene = new HouseInteriorScene();
exports.default = exports.houseInteriorScene;
