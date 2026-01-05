import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as AIService from '../../../src/core/services/AIService';
import * as UnitModel from '../../../src/core/models/Unit';
import * as Targeting from '../../../src/core/algorithms/targeting';
import * as Stats from '../../../src/core/algorithms/stats';
import * as Damage from '../../../src/core/algorithms/damage';

// Constants to avoid magic numbers in tests
const DEFAULT_RNG_NEXT = 0.5;

// Simple PRNG-like stub used by tests
type SimpleRng = { next: () => number };

let mockRng: SimpleRng;
let mockPlayer1: any;
let mockPlayer2: any;
let mockEnemy: any;
let mockState: any;

beforeEach(() => {
  // Basic deterministic RNG stub
  mockRng = { next: () => DEFAULT_RNG_NEXT };

  // Minimal player units
  mockPlayer1 = {
    id: 'player-1',
    currentHp: 100,
    level: 1,
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
    statusEffects: [],
    baseStats: { hp: 100, atk: 10, mag: 5, def: 5, pp: 0, spd: 0 },
    element: 'none',
    abilities: [],
  };

  mockPlayer2 = {
    id: 'player-2',
    currentHp: 50,
    level: 1,
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
    statusEffects: [],
    baseStats: { hp: 80, atk: 6, mag: 8, def: 3, pp: 0, spd: 0 },
    element: 'none',
    abilities: [],
  };

  // Enemy with multiple abilities for selection tests
  mockEnemy = {
    id: 'enemy-1',
    currentHp: 80,
    level: 1,
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
    statusEffects: [],
    baseStats: { hp: 80, atk: 8, mag: 3, def: 2, pp: 0, spd: 0 },
    element: 'none',
    abilities: [
      { id: 'strike', type: 'physical', basePower: 5, targets: 'single-enemy', aiHints: { priority: 1 } },
      { id: 'big-strike', type: 'physical', basePower: 8, targets: 'single-enemy', aiHints: { priority: 3 } },
      { id: 'random-hit', type: 'physical', basePower: 4, targets: 'single-enemy', aiHints: { target: 'random' } },
      { id: 'revive', type: 'healing', basePower: 0, targets: 'single-ally', revive: true },
      { id: 'aoe', type: 'physical', basePower: 4, targets: 'all-enemies' },
    ],
  };

  mockState = {
    playerTeam: { units: [mockPlayer1, mockPlayer2] },
    enemies: [mockEnemy],
    currentTurn: 0,
  };

  // Default mocks for external algorithms to keep tests deterministic
  vi.spyOn(Targeting, 'resolveTargets').mockImplementation((ability: any) => {
    // For AoE, return all players; otherwise return both for single-target tests
    if (ability.targets === 'all-enemies' || ability.targets === 'all-allies') {
      return [mockPlayer1, mockPlayer2];
    }
    return [mockPlayer1, mockPlayer2];
  });

  vi.spyOn(UnitModel, 'isUnitKO').mockImplementation((u: any) => {
    return u.currentHp <= 0;
  });

  vi.spyOn(UnitModel, 'calculateMaxHp').mockImplementation((u: any) => {
    // Use baseStats.hp when present, otherwise fallback
    return (u.baseStats && u.baseStats.hp) || 100;
  });

  vi.spyOn(Stats, 'calculateEffectiveStats').mockImplementation((unit: any) => {
    // Return base stats shaped object used by AIService
    return { atk: unit.baseStats.atk || 0, mag: unit.baseStats.mag || 0, def: unit.baseStats.def || 0 };
  });

  vi.spyOn(Damage, 'getElementModifier').mockImplementation(() => 1.0);
});

describe('AIService - targeting and scoring', () => {
  it('selectLowHPTarget returns unit with lowest HP percentage', () => {
    const u1 = { ...mockPlayer1, currentHp: 80, baseStats: { hp: 100 } };
    const u2 = { ...mockPlayer2, currentHp: 25, baseStats: { hp: 100 } };

    const chosen = AIService.selectLowHPTarget([u1, u2]);
    expect(chosen).not.toBeNull();
    expect(chosen!.id).toBe(u2.id);
  });

  it('makeAIDecision chooses ability with higher aiHints.priority', () => {
    const decision = AIService.makeAIDecision(mockState as any, mockEnemy.id, mockRng as any);
    expect(decision.abilityId).toBe('big-strike');
    expect(Array.isArray(decision.targetIds)).toBe(true);
    expect(decision.targetIds.length).toBeGreaterThan(0);
  });

  it('makeAIDecision respects random target hint via RNG', () => {
    // Force RNG to select second target
    const rng = { next: () => 0.99 };
    const dec = AIService.makeAIDecision(mockState as any, mockEnemy.id, rng as any);
    // Ability chosen might not be random-hit if scoring prefers others; pick the specific ability directly by restricting abilities
    const singleAbilityEnemy = { ...mockEnemy, abilities: [mockEnemy.abilities.find((a: any) => a.id === 'random-hit')] };
    const state = { ...mockState, enemies: [singleAbilityEnemy] };
    const dec2 = AIService.makeAIDecision(state as any, singleAbilityEnemy.id, rng as any);
    expect(dec2.abilityId).toBe('random-hit');
    // RNG=0.99 should pick index 1 (second player)
    expect(dec2.targetIds[0]).toBe(mockPlayer2.id);
  });

  it('revive ability prefers KO targets', () => {
    // Mark player1 as KO
    const p1 = { ...mockPlayer1, currentHp: 0 };
    const p2 = { ...mockPlayer2, currentHp: 30 };
    const singleReviver = { ...mockEnemy, abilities: [mockEnemy.abilities.find((a: any) => a.id === 'revive')] };
    const state = { playerTeam: { units: [p1, p2] }, enemies: [singleReviver] };

    // Ensure resolveTargets returns the KO instances for this test
    vi.spyOn(Targeting, 'resolveTargets').mockImplementation(() => [p1, p2]);

    const dec = AIService.makeAIDecision(state as any, singleReviver.id, mockRng as any);
    expect(dec.abilityId).toBe('revive');
    expect(dec.targetIds.length).toBe(1);
    expect(dec.targetIds[0]).toBe(p1.id);
  });

  it('throws when no available abilities (no valid targets)', () => {
    // Make resolveTargets return only KO targets and ability cannot revive
    vi.spyOn(Targeting, 'resolveTargets').mockImplementationOnce(() => []);
    const enemyNoTargets = { ...mockEnemy, abilities: [{ id: 'lonely', type: 'physical', basePower: 3, targets: 'single-enemy' }] };
    const state = { ...mockState, enemies: [enemyNoTargets] };
    expect(() => AIService.makeAIDecision(state as any, enemyNoTargets.id, mockRng as any)).toThrow(/No available abilities/);
  });

  it('throws for invalid or KO actor', () => {
    // Actor not found
    expect(() => AIService.makeAIDecision(mockState as any, 'no-such-unit', mockRng as any)).toThrow(/Invalid actor/);

    // Actor KO
    const koEnemy = { ...mockEnemy, currentHp: 0 };
    const state = { ...mockState, enemies: [koEnemy] };
    expect(() => AIService.makeAIDecision(state as any, koEnemy.id, mockRng as any)).toThrow(/Invalid actor/);
  });
});

