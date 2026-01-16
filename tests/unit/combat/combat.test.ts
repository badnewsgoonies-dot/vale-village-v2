import { describe, it, expect } from 'vitest';
import {
  COMBAT_CONSTANTS,
  distance,
  calculatePlayerDamage,
  resolvePlayerAttack,
  processEnemyAttacks,
  processEnemyMovement,
  findNearestEnemy,
} from '../../../src/core/logic/combat';
import type { GameState } from '../../../src/core/logic/types';

function makeState(): GameState {
  return {
    tick: 1,
    player: {
      hp: 100,
      maxHp: 100,
      position: { x: 0, y: 0 },
      deaths: 0,
    },
    world: {
      levelId: 'test-level',
      timeElapsed: 0,
      enemies: [],
    },
    terminal: { kind: 'running' },
    flags: {},
    metrics: { enemiesDefeated: 0, itemsCollected: 0, novelty: 0 },
  } as unknown as GameState;
}

describe('combat logic', () => {
  it('returns miss when no target present', () => {
    const state = makeState();
    const res = resolvePlayerAttack(state);
    expect(res.hit).toBe(false);
    expect(res.notes).toContain('attack_missed_no_target');
  });

  it('hits nearest enemy and applies base damage', () => {
    const state = makeState();
    state.world.enemies.push({ id: 'e1', type: 'slime', hp: 50, maxHp: 50, position: { x: 1, y: 0 } });

    const res = resolvePlayerAttack(state);
    expect(res.hit).toBe(true);
    expect(res.damage).toBe(COMBAT_CONSTANTS.PLAYER_BASE_DAMAGE);
    const remaining = state.world.enemies.find(e => e.id === 'e1');
    expect(remaining).not.toBeUndefined();
    expect(remaining!.hp).toBe(50 - COMBAT_CONSTANTS.PLAYER_BASE_DAMAGE);
  });

  it('applies crit damage deterministically on crit tick', () => {
    // tick 10 should be crit according to calculatePlayerDamage implementation
    const dmg = calculatePlayerDamage(10);
    expect(dmg).toBe(COMBAT_CONSTANTS.PLAYER_BASE_DAMAGE * COMBAT_CONSTANTS.CRIT_MULTIPLIER);
  });

  it('kills enemy when damage exceeds hp and increments metrics', () => {
    const state = makeState();
    state.tick = 10; // crit to ensure kill
    state.world.enemies.push({ id: 'e2', type: 'slime', hp: 10, maxHp: 10, position: { x: 1, y: 0 } });

    const res = resolvePlayerAttack(state);
    expect(res.killed).toBe(true);
    expect(state.world.enemies.find(e => e.id === 'e2')).toBeUndefined();
    expect(state.metrics?.enemiesDefeated).toBe(1);
  });

  it('enemies attack player when within attack range', () => {
    const state = makeState();
    state.world.enemies.push({ id: 'e3', type: 'goblin', hp: 20, maxHp: 20, position: { x: 1, y: 0 } });

    const beforeHp = state.player.hp;
    const total = processEnemyAttacks(state);
    expect(total).toBe(COMBAT_CONSTANTS.ENEMY_BASE_DAMAGE);
    expect(state.player.hp).toBe(beforeHp - COMBAT_CONSTANTS.ENEMY_BASE_DAMAGE);
  });

  it('moves enemy toward player when in aggro range but outside attack range', () => {
    const state = makeState();
    // place enemy at distance 3 (aggro 5, attack 1.5) -> should move
    state.world.enemies.push({ id: 'e4', type: 'wolf', hp: 20, maxHp: 20, position: { x: 3, y: 0 } });

    processEnemyMovement(state);
    const e = state.world.enemies.find(x => x.id === 'e4')!;
    // moved one step toward player (from x=3 to x=2)
    expect(e.position.x).toBe(2);
  });

  it('does not move enemy that is within attack range', () => {
    const state = makeState();
    state.world.enemies.push({ id: 'e5', type: 'imp', hp: 20, maxHp: 20, position: { x: 1, y: 0 } });

    processEnemyMovement(state);
    const e = state.world.enemies.find(x => x.id === 'e5')!;
    expect(e.position.x).toBe(1);
  });
});
