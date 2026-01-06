/**
 * Game constants
 * Centralized magic numbers and configuration values
 */

import { MAX_LEVEL as GAME_MAX_LEVEL } from '../constants/game';

/**
 * Minimum party size - minimum number of units in player team
 */
export const MIN_PARTY_SIZE = 1;

/**
 * Maximum party size - maximum number of units in player team
 */
export const MAX_PARTY_SIZE = 4;

/**
 * Maximum unit level supported by XP curve / normalization
 */
export const MAX_LEVEL = GAME_MAX_LEVEL;

/**
 * RNG stream offsets for deterministic battle RNG
 * Each stream is separated by a large offset to prevent collisions
 */
export const RNG_STREAMS = {
  /** Status effects processing (poison, burn, etc.) */
  STATUS_EFFECTS: 0,
  /** Player/enemy actions */
  ACTIONS: 7,
  /** Victory reward calculation */
  VICTORY: 999,
  /** End turn processing */
  END_TURN: 1,
  /** Queue battle round execution */
  QUEUE_ROUND: 1000,
} as const;

/**
 * Base multiplier for RNG stream separation
 * Ensures streams don't overlap across turns
 */
export const RNG_STREAM_BASE_MULTIPLIER = 1_000_000;

/**
 * Number of warmup iterations performed by PRNG implementations to avoid
 * trivial early-state correlations. Centralized here to avoid magic numbers
 * spread across the codebase.
 */
export const PRNG_WARMUP_ITERATIONS = 10;



/**
 * Default RNG seed used when none provided by caller
 */
export const DEFAULT_RNG_SEED = 1337;

/**
 * Default critical hit threshold used by UI crit counters
 */
export const DEFAULT_CRIT_THRESHOLD = 10;

/**
 * Duration (ms) for crit flash visual effect
 */
export const CRIT_FLASH_DURATION_MS = 200;

/**
 * Battle calculation constants
 */
export const BATTLE_CONSTANTS = {
  /** Revive HP percentage (50% of max HP) */
  REVIVE_HP_PERCENTAGE: 0.5,
  /** Base defense multiplier in damage formula (physical) */
  DEFENSE_MULTIPLIER: 0.5,
  /** Base defense multiplier for psynergy damage */
  PSYNERGY_DEFENSE_MULTIPLIER: 0.3,
  /** Element advantage damage multiplier */
  ELEMENT_ADVANTAGE_MULTIPLIER: 1.0,
  /** Element disadvantage damage multiplier */
  ELEMENT_DISADVANTAGE_MULTIPLIER: 1.0,
  /** Normal battle equipment drop rate (10%) */
  EQUIPMENT_DROP_RATE_NORMAL: 0.1,
  /** Boss battle equipment drop rate (50%) */
  EQUIPMENT_DROP_RATE_BOSS: 0.5,
  /** Minimum damage floor (all attacks deal at least this much) */
  MINIMUM_DAMAGE: 1,
  /** Minimum healing amount (all heals restore at least this much if basePower > 0) */
  MINIMUM_HEALING: 1,
} as const;

export const STATUS_CONSTANTS = {
  POISON_PERCENT: 0.08,
  BURN_PERCENT: 0.10,
  FREEZE_BREAK_CHANCE: 0.3,
  PARALYZE_FAIL_CHANCE: 0.25,
} as const;

export const TOWER_CONSTANTS = {
  HARD_DIFFICULTY_BONUS: 0.25,
} as const;

/**
 * Create an empty action queue
 * Returns array of nulls with proper type for BattleState
 * @param size - Queue size (defaults to MAX_PARTY_SIZE for backward compatibility)
 */
export function createEmptyQueue(size: number = MAX_PARTY_SIZE): readonly null[] {
  if (size < MIN_PARTY_SIZE || size > MAX_PARTY_SIZE) {
    throw new Error(`Queue size must be between ${MIN_PARTY_SIZE} and ${MAX_PARTY_SIZE}, got ${size}`);
  }
  return Array(size).fill(null) as null[];
}

/**
 * Create RNG stream for a specific purpose
 * @param rngSeed Base seed for the battle
 * @param turnNumber Current turn/round number
 * @param stream Stream identifier (from RNG_STREAMS or custom offset)
 */
export function createRNGStream(
  rngSeed: number,
  turnNumber: number,
  stream: keyof typeof RNG_STREAMS | number
): number {
  const offset = typeof stream === 'number' ? stream : RNG_STREAMS[stream];
  return rngSeed + turnNumber * RNG_STREAM_BASE_MULTIPLIER + offset;
}
