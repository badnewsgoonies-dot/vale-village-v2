import { describe, it, expect, vi } from 'vitest';

// Mock the dependencies
vi.mock('../../src/core/models/BattleState', () => ({
  updateBattleState: (state: any, updates: any) => ({ ...state, ...updates }),
  createEmptyQueue: () => [],
}));

vi.mock('../../src/core/models/Team', () => ({
  updateTeam: (team: any, updates: any) => ({ ...team, ...updates }),
}));

vi.mock('../../src/core/algorithms/djinnAbilities', () => ({
  mergeDjinnAbilitiesIntoUnit: (unit: any) => unit,
}));

vi.mock('../../src/core/algorithms/stats', () => ({
  calculateEffectiveStats: (unit: any) => ({ hp: 100 }),
}));

// Import the service AFTER mocking
import { queueBattleServiceInternals } from '../../src/core/services/QueueBattleService';

describe('BUG-003: Mana Generation Wipe', () => {
  it('should NOT reset remainingMana to maxMana when transitioning to planning phase', () => {
    // Mock state with 6/10 mana (4 spent)
    const mockState: any = {
      roundNumber: 1,
      phase: 'executing',
      remainingMana: 6,
      maxMana: 10,
      playerTeam: {
        units: [{ id: 'u1', currentHp: 100 }],
        djinnTrackers: {},
        collectedDjinn: [],
      },
      djinnRecoveryTimers: {},
      queuedActions: [],
      queuedDjinn: [],
      executionIndex: 0,
    };
    
    // Call the function
    const nextState = queueBattleServiceInternals.transitionToPlanningPhase(mockState);
    
    // If bug exists, remainingMana would be 10 (via refreshMana call)
    // If fixed, it should be 6 (preserved).
    expect(nextState.remainingMana).toBe(6);
    expect(nextState.phase).toBe('planning');
    expect(nextState.roundNumber).toBe(2);
  });
});
