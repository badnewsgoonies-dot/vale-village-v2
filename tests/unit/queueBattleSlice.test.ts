import { describe, it, expect } from 'vitest'

import { createStore } from '../../src/ui/state/store'
import { createUnit } from '../../src/core/models/Unit'
import { createTeam } from '../../src/core/models/Team'
import { createBattleState } from '../../src/core/models/BattleState'

describe('QueueBattleSlice - queuedActions reset behavior', () => {
  it('initializes queuedActions to empty queue when battle set', () => {
    const store = createStore()

    const def = {
      id: 'u1',
      name: 'Test',
      element: 'Neutral',
      role: 'Balanced Warrior',
      baseStats: { hp: 10, pp: 5, atk: 1, def: 1, mag: 1, spd: 1 },
      growthRates: { hp: 1, pp: 1, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: 'dummy',
    } as const

    const unit = createUnit(def as any, 1)
    const team = createTeam([unit])
    const battle = createBattleState(team, [])

    // Set the battle into the slice
    store.getState().setBattle(battle, 12345)

    const state = store.getState()
    expect(state.battle).not.toBeNull()
    expect(state.battle!.queuedActions.length).toBe(team.units.length)
    expect(state.battle!.queuedActions.every((a) => a === null)).toBe(true)
  })

  it('resets queuedActions when encounter changes', () => {
    const store = createStore()

    const def = {
      id: 'u1',
      name: 'Test',
      element: 'Neutral',
      role: 'Balanced Warrior',
      baseStats: { hp: 10, pp: 5, atk: 1, def: 1, mag: 1, spd: 1 },
      growthRates: { hp: 1, pp: 1, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: 'dummy',
    } as const

    const unit = createUnit(def as any, 1)
    const team = createTeam([unit])
    const oldBattle = createBattleState(team, [])
    // simulate an old battle with a queued action
    const queuedAction = { unitId: unit.id, abilityId: null, targetIds: [], manaCost: 0 }
    const leakedBattle = { ...oldBattle, queuedActions: [queuedAction] }

    // Seed the store with the leaked battle
    // @ts-expect-error setState exists on store
    store.setState({ battle: leakedBattle })

    // Now set a new battle with a different encounter id -> should reset queue
    const newBattle = createBattleState(team, [])
    newBattle.meta = { encounterId: 'enc-1' }

    store.getState().setBattle(newBattle, 999)

    const state = store.getState()
    expect(state.battle).not.toBeNull()
    expect(state.battle!.queuedActions.length).toBe(team.units.length)
    expect(state.battle!.queuedActions.every((a) => a === null)).toBe(true)
  })
})
