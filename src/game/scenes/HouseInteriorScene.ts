import type { GameMap, Position } from '@/core/models/overworld';
import { MAPS } from '@/data/definitions/maps';

export type FacingDirection = 'up' | 'down' | 'left' | 'right';

export type WorldPosition = Readonly<{
  x: number;
  y: number;
}>;

export type InteriorSpawnResolution = Readonly<{
  mapId: string;
  position: Position;
  facing?: FacingDirection;
  source: 'map-spawn' | 'exit-trigger' | 'fallback';
}>;

export type ExteriorReturnResolution = Readonly<{
  mapId: string;
  position: Position;
  facing?: FacingDirection;
  worldPosition?: WorldPosition;
  source: 'return-point' | 'exit-trigger' | 'fallback';
}>;

type StoredReturnPoint = {
  exteriorMapId: string;
  exteriorPosition: Position;
  exteriorFacing?: FacingDirection;
  exteriorWorldPosition?: WorldPosition;
  updatedAt: number;
};

type PersistedStateV1 = {
  version: 1;
  returnPointByInteriorMapId: Record<string, StoredReturnPoint>;
};

const STORAGE_KEY = 'vv2:house-interior-scene:v1';

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

const isWorldPosition = (value: unknown): value is WorldPosition => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { x?: unknown; y?: unknown };
  return (
    typeof candidate.x === 'number' &&
    Number.isFinite(candidate.x) &&
    typeof candidate.y === 'number' &&
    Number.isFinite(candidate.y)
  );
};

const clonePosition = (pos: Position): Position => ({ x: pos.x, y: pos.y });

const cloneWorldPosition = (pos: WorldPosition): WorldPosition => ({ x: pos.x, y: pos.y });

const safeSessionStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage ?? null;
  } catch {
    return null;
  }
};

const isHouseInteriorMapId = (mapId: string): boolean => /^house-\d{2}-interior$/.test(mapId);

const clampPositionToMap = (map: GameMap, pos: Position): Position => ({
  x: Math.max(0, Math.min(map.width - 1, pos.x)),
  y: Math.max(0, Math.min(map.height - 1, pos.y)),
});

const getTile = (map: GameMap, pos: Position) => map.tiles[pos.y]?.[pos.x];

const isWalkable = (map: GameMap, pos: Position): boolean => Boolean(getTile(map, pos)?.walkable);

const isDoorTile = (map: GameMap, pos: Position): boolean => getTile(map, pos)?.type === 'door';

const comparePosition = (a: Position, b: Position): number => (a.y - b.y !== 0 ? a.y - b.y : a.x - b.x);

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
  exteriorDoorPosition: Position;
  enteredFacing?: FacingDirection;
}): Position => {
  const { exteriorMap, exteriorDoorPosition, enteredFacing } = params;

  if (enteredFacing) {
    const candidate = clampPositionToMap(
      exteriorMap,
      applyFacingDelta(exteriorDoorPosition, oppositeFacing(enteredFacing)),
    );
    if (isWalkable(exteriorMap, candidate)) return candidate;
  }

  const neighbors: Position[] = [
    { x: exteriorDoorPosition.x, y: exteriorDoorPosition.y + 1 },
    { x: exteriorDoorPosition.x, y: exteriorDoorPosition.y - 1 },
    { x: exteriorDoorPosition.x - 1, y: exteriorDoorPosition.y },
    { x: exteriorDoorPosition.x + 1, y: exteriorDoorPosition.y },
  ]
    .map((candidate) => clampPositionToMap(exteriorMap, candidate))
    .filter((candidate) => candidate.x !== exteriorDoorPosition.x || candidate.y !== exteriorDoorPosition.y);

  const nonDoor = neighbors.find(
    (pos) => isWalkable(exteriorMap, pos) && getTile(exteriorMap, pos)?.type !== 'door',
  );
  if (nonDoor) return nonDoor;

  const anyWalkable = neighbors.find((pos) => isWalkable(exteriorMap, pos));
  if (anyWalkable) return anyWalkable;

  return clampPositionToMap(exteriorMap, exteriorDoorPosition);
};

const resolveNearestWalkablePosition = (map: GameMap, preferred: Position): Position => {
  const clampedPreferred = clampPositionToMap(map, preferred);
  if (isWalkable(map, clampedPreferred)) return clampedPreferred;

  const neighbors: Position[] = [
    { x: clampedPreferred.x, y: clampedPreferred.y + 1 },
    { x: clampedPreferred.x, y: clampedPreferred.y - 1 },
    { x: clampedPreferred.x - 1, y: clampedPreferred.y },
    { x: clampedPreferred.x + 1, y: clampedPreferred.y },
  ].map((pos) => clampPositionToMap(map, pos));

  const nonDoor = neighbors.find((pos) => isWalkable(map, pos) && !isDoorTile(map, pos));
  if (nonDoor) return nonDoor;

  const anyWalkable = neighbors.find((pos) => isWalkable(map, pos));
  if (anyWalkable) return anyWalkable;

  return clampedPreferred;
};

const resolveInteriorDoorSpawnFromMap = (
  map: GameMap,
): { position: Position; source: InteriorSpawnResolution['source'] } => {
  if (isPosition(map.spawnPoint)) return { position: clonePosition(map.spawnPoint), source: 'map-spawn' };

  const transitionPositions = map.triggers
    .filter((trigger) => trigger.type === 'transition')
    .map((trigger) => trigger.position)
    .filter(isPosition)
    .map((pos) => clampPositionToMap(map, pos))
    .sort(comparePosition);

  const doorTriggerPos = transitionPositions.find((pos) => isDoorTile(map, pos));
  if (doorTriggerPos) return { position: clonePosition(doorTriggerPos), source: 'exit-trigger' };

  if (transitionPositions.length > 0)
    return { position: clonePosition(transitionPositions[0]!), source: 'exit-trigger' };

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const pos = { x, y };
      if (isDoorTile(map, pos)) return { position: pos, source: 'fallback' };
    }
  }

  return { position: { x: 0, y: 0 }, source: 'fallback' };
};

