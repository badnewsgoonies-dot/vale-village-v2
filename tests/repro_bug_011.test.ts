import { readFileSync } from 'fs';
import { resolve } from 'path';
import { test, expect } from 'vitest';

// Repro: The battlefield UI currently prevents clicking KO'd units unconditionally
// This test asserts that the Battlefield component does NOT contain an unconditional
// check that blocks KO'd units. The codebase currently contains such a check
// ("!unit.isKo"), which prevents revival abilities from selecting fallen allies.

test('UI does not unconditionally block KO units from being targetable', () => {
  const path = resolve(process.cwd(), 'src/ui/components/battle/Battlefield.tsx');
  const src = readFileSync(path, 'utf8');

  // Expectation: there should NOT be an unconditional KO check that prevents
  // targetability. If such a check exists, the UI will exclude revival targets.
  expect(src).not.toMatch(/!unit\.isKo/);
});
import { createBattleState } from '../src/core/models/BattleState';
import { queueAction, executeRound } from '../src/core/services/QueueBattleService';
import { makePRNG } from '../src/core/random/prng';

describe('BUG-011: Revival targeting excluded by queue retargeting', () => {
  it('allows targeting a KO\'d ally with a revival ability (should revive the KO target)', () => {
    // Minimal mock unit definition
    const mockDef: any = {
      id: 'test-unit',
      name: 'Test Unit',
      element: 'Venus',
      role: 'adept',
      baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
      growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: 'Test unit',
    };

    const reviveAbility: any = {
      id: 'test-revive',
      name: 'Test Revive',
      targets: 'single-ally',
      type: 'healing',
      revivesFallen: true,
      reviveHPPercent: 0.5,
      manaCost: 0,
    };

    const casterBase = createUnit({ ...mockDef, id: 'caster' }, 1);
    const caster = { 
      ...casterBase,
      abilities: [reviveAbility],
      unlockedAbilityIds: [reviveAbility.id],
    };

    const allyBase = createUnit({ ...mockDef, id: 'ally' }, 1);
    // KO the ally
    const ally = { ...allyBase, currentHp: 0 };

    const enemy = createUnit({ ...mockDef, id: 'enemy' }, 1);

    const playerTeam = createTeam([caster, ally]);
    const state = createBattleState(playerTeam, [enemy]);

    // Queue the revive action targeting the KO'd ally
    const q = queueAction(state, caster.id, reviveAbility.id, [ally.id], reviveAbility);
    expect(q.ok).toBe(true);
    if (!q.ok) return;

    const rng = makePRNG(123);
    const result = executeRound(q.value, rng);

    // After executing the round, the KO'd ally should have been revived
    const revived = result.state.playerTeam.units.find(u => u.id === ally.id);
    expect(revived).toBeDefined();
    // Expect revival to have restored HP (> 0)
    expect(revived!.currentHp).toBeGreaterThan(0);
  });
});
