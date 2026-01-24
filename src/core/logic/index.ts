/**
 * Shared Game Logic - Public API
 *
 * SINGLE SOURCE OF TRUTH for game mechanics.
 * Both Game and Simulator import from here.
 *
 * Usage:
 *   import { simStep, getLegalActions, checkTerminal } from '../core/logic';
 */

// Types (re-exported from driver)
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
} from './types';

export { DRIVER_VERSION } from './types';

// Core step function
export { simStep, getLegalActions } from './simStep';
export type { StepResult } from './simStep';

// Terminal conditions
export { checkTerminal, isTerminal, isWin, isLoss } from './terminal';

// Combat
export {
  COMBAT_CONSTANTS,
  distance,
  findNearestEnemy,
  findEnemyById,
  calculatePlayerDamage,
  calculateEnemyDamage,
  resolvePlayerAttack,
  processEnemyAttacks,
  processEnemyMovement,
} from './combat';
export type { AttackResult } from './combat';

// Spawning
export {
  OVERWORLD_SPAWNS,
  spawnEnemies,
  spawnEnemiesSeeded,
} from './spawn';
export type { SpawnConfig } from './spawn';
