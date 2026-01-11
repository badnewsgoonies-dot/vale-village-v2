"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputLock = exports.InputLock = exports.InputLockScopedHandle = exports.InputLockHandle = void 0;
class InputLockHandle {
    constructor(manager, token) {
        Object.defineProperty(this, "manager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: manager
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: token
        });
        Object.defineProperty(this, "released", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    release() {
        if (this.released)
            return;
        this.released = true;
        this.manager.unlock(this.token);
    }
}
exports.InputLockHandle = InputLockHandle;
class InputLockScopedHandle {
    constructor(manager, sceneKey, scope) {
        Object.defineProperty(this, "manager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: manager
        });
        Object.defineProperty(this, "sceneKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: sceneKey
        });
        Object.defineProperty(this, "scope", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: scope
        });
        Object.defineProperty(this, "released", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    release() {
        if (this.released)
            return;
        this.released = true;
        this.manager.releaseScoped(this.sceneKey, this.scope);
    }
}
exports.InputLockScopedHandle = InputLockScopedHandle;
const DEFAULT_CLEANUP_EVENTS = ['shutdown', 'destroy', 'transitionout', 'sleep'];
const resolveEmitter = (value) => {
    if (!value)
        return null;
    const direct = value;
    if (typeof direct.on === 'function')
        return direct;
    const scene = value;
    if (scene.events && typeof scene.events.on === 'function')
        return scene.events;
    if (scene.sys?.events && typeof scene.sys.events.on === 'function')
        return scene.sys.events;
    return null;
};
const attachListener = (emitter, event, handler) => {
    if (typeof emitter.once === 'function') {
        emitter.once(event, handler);
        return () => {
            if (typeof emitter.off === 'function') {
                emitter.off(event, handler);
                return;
            }
            if (typeof emitter.removeListener === 'function') {
                emitter.removeListener(event, handler);
            }
        };
    }
    emitter.on(event, handler);
    return () => {
        if (typeof emitter.off === 'function') {
            emitter.off(event, handler);
            return;
        }
        if (typeof emitter.removeListener === 'function') {
            emitter.removeListener(event, handler);
        }
    };
};
const createLockId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
/**
 * InputLock
 *
 * A reference-counted lock manager that scopes locks per scene and supports:
 * - unscoped locks via `lock()` / handle.release()
 * - scoped locks via `acquireScoped(scope)` / `releaseScoped(scope)`
 *
 * Scoped locks are ref-counted by `scope` and can be force-cleared with `clearScope()`,
 * helping prevent stuck input when callers lose a handle during transitions/menus.
 *
 * Recommended usage:
 * - Register a scene with `registerScene(sceneKey, { setInputEnabled, lifecycle })`
 * - Acquire locks via `lock(sceneKey)` or `acquireScoped(sceneKey, scope)`
 * - Release via handle.release() (or `releaseScoped`) and/or rely on lifecycle cleanup
 */
