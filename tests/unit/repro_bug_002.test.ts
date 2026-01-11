import { describe, it, expect, vi } from 'vitest';

import { performAction } from '../../src/core/services/BattleService';

// Mock dependencies
vi.mock('../../src/core/models/BattleState', () => ({
  updateBattleState: (s: any, u: any) => ({ ...s, ...u }),
  createBattleState: () => ({}),
}));

vi.mock('../../src/core/algorithms/damage', () => ({
  calculatePhysicalDamage: () => 10,
  calculatePsynergyDamage: () => 10,
  calculateHealAmount: () => 10,
  applyDamageWithShields: (u: any, d: number) => ({ updatedUnit: u, actualDamage: d }),
  applyHealing: (u: any, h: number) => ({ ...u, currentHp: u.currentHp + h }),
}));

vi.mock('../../src/core/services/BattleTransaction', () => ({
  BattleTransaction: class { begin() {}; commit() {}; rollback() {} }
}));

describe('BUG-002: AoE Damage Reporting', () => {
  it('should report individual damage per target, not total sum', () => {
    const target1 = { id: 't1', currentHp: 100, statusEffects: [], equipment: {} };
    const target2 = { id: 't2', currentHp: 100, statusEffects: [], equipment: {} };
    const actor = { id: 'a1', abilities: [{ id: 'aoe', type: 'physical', targets: 'all-enemies' }], statusEffects: [] };
    
    const state: any = {
      unitById: new Map([['t1', {unit: target1}], ['t2', {unit: target2}], ['a1', {unit: actor}]]),
      playerTeam: { units: [actor] },
      enemies: [target1, target2],
      log: []
    };
    
    const rng = { next: () => 0.5 };
    
    const result = performAction(state, 'a1', 'aoe', ['t1', 't2'], rng as any);
    
    if (!result.ok) throw new Error(result.error);
    
    // Check hit events
    const hitEvents = result.value.events.filter(e => e.type === 'hit');
    expect(hitEvents.length).toBe(2);
    
    // Each hit should be 10 (individual), NOT 20 (total)
    expect(hitEvents[0].amount).toBe(10);
    expect(hitEvents[1].amount).toBe(10);
  });
});
