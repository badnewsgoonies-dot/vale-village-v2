export type InputLockSceneKey = string;

export type InputLockToken = Readonly<{
  id: string;
  sceneKey: InputLockSceneKey;
}>;

export type InputEnabledHandler = (enabled: boolean) => void;

export interface EventEmitterLike {
  on(event: string, handler: () => void): unknown;
  once?(event: string, handler: () => void): unknown;
  off?(event: string, handler: () => void): unknown;
  removeListener?(event: string, handler: () => void): unknown;
}

export interface SceneLifecycleLike {
  events?: EventEmitterLike;
  sys?: { events?: EventEmitterLike };
}

export interface RegisterSceneOptions {
  setInputEnabled: InputEnabledHandler;
  /**
   * Optional lifecycle source used to auto-cleanup all locks for the scene.
   * Accepts:
   * - an EventEmitter-like object
   * - a Phaser-like Scene object with `events` or `sys.events`
   */
  lifecycle?: EventEmitterLike | SceneLifecycleLike | null;
  /**
   * Events that should trigger lock cleanup. When omitted, uses a safe default list
   * that covers typical "close" and "transition away" flows.
   */
  cleanupEvents?: readonly string[];
}

export class InputLockHandle {
  private released = false;

  constructor(
    private readonly manager: InputLock,
    public readonly token: InputLockToken,
  ) {}

  release(): void {
    if (this.released) return;
    this.released = true;
    this.manager.unlock(this.token);
  }
}

export class InputLockScopedHandle {
  private released = false;

  constructor(
    private readonly manager: InputLock,
    public readonly sceneKey: InputLockSceneKey,
    public readonly scope: string,
  ) {}

  release(): void {
    if (this.released) return;
    this.released = true;
    this.manager.releaseScoped(this.sceneKey, this.scope);
  }
}

type SceneState = {
  setInputEnabled: InputEnabledHandler | null;
  unscopedLocks: Set<string>;
  scopedLockCounts: Map<string, number>;
  cleanup: Array<() => void>;
  lastAppliedEnabled: boolean | null;
};

const DEFAULT_CLEANUP_EVENTS = ['shutdown', 'destroy', 'transitionout', 'sleep'] as const;

const resolveEmitter = (value: EventEmitterLike | SceneLifecycleLike | null | undefined): EventEmitterLike | null => {
  if (!value) return null;
  const direct = value as EventEmitterLike;
  if (typeof direct.on === 'function') return direct;
  const scene = value as SceneLifecycleLike;
  if (scene.events && typeof scene.events.on === 'function') return scene.events;
  if (scene.sys?.events && typeof scene.sys.events.on === 'function') return scene.sys.events;
  return null;
};

