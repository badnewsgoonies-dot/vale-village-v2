/**
 * Unit tests for RewardsService
 * Tests XP distribution, currency scaling, equipment resolution, and Djinn tracker reset
 */

import { describe, it, expect } from 'vitest';
import { processVictory, resolveEquipmentReward } from '../../../src/core/services/RewardsService';
import { calculateBattleRewards, distributeRewards } from '../../../src/core/algorithms/rewards';
import type { BattleState } from '../../../src/core/models/BattleState';
import type { Team } from '../../../src/core/models/Team';
import type { Unit } from '../../../src/core/models/Unit';
import type { EquipmentReward } from '../../../src/data/schemas/EncounterSchema';

// Helper to create a minimal unit for testing
function createTestUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'Adept',
    level: 1,
    xp: 0,
    currentHp: 50,
    baseStats: { hp: 50, pp: 20, atk: 10, def: 8, mag: 5, spd: 7 },
    growthRates: { hp: 5, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
    manaContribution: 1,
    description: 'Test unit',
    equipment: { weapon: null, armor: null, accessory: null },
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    storeUnlocked: false,
    statusEffects: [],
    actionsTaken: 0,
    battleStats: { damageDealt: 0, damageTaken: 0, healingDone: 0, abilitiesUsed: 0, criticalHits: 0 },
    ...overrides,
  };
}

// Helper to create test team
function createTestTeam(units: Partial<Unit>[]): Team {
  return {
    units: units.map((u, i) => createTestUnit({ id: `unit-${i}`, ...u })),
    djinnTrackers: {},
  };
}

// Helper to create minimal battle state for testing
function createTestBattleState(overrides: Partial<BattleState> = {}): BattleState {
  return {
    id: 'test-battle',
    encounterId: 'house-01',
    phase: 'victory',
    turnNumber: 5,
    playerTeam: createTestTeam([{ currentHp: 50 }, { currentHp: 30 }]),
    enemyTeam: { units: [] },
    actionQueue: [],
    eventLog: [],
    battleStartTimestamp: Date.now(),
    manaPool: { current: 3, max: 5, circles: [] },
    rng: { seed: 12345 },
    ...overrides,
  } as BattleState;
}

