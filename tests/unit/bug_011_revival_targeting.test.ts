import { describe, it, expect } from 'vitest';
import { startBattle, performAction } from '../../src/core/services/BattleService';
import { createTeam } from '../../src/core/models/Team';
import { createUnit } from '../../src/core/models/Unit';
import { makePRNG } from '../../src/core/random/prng';
import { GAIA_REBIRTH } from '../../src/data/definitions/abilities';

// Reproduction test for BUG-011: ensure revival abilities can target KO'd units
describe('BUG-011 revival targeting', () => {
  it('allows revival abilities to target KO\'d ally (reproduction)', () => {
    const rng = makePRNG(42);

    // Minimal unit definitions for test
    const casterDef: any = {
      id: 'caster-def',
      name: 'Caster',
      element: 'Venus',
      role: 'Adept',
      baseStats: { hp: 100, pp: 0, atk: 10, def: 10, mag: 20, spd: 10 },
      growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [GAIA_REBIRTH],
      manaContribution: 0,
      description: 'Test caster',
    };

    const allyDef: any = {
      id: 'ally-def',
      name: 'Ally',
      element: 'Venus',
      role: 'Adept',
      baseStats: { hp: 80, pp: 0, atk: 8, def: 8, mag: 8, spd: 8 },
      growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 0,
      description: 'Test ally',
    };

    const enemyDef: any = {
      id: 'enemy-def',
      name: 'Enemy',
      element: 'Mars',
      role: 'Foe',
      baseStats: { hp: 50, pp: 0, atk: 6, def: 6, mag: 6, spd: 6 },
      growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 0,
      description: 'Dummy enemy',
    };

    const caster = createUnit(casterDef, 1);
    const ally = createUnit(allyDef, 1);
    const enemy = createUnit(enemyDef, 1);

    // KO the ally (simulate fallen unit)
    const koAlly = { ...ally, currentHp: 0 };

    const playerTeam = createTeam([caster, koAlly]);
    const start = startBattle(playerTeam, [enemy], rng);
    expect(start.ok).toBe(true);
    const state = start.value;

    // Attempt to use a revival ability on the KO'd ally
    const result = performAction(state, caster.id, GAIA_REBIRTH.id, [koAlly.id], rng);

    // Expectation: revival ability SHOULD be able to target and revive KO'd ally.
    // If this assertion fails, it reproduces BUG-011 where revival abilities cannot target KO'd units.
    expect(result.ok).toBe(true);
  });
});
