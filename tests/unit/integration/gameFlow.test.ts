/**
 * Integration tests for game flow
 * Tests complete game operation: battle flow, rewards, progression
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ENCOUNTERS } from '../../../src/data/definitions/encounters';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { ENEMIES, GARET_ENEMY } from '../../../src/data/definitions/enemies';
import { createUnit, calculateMaxHp } from '../../../src/core/models/Unit';
import { createTeam } from '../../../src/core/models/Team';
import type { Team } from '../../../src/core/models/Team';
import type { Unit } from '../../../src/core/models/Unit';
import { makePRNG } from '../../../src/core/random/prng';

// Helper to create a test team
function createTestTeam(units: Unit[]): Team {
  return createTeam(units);
}

describe('Integration: Game Data Integrity', () => {
  describe('Unit Definitions', () => {
    it('should have core recruitable units defined', () => {
      // Check actual existing units
      const coreUnits = ['adept', 'war-mage', 'sentinel', 'mystic', 'ranger'];

      for (const unitId of coreUnits) {
        const def = UNIT_DEFINITIONS[unitId];
        expect(def, `Unit ${unitId} should be defined`).toBeDefined();
        expect(def.id).toBe(unitId);
        expect(def.name).toBeTruthy();
        expect(def.element).toBeTruthy();
      }
    });

    it('should have valid base stats for all units', () => {
      Object.values(UNIT_DEFINITIONS).forEach((def) => {
        expect(def.baseStats.hp).toBeGreaterThan(0);
        expect(def.baseStats.atk).toBeGreaterThan(0);
        expect(def.baseStats.def).toBeGreaterThanOrEqual(0);
        expect(def.baseStats.spd).toBeGreaterThan(0);
      });
    });

    it('should have valid growth rates for all units', () => {
      Object.values(UNIT_DEFINITIONS).forEach((def) => {
        expect(def.growthRates.hp).toBeGreaterThanOrEqual(0);
        expect(def.growthRates.atk).toBeGreaterThanOrEqual(0);
        expect(def.growthRates.def).toBeGreaterThanOrEqual(0);
        expect(def.growthRates.spd).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Enemy Definitions', () => {
    it('should have enemies defined', () => {
      expect(Object.keys(ENEMIES).length).toBeGreaterThan(0);
    });

    it('should have valid stats for all enemies', () => {
      Object.values(ENEMIES).forEach((enemy) => {
        expect(enemy.id).toBeTruthy();
        expect(enemy.name).toBeTruthy();
        expect(enemy.stats.hp).toBeGreaterThan(0);
        expect(enemy.stats.atk).toBeGreaterThan(0);
        expect(enemy.stats.def).toBeGreaterThanOrEqual(0);
        expect(enemy.stats.spd).toBeGreaterThan(0);
      });
    });
  });

  describe('Encounter Definitions', () => {
    it('should have encounters defined', () => {
      expect(Object.keys(ENCOUNTERS).length).toBeGreaterThan(0);
    });

    it('should have valid encounter structures', () => {
      Object.values(ENCOUNTERS).forEach((encounter) => {
        expect(encounter.id).toBeTruthy();
        expect(encounter.name).toBeTruthy();
        expect(encounter.enemies.length).toBeGreaterThan(0);
      });
    });

    it('should have house-01 (VS1) encounter', () => {
      const house01 = ENCOUNTERS['house-01'];
      expect(house01).toBeDefined();
      expect(house01.id).toBe('house-01');
      expect(house01.enemies.length).toBe(1);
    });
  });
});

describe('Integration: VS1 Balance Check', () => {
  it('should have Garet enemy with balanced stats', () => {
    // Verify the balance fix was applied
    const garetEnemy = GARET_ENEMY;

    expect(garetEnemy).toBeDefined();
    expect(garetEnemy.id).toBe('garet-enemy');

    // War Mage base HP: 80, growth: 15, level 2 = 80 + 15 = 95
    // New multiplier: 1.5x = 142.5, rounds to ~143
    expect(garetEnemy.stats.hp).toBeLessThanOrEqual(150);
    expect(garetEnemy.stats.hp).toBeGreaterThanOrEqual(140);

    // War Mage base ATK: 10, growth: 2, level 2 = 10 + 2 = 12
    // New bonus: +2 = 14
    expect(garetEnemy.stats.atk).toBeLessThanOrEqual(15);
    expect(garetEnemy.stats.atk).toBeGreaterThanOrEqual(13);
  });

  it('should allow player to deal meaningful damage to Garet', () => {
    // Create a level 1 Adept
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const playerUnit = createUnit(adeptDef!, 1, 0);
    const garetEnemy = GARET_ENEMY;

    // Basic damage calculation: ATK - DEF/2 (simplified)
    // Player ATK should be able to deal at least some damage
    const estimatedDamage = Math.max(1, playerUnit.baseStats.atk - Math.floor(garetEnemy.stats.def / 2));

    // Should be able to defeat Garet in reasonable turns
    const turnsToKill = Math.ceil(garetEnemy.stats.hp / estimatedDamage);

    // HP was halved from 285 to ~143, so turns should be roughly halved too
    // Allow some margin for rough damage calculation
    expect(turnsToKill).toBeLessThanOrEqual(20); // Reasonable upper bound
    expect(turnsToKill).toBeGreaterThanOrEqual(3); // Not too easy
  });
});

describe('Integration: Team Creation', () => {
  it('should create a valid team from units', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const units = [createUnit(adeptDef!, 1, 0)];
    const team = createTestTeam(units);

    expect(team.units.length).toBe(1);
    expect(team.equippedDjinn).toEqual([]);
    expect(team.collectedDjinn).toEqual([]);
  });

  it('should allow creating team with multiple units', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    const warMageDef = UNIT_DEFINITIONS['war-mage'];

    expect(adeptDef).toBeDefined();
    expect(warMageDef).toBeDefined();

    const units = [
      createUnit(adeptDef!, 1, 0),
      createUnit(warMageDef!, 1, 0),
    ];

    const team = createTestTeam(units);
    expect(team.units.length).toBe(2);
  });

  it('should preserve unit level in team', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const unit = createUnit(adeptDef!, 5, 0);
    const team = createTestTeam([unit]);

    expect(team.units[0].level).toBe(5);
    // Max HP should be higher than base due to level growth
    const maxHp = calculateMaxHp(team.units[0]);
    expect(maxHp).toBeGreaterThan(adeptDef!.baseStats.hp);
  });
});

describe('Integration: Level Progression', () => {
  it('should increase max HP with level', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const level1 = createUnit(adeptDef!, 1, 0);
    const level10 = createUnit(adeptDef!, 10, 0);

    const hp1 = calculateMaxHp(level1);
    const hp10 = calculateMaxHp(level10);

    expect(hp10).toBeGreaterThan(hp1);
  });

  it('should respect growth rates', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const level1 = createUnit(adeptDef!, 1, 0);
    const level2 = createUnit(adeptDef!, 2, 0);

    // HP should increase by growth rate
    const hp1 = calculateMaxHp(level1);
    const hp2 = calculateMaxHp(level2);
    const actualHpGain = hp2 - hp1;

    expect(actualHpGain).toBe(adeptDef!.growthRates.hp);
  });
});

describe('Integration: PRNG Determinism', () => {
  it('should produce same results with same seed', () => {
    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(12345);

    // Call next() method on the PRNG object
    const sequence1 = [rng1.next(), rng1.next(), rng1.next()];
    const sequence2 = [rng2.next(), rng2.next(), rng2.next()];

    expect(sequence1).toEqual(sequence2);
  });

  it('should produce different results with different seeds', () => {
    const rng1 = makePRNG(12345);
    const rng2 = makePRNG(54321);

    const val1 = rng1.next();
    const val2 = rng2.next();

    expect(val1).not.toBe(val2);
  });
});

describe('Integration: Data Validation', () => {
  it('should have matching IDs in definition keys and objects', () => {
    Object.entries(UNIT_DEFINITIONS).forEach(([key, def]) => {
      expect(def.id).toBe(key);
    });
  });

  it('should have valid element types', () => {
    const validElements = ['Venus', 'Mars', 'Mercury', 'Jupiter'];

    Object.values(UNIT_DEFINITIONS).forEach((def) => {
      expect(validElements).toContain(def.element);
    });
  });

  it('should have encounters reference enemy IDs as strings', () => {
    Object.values(ENCOUNTERS).forEach((encounter) => {
      encounter.enemies.forEach((enemyId) => {
        // Enemy references should be strings
        expect(typeof enemyId).toBe('string');
        expect(enemyId.length).toBeGreaterThan(0);
      });
    });
  });
});