const attachListener = (emitter: EventEmitterLike, event: string, handler: () => void): (() => void) => {
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

const createLockId = (): string => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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
export class InputLock {
  private readonly scenes = new Map<InputLockSceneKey, SceneState>();

  registerScene(sceneKey: InputLockSceneKey, options: RegisterSceneOptions): void {
    const state = this.getOrCreateSceneState(sceneKey);

    for (const cleanup of state.cleanup) cleanup();
    state.cleanup = [];

    state.setInputEnabled = options.setInputEnabled;
    this.applySceneEnabled(sceneKey, this.getLockCountForState(state) === 0);

    const emitter = resolveEmitter(options.lifecycle ?? null);
    if (!emitter) return;

    const events = options.cleanupEvents ?? DEFAULT_CLEANUP_EVENTS;
    for (const event of events) {
      state.cleanup.push(
        attachListener(emitter, event, () => {
          this.clearScene(sceneKey);
          this.unregisterScene(sceneKey);
        }),
      );
    }
  }

  unregisterScene(sceneKey: InputLockSceneKey): void {
    const state = this.scenes.get(sceneKey);
    if (!state) return;

    for (const cleanup of state.cleanup) cleanup();
    state.cleanup = [];

    state.setInputEnabled = null;
    state.lastAppliedEnabled = null;
  }

  /**
   * Acquire an unscoped lock. Release using the returned handle.
   */
  lock(sceneKey: InputLockSceneKey): InputLockHandle {
    const state = this.getOrCreateSceneState(sceneKey);
    const id = createLockId();
    state.unscopedLocks.add(id);
    this.applySceneEnabled(sceneKey, false);
    return new InputLockHandle(this, { id, sceneKey });
  }

  /**
   * Release an unscoped lock created by `lock()`. Safe to call multiple times.
   */
  unlock(token: InputLockToken): void {
    const state = this.scenes.get(token.sceneKey);
    if (!state) return;

    state.unscopedLocks.delete(token.id);
    if (this.getLockCountForState(state) === 0) {
      this.applySceneEnabled(token.sceneKey, true);
    }
  }

  /**
   * Acquire a scoped lock, ref-counted by `scope`. Release using the returned handle,
   * or via `releaseScoped(sceneKey, scope)`.
   */
  acquireScoped(sceneKey: InputLockSceneKey, scope: string): InputLockScopedHandle {
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
  releaseScoped(sceneKey: InputLockSceneKey, scope: string): void {
    const state = this.scenes.get(sceneKey);
    if (!state) return;

    const current = state.scopedLockCounts.get(scope);
    if (!current) return;

    if (current <= 1) {
      state.scopedLockCounts.delete(scope);
    } else {
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
  clearScope(sceneKey: InputLockSceneKey, scope: string): void {
    const state = this.scenes.get(sceneKey);
    if (!state) return;
    if (!state.scopedLockCounts.has(scope)) return;

    state.scopedLockCounts.delete(scope);
    if (this.getLockCountForState(state) === 0) {
      this.applySceneEnabled(sceneKey, true);
    }
  }

  isLocked(sceneKey: InputLockSceneKey): boolean {
    const state = this.scenes.get(sceneKey);
    return state ? this.getLockCountForState(state) > 0 : false;
  }

  getLockCount(sceneKey: InputLockSceneKey): number {
    const state = this.scenes.get(sceneKey);
    return state ? this.getLockCountForState(state) : 0;
  }

  getScopedLockCount(sceneKey: InputLockSceneKey, scope: string): number {
    const state = this.scenes.get(sceneKey);
    return state ? (state.scopedLockCounts.get(scope) ?? 0) : 0;
  }

  /**
   * Release all locks for a scene. Safe to call multiple times.
   * If the scene is registered, it will also be re-enabled.
   */
  clearScene(sceneKey: InputLockSceneKey): void {
    const state = this.scenes.get(sceneKey);
    if (!state) return;

    state.unscopedLocks.clear();
    state.scopedLockCounts.clear();
    this.applySceneEnabled(sceneKey, true);
  }

  /**
   * Clear and unregister a scene in a single call.
   * Useful for explicit teardown if you're not binding lifecycle events.
   */
  destroyScene(sceneKey: InputLockSceneKey): void {
    this.clearScene(sceneKey);
    this.unregisterScene(sceneKey);
    this.scenes.delete(sceneKey);
  }

  /**
   * Convenience helper that guarantees release using try/finally.
   * Works for both sync and async callbacks.
   */
  withLock<T>(sceneKey: InputLockSceneKey, fn: () => T): T;
  withLock<T>(sceneKey: InputLockSceneKey, fn: () => Promise<T>): Promise<T>;
  withLock<T>(sceneKey: InputLockSceneKey, fn: () => T | Promise<T>): T | Promise<T> {
    const handle = this.lock(sceneKey);
    try {
      const result = fn();
      if (result && typeof (result as Promise<T>).finally === 'function') {
        return (result as Promise<T>).finally(() => handle.release());
      }
      handle.release();
      return result;
    } catch (err) {
      handle.release();
      throw err;
    }
  }

  /**
   * Convenience helper for a scoped lock with try/finally semantics.
   * Works for both sync and async callbacks.
   */
  withScopedLock<T>(sceneKey: InputLockSceneKey, scope: string, fn: () => T): T;
  withScopedLock<T>(sceneKey: InputLockSceneKey, scope: string, fn: () => Promise<T>): Promise<T>;
  withScopedLock<T>(sceneKey: InputLockSceneKey, scope: string, fn: () => T | Promise<T>): T | Promise<T> {
    const handle = this.acquireScoped(sceneKey, scope);
    try {
      const result = fn();
      if (result && typeof (result as Promise<T>).finally === 'function') {
        return (result as Promise<T>).finally(() => handle.release());
      }
      handle.release();
      return result;
    } catch (err) {
      handle.release();
      throw err;
    }
  }

  private getOrCreateSceneState(sceneKey: InputLockSceneKey): SceneState {
    const existing = this.scenes.get(sceneKey);
    if (existing) return existing;

    const state: SceneState = {
      setInputEnabled: null,
      unscopedLocks: new Set<string>(),
      scopedLockCounts: new Map<string, number>(),
      cleanup: [],
      lastAppliedEnabled: null,
    };
    this.scenes.set(sceneKey, state);
    return state;
  }

  private getLockCountForState(state: SceneState): number {
    let count = state.unscopedLocks.size;
    for (const value of state.scopedLockCounts.values()) count += value;
    return count;
  }

  private applySceneEnabled(sceneKey: InputLockSceneKey, enabled: boolean): void {
    const state = this.scenes.get(sceneKey);
    if (!state) return;
    if (!state.setInputEnabled) return;
    if (state.lastAppliedEnabled === enabled) return;
    state.lastAppliedEnabled = enabled;
    state.setInputEnabled(enabled);
  }
}

export const inputLock = new InputLock();