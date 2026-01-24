/**
 * Game Driver Contract v1.0 (FROZEN)
 *
 * This is the stable automation interface for machine-playable games.
 * Once frozen, breaking changes require v2.0.
 *
 * KEY FIXES from critique:
 * 1. State is PURE DATA (no methods mixed in)
 * 2. Explicit `terminal` signal (not just flags)
 * 3. dispatch() returns DispatchResult (not void)
 * 4. Tick ownership defined (increments after each dispatch)
 *
 * VERSIONING RULES:
 * ✅ Allowed in v1.x: Add optional fields, new action types, optional metadata
 * ❌ Forbidden in v1.x: Rename fields, change terminal semantics, remove fields
 */

// ============================================================================
// Version
// ============================================================================

export const DRIVER_VERSION = 'v1' as const;

// ============================================================================
// State Schema (PURE DATA - no methods)
// ============================================================================

export type Position = {
  x: number;
  y: number;
};

export type PlayerState = {
  hp: number;
  maxHp: number;
  position: Position;
  deaths: number;  // Cumulative, for failure rate
};

export type EnemyState = {
  id: string;
  type: string;
  hp: number;
  maxHp: number;
  position: Position;
};

export type WorldState = {
  levelId: string;
  timeElapsed: number;  // Seconds since run start
  enemies: EnemyState[];
};

/**
 * Explicit episode termination signal.
 * This is REQUIRED - agents cannot reliably end episodes without it.
 */
export type TerminalState = {
  kind: 'running' | 'win' | 'lose';
  reason?: string;  // e.g., "player_death", "boss_defeated", "timeout"
};

/**
 * Optional metrics for Fun Proxy calculation.
 * These are tracked per-run and reset on RESET_RUN.
 */
export type MetricsState = {
  enemiesDefeated: number;
  itemsCollected: number;
  novelty: number;  // Unique discoveries this run
};

/**
 * Pure game state snapshot. No functions, no methods.
 * This is what getState() returns.
 */
export type GameState = {
  tick: number;  // Monotonic. Increments after each dispatch.
  player: PlayerState;
  world: WorldState;
  terminal: TerminalState;  // REQUIRED - explicit termination
  flags: Record<string, boolean>;  // Optional game-specific flags
  metrics?: MetricsState;  // Optional, for fun proxy
};

// ============================================================================
// Action Types
// ============================================================================

export type GameAction =
  | { type: 'MOVE'; dx: number; dy: number }
  | { type: 'ATTACK'; targetId?: string }
  | { type: 'INTERACT'; targetId?: string }
  | { type: 'NOOP' };  // Explicit no-op for stepping time

// ============================================================================
// Dispatch Result (NOT void - agents need feedback)
// ============================================================================

/**
 * Result of applying an action.
 * This enables: invariant enforcement, error handling, MCTS rollouts, debugging.
 */
export type DispatchResult = {
  ok: boolean;
  notes?: string[];  // Warnings, info (e.g., "attack missed", "no target")
  terminal: TerminalState;  // Current terminal state after action
};

// ============================================================================
// Driver Interface
// ============================================================================

export interface GameDriver {
  /** Contract version - agents check this for compatibility */
  version: typeof DRIVER_VERSION;

  /** Get current state snapshot (PURE DATA) */
  getState(): GameState;

  /**
   * Dispatch a high-level action.
   * - Tick increments after each dispatch
   * - Returns result envelope, not void
   */
  dispatch(action: GameAction): DispatchResult;

  /**
   * Reset episode with optional seed for reproducibility.
   * - Resets tick to 0
   * - Resets terminal to { kind: 'running' }
   * - Resets metrics
   */
  resetRun(seed?: number): void;
}

// ============================================================================
// Installation Helper
// ============================================================================

export function installGameDriver(opts: {
  getState: () => GameState;
  dispatch: (action: GameAction) => DispatchResult;
  resetRun: (seed?: number) => void;
}): void {

  const driver: GameDriver = {
    version: DRIVER_VERSION,
    getState: opts.getState,
    dispatch: opts.dispatch,
    resetRun: opts.resetRun,
  };

  (window as any).__GAME_DRIVER__ = driver;
  console.log(`[driver] __GAME_DRIVER__ ${DRIVER_VERSION} installed`);
}

// ============================================================================
// Type augmentation
// ============================================================================

declare global {
  interface Window {
    __GAME_DRIVER__?: GameDriver;
  }
}

// ============================================================================
// JSON Schema (for validation, documentation, agent consumption)
// ============================================================================

export const DRIVER_V1_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GameDriverContractV1",
  "description": "Frozen v1.0 - Breaking changes require v2.0",

  "definitions": {
    "position": {
      "type": "object",
      "properties": {
        "x": { "type": "number" },
        "y": { "type": "number" }
      },
      "required": ["x", "y"]
    },

    "terminal": {
      "type": "object",
      "description": "Explicit episode termination signal",
      "properties": {
        "kind": { "type": "string", "enum": ["running", "win", "lose"] },
        "reason": { "type": "string" }
      },
      "required": ["kind"]
    },

    "player": {
      "type": "object",
      "properties": {
        "hp": { "type": "number", "minimum": 0 },
        "maxHp": { "type": "number", "minimum": 1 },
        "position": { "$ref": "#/definitions/position" },
        "deaths": { "type": "integer", "minimum": 0 }
      },
      "required": ["hp", "maxHp", "position", "deaths"]
    },

    "enemy": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "type": { "type": "string" },
        "hp": { "type": "number", "minimum": 0 },
        "position": { "$ref": "#/definitions/position" }
      },
      "required": ["id", "type", "hp", "position"]
    },

    "world": {
      "type": "object",
      "properties": {
        "levelId": { "type": "string" },
        "timeElapsed": { "type": "number", "minimum": 0 },
        "enemies": { "type": "array", "items": { "$ref": "#/definitions/enemy" } }
      },
      "required": ["levelId", "timeElapsed", "enemies"]
    },

    "state": {
      "type": "object",
      "description": "Pure game state snapshot",
      "properties": {
        "tick": { "type": "integer", "minimum": 0 },
        "player": { "$ref": "#/definitions/player" },
        "world": { "$ref": "#/definitions/world" },
        "terminal": { "$ref": "#/definitions/terminal" },
        "flags": { "type": "object", "additionalProperties": { "type": "boolean" } },
        "metrics": {
          "type": "object",
          "properties": {
            "enemiesDefeated": { "type": "integer", "minimum": 0 },
            "itemsCollected": { "type": "integer", "minimum": 0 },
            "novelty": { "type": "integer", "minimum": 0 }
          }
        }
      },
      "required": ["tick", "player", "world", "terminal"]
    },

    "action": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "enum": ["MOVE", "ATTACK", "INTERACT", "NOOP"] },
        "dx": { "type": "number" },
        "dy": { "type": "number" },
        "targetId": { "type": "string" }
      },
      "required": ["type"],
      "allOf": [
        {
          "if": { "properties": { "type": { "const": "MOVE" } } },
          "then": { "required": ["dx", "dy"] }
        }
      ]
    },

    "dispatchResult": {
      "type": "object",
      "description": "Result of applying an action",
      "properties": {
        "ok": { "type": "boolean" },
        "notes": { "type": "array", "items": { "type": "string" } },
        "terminal": { "$ref": "#/definitions/terminal" }
      },
      "required": ["ok", "terminal"]
    }
  }
} as const;
