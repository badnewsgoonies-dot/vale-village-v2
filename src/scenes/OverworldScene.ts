import type { Position, MapTrigger } from '../core/models/overworld';
import { MAPS } from '../data/definitions/maps';
import { sceneTransitionManager, type FacingDirection } from '../systems/SceneTransitionManager';
import { useStore, type Store } from '../ui/state/store';

export interface OverworldSceneOptions {
  /**
   * Called with `false` to disable input, `true` to re-enable input.
   * Intended to be wired to the underlying overworld input system.
   */
  setInputEnabled?: (enabled: boolean) => void;
}

const clonePosition = (position: Position): Position => ({ x: position.x, y: position.y });

const coerceFacing = (value: unknown): FacingDirection | undefined => {
  if (value === 'up' || value === 'down' || value === 'left' || value === 'right') return value;
  return undefined;
};

/**
 * OverworldScene
 *
 * Centralizes overworld map transitions with stable, resumable spawn logic.
 * In particular, House 01 entry/exit uses `SceneTransitionManager` return-points
 * so exiting the interior returns the player to their last exterior position.
 */
export class OverworldScene {
  constructor(private readonly options: OverworldSceneOptions = {}) {}

  destroy(): void {
    this.options.setInputEnabled?.(true);
  }

  /**
   * Convenience: enter House 01 interior, recording an exterior return-point.
   */
  enterFirstHouse(): void {
    const toMapId = 'house-01-interior';
    const fallback = MAPS[toMapId]?.spawnPoint ?? { x: 5, y: 7 };
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
  exitFirstHouse(): void {
    const toMapId = 'vale-village';
    const fallback = MAPS[toMapId]?.spawnPoint ?? { x: 7, y: 13 };
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
  handleTransitionTrigger(trigger: MapTrigger): void {
    if (trigger.type !== 'transition') return;

    const data = trigger.data as { targetMap?: string; targetPos?: Position; requiredFlags?: string[] } | null;
    const targetMap = data?.targetMap;
    if (!targetMap) return;

    const store = this.getStore();
    const fromMapId = store.currentMapId;

    // Gating: if the trigger defines requiredFlags, ensure all are present in story flags
    const requiredFlags = Array.isArray(data?.requiredFlags) ? data!.requiredFlags : undefined;
    if (requiredFlags && requiredFlags.length > 0) {
      const unmet = requiredFlags.some((flag) => !store.story.flags[flag]);
      if (unmet) return; // Do not process transition if requirements unmet
    }

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

  private getStore(): Store {
    return useStore.getState();
  }

  private getCurrentLocation(): { mapId: string; position: Position; facing?: FacingDirection } {
    const store = this.getStore();
    return {
      mapId: store.currentMapId,
      position: clonePosition(store.playerPosition),
      facing: coerceFacing(store.facing),
    };
  }

  private applyTeleport(toMapId: string, position: Position, facing?: FacingDirection): void {
    const store = this.getStore();
    store.teleportPlayer(toMapId, position);
    if (facing) {
      store.setFacing(facing);
    }
  }

  private transition(params: {
    toMapId: string;
    toPosition?: Position;
    toFacing?: FacingDirection;
    triggerId?: string;
    reason?: string;
    /**
     * When omitted, defaults to the destination map's spawnPoint (if any), else (0,0).
     * For interior exits, pass the exterior spawnPoint so return-points can override it.
     */
    fallbackPosition?: Position;
  }): void {
    const from = this.getCurrentLocation();

    sceneTransitionManager.beginTransition({
      from,
      toMapId: params.toMapId,
      toPosition: params.toPosition,
      toFacing: params.toFacing,
      triggerId: params.triggerId,
      reason: params.reason,
    });

    const fallback = params.fallbackPosition ?? MAPS[params.toMapId]?.spawnPoint ?? { x: 0, y: 0 };
    const resolved = sceneTransitionManager.resolveSpawn(params.toMapId, fallback, params.toFacing);

    this.applyTeleport(params.toMapId, resolved.position, resolved.facing);
    sceneTransitionManager.consumePendingTransitionForMap(params.toMapId);
  }
}