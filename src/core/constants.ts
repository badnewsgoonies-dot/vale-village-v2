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
 * Maximum number of save slots
 */
export const MAX_SAVE_SLOTS = 3;

/**
 * Maximum number of Djinn that can be equipped by the team at once
 */
export const MAX_EQUIPPED_DJINN = 3;

/**
 * Maximum unit level supported by XP curve / normalization
 */
export const MAX_LEVEL = GAME_MAX_LEVEL;

/**
 * Y coordinate (world pixels) used as the baseline ground anchor for building placement in the village.
 * All buildings use this as their bottom-center Y coordinate.
 */
export const BUILDING_GROUND_Y = 200;

/**
 * RNG stream offsets for deterministic battle RNG
 * Each stream is separated by a large offset to prevent collisions
 */
export const RNG_STREAMS = {
  /** Status effects processing (poison, burn, etc.) */
  STATUS_EFFECTS: 0,
  /** Player/enemy actions */
  ACTIONS: 7,
  /** Per-turn stream used for general per-input RNG (replays, turn-scoped) */
  TURN: 2,
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
  ELEMENT_ADVANTAGE_MULTIPLIER: 1.5,
  /** Element disadvantage damage multiplier */
  ELEMENT_DISADVANTAGE_MULTIPLIER: 0.67,
  /** Maximum elemental resistance from equipment to avoid full immunity */
  MAX_ELEMENTAL_RESIST: 0.9,
  /** Normal battle equipment drop rate (10%) */
  EQUIPMENT_DROP_RATE_NORMAL: 0.1,
  /** Boss battle equipment drop rate (50%) */
  EQUIPMENT_DROP_RATE_BOSS: 0.5,
  /** Minimum damage floor (all attacks deal at least this much) */
  MINIMUM_DAMAGE: 1,
  /** Minimum healing amount (all heals restore at least this much if basePower > 0) */
  MINIMUM_HEALING: 1,
  /** God mode damage (one-hit kill) */
  GOD_MODE_DAMAGE: 9999,
  /** Break system: normal hit gauge reduction */
  BREAK_GAUGE_REDUCTION_NORMAL: 10,
  /** Break system: weakness hit gauge reduction */
  BREAK_GAUGE_REDUCTION_WEAKNESS: 25,
  /** Break system: damage multiplier when broken */
  BREAK_DAMAGE_MULTIPLIER: 1.5,
  /** Break system: default recovery amount */
  BREAK_RECOVERY_DEFAULT: 50,
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

export const OVERWORLD_CONSTANTS = {
  INTERIOR_PLAYER_Y: 450,
  TRANSITION_ALPHA_STEP: 0.05,
  TRANSITION_ALPHA_MIN: 0,
  TRANSITION_ALPHA_MAX: 1,
  ENCOUNTER_PROXIMITY_RADIUS_PX: 60,
  ENCOUNTER_PROXIMITY_RADIUS_SQ: 60 * 60,
} as const;

export const AI_CONSTANTS = {
  /** Score returned when no valid targets or useless ability */
  INVALID_SCORE: -1000,
  /** Bonus score for each unit a revival ability can revive */
  REVIVE_SCORE_BONUS: 100,
  /** Bonus score for abilities prioritized in a boss phase */
  PHASE_PRIORITY_BONUS: 10,
  /** Threshold for considering scores "close" for randomization */
  SCORE_CLOSE_THRESHOLD: 2.0,
  /** Multiplier for estimated damage/healing utility */
  STATUS_UTILITY_MULTIPLIER: 0.1,
  /** Multiplier for buff/debuff stat modifiers */
  BUFF_UTILITY_MULTIPLIER: 2.0,
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