class InputLock {
    constructor() {
        Object.defineProperty(this, "scenes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    registerScene(sceneKey, options) {
        const state = this.getOrCreateSceneState(sceneKey);
        for (const cleanup of state.cleanup)
            cleanup();
        state.cleanup = [];
        state.setInputEnabled = options.setInputEnabled;
        this.applySceneEnabled(sceneKey, this.getLockCountForState(state) === 0);
        const emitter = resolveEmitter(options.lifecycle ?? null);
        if (!emitter)
            return;
        const events = options.cleanupEvents ?? DEFAULT_CLEANUP_EVENTS;
        for (const event of events) {
            state.cleanup.push(attachListener(emitter, event, () => {
                this.clearScene(sceneKey);
                this.unregisterScene(sceneKey);
            }));
        }
    }
    unregisterScene(sceneKey) {
        const state = this.scenes.get(sceneKey);
        if (!state)
            return;
        for (const cleanup of state.cleanup)
            cleanup();
        state.cleanup = [];
        state.setInputEnabled = null;
        state.lastAppliedEnabled = null;
    }
    /**
     * Acquire an unscoped lock. Release using the returned handle.
     */
    lock(sceneKey) {
        const state = this.getOrCreateSceneState(sceneKey);
        const id = createLockId();
        state.unscopedLocks.add(id);
        this.applySceneEnabled(sceneKey, false);
        return new InputLockHandle(this, { id, sceneKey });
    }
    /**
     * Release an unscoped lock created by `lock()`. Safe to call multiple times.
     */
    unlock(token) {
        const state = this.scenes.get(token.sceneKey);
        if (!state)
            return;
        state.unscopedLocks.delete(token.id);
        if (this.getLockCountForState(state) === 0) {
            this.applySceneEnabled(token.sceneKey, true);
        }
    }
    /**
     * Acquire a scoped lock, ref-counted by `scope`. Release using the returned handle,
     * or via `releaseScoped(sceneKey, scope)`.
     */
    acquireScoped(sceneKey, scope) {
        const state = this.getOrCreateSceneState(sceneKey);
        const prev = state.scopedLockCounts.get(scope) ?? 0;
        state.scopedLockCounts.set(scope, prev + 1);
        this.applySceneEnabled(sceneKey, false);
        return new InputLockScopedHandle(this, sceneKey, scope);
    }
    /**
     * Release a scoped lock. This decrements the scope ref-count until it hits 0.
     * Safe to call even if the scope is not currently locked.
     */
    releaseScoped(sceneKey, scope) {
        const state = this.scenes.get(sceneKey);
        if (!state)
            return;
        const current = state.scopedLockCounts.get(scope);
        if (!current)
            return;
        if (current <= 1) {
            state.scopedLockCounts.delete(scope);
        }
        else {
            state.scopedLockCounts.set(scope, current - 1);
        }
        if (this.getLockCountForState(state) === 0) {
            this.applySceneEnabled(sceneKey, true);
        }
    }
    /**
     * Force-clear an entire scoped lock regardless of its ref-count.
     * Useful when a transition/menu may have leaked a handle.
     */
    clearScope(sceneKey, scope) {
        const state = this.scenes.get(sceneKey);
        if (!state)
            return;
        if (!state.scopedLockCounts.has(scope))
            return;
        state.scopedLockCounts.delete(scope);
        if (this.getLockCountForState(state) === 0) {
            this.applySceneEnabled(sceneKey, true);
        }
    }
    isLocked(sceneKey) {
        const state = this.scenes.get(sceneKey);
        return state ? this.getLockCountForState(state) > 0 : false;
    }
    getLockCount(sceneKey) {
        const state = this.scenes.get(sceneKey);
        return state ? this.getLockCountForState(state) : 0;
    }
    getScopedLockCount(sceneKey, scope) {
        const state = this.scenes.get(sceneKey);
        return state ? (state.scopedLockCounts.get(scope) ?? 0) : 0;
    }
    /**
     * Release all locks for a scene. Safe to call multiple times.
     * If the scene is registered, it will also be re-enabled.
     */
    clearScene(sceneKey) {
        const state = this.scenes.get(sceneKey);
        if (!state)
            return;
        state.unscopedLocks.clear();
        state.scopedLockCounts.clear();
        this.applySceneEnabled(sceneKey, true);
    }
    /**
     * Clear and unregister a scene in a single call.
     * Useful for explicit teardown if you're not binding lifecycle events.
     */
    destroyScene(sceneKey) {
        this.clearScene(sceneKey);
        this.unregisterScene(sceneKey);
        this.scenes.delete(sceneKey);
    }
    withLock(sceneKey, fn) {
        const handle = this.lock(sceneKey);
        try {
            const result = fn();
            if (result && typeof result.finally === 'function') {
                return result.finally(() => handle.release());
            }
            handle.release();
            return result;
        }
        catch (err) {
            handle.release();
            throw err;
        }
    }
    withScopedLock(sceneKey, scope, fn) {
        const handle = this.acquireScoped(sceneKey, scope);
        try {
            const result = fn();
            if (result && typeof result.finally === 'function') {
                return result.finally(() => handle.release());
            }
            handle.release();
            return result;
        }
        catch (err) {
            handle.release();
            throw err;
        }
    }
    getOrCreateSceneState(sceneKey) {
        const existing = this.scenes.get(sceneKey);
        if (existing)
            return existing;
        const state = {
            setInputEnabled: null,
            unscopedLocks: new Set(),
            scopedLockCounts: new Map(),
            cleanup: [],
            lastAppliedEnabled: null,
        };
        this.scenes.set(sceneKey, state);
        return state;
    }
    getLockCountForState(state) {
        let count = state.unscopedLocks.size;
        for (const value of state.scopedLockCounts.values())
            count += value;
        return count;
    }
    applySceneEnabled(sceneKey, enabled) {
        const state = this.scenes.get(sceneKey);
        if (!state)
            return;
        if (!state.setInputEnabled)
            return;
        if (state.lastAppliedEnabled === enabled)
            return;
        state.lastAppliedEnabled = enabled;
        state.setInputEnabled(enabled);
    }
}
exports.InputLock = InputLock;
exports.inputLock = new InputLock();
