/**
 * Combat Logic - Damage calculations and attack resolution
 *
 * SINGLE SOURCE OF TRUTH for combat mechanics.
 * Both Game and Simulator import from here.
 */

import type { GameState, EnemyState, Position } from './types';

// ============================================================================
// Constants (Game Balance)
// ============================================================================

export const COMBAT_CONSTANTS = {
  // Player
  PLAYER_BASE_DAMAGE: 10,
  PLAYER_ATTACK_RANGE: 2.0,

  // Enemy
  ENEMY_BASE_DAMAGE: 5,
  ENEMY_ATTACK_RANGE: 1.5,
  ENEMY_AGGRO_RANGE: 5.0,

  // Combat
  CRIT_CHANCE: 0.1,
  CRIT_MULTIPLIER: 2.0,
} as const;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Calculate distance between two positions.
 */
export function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Find nearest enemy within range.
 */
export function findNearestEnemy(
  playerPos: Position,
  enemies: EnemyState[],
  range: number = COMBAT_CONSTANTS.PLAYER_ATTACK_RANGE
): EnemyState | null {
  let nearest: EnemyState | null = null;
  let nearestDist = Infinity;

  for (const enemy of enemies) {
    const dist = distance(playerPos, enemy.position);
    if (dist <= range && dist < nearestDist) {
      nearest = enemy;
      nearestDist = dist;
    }
  }

  return nearest;
}

/**
 * Find enemy by ID.
 */
export function findEnemyById(
  enemies: EnemyState[],
  targetId: string
): EnemyState | null {
  return enemies.find(e => e.id === targetId) ?? null;
}

// ============================================================================
// Damage Calculation
// ============================================================================

/**
 * Calculate player damage (deterministic for simulation).
 * For determinism, crit is based on tick modulo, not random.
 */
export function calculatePlayerDamage(tick: number): number {
  const baseDamage = COMBAT_CONSTANTS.PLAYER_BASE_DAMAGE;
  // Deterministic "crit": every 10th tick
  const isCrit = tick % 10 === 0;
  return isCrit ? baseDamage * COMBAT_CONSTANTS.CRIT_MULTIPLIER : baseDamage;
}

/**
 * Calculate enemy damage.
 */
export function calculateEnemyDamage(enemy: EnemyState): number {
  // Could vary by enemy type in future
  return COMBAT_CONSTANTS.ENEMY_BASE_DAMAGE;
}

// ============================================================================
// Combat Resolution
// ============================================================================

export interface AttackResult {
  hit: boolean;
  damage: number;
  targetId?: string;
  killed: boolean;
  notes: string[];
}

/**
 * Resolve player attack.
 * Mutates state in place, returns result for logging.
 */
export function resolvePlayerAttack(
  state: GameState,
  targetId?: string
): AttackResult {
  const result: AttackResult = {
    hit: false,
    damage: 0,
    killed: false,
    notes: [],
  };

  // Find target
  let target: EnemyState | null = null;
  if (targetId) {
    target = findEnemyById(state.world.enemies, targetId);
  } else {
    target = findNearestEnemy(
      state.player.position,
      state.world.enemies,
      COMBAT_CONSTANTS.PLAYER_ATTACK_RANGE
    );
  }

  if (!target) {
    result.notes.push('attack_missed_no_target');
    return result;
  }

  // Calculate and apply damage
  result.hit = true;
  result.targetId = target.id;
  result.damage = calculatePlayerDamage(state.tick);
  target.hp -= result.damage;

  result.notes.push(`hit_${target.id}_for_${result.damage}`);

  // Check kill
  if (target.hp <= 0) {
    result.killed = true;
    state.world.enemies = state.world.enemies.filter(e => e.id !== target!.id);
    if (state.metrics) {
      state.metrics.enemiesDefeated++;
    }
    result.notes.push(`killed_${target.id}`);
  }

  return result;
}

/**
 * Process all enemy attacks (enemy turn).
 * Mutates state in place, returns total damage dealt.
 */
export function processEnemyAttacks(state: GameState): number {
  let totalDamage = 0;

  for (const enemy of state.world.enemies) {
    const dist = distance(enemy.position, state.player.position);

    if (dist <= COMBAT_CONSTANTS.ENEMY_ATTACK_RANGE) {
      // Enemy attacks player
      const damage = calculateEnemyDamage(enemy);
      state.player.hp -= damage;
      totalDamage += damage;
    }
  }

  return totalDamage;
}

/**
 * Process enemy movement (enemies move toward player).
 * Mutates state in place.
 */
export function processEnemyMovement(state: GameState): void {
  for (const enemy of state.world.enemies) {
    const dist = distance(enemy.position, state.player.position);

    // Only move if in aggro range but not attack range
    if (dist > COMBAT_CONSTANTS.ENEMY_ATTACK_RANGE && dist <= COMBAT_CONSTANTS.ENEMY_AGGRO_RANGE) {
      // Move toward player (simple chase AI)
      const dx = Math.sign(state.player.position.x - enemy.position.x);
      const dy = Math.sign(state.player.position.y - enemy.position.y);
      enemy.position.x += dx;
      enemy.position.y += dy;
    }
  }
}
