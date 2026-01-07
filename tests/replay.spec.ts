import { expect, test } from 'vitest';
import { playReplay } from '@/core/save/ReplayService';
import { createUnit, updateUnit } from '@/core/models/Unit';
import { createTeam } from '@/core/models/Team';
import { createBattleState } from '@/core/models/BattleState';
import { createStoryState } from '@/core/models/story';

// Minimal unit definition to satisfy createUnit
const unitDef = {
  id: 'u1',
  name: 'TestUnit',
  element: 'Neutral' as const,
  role: 'Balanced Warrior' as const,
  baseStats: { hp: 100, pp: 0, atk: 10, def: 5, mag: 0, spd: 5 },
  growthRates: { hp: 10, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
  abilities: [],
  manaContribution: 0,
  description: '',
};

function makeReplayTapeWithFreeze(seed: number) {
  const unit = createUnit(unitDef, 1);
  const unitWithStatus = updateUnit(unit, { statusEffects: [{ type: 'freeze', duration: 1 }] });
  const team = createTeam([unitWithStatus]);
  const battle = createBattleState(team, []);

  const snapshot = {
    battle,
    team,
    story: createStoryState(1),
    gold: 0,
    unitsCollected: [],
  };

  const tick = {
    type: 'status-tick',
    turn: 1,
    actorId: unitWithStatus.id,
  };

  return {
    seed,
    initial: snapshot,
    inputs: [tick],
    engineVersion: { major: 1, minor: 0 },
    dataVersion: { major: 1, minor: 0 },
  } as const;
}

test('replay is deterministic for same seed', () => {
  const tape = makeReplayTapeWithFreeze(42);
  const first = playReplay(tape);
  const second = playReplay(tape);
  expect(first.success).toBe(true);
  expect(second.success).toBe(true);
  expect(first.events).toEqual(second.events);
  expect(first.finalState?.playerTeam.units[0].currentHp).toEqual(second.finalState?.playerTeam.units[0].currentHp);
});

test('different seeds produce different outcomes for freeze break', () => {
  const tapeA = makeReplayTapeWithFreeze(42);
  const tapeB = makeReplayTapeWithFreeze(43);
  const a = playReplay(tapeA);
  const b = playReplay(tapeB);
  expect(a.success).toBe(true);
  expect(b.success).toBe(true);
  // It's possible in rare cases both seeds yield same result, but likelihood is negligible; assert difference
  expect(a.finalState?.playerTeam.units[0].currentHp === b.finalState?.playerTeam.units[0].currentHp).toBe(false);
});