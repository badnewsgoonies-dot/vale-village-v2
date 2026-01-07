import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { createBattleState } from '../../src/core/models/BattleState';
import { createStoryState } from '../../src/core/models/story';
import { playReplay } from '../../src/core/save/ReplayService';
import { ABILITIES } from '../../src/data/definitions/abilities';

describe('Replay determinism', () => {
  it('produces identical events for same tape and seed', () => {
    const mockUnitDef: any = {
      id: 'u1',
      name: 'Player',
      element: 'Venus',
      role: 'adept',
      baseStats: { hp: 100, pp: 20, atk: 30, def: 10, mag: 20, spd: 10 },
      growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: 'Player unit',
    };

    const player = createUnit(mockUnitDef, 1);
    const enemyDef = { ...mockUnitDef, id: 'e1', name: 'Enemy' };
    const enemy = createUnit(enemyDef, 1);

    // Give player an ability that uses RNG for status application
    const ability = ABILITIES['inferno-fist'];
    const playerWithAbility = { ...player, abilities: [ability], unlockedAbilityIds: [ability.id] } as any;

    const team = createTeam([playerWithAbility]);
    const enemies = [enemy];
    const battle = createBattleState(team, enemies);

    const tape: any = {
      seed: 12345,
      initial: { battle, team, story: createStoryState(1), gold: 0, unitsCollected: [] },
      inputs: [
        { type: 'ability', turn: 0, actorId: playerWithAbility.id, abilityId: ability.id, targetIds: [enemy.id] }
      ],
      engineVersion: { major: 1, minor: 0 },
      dataVersion: { major: 1, minor: 0 },
    };

    const r1 = playReplay(tape);
    const r2 = playReplay(tape);

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r1.events).toEqual(r2.events);
  });

  it('reproduces events for a second tape (different ability)', () => {
    const mockUnitDef: any = {
      id: 'u2',
      name: 'Player2',
      element: 'Venus',
      role: 'adept',
      baseStats: { hp: 100, pp: 20, atk: 30, def: 10, mag: 20, spd: 10 },
      growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: 'Player unit',
    };

    const player = createUnit(mockUnitDef, 1);
    const enemyDef = { ...mockUnitDef, id: 'e2', name: 'Enemy2' };
    const enemy = createUnit(enemyDef, 1);

    // Use a different ability (poison-strike)
    const ability = ABILITIES['poison-strike'];
    const playerWithAbility = { ...player, abilities: [ability], unlockedAbilityIds: [ability.id] } as any;

    const team = createTeam([playerWithAbility]);
    const enemies = [enemy];
    const battle = createBattleState(team, enemies);

    const tape: any = {
      seed: 4242,
      initial: { battle, team, story: createStoryState(1), gold: 0, unitsCollected: [] },
      inputs: [
        { type: 'ability', turn: 0, actorId: playerWithAbility.id, abilityId: ability.id, targetIds: [enemy.id] }
      ],
      engineVersion: { major: 1, minor: 0 },
      dataVersion: { major: 1, minor: 0 },
    };

    const r1 = playReplay(tape);
    const r2 = playReplay(tape);

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r1.events).toEqual(r2.events);
  });
});
