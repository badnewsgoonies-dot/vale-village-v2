import { describe, it, expect, vi } from 'vitest';

// Flexible mocks for deterministic, unit-level AI logic testing
vi.mock('/home/geni/Documents/vale-village-v2/src/core/algorithms/targeting', () => ({
  resolveTargets: (ability: any, caster: any, playerUnits: any[], enemies: any[]) => {
    // Return allies when ability targets allies or is a revive; otherwise return player units
    const targets = ability?.targets ?? '';
    if (ability?.revive || ability?.revivesFallen || String(targets).includes('ally')) {
      return enemies;
    }
    if (String(targets).includes('enemy')) {
      return playerUnits;
    }
    // default to playerUnits
    return playerUnits;
  },
}));

vi.mock('/home/geni/Documents/vale-village-v2/src/core/algorithms/stats', () => ({
  calculateEffectiveStats: (unit: any, team: any) => ({ atk: unit.baseStats?.atk ?? 0, mag: unit.baseStats?.mag ?? 0, def: unit.baseStats?.def ?? 0 }),
}));

vi.mock('/home/geni/Documents/vale-village-v2/src/core/algorithms/damage', () => ({
  getElementModifier: (abilityEl: any, targetEl: any) => 1,
}));

vi.mock('/home/geni/Documents/vale-village-v2/src/core/models/Unit', () => ({
  calculateMaxHp: (u: any) => u.baseStats?.maxHp ?? 100,
  isUnitKO: (u: any) => !!u.isKO,
}));

// Provide a minimal ENEMIES registry for phase tests
vi.mock('/home/geni/Documents/vale-village-v2/src/data/definitions/enemies', () => ({
  ENEMIES: {
    boss1: { phases: [ { threshold: 1.0, priorityAbilities: ['a_priority'] } ] },
  },
}));

import { makeAIDecision, selectLowHPTarget } from '../../../src/core/services/AIService';

