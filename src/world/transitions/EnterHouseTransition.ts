import type { GameMap, MapTrigger, Position } from '@/core/models/overworld';
import { MAPS } from '@/data/definitions/maps';

export type FacingDirection = 'up' | 'down' | 'left' | 'right';

export interface PlayerLocation {
  mapId: string;
  position: Position;
  facing?: FacingDirection;
}

export interface TransitionResolution {
  toMapId: string;
  toPosition: Position;
  toFacing?: FacingDirection;
  source: 'return-point' | 'trigger' | 'map-spawn' | 'fallback';
}

type StoredReturnPoint = {
  mapId: string;
  position: Position;
  facing?: FacingDirection;
  updatedAt: number;
};

type PersistedStateV1 = {
  version: 1;
  returnPointByInteriorMapId: Record<string, StoredReturnPoint>;
};

const STORAGE_KEY = 'vv2:enter-house-transition:v1';

const now = (): number => Date.now();

const isFacing = (value: unknown): value is FacingDirection =>
  value === 'up' || value === 'down' || value === 'left' || value === 'right';

const isPosition = (value: unknown): value is Position => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { x?: unknown; y?: unknown };
  return (
    typeof candidate.x === 'number' &&
    Number.isInteger(candidate.x) &&
    candidate.x >= 0 &&
    typeof candidate.y === 'number' &&
    Number.isInteger(candidate.y) &&
    candidate.y >= 0
  );
};

const clonePosition = (pos: Position): Position => ({ x: pos.x, y: pos.y });

const safeSessionStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage ?? null;
  } catch {
    return null;
  }
};

const isInteriorMapId = (mapId: string): boolean => mapId.includes('-interior');

const isHouseInteriorMapId = (mapId: string): boolean => /^house-\d{2}-interior$/.test(mapId);

const clampPositionToMap = (map: GameMap, pos: Position): Position => ({
  x: Math.max(0, Math.min(map.width - 1, pos.x)),
  y: Math.max(0, Math.min(map.height - 1, pos.y)),
});

const getTile = (map: GameMap, pos: Position) => map.tiles[pos.y]?.[pos.x];

const isWalkable = (map: GameMap, pos: Position): boolean => Boolean(getTile(map, pos)?.walkable);

const oppositeFacing = (facing: FacingDirection): FacingDirection => {
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

const applyFacingDelta = (pos: Position, facing: FacingDirection): Position => {
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

const computeExteriorReturnPosition = (params: {
  exteriorMap: GameMap;
  doorPosition: Position;
  enteredFacing?: FacingDirection;
}): Position => {
  const { exteriorMap, doorPosition, enteredFacing } = params;

  if (enteredFacing) {
    const candidate = clampPositionToMap(exteriorMap, applyFacingDelta(doorPosition, oppositeFacing(enteredFacing)));
    if (isWalkable(exteriorMap, candidate)) return candidate;
  }

  const neighbors: Position[] = [
    { x: doorPosition.x, y: doorPosition.y + 1 },
    { x: doorPosition.x, y: doorPosition.y - 1 },
    { x: doorPosition.x - 1, y: doorPosition.y },
    { x: doorPosition.x + 1, y: doorPosition.y },
  ]
    .map((candidate) => clampPositionToMap(exteriorMap, candidate))
    .filter((candidate) => candidate.x !== doorPosition.x || candidate.y !== doorPosition.y);

  const nonDoor = neighbors.find((pos) => isWalkable(exteriorMap, pos) && getTile(exteriorMap, pos)?.type !== 'door');
  if (nonDoor) return nonDoor;

  const anyWalkable = neighbors.find((pos) => isWalkable(exteriorMap, pos));
  if (anyWalkable) return anyWalkable;

  return clampPositionToMap(exteriorMap, doorPosition);
};

const sanitizeStoredReturnPoint = (value: unknown): StoredReturnPoint | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<StoredReturnPoint>;
  if (typeof candidate.mapId !== 'string') return null;
  if (!isPosition(candidate.position)) return null;
  if (typeof candidate.updatedAt !== 'number' || !Number.isFinite(candidate.updatedAt)) return null;
  return {
    mapId: candidate.mapId,
    position: clonePosition(candidate.position),
    facing: isFacing(candidate.facing) ? candidate.facing : undefined,
    updatedAt: candidate.updatedAt,
  };
};

const sanitizeStateV1 = (value: unknown): PersistedStateV1 | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<PersistedStateV1>;
  if (candidate.version !== 1) return null;

  const returnPointByInteriorMapId: PersistedStateV1['returnPointByInteriorMapId'] = {};
  if (candidate.returnPointByInteriorMapId && typeof candidate.returnPointByInteriorMapId === 'object') {
    for (const [interiorMapId, raw] of Object.entries(candidate.returnPointByInteriorMapId as Record<string, unknown>)) {
      if (!isInteriorMapId(interiorMapId)) continue;
      const sanitized = sanitizeStoredReturnPoint(raw);
      if (!sanitized) continue;
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
export class EnterHouseTransition {
  private state: PersistedStateV1 = {
    version: 1,
    returnPointByInteriorMapId: {},
  };

  constructor(private readonly maps: Record<string, GameMap> = MAPS) {
    this.hydrate();
  }

  resolve(trigger: MapTrigger, from: PlayerLocation): TransitionResolution | null {
    if (trigger.type !== 'transition') return null;

    const data = trigger.data as { targetMap?: unknown; targetPos?: unknown } | null;
    const toMapId = typeof data?.targetMap === 'string' ? data.targetMap : null;
    if (!toMapId) return null;

    const toMap = this.maps[toMapId];
    const fromMap = this.maps[from.mapId];

    const triggerPos = isPosition(data?.targetPos) ? clonePosition(data!.targetPos as Position) : null;
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

  getReturnPoint(interiorMapId: string): PlayerLocation | null {
    const saved = this.state.returnPointByInteriorMapId[interiorMapId];
    if (!saved) return null;
    return {
      mapId: saved.mapId,
      position: clonePosition(saved.position),
      facing: saved.facing,
    };
  }

  setReturnPoint(interiorMapId: string, value: { mapId: string; position: Position; facing?: FacingDirection }): void {
    if (!isInteriorMapId(interiorMapId)) return;

    const map = this.maps[value.mapId];
    if (!map) return;
    const clamped = clampPositionToMap(map, value.position);
    if (!isWalkable(map, clamped)) return;

    this.state.returnPointByInteriorMapId[interiorMapId] = {
      mapId: value.mapId,
      position: clonePosition(clamped),
      facing: value.facing,
      updatedAt: now(),
    };
    this.persist();
  }

  reset(): void {
    this.state = { version: 1, returnPointByInteriorMapId: {} };
    this.persist(true);
  }

  private hydrate(): void {
    const storage = safeSessionStorage();
    if (!storage) return;
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      const sanitized = sanitizeStateV1(parsed);
      if (!sanitized) return;
      this.state = sanitized;
    } catch {
      // Ignore malformed storage
    }
  }

  private persist(clear = false): void {
    const storage = safeSessionStorage();
    if (!storage) return;
    try {
      if (clear) {
        storage.removeItem(STORAGE_KEY);
        return;
      }
      storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore quota/security errors
    }
  }
}

export const enterHouseTransition = new EnterHouseTransition();

export default enterHouseTransition;