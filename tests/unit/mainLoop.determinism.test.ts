import { test, expect } from 'vitest'

import { createStore } from '../../src/ui/state/store'
import { createUnit } from '../../src/core/models/Unit'
import { createTeam } from '../../src/core/models/Team'
import { createBattleState } from '../../src/core/models/BattleState'

// Ensures queue-based execution of a single round is deterministic given the same seed
test('queue-based main loop deterministic for same seed', () => {
  const seed = 424242

  const def: any = {
    id: 'u1',
    name: 'U1',
    element: 'Neutral',
    role: 'Balanced Warrior',
    baseStats: { hp: 10, pp: 0, atk: 2, def: 1, mag: 0, spd: 1 },
    growthRates: { hp: 1, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [],
    manaContribution: 1,
    description: '',
  }

  const unit = createUnit(def, 1)
  const enemy = createUnit({ ...def, id: 'e1', name: 'E1' }, 1)
  const team = createTeam([unit])

  const battle = createBattleState(team, [enemy]) as any
  battle.meta = { encounterId: 'det-test' }

  const s1 = createStore()
  const s2 = createStore()

  s1.getState().setBattle(battle, seed)
  s2.getState().setBattle(battle, seed)

  // Queue a basic attack (abilityId null) for the first unit targeting the enemy
  const queued1 = s1.getState().queueUnitAction(0, null, [enemy.id])
  const queued2 = s2.getState().queueUnitAction(0, null, [enemy.id])
  expect(queued1).toBe(true)
  expect(queued2).toBe(true)

  s1.getState().executeQueuedRound()
  s2.getState().executeQueuedRound()

  // Compare serialized battle states for exact equality
  expect(JSON.stringify(s1.getState().battle)).toEqual(JSON.stringify(s2.getState().battle))
})
