/**
 * Heuristic Policy
 *
 * Simple greedy strategy: attack if enemy nearby, else move toward closest enemy.
 * Not smart. Intentionally not smart.
 *
 * Purpose:
 * - Baseline "can this game be completed at all?"
 * - If this can't win a trivial level, content is broken
 * - Benchmark for LLM policies to beat
 */

import type { GameState, GameAction, Position, EnemyState } from '../../driver';

export function heuristicAction(state: GameState): GameAction {
  const player = state.player;
  const enemies = state.world.enemies;

  // Dead or terminal? NOOP
  if (player.hp <= 0 || state.terminal.kind !== 'running') {
    return { type: 'NOOP' };
  }

  // No enemies? We won (or will)
  if (enemies.length === 0) {
    return { type: 'NOOP' };
  }

  // Find closest enemy
  const closest = findClosest(player.position, enemies);
  if (!closest) {
    return { type: 'NOOP' };
  }

  const dist = distance(player.position, closest.position);

  // In attack range (< 2 tiles)? Attack
  if (dist < 2) {
    return { type: 'ATTACK', targetId: closest.id };
  }

  // Otherwise, move toward enemy
  const dx = Math.sign(closest.position.x - player.position.x);
  const dy = Math.sign(closest.position.y - player.position.y);

  // Prefer diagonal movement if both dx and dy are non-zero
  if (dx !== 0 && dy !== 0) {
    return { type: 'MOVE', dx, dy };
  }

  // Cardinal movement
  return { type: 'MOVE', dx, dy };
}

// ============================================================================
// Helpers
// ============================================================================

function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function findClosest(from: Position, enemies: EnemyState[]): EnemyState | null {
  let closest: EnemyState | null = null;
  let minDist = Infinity;

  for (const enemy of enemies) {
    const d = distance(from, enemy.position);
    if (d < minDist) {
      minDist = d;
      closest = enemy;
    }
  }

  return closest;
}

// ============================================================================
// Advanced: Priority-based heuristic
// ============================================================================

export type HeuristicConfig = {
  /** Attack range threshold */
  attackRange: number;

  /** HP threshold to consider fleeing */
  fleeThreshold: number;

  /** Whether to prioritize low-HP enemies */
  focusWeakest: boolean;
};

export const DEFAULT_HEURISTIC_CONFIG: HeuristicConfig = {
  attackRange: 2,
  fleeThreshold: 20,
  focusWeakest: true,
};

export function configurableHeuristicAction(
  state: GameState,
  config: HeuristicConfig = DEFAULT_HEURISTIC_CONFIG
): GameAction {
  const player = state.player;
  const enemies = state.world.enemies;

  if (player.hp <= 0 || state.terminal.kind !== 'running') {
    return { type: 'NOOP' };
  }

  if (enemies.length === 0) {
    return { type: 'NOOP' };
  }

  // Low HP? Consider fleeing (move away from enemies)
  if (player.hp <= config.fleeThreshold) {
    const closest = findClosest(player.position, enemies);
    if (closest) {
      const dx = -Math.sign(closest.position.x - player.position.x);
      const dy = -Math.sign(closest.position.y - player.position.y);
      return { type: 'MOVE', dx, dy };
    }
  }

  // Select target based on config
  let target: EnemyState | null;
  if (config.focusWeakest) {
    target = findWeakest(enemies, player.position, config.attackRange * 2);
  } else {
    target = findClosest(player.position, enemies);
  }

  if (!target) {
    return { type: 'NOOP' };
  }

  const dist = distance(player.position, target.position);

  if (dist <= config.attackRange) {
    return { type: 'ATTACK', targetId: target.id };
  }

  const dx = Math.sign(target.position.x - player.position.x);
  const dy = Math.sign(target.position.y - player.position.y);
  return { type: 'MOVE', dx, dy };
}

function findWeakest(
  enemies: EnemyState[],
  from: Position,
  maxDist: number
): EnemyState | null {
  let weakest: EnemyState | null = null;
  let minHp = Infinity;

  for (const enemy of enemies) {
    const d = distance(from, enemy.position);
    if (d <= maxDist && enemy.hp < minHp) {
      minHp = enemy.hp;
      weakest = enemy;
    }
  }

  return weakest || findClosest(from, enemies);
}
