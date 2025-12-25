import { describe, it, expect } from 'vitest';
import { createBattleState } from '../../../src/core/models/BattleState';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import { executeRound, queueAction } from '../../../src/core/services/QueueBattleService';
import { makePRNG } from '../../../src/core/random/prng';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { enemyToUnit } from '../../../src/core/utils/enemyToUnit';
import { GARET_ENEMY } from '../../../src/data/definitions/enemies';

describe('Mana Persistence', () => {
  const rng = makePRNG(12345);
  const adeptDef = UNIT_DEFINITIONS['adept']!;
  const enemy = enemyToUnit(GARET_ENEMY);

  it('should persist unspent mana between rounds (Test Case 1)', () => {
    const playerUnit = createUnit(adeptDef, 1, 0);
    const team = createTeam([playerUnit]);
    const initialState = createBattleState(team, [enemy], []);
    
    // Ensure we have enough mana for the test (Adept usually has some)
    // We'll manually set maxMana and remainingMana for precise testing
    initialState.maxMana = 10;
    initialState.remainingMana = 10;

    // Queue actions totaling 4 mana (if we had a 4-mana ability)
    // Since we want to test specifically the transition, we can just manually adjust remainingMana 
    // to simulate mana being spent, then execute a round.
    // Or better, actually queue something that costs mana.
    
    // For simplicity in this unit test of the service, we can simulate the state after spending mana
    initialState.remainingMana = 6;
    
    // Execute a round where no player actions generate mana (e.g. they just wait or use items)
    // To keep it simple, we'll just execute a round with no actions queued.
    const result = executeRound(initialState, rng);
    
    // After one round, it should transition back to planning phase
    expect(result.state.phase).toBe('planning');
    expect(result.state.roundNumber).toBe(2);
    expect(result.state.remainingMana).toBe(6);
  });

  it('should preserve mana generated during execution (Test Case 2)', () => {
    const playerUnit = createUnit(adeptDef, 1, 0);
    const team = createTeam([playerUnit]);
    const initialState = createBattleState(team, [enemy], []);
    
    initialState.maxMana = 10;
    initialState.remainingMana = 0; // Start with 0 mana

    // Queue a basic attack which generates 1 mana
    const queued = queueAction(initialState, playerUnit.id, null, [enemy.id]);
    expect(queued.ok).toBe(true);
    
    const result = executeRound(queued.value, rng);
    
    expect(result.state.phase).toBe('planning');
    expect(result.state.roundNumber).toBe(2);
    // 0 + 1 generated = 1
    expect(result.state.remainingMana).toBe(1);
  });

  it('should clamp mana to maxMana when generating (Test Case 3)', () => {
    const playerUnit = createUnit(adeptDef, 1, 0);
    const team = createTeam([playerUnit]);
    const initialState = createBattleState(team, [enemy], []);
    
    initialState.maxMana = 10;
    initialState.remainingMana = 10; // Start with full mana

    // Queue a basic attack which would generate 1 mana
    const queued = queueAction(initialState, playerUnit.id, null, [enemy.id]);
    expect(queued.ok).toBe(true);
    
    const result = executeRound(queued.value, rng);
    
    expect(result.state.phase).toBe('planning');
    expect(result.state.roundNumber).toBe(2);
    // 10 + 1 generated = 11, but clamped to 10
    expect(result.state.remainingMana).toBe(10);
  });

  it('should start with full mana in round 1 (Test Case 4)', () => {
    const playerUnit = createUnit(adeptDef, 1, 0);
    const team = createTeam([playerUnit]);
    const state = createBattleState(team, [enemy], []);
    
    expect(state.roundNumber).toBe(1);
    expect(state.remainingMana).toBe(state.maxMana);
  });
});
