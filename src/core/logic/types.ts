/**
 * Shared Game Types - Re-exported from driver.ts
 *
 * This file exists so both Game and Simulator can import from the same place.
 * The driver.ts is the source of truth for types.
 *
 * Usage:
 *   import { GameState, GameAction } from '../core/logic/types';
 */

// Re-export all types from driver
export type {
  Position,
  PlayerState,
  EnemyState,
  WorldState,
  TerminalState,
  MetricsState,
  GameState,
  GameAction,
  DispatchResult,
} from '../../driver';

// Re-export version
export { DRIVER_VERSION } from '../../driver';