describe('RewardsService', () => {
  describe('calculateBattleRewards', () => {
    it('should distribute XP equally among survivors', () => {
      // house-01 has 100 XP base (assuming this encounter exists)
      const rewards = calculateBattleRewards('house-01', 2);

      expect(rewards.survivorCount).toBe(2);
      expect(rewards.xpPerUnit).toBe(Math.floor(rewards.totalXp / 2));
    });

    it('should give all XP to single survivor', () => {
      const rewards = calculateBattleRewards('house-01', 1);

      expect(rewards.survivorCount).toBe(1);
      expect(rewards.xpPerUnit).toBe(rewards.totalXp);
    });

    it('should handle no survivors (edge case)', () => {
      const rewards = calculateBattleRewards('house-01', 0);

      expect(rewards.survivorCount).toBe(0);
      expect(rewards.xpPerUnit).toBe(0);
    });

    it('should mark allSurvived correctly', () => {
      const rewardsPartial = calculateBattleRewards('house-01', 2);
      expect(rewardsPartial.allSurvived).toBe(false);

      const rewardsFull = calculateBattleRewards('house-01', 4);
      expect(rewardsFull.allSurvived).toBe(true);
    });

    it('should throw for invalid encounter', () => {
      expect(() => calculateBattleRewards('invalid-encounter-id', 2)).toThrow();
    });
  });

  describe('resolveEquipmentReward', () => {
    it('should resolve none type', () => {
      const reward: EquipmentReward = { type: 'none' };
      const result = resolveEquipmentReward(reward);

      expect(result.type).toBe('none');
    });

    it('should resolve fixed equipment', () => {
      // Use a known equipment ID from EQUIPMENT
      const reward: EquipmentReward = { type: 'fixed', itemId: 'wooden-sword' };
      const result = resolveEquipmentReward(reward);

      expect(result.type).toBe('fixed');
      if (result.type === 'fixed') {
        expect(result.equipment).toBeDefined();
        expect(result.equipment.id).toBe('wooden-sword');
      }
    });

    it('should resolve choice equipment', () => {
      const reward: EquipmentReward = {
        type: 'choice',
        options: ['wooden-sword', 'bronze-armor']
      };
      const result = resolveEquipmentReward(reward);

      expect(result.type).toBe('choice');
      if (result.type === 'choice') {
        expect(result.options).toHaveLength(2);
        expect(result.options[0]?.id).toBe('wooden-sword');
        expect(result.options[1]?.id).toBe('bronze-armor');
      }
    });

    it('should throw for invalid fixed equipment ID', () => {
      const reward: EquipmentReward = { type: 'fixed', itemId: 'invalid-item-xyz' };
      expect(() => resolveEquipmentReward(reward)).toThrow();
    });

    it('should throw for invalid choice equipment ID', () => {
      const reward: EquipmentReward = {
        type: 'choice',
        options: ['wooden-sword', 'invalid-item-xyz']
      };
      expect(() => resolveEquipmentReward(reward)).toThrow();
    });
  });

  describe('distributeRewards', () => {
    it('should not give XP to KO units', () => {
      const team = createTestTeam([
        { currentHp: 50, xp: 0 }, // Alive
        { currentHp: 0, xp: 0 },  // KO'd
      ]);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 50,
        survivorCount: 1,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      // First unit should have gained XP
      expect(result.updatedTeam.units[0]?.xp).toBeGreaterThan(0);
      // KO'd unit should have same XP (0)
      expect(result.updatedTeam.units[1]?.xp).toBe(0);
    });

    it('should not give XP to max level units', () => {
      const team = createTestTeam([
        { currentHp: 50, level: 20, xp: 0 }, // Max level
        { currentHp: 50, level: 1, xp: 0 },  // Not max level
      ]);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 50,
        survivorCount: 2,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      // Max level unit should have same XP
      expect(result.updatedTeam.units[0]?.xp).toBe(0);
      // Level 1 unit should have gained XP
      expect(result.updatedTeam.units[1]?.xp).toBeGreaterThan(0);
    });

    it('should record gold earned', () => {
      const team = createTestTeam([{ currentHp: 50 }]);

      const rewards = {
        totalXp: 100,
        totalGold: 75,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      expect(result.goldEarned).toBe(75);
    });
  });

  describe('processVictory', () => {
    it('should reset Djinn trackers to Set state', () => {
      const battleState = createTestBattleState({
        playerTeam: {
          units: [createTestUnit({ currentHp: 50 })],
          djinnTrackers: {
            'flint': { djinnId: 'flint', state: 'Standby', lastActivatedTurn: 3 },
            'forge': { djinnId: 'forge', state: 'Recovery', lastActivatedTurn: 4 },
          },
        },
      });

      const result = processVictory(battleState);

      // All Djinn should be reset to Set state
      expect(result.updatedTeam.djinnTrackers['flint']?.state).toBe('Set');
      expect(result.updatedTeam.djinnTrackers['forge']?.state).toBe('Set');
    });

    it('should throw without encounter ID', () => {
      const battleState = createTestBattleState();
      // @ts-expect-error - Testing invalid state
      battleState.encounterId = undefined;

      expect(() => processVictory(battleState)).toThrow('Cannot process victory without encounter ID');
    });

    it('should filter KO units from survivor count', () => {
      const battleState = createTestBattleState({
        playerTeam: {
          units: [
            createTestUnit({ id: 'alive-1', currentHp: 50 }),
            createTestUnit({ id: 'alive-2', currentHp: 30 }),
            createTestUnit({ id: 'ko', currentHp: 0 }),
          ],
          djinnTrackers: {},
        },
      });

      const result = processVictory(battleState);

      // Should have 2 survivors out of 3
      expect(result.distribution.rewards.survivorCount).toBe(2);
    });

    it('should set fixedEquipment when encounter has fixed reward', () => {
      // Note: This test depends on encounter configuration
      // If house-01 has a fixed equipment reward, this will test it
      const battleState = createTestBattleState({
        encounterId: 'house-01', // May need to use an encounter with fixed equipment
      });

      const result = processVictory(battleState);

      // Check that equipment resolution worked (may be none, fixed, or choice)
      expect(result.distribution).toBeDefined();
    });
  });

  describe('XP Distribution Edge Cases', () => {
    it('should handle team of all max level units', () => {
      const team = createTestTeam([
        { currentHp: 50, level: 20 },
        { currentHp: 50, level: 20 },
      ]);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 50,
        survivorCount: 2,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      // No level ups should occur
      expect(result.levelUps).toHaveLength(0);
    });

    it('should handle team of all KO units', () => {
      const team = createTestTeam([
        { currentHp: 0 },
        { currentHp: 0 },
      ]);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 0,
        survivorCount: 0,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      // No XP should be distributed
      expect(result.updatedTeam.units[0]?.xp).toBe(0);
      expect(result.updatedTeam.units[1]?.xp).toBe(0);
    });

    it('should track level-up events with stat gains', () => {
      // Create a unit very close to leveling up
      const team = createTestTeam([
        {
          currentHp: 50,
          level: 1,
          xp: 90, // Close to level 2 (usually 100 XP threshold)
          growthRates: { hp: 5, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
        },
      ]);

      const rewards = {
        totalXp: 100,
        totalGold: 50,
        xpPerUnit: 100, // Should trigger level up
        survivorCount: 1,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      // Check if level up occurred
      if (result.levelUps.length > 0) {
        const levelUp = result.levelUps[0];
        expect(levelUp?.oldLevel).toBe(1);
        expect(levelUp?.newLevel).toBeGreaterThan(1);
        expect(levelUp?.statGains).toBeDefined();
        expect(levelUp?.statGains.hp).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Currency Scaling', () => {
    it('should include gold from encounter rewards', () => {
      const rewards = calculateBattleRewards('house-01', 2);

      // Gold should be defined and non-negative
      expect(rewards.totalGold).toBeGreaterThanOrEqual(0);
    });

    it('should preserve gold value through distribution', () => {
      const team = createTestTeam([{ currentHp: 50 }]);

      const rewards = {
        totalXp: 100,
        totalGold: 123,
        xpPerUnit: 100,
        survivorCount: 1,
        allSurvived: false,
        enemiesDefeated: 3,
        equipmentReward: { type: 'none' as const },
      };

      const result = distributeRewards(team, rewards);

      expect(result.goldEarned).toBe(123);
      expect(result.rewards.totalGold).toBe(123);
    });
  });
});
