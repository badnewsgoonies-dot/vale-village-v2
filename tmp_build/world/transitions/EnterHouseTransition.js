"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterHouseTransition = exports.EnterHouseTransition = void 0;
const maps_1 = require("@/data/definitions/maps");
const STORAGE_KEY = 'vv2:enter-house-transition:v1';
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
const clonePosition = (pos) => ({ x: pos.x, y: pos.y });
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
const isInteriorMapId = (mapId) => mapId.includes('-interior');
const isHouseInteriorMapId = (mapId) => /^house-\d{2}-interior$/.test(mapId);
const clampPositionToMap = (map, pos) => ({
    x: Math.max(0, Math.min(map.width - 1, pos.x)),
    y: Math.max(0, Math.min(map.height - 1, pos.y)),
});
const getTile = (map, pos) => map.tiles[pos.y]?.[pos.x];
const isWalkable = (map, pos) => Boolean(getTile(map, pos)?.walkable);
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
    const { exteriorMap, doorPosition, enteredFacing } = params;
    if (enteredFacing) {
        const candidate = clampPositionToMap(exteriorMap, applyFacingDelta(doorPosition, oppositeFacing(enteredFacing)));
        if (isWalkable(exteriorMap, candidate))
            return candidate;
    }
    const neighbors = [
        { x: doorPosition.x, y: doorPosition.y + 1 },
        { x: doorPosition.x, y: doorPosition.y - 1 },
        { x: doorPosition.x - 1, y: doorPosition.y },
        { x: doorPosition.x + 1, y: doorPosition.y },
    ]
        .map((candidate) => clampPositionToMap(exteriorMap, candidate))
        .filter((candidate) => candidate.x !== doorPosition.x || candidate.y !== doorPosition.y);
    const nonDoor = neighbors.find((pos) => isWalkable(exteriorMap, pos) && getTile(exteriorMap, pos)?.type !== 'door');
    if (nonDoor)
        return nonDoor;
    const anyWalkable = neighbors.find((pos) => isWalkable(exteriorMap, pos));
    if (anyWalkable)
        return anyWalkable;
    return clampPositionToMap(exteriorMap, doorPosition);
};
const sanitizeStoredReturnPoint = (value) => {
    if (!value || typeof value !== 'object')
        return null;
    const candidate = value;
    if (typeof candidate.mapId !== 'string')
        return null;
    if (!isPosition(candidate.position))
        return null;
    if (typeof candidate.updatedAt !== 'number' || !Number.isFinite(candidate.updatedAt))
        return null;
    return {
        mapId: candidate.mapId,
        position: clonePosition(candidate.position),
        facing: isFacing(candidate.facing) ? candidate.facing : undefined,
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
            if (!isInteriorMapId(interiorMapId))
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
 * EnterHouseTransition
 *
 * Resolves house entry/exit spawns and persists an exterior "return point"
 * keyed by interior map id.
 *
 * Core behavior:
 * - Entering a house interior persists an exterior return point computed from the door position.
 * - Exiting a house interior prefers the persisted return point over hardcoded trigger positions.
 * - When trigger metadata is missing, falls back to destination map spawnPoint.
 */
class EnterHouseTransition {
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
    resolve(trigger, from) {
        if (trigger.type !== 'transition')
            return null;
        const data = trigger.data;
        const toMapId = typeof data?.targetMap === 'string' ? data.targetMap : null;
        if (!toMapId)
            return null;
        const toMap = this.maps[toMapId];
        const fromMap = this.maps[from.mapId];
        const triggerPos = isPosition(data?.targetPos) ? clonePosition(data.targetPos) : null;
        const mapSpawn = toMap ? clonePosition(toMap.spawnPoint) : null;
        const enteringHouse = Boolean(fromMap && !isInteriorMapId(from.mapId) && isHouseInteriorMapId(toMapId));
        const exitingHouse = Boolean(toMap && isHouseInteriorMapId(from.mapId) && !isInteriorMapId(toMapId));
        if (enteringHouse && fromMap) {
            const returnPos = computeExteriorReturnPosition({
                exteriorMap: fromMap,
                doorPosition: trigger.position,
                enteredFacing: from.facing,
            });
            const exitFacing = from.facing ? oppositeFacing(from.facing) : undefined;
            this.setReturnPoint(toMapId, {
                mapId: from.mapId,
                position: returnPos,
                facing: exitFacing,
            });
        }
        if (exitingHouse) {
            const saved = this.getReturnPoint(from.mapId);
            if (saved && saved.mapId === toMapId) {
                return {
                    toMapId,
                    toPosition: clonePosition(saved.position),
                    toFacing: saved.facing,
                    source: 'return-point',
                };
            }
        }
        if (triggerPos) {
            return {
                toMapId,
                toPosition: triggerPos,
                source: 'trigger',
            };
        }
        if (mapSpawn) {
            return {
                toMapId,
                toPosition: mapSpawn,
                source: 'map-spawn',
            };
        }
        return {
            toMapId,
            toPosition: { x: 0, y: 0 },
            source: 'fallback',
        };
    }
    getReturnPoint(interiorMapId) {
        const saved = this.state.returnPointByInteriorMapId[interiorMapId];
        if (!saved)
            return null;
        return {
            mapId: saved.mapId,
            position: clonePosition(saved.position),
            facing: saved.facing,
        };
    }
    setReturnPoint(interiorMapId, value) {
        if (!isInteriorMapId(interiorMapId))
            return;
        const map = this.maps[value.mapId];
        if (!map)
            return;
        const clamped = clampPositionToMap(map, value.position);
        if (!isWalkable(map, clamped))
            return;
        this.state.returnPointByInteriorMapId[interiorMapId] = {
            mapId: value.mapId,
            position: clonePosition(clamped),
            facing: value.facing,
            updatedAt: now(),
        };
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
exports.EnterHouseTransition = EnterHouseTransition;
exports.enterHouseTransition = new EnterHouseTransition();
exports.default = exports.enterHouseTransition;
