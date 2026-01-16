/**
 * Enemy Spawning - Deterministic spawn logic
 *
 * SINGLE SOURCE OF TRUTH for enemy initialization.
 * Pure, deterministic, no side effects.
 */

import type { EnemyState, Position } from './types';

// ============================================================================
// Spawn Configuration
// ============================================================================

export interface SpawnConfig {
  id: string;
  type: string;
  hp: number;
  position: Position;
}

/**
 * Default overworld enemy spawns.
 * Fixed positions for deterministic testing.
 */
export const OVERWORLD_SPAWNS: SpawnConfig[] = [
  { id: 'goblin_1', type: 'goblin', hp: 30, position: { x: 400, y: 480 } },
  { id: 'goblin_2', type: 'goblin', hp: 30, position: { x: 600, y: 470 } },
  { id: 'skeleton_1', type: 'skeleton', hp: 45, position: { x: 800, y: 490 } },
];

// ============================================================================
// Spawn Functions
// ============================================================================

/**
 * Create enemies from spawn configs.
 * Pure function - no side effects.
 */
export function spawnEnemies(configs: SpawnConfig[] = OVERWORLD_SPAWNS): EnemyState[] {
  return configs.map(config => ({
    id: config.id,
    type: config.type,
    hp: config.hp,
    maxHp: config.hp,
    position: { ...config.position },
  }));
}

/**
 * Spawn enemies with seeded randomization.
 * For deterministic procedural spawning.
 */
export function spawnEnemiesSeeded(
  seed: number,
  count: number = 3,
  bounds: { minX: number; maxX: number; y: number }
): EnemyState[] {
  const rng = seededRandom(seed);
  const enemies: EnemyState[] = [];

  for (let i = 0; i < count; i++) {
    const x = bounds.minX + rng() * (bounds.maxX - bounds.minX);
    const hp = 25 + Math.floor(rng() * 20); // 25-44 HP

    enemies.push({
      id: `enemy_${i}`,
      type: rng() > 0.5 ? 'goblin' : 'skeleton',
      hp,
      maxHp: hp,
      position: { x, y: bounds.y + (rng() * 20 - 10) },
    });
  }

  return enemies;
}

/**
 * Simple seeded RNG for determinism.
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