const resolveExitTriggerFallback = (map: GameMap): { mapId: string; position: Position } | null => {
  const candidates = map.triggers
    .filter((trigger) => trigger.type === 'transition')
    .map((trigger) => {
      const data = trigger.data as { targetMap?: unknown; targetPos?: unknown } | null;
      const targetMap = typeof data?.targetMap === 'string' ? data.targetMap : null;
      const targetPos = isPosition(data?.targetPos) ? (data?.targetPos as Position) : null;
      if (!targetMap || !targetPos) return null;
      const clampedTriggerPos = isPosition(trigger.position) ? clampPositionToMap(map, trigger.position) : null;
      return {
        targetMap,
        targetPos: clonePosition(targetPos),
        triggerId: typeof trigger.id === 'string' ? trigger.id : '',
        triggerPos: clampedTriggerPos,
      };
    })
    .filter((value): value is NonNullable<typeof value> => Boolean(value));

  if (candidates.length === 0) return null;

  const scored = candidates
    .map((candidate) => {
      const isExitNamed = candidate.triggerId.toLowerCase().includes('exit');
      const isDoor = candidate.triggerPos ? isDoorTile(map, candidate.triggerPos) : false;
      const score = (isExitNamed ? 2 : 0) + (isDoor ? 1 : 0);
      return { ...candidate, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.triggerPos && b.triggerPos) return comparePosition(a.triggerPos, b.triggerPos);
      if (a.triggerPos) return -1;
      if (b.triggerPos) return 1;
      return a.triggerId.localeCompare(b.triggerId);
    });

  const best = scored[0]!;
  return { mapId: best.targetMap, position: clonePosition(best.targetPos) };
};

const sanitizeStoredReturnPoint = (value: unknown): StoredReturnPoint | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<StoredReturnPoint>;
  if (typeof candidate.exteriorMapId !== 'string') return null;
  if (!isPosition(candidate.exteriorPosition)) return null;
  if (typeof candidate.updatedAt !== 'number' || !Number.isFinite(candidate.updatedAt)) return null;
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

const sanitizeStateV1 = (value: unknown): PersistedStateV1 | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<PersistedStateV1>;
  if (candidate.version !== 1) return null;

  const returnPointByInteriorMapId: PersistedStateV1['returnPointByInteriorMapId'] = {};
  if (candidate.returnPointByInteriorMapId && typeof candidate.returnPointByInteriorMapId === 'object') {
    for (const [interiorMapId, raw] of Object.entries(
      candidate.returnPointByInteriorMapId as Record<string, unknown>,
    )) {
      if (!isHouseInteriorMapId(interiorMapId)) continue;
      const sanitized = sanitizeStoredReturnPoint(raw);
      if (!sanitized) continue;
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
export class HouseInteriorScene {
  private state: PersistedStateV1 = {
    version: 1,
    returnPointByInteriorMapId: {},
  };

  constructor(private readonly maps: Record<string, GameMap> = MAPS) {
    this.hydrate();
  }

  /**
   * Resolve the interior spawn position for a house.
   * Defaults to the interior map spawnPoint (door tile) and is deterministic.
   */
  resolveDoorSpawn(interiorMapId: string, facing: FacingDirection = 'up'): InteriorSpawnResolution {
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
  recordEntryFromDoor(params: {
    interiorMapId: string;
    exteriorMapId: string;
    exteriorDoorPosition: Position;
    enteredFacing?: FacingDirection;
    exteriorWorldPosition?: WorldPosition;
  }): void {
    if (!isHouseInteriorMapId(params.interiorMapId)) return;

    const exteriorMap = this.maps[params.exteriorMapId];
    if (!exteriorMap) return;

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
  setReturnPoint(
    interiorMapId: string,
    value: {
      exteriorMapId: string;
      exteriorPosition: Position;
      exteriorFacing?: FacingDirection;
      exteriorWorldPosition?: WorldPosition;
    },
  ): void {
    if (!isHouseInteriorMapId(interiorMapId)) return;

    const exteriorMap = this.maps[value.exteriorMapId];
    if (!exteriorMap) return;

    const clamped = clampPositionToMap(exteriorMap, value.exteriorPosition);
    if (!isWalkable(exteriorMap, clamped)) return;

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
  resolveExit(interiorMapId: string): ExteriorReturnResolution | null {
    const interiorMap = this.maps[interiorMapId];
    if (!interiorMap) return null;

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

  getReturnPoint(
    interiorMapId: string,
  ): { exteriorMapId: string; position: Position; facing?: FacingDirection; worldPosition?: WorldPosition } | null {
    const saved = this.state.returnPointByInteriorMapId[interiorMapId];
    if (!saved) return null;
    return {
      exteriorMapId: saved.exteriorMapId,
      position: clonePosition(saved.exteriorPosition),
      facing: saved.exteriorFacing,
      worldPosition: saved.exteriorWorldPosition ? cloneWorldPosition(saved.exteriorWorldPosition) : undefined,
    };
  }

  clearReturnPoint(interiorMapId: string): void {
    if (!this.state.returnPointByInteriorMapId[interiorMapId]) return;
    delete this.state.returnPointByInteriorMapId[interiorMapId];
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

export const houseInteriorScene = new HouseInteriorScene();

export default houseInteriorScene;