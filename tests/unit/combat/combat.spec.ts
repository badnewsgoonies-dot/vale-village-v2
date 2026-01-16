import { describe, it, expect } from 'vitest';
import {
  resolvePlayerAttack,
  processEnemyAttacks,
  processEnemyMovement,
  COMBAT_CONSTANTS,
  calculatePlayerDamage,
} from '../../../src/core/logic/combat';
import { simStep } from '../../../src/core/logic/simStep';
import type { GameState, EnemyState } from '../../../src/core/logic/types';

function makeState(overrides?: Partial<GameState>): GameState {
  const defaultState: GameState = {
    tick: 0,
    player: {
      hp: 100,
      maxHp: 100,
      position: { x: 0, y: 0 },
      deaths: 0,
    },
    world: {
      levelId: 'test',
      timeElapsed: 0,
      enemies: [],
    },
    terminal: { kind: 'running' },
    flags: {},
    metrics: { enemiesDefeated: 0, itemsCollected: 0, novelty: 0 },
  } as GameState;

  return structuredClone({ ...defaultState, ...overrides }) as GameState;
}

describe('Combat core logic', () => {
  it('attack misses when no enemies in range', () => {
    const state = makeState({ world: { levelId: 'test', timeElapsed: 0, enemies: [{ id: 'e1', type: 'goblin', hp: 10, maxHp: 10, position: { x: 10, y: 10 } }] } });
    const prevEnemies = structuredClone(state.world.enemies);
    const result = resolvePlayerAttack(state);
    expect(result.notes).toContain('attack_missed_no_target');
    // original enemies should remain (state mutated version shouldn't remove anything)
    expect(state.world.enemies).toEqual(prevEnemies);
  });

  it('attack hits and kills enemy and increments metrics', () => {
    const enemy: EnemyState = { id: 'e2', type: 'slime', hp: 5, maxHp: 5, position: { x: 1, y: 0 } };
    const state = makeState({ world: { levelId: 'test', timeElapsed: 0, enemies: [enemy] } });

    const result = resolvePlayerAttack(state, 'e2');
    expect(result.hit).toBe(true);
    expect(result.killed).toBe(true);
    expect(result.targetId).toBe('e2');
    expect(state.world.enemies.find(e => e.id === 'e2')).toBeUndefined();
    expect(state.metrics && state.metrics.enemiesDefeated).toBe(1);
  });

  it('simStep is pure and does not mutate previous state', () => {
    const enemy: EnemyState = { id: 'e3', type: 'slime', hp: 20, maxHp: 20, position: { x: 1, y: 0 } };
    const prev = makeState({ world: { levelId: 'test', timeElapsed: 0, enemies: [enemy] } });
    const prevCopy = structuredClone(prev);

    const { state: next } = simStep(prev, { type: 'ATTACK' });

    // prev must remain equal to prevCopy
    expect(prev).toEqual(prevCopy);

    // next should reflect the attack (enemy HP decreased or removed)
    expect(next.tick).toBe(prev.tick + 1);
  });

  it('enemy moves toward player and attacks when in range', () => {
    const enemy: EnemyState = { id: 'e4', type: 'orc', hp: 30, maxHp: 30, position: { x: 2, y: 0 } };
    const prev = makeState({ world: { levelId: 'test', timeElapsed: 0, enemies: [enemy] } });
    const { state: next, notes } = simStep(prev, { type: 'NOOP' });

    // After movement, enemy should be at x=1 (moved closer)
    const movedEnemy = next.world.enemies.find(e => e.id === 'e4');
    expect(movedEnemy).toBeDefined();
    expect(movedEnemy!.position.x).toBe(1);

    // Player should have taken damage (ENEMY_BASE_DAMAGE)
    expect(notes).toContain(`took_${COMBAT_CONSTANTS.ENEMY_BASE_DAMAGE}_damage`);
    expect(next.player.hp).toBe(prev.player.hp - COMBAT_CONSTANTS.ENEMY_BASE_DAMAGE);
  });

  it('calculatePlayerDamage is deterministic (crit every 10 ticks)', () => {
    expect(calculatePlayerDamage(9)).toBe(COMBAT_CONSTANTS.PLAYER_BASE_DAMAGE);
    expect(calculatePlayerDamage(10)).toBe(COMBAT_CONSTANTS.PLAYER_BASE_DAMAGE * COMBAT_CONSTANTS.CRIT_MULTIPLIER);
  });
});
