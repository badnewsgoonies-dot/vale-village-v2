import { describe, expect, it } from 'vitest';
import { calculateTurnOrder } from '../../src/core/algorithms/turn-order';
import type { Unit } from '../../src/core/models/Unit';
import { createTeam, type Team } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import type { Equipment } from '../../src/core/models/Equipment';
import type { Stats } from '../../src/core/models/types';

function buildUnit(id: string, spd: number, opts: { hp?: number; hermes?: boolean; isPlayer?: boolean } = {}): Unit {
  const stats: Stats = {
    hp: opts.hp ?? 40,
    pp: 10,
    atk: 10,
    def: 10,
    mag: 10,
    spd,
  };

  const hermesBoots: Equipment | null = opts.hermes
    ? {
        id: 'hermes-sandals',
        name: 'Hermes Sandals',
        slot: 'boots',
        tier: 'legendary',
        cost: 0,
        allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'],
        statBonus: {},
        alwaysFirstTurn: true,
      }
    : null;

  return {
    id,
    name: id,
    element: opts.isPlayer ? 'Venus' : 'Mars',
    role: 'Balanced Warrior',
    baseStats: stats,
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    description: 'test',
    autoAttackTiming: 'same-turn',
    manaContribution: 0,
    level: 1,
    xp: 0,
    currentHp: stats.hp,
    equipment: {
      weapon: null,
      armor: null,
      helm: null,
      boots: hermesBoots,
      accessory: null,
    },
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    storeUnlocked: false,
    statusEffects: [],
    actionsTaken: 0,
    battleStats: {
      damageDealt: 0,
      damageTaken: 0,
    },
  };
}

function makeTeam(...units: Unit[]): Team {
  return createTeam(units);
}

describe('calculateTurnOrder', () => {
  it('prioritizes Hermes Sandals over higher SPD enemies', () => {
    const hermes = buildUnit('hermes', 5, { hermes: true, isPlayer: true });
    const fastEnemy = buildUnit('fast-enemy', 50, { isPlayer: false });
    const rng = makePRNG(1);
    const order = calculateTurnOrder([hermes, fastEnemy], makeTeam(hermes), rng);

    expect(order[0]).toBe('hermes');
  });

  it('tiebreaks identical SPD by favoring player units before enemies', () => {
    const player = buildUnit('player', 12, { isPlayer: true });
    const enemy = buildUnit('enemy', 12, { isPlayer: false });
    const rng = makePRNG(2);
    const order = calculateTurnOrder([player, enemy], makeTeam(player), rng);

    expect(order[0]).toBe('player');
    expect(order[1]).toBe('enemy');
  });

  it('omits KO\'d units from turn order', () => {
    const player = buildUnit('player', 10, { isPlayer: true });
    const enemyAlive = buildUnit('enemy-alive', 8, { isPlayer: false });
    const enemyKo = { ...buildUnit('enemy-ko', 20, { isPlayer: false }), currentHp: 0 };
    const rng = makePRNG(3);

    const order = calculateTurnOrder([player, enemyAlive, enemyKo], makeTeam(player), rng);

    expect(order).toEqual(['player', 'enemy-alive']);
    expect(order).not.toContain('enemy-ko');
  });

  it('is deterministic for the same seed and turn number', () => {
    const playerA = buildUnit('player-a', 15, { isPlayer: true });
    const playerB = buildUnit('player-b', 15, { isPlayer: true });
    const enemy = buildUnit('enemy', 15, { isPlayer: false });
    const units = [playerA, playerB, enemy];

    const rng1 = makePRNG(42);
    const rng2 = makePRNG(42);

    const order1 = calculateTurnOrder(units, makeTeam(playerA, playerB), rng1, 1);
    const order2 = calculateTurnOrder(units, makeTeam(playerA, playerB), rng2, 1);

    expect(order1).toEqual(order2);
  });
});
