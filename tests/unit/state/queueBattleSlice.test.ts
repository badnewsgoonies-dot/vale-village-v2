import { describe, it, expect } from 'vitest'

import { createStore } from '../../../src/ui/state/store'
import { createUnit } from '../../../src/core/models/Unit'
import { createTeam } from '../../../src/core/models/Team'
import { createBattleState } from '../../../src/core/models/BattleState'

describe('QueueBattleSlice', () => {
  it('resets queuedActions when encounter changes', () => {
    const store = createStore();

    // Minimal unit definition for tests
    const def: any = {
      id: 'u1',
      name: 'U1',
      element: 'Neutral',
      role: 'Balanced Warrior',
      baseStats: { hp: 10, pp: 0, atk: 1, def: 1, mag: 1, spd: 1 },
      growthRates: { hp: 1, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: '',
    }

    const unit = createUnit(def, 1)
    const enemy = createUnit({ ...def, id: 'e1', name: 'E1' }, 1)

    const playerTeam = createTeam([unit])

    // previous battle with a queued action (simulating leakage)
    const prevBattle = createBattleState(playerTeam, [enemy]) as any
    prevBattle.meta = { encounterId: 'enc-A' }
    prevBattle.queuedActions = [{ unitId: unit.id, abilityId: 'a1', targetIds: [enemy.id], manaCost: 1 }]

    // Inject previous battle into store
    store.setState({ battle: prevBattle })

    // new battle with different encounter id and roundNumber != 1 (old logic would not clear)
    const newBattle = createBattleState(playerTeam, [enemy]) as any
    newBattle.meta = { encounterId: 'enc-B' }
    newBattle.roundNumber = 2
    newBattle.currentTurn = 0

    // Call setBattle which should detect encounter change and reset queuedActions
    store.getState().setBattle(newBattle, 42)

    const state = store.getState()
    expect(state.battle).toBeDefined()
    expect(state.battle?.queuedActions.every((a: any) => a === null)).toBe(true)
  })
})