describe('AIService - decision making and targeting', () => {
  const RNG_ZERO = { next: () => 0 } as any;
  const RNG_HALF = { next: () => 0.5 } as any;

  it('chooses higher estimated damage ability', () => {
    const player = { id: 'p1', currentHp: 100, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 2 }, abilities: [] };
    const enemy = {
      id: 'e_dmg',
      currentHp: 100,
      baseStats: { maxHp: 100, atk: 5, mag: 2, def: 2 },
      abilities: [
        { id: 'weak', type: 'physical', basePower: 2, targets: 'single-enemy' },
        { id: 'strong', type: 'physical', basePower: 20, targets: 'single-enemy' },
      ],
    };

    const state = { playerTeam: { units: [player] }, enemies: [enemy], currentTurn: 1 } as any;
    const decision = makeAIDecision(state, 'e_dmg', RNG_ZERO);
    expect(decision.abilityId).toBe('strong');
  });

  it('applies phase priority bonus when boss is in phase', () => {
    const player = { id: 'p1', currentHp: 100, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 2 }, abilities: [] };
    const boss = {
      id: 'boss1',
      currentHp: 100,
      baseStats: { maxHp: 100, atk: 5, mag: 2, def: 2 },
      abilities: [
        { id: 'a_normal', type: 'physical', basePower: 10, targets: 'single-enemy' },
        { id: 'a_priority', type: 'physical', basePower: 1, targets: 'single-enemy' },
      ],
    };

    const state = { playerTeam: { units: [player] }, enemies: [boss], currentTurn: 1 } as any;
    // The mocked ENEMIES places boss1 in a phase that prioritizes 'a_priority'
    const decision = makeAIDecision(state, 'boss1', RNG_ZERO);
    expect(decision.abilityId).toBe('a_priority');
  });

  it('selects revival ability when an ally is KO', () => {
    const player = { id: 'p1', currentHp: 100, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 2 }, abilities: [] };
    const allyKO = { id: 'ally1', currentHp: 0, isKO: true, baseStats: { maxHp: 100, atk: 2, mag: 1, def: 1 }, abilities: [] };
    const caster = {
      id: 'reviver',
      currentHp: 100,
      baseStats: { maxHp: 100, atk: 3, mag: 3, def: 2 },
      abilities: [ { id: 'revive', type: 'healing', basePower: 0, targets: 'single-ally', revive: true } ],
    };

    const state = { playerTeam: { units: [player] }, enemies: [caster, allyKO], currentTurn: 1 } as any;
    const decision = makeAIDecision(state, 'reviver', RNG_ZERO);
    expect(decision.abilityId).toBe('revive');
    expect(decision.targetIds).toEqual(['ally1']);
  });

  it('throws when there are no valid targets', () => {
    const enemy = { id: 'e_none', currentHp: 100, baseStats: { maxHp: 100, atk: 5, mag: 2, def: 2 }, abilities: [ { id: 'a', type: 'physical', basePower: 5, targets: 'single-enemy' } ] };
    const state = { playerTeam: { units: [] }, enemies: [enemy], currentTurn: 1 } as any;
    expect(() => makeAIDecision(state, 'e_none', RNG_ZERO)).toThrow();
  });

  it('selectLowHPTarget returns the lowest HP percent or null when none', () => {
    const u1 = { id: 'u1', currentHp: 30, baseStats: { maxHp: 100 }, isKO: false } as any;
    const u2 = { id: 'u2', currentHp: 10, baseStats: { maxHp: 50 }, isKO: false } as any;
    const u3 = { id: 'u3', currentHp: 0, baseStats: { maxHp: 100 }, isKO: true } as any;

    const chosen = selectLowHPTarget([u1, u2, u3]);
    expect(chosen?.id).toBe('u2');

    const none = selectLowHPTarget([ { ...u3, isKO: true } ]);
    expect(none).toBeNull();
  });

  it('honors avoidOverkill hint when selecting targets', () => {
    const pLow = { id: 'pLow', currentHp: 5, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 1 }, abilities: [] };
    const pSafe = { id: 'pSafe', currentHp: 60, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 1 }, abilities: [] };
    const caster = { id: 'e_over', currentHp: 100, baseStats: { maxHp: 100, atk: 0, mag: 0, def: 1 }, abilities: [ { id: 'big', type: 'physical', basePower: 50, targets: 'single-enemy', aiHints: { avoidOverkill: true } } ] };

    const state = { playerTeam: { units: [pLow, pSafe] }, enemies: [caster], currentTurn: 1 } as any;
    const decision = makeAIDecision(state, 'e_over', RNG_ZERO);
    // Should avoid pLow due to extreme overkill and pick pSafe
    expect(decision.targetIds[0]).toBe('pSafe');
  });

  it('respects random target hint using RNG', () => {
    const p1 = { id: 'r1', currentHp: 50, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 1 }, abilities: [] };
    const p2 = { id: 'r2', currentHp: 50, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 1 }, abilities: [] };
    const caster = { id: 'e_rand', currentHp: 100, baseStats: { maxHp: 100, atk: 2, mag: 2, def: 1 }, abilities: [ { id: 'rnd', type: 'physical', basePower: 5, targets: 'single-enemy', aiHints: { target: 'random' } } ] };

    const state = { playerTeam: { units: [p1, p2] }, enemies: [caster], currentTurn: 1 } as any;
    const decision = makeAIDecision(state, 'e_rand', RNG_HALF);
    // RNG_HALF gives index floor(0.5 * 2) = 1 -> picks second unit
    expect(decision.targetIds[0]).toBe('r2');
  });

  it('targets healers first when hint is healerFirst', () => {
    const healer = { id: 'h1', currentHp: 80, baseStats: { maxHp: 100, atk: 1, mag: 2, def: 1 }, abilities: [ { id: 'heal', type: 'healing', basePower: 10, targets: 'single-ally' } ] };
    const other = { id: 'o1', currentHp: 80, baseStats: { maxHp: 100, atk: 2, mag: 1, def: 1 }, abilities: [] };
    const caster = { id: 'e_h', currentHp: 100, baseStats: { maxHp: 100, atk: 3, mag: 2, def: 1 }, abilities: [ { id: 'focus', type: 'physical', basePower: 5, targets: 'single-enemy', aiHints: { target: 'healerFirst' } } ] };

    const state = { playerTeam: { units: [healer, other] }, enemies: [caster], currentTurn: 1 } as any;
    const decision = makeAIDecision(state, 'e_h', RNG_ZERO);
    expect(decision.targetIds[0]).toBe('h1');
  });

  it('chooses highestDef target when hinted', () => {
    const t1 = { id: 'd1', currentHp: 80, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 5 }, abilities: [] };
    const t2 = { id: 'd2', currentHp: 80, baseStats: { maxHp: 100, atk: 1, mag: 1, def: 10 }, abilities: [] };
    const caster = { id: 'e_def', currentHp: 100, baseStats: { maxHp: 100, atk: 3, mag: 1, def: 1 }, abilities: [ { id: 'crush', type: 'physical', basePower: 5, targets: 'single-enemy', aiHints: { target: 'highestDef' } } ] };

    const state = { playerTeam: { units: [t1, t2] }, enemies: [caster], currentTurn: 1 } as any;
    const decision = makeAIDecision(state, 'e_def', RNG_ZERO);
    expect(decision.targetIds[0]).toBe('d2');
  });
});
