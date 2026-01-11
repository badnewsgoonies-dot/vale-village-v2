import { expect, test } from 'vitest';

import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { createBattleState } from '../../src/core/models/BattleState';
import { createStoryState } from '../../src/core/models/story';
import { playReplay } from '../../src/core/save/ReplayService';

// Minimal unit definitions for testing
const unitDef = {
  id: 'u1',
  name: 'Hero',
  element: 'Neutral' as const,
  role: 'Balanced Warrior' as const,
  baseStats: { hp: 20, pp: 10, atk: 5, def: 2, mag: 1, spd: 5 },
  growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
  abilities: [] as any[],
  manaContribution: 1,
  description: 'Test hero',
};

const enemyDef = {
  id: 'e1',
  name: 'Slime',
  element: 'Neutral' as const,
  role: 'Balanced Warrior' as const,
  baseStats: { hp: 8, pp: 0, atk: 2, def: 1, mag: 0, spd: 3 },
  growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
  abilities: [] as any[],
  manaContribution: 0,
  description: 'Weak enemy',
};

function makeReplayTape(seed: number) {
  const playerUnit = createUnit(unitDef as any, 1);
  const enemyUnit = createUnit(enemyDef as any, 1);
  const team = createTeam([playerUnit]);
  const battle = createBattleState(team, [enemyUnit]);

  return {
    seed,
    initial: {
      battle,
      team,
      story: createStoryState(),
      gold: 0,
      unitsCollected: [],
    },
    inputs: [
      { type: 'status-tick', turn: 1, actorId: playerUnit.id },
      { type: 'end-turn', turn: 1, actorId: playerUnit.id },
    ],
    engineVersion: { major: 1, minor: 0 },
    dataVersion: { major: 1, minor: 0 },
  } as const;
}

test('playReplay is deterministic across runs with same seed', () => {
  const tape = makeReplayTape(42);
  const r1 = playReplay(tape as any);
  const r2 = playReplay(tape as any);

  expect(r1.success).toBe(true);
  expect(r1).toEqual(r2);
});

import { makePRNG, prngFromSnapshot } from '../../src/core/random/prng';
import { createRNGStream, RNG_STREAMS } from '../../src/core/constants';

test('PRNG snapshot and restore preserves sequence', () => {
  const seed = 12345;
  const turn = 1;
  const streamSeed = createRNGStream(seed, turn, RNG_STREAMS.ACTIONS);
  const prng = makePRNG(streamSeed);

  // Draw some values and capture a snapshot
  const firstDraw = prng.next();
  const secondDraw = prng.next();
  const snapshot = prng.snapshot();

  // Continue drawing on the original
  const contA = [prng.next(), prng.next(), prng.next()];

  // Restore from snapshot and ensure subsequent draws match
  const restored = prngFromSnapshot(snapshot as any);
  const contB = [restored.next(), restored.next(), restored.next()];

  expect(contB).toEqual(contA);
});
