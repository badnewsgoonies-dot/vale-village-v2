import { describe, it, expect } from 'vitest';
import { GameInitializationService } from '../../src/core/services/GameInitializationService';
import { UNIT_DEFINITIONS } from '../../src/data/definitions/units';

describe('GameInitializationService Smoke Test', () => {
  it('should create a valid starter team', () => {
    expect(UNIT_DEFINITIONS['adept']).toBeDefined();
    
    const team = GameInitializationService.createStarterTeamWithFlint();
    
    expect(team).toBeDefined();
    expect(team.units).toHaveLength(4);
    expect(team.units[0].name).toBe('Isaac');
    expect(team.units[1].name).toBe('Garet');
    expect(team.units[2].name).toBe('Ivan');
    expect(team.units[3].name).toBe('Mia');
    expect(team.collectedDjinn).toContain('flint');
  });
});
