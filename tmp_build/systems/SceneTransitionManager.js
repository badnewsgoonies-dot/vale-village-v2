"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneTransitionManager = exports.SceneTransitionManager = void 0;
const STORAGE_KEY = 'vv2:scene-transition-manager:v1';
const now = () => Date.now();
const isPosition = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const candidate = value;
    return typeof candidate.x === 'number' && Number.isFinite(candidate.x) && typeof candidate.y === 'number' && Number.isFinite(candidate.y);
};
const isFacing = (value) => value === 'up' || value === 'down' || value === 'left' || value === 'right';
const isInteriorMapId = (mapId) => mapId.includes('-interior');
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
const clonePosition = (pos) => ({ x: pos.x, y: pos.y });
const buildTransitionId = () => `${now()}-${Math.random().toString(16).slice(2)}`;
const sanitizeStoredLocation = (value) => {
    if (!value || typeof value !== 'object')
        return null;
    const candidate = value;
    if (typeof candidate.mapId !== 'string')
        return null;
    if (!isPosition(candidate.position))
        return null;
    if (typeof candidate.updatedAt !== 'number' || !Number.isFinite(candidate.updatedAt))
        return null;
    const facing = isFacing(candidate.facing) ? candidate.facing : undefined;
    return {
        mapId: candidate.mapId,
        position: clonePosition(candidate.position),
        facing,
        updatedAt: candidate.updatedAt,
    };
};
const sanitizePendingTransition = (value) => {
    if (!value || typeof value !== 'object')
        return null;
    const candidate = value;
    if (typeof candidate.id !== 'string')
        return null;
    if (typeof candidate.createdAt !== 'number' || !Number.isFinite(candidate.createdAt))
        return null;
    const req = candidate.request;
    if (!req || typeof req !== 'object')
        return null;
    const from = req.from;
    if (!from || typeof from !== 'object')
        return null;
    if (typeof from.mapId !== 'string')
        return null;
    if (!isPosition(from.position))
        return null;
    if (typeof req.toMapId !== 'string')
        return null;
    return {
        id: candidate.id,
        createdAt: candidate.createdAt,
        request: {
            from: {
                mapId: from.mapId,
                position: clonePosition(from.position),
                facing: isFacing(from.facing) ? from.facing : undefined,
            },
            toMapId: req.toMapId,
            toPosition: isPosition(req.toPosition) ? clonePosition(req.toPosition) : undefined,
            toFacing: isFacing(req.toFacing) ? req.toFacing : undefined,
            triggerId: typeof req.triggerId === 'string' ? req.triggerId : undefined,
            reason: typeof req.reason === 'string' ? req.reason : undefined,
        },
    };
};
const sanitizeStateV1 = (value) => {
    if (!value || typeof value !== 'object')
        return null;
    const candidate = value;
    if (candidate.version !== 1)
        return null;
    const lastKnownByMapId = {};
    if (candidate.lastKnownByMapId && typeof candidate.lastKnownByMapId === 'object') {
        for (const [mapId, loc] of Object.entries(candidate.lastKnownByMapId)) {
            const sanitized = sanitizeStoredLocation(loc);
            if (sanitized && sanitized.mapId === mapId) {
                lastKnownByMapId[mapId] = sanitized;
            }
        }
    }
    const returnPointByInteriorMapId = {};
    if (candidate.returnPointByInteriorMapId && typeof candidate.returnPointByInteriorMapId === 'object') {
        for (const [interiorMapId, loc] of Object.entries(candidate.returnPointByInteriorMapId)) {
            const sanitized = sanitizeStoredLocation(loc);
            if (sanitized && isInteriorMapId(interiorMapId)) {
                returnPointByInteriorMapId[interiorMapId] = sanitized;
            }
        }
    }
    const pendingTransition = candidate.pendingTransition ? sanitizePendingTransition(candidate.pendingTransition) : null;
    return {
        version: 1,
        lastKnownByMapId,
        returnPointByInteriorMapId,
        pendingTransition: pendingTransition ?? undefined,
    };
};
/**
 * SceneTransitionManager
 *
 * Persists player spawn/position across map transitions, with special handling
 * for exterior <-> interior transitions.
 *
 * Design goals:
 * - Stable across component re-mounts (uses in-memory + sessionStorage).
 * - Deterministic: a single "pending transition" can be consumed by the next map load.
 * - Safe in non-browser contexts (tests/SSR): storage is optional.
 */
