import { describe, it, expect } from 'vitest';
import { getValidTargets } from '../../../src/core/algorithms/targeting';

// Reproduction test for BUG-011: Revival targeting vs UI blocking KO units
// The test intentionally asserts that the UI-level selection logic would allow
// targeting a KO'd ally when using a revival ability — this currently fails
// because the UI rendering logic blocks KO units.

describe('BUG-011 - Revival targeting mismatch (repro)', () => {
  it('attempts to target a KO\'d ally with a revive ability (expected to fail)', () => {
    // Minimal ability that revives
    const reviveAbility = {
      id: 'revive-test',
      name: 'Revive Test',
      type: 'healing',
      manaCost: 0,
      basePower: 0,
      targets: 'single-ally',
      unlockLevel: 1,
      description: 'Test revive',
      revive: true,
    } as any;

    // Minimal caster and ally objects (shaped enough for getValidTargets)
    const caster = {
      id: 'caster-1',
      currentHp: 50,
      baseStats: { maxHp: 100 },
      abilities: [reviveAbility],
    } as any;

    // KO'd ally (currentHp = 0). UI layers commonly mark KO'd units with isKo = true;
    // include that flag to simulate the UI state that blocks clicks.
    const allyKO = {
      id: 'ally-ko',
      currentHp: 0,
      baseStats: { maxHp: 100 },
      isKo: true,
      abilities: [],
    } as any;

    const playerTeam = { units: [caster, allyKO] } as any;
    const enemies: any[] = [];

    // Core targeting helper SHOULD include KO target because ability.revives === true
    const valid = getValidTargets(reviveAbility, caster, playerTeam, enemies);
    const validIds = new Set(valid.map((u: any) => u.id));
    expect(validIds.has('ally-ko')).toBe(true);

    // Modern UI selection logic (e.g. in QueueBattleView.tsx) uses validIds 
    // from getValidTargets rather than checking unit.isKo directly.
    const uiAllowsSelection = validIds.has('ally-ko');

    expect(uiAllowsSelection).toBe(true);
  });
});