class SceneTransitionManager {
    constructor() {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                version: 1,
                lastKnownByMapId: {},
                returnPointByInteriorMapId: {},
                pendingTransition: undefined,
            }
        });
        this.hydrate();
    }
    /**
     * Begin a transition and persist the "from" snapshot.
     *
     * Recommended call site: right before updating `currentMapId` in your store.
     */
    beginTransition(request) {
        const transition = {
            id: buildTransitionId(),
            createdAt: now(),
            request: {
                ...request,
                from: {
                    mapId: request.from.mapId,
                    position: clonePosition(request.from.position),
                    facing: request.from.facing,
                },
                toPosition: request.toPosition ? clonePosition(request.toPosition) : undefined,
            },
        };
        this.recordLastKnownPosition(request.from);
        const fromIsInterior = isInteriorMapId(request.from.mapId);
        const toIsInterior = isInteriorMapId(request.toMapId);
        // Entering an interior: save where to return when exiting this interior.
        if (!fromIsInterior && toIsInterior) {
            this.state.returnPointByInteriorMapId[request.toMapId] = {
                mapId: request.from.mapId,
                position: clonePosition(request.from.position),
                facing: request.from.facing,
                updatedAt: now(),
            };
        }
        // Exiting an interior: keep the last known interior position too.
        if (fromIsInterior && !toIsInterior) {
            this.recordLastKnownPosition(request.from);
        }
        this.state.pendingTransition = transition;
        this.persist();
    }
    /**
     * Record the player's last known position for a map.
     * Useful to keep "resume position" stable when returning to a map.
     */
    recordLastKnownPosition(location) {
        this.state.lastKnownByMapId[location.mapId] = {
            mapId: location.mapId,
            position: clonePosition(location.position),
            facing: location.facing,
            updatedAt: now(),
        };
        this.persist();
    }
    /**
     * Resolve a spawn/position for a map load.
     *
     * Priority:
     * 1) Pending transition destination (if `toMapId` matches).
     * 2) Return-point when exiting an interior (even if destination pos missing).
     * 3) Last known saved position (optional).
     * 4) Fallback position provided by caller.
     */
    resolveSpawn(mapId, fallbackPosition, fallbackFacing, options) {
        const pending = this.state.pendingTransition;
        if (pending && pending.request.toMapId === mapId) {
            const { request } = pending;
            // If the caller provided an explicit destination, prefer it.
            if (request.toPosition) {
                return {
                    position: clonePosition(request.toPosition),
                    facing: request.toFacing ?? fallbackFacing,
                    source: 'pending-transition',
                };
            }
            // Exiting interior: if we lack an explicit destination pos, use the saved return-point.
            if (isInteriorMapId(request.from.mapId) && !isInteriorMapId(mapId)) {
                const returnPoint = this.state.returnPointByInteriorMapId[request.from.mapId];
                if (returnPoint && returnPoint.mapId === mapId) {
                    return {
                        position: clonePosition(returnPoint.position),
                        facing: returnPoint.facing ?? fallbackFacing,
                        source: 'return-point',
                    };
                }
            }
            return {
                position: clonePosition(fallbackPosition),
                facing: fallbackFacing,
                source: 'fallback',
            };
        }
        if (options?.preferSavedPosition) {
            const saved = this.state.lastKnownByMapId[mapId];
            if (saved) {
                return {
                    position: clonePosition(saved.position),
                    facing: saved.facing ?? fallbackFacing,
                    source: 'saved-position',
                };
            }
        }
        return {
            position: clonePosition(fallbackPosition),
            facing: fallbackFacing,
            source: 'fallback',
        };
    }
    /**
     * Consume a pending transition if it targeted `mapId`.
     * Call this after a successful map load + spawn apply to prevent stale reuse.
     */
    consumePendingTransitionForMap(mapId) {
        const pending = this.state.pendingTransition;
        if (!pending)
            return;
        if (pending.request.toMapId !== mapId)
            return;
        this.state.pendingTransition = undefined;
        this.persist();
    }
    /**
     * Get the saved return point for an interior map (if any).
     */
    getReturnPointForInterior(interiorMapId) {
        const loc = this.state.returnPointByInteriorMapId[interiorMapId];
        if (!loc)
            return null;
        return { mapId: loc.mapId, position: clonePosition(loc.position), facing: loc.facing };
    }
    /**
     * Debug-only snapshot (do not mutate).
     */
    getDebugState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    /**
     * Reset all state (primarily for tests).
     */
    reset() {
        this.state = {
            version: 1,
            lastKnownByMapId: {},
            returnPointByInteriorMapId: {},
            pendingTransition: undefined,
        };
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
exports.SceneTransitionManager = SceneTransitionManager;
exports.sceneTransitionManager = new SceneTransitionManager();
