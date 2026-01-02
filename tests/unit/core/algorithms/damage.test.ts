import { describe, it, expect } from 'vitest';
import { 
  calculatePhysicalDamage, 
  calculatePsynergyDamage, 
  applyDamageModifiers
} from '../../../../src/core/algorithms/damage';
import { createUnit } from '../../../../src/core/models/Unit';
import { Element, UnitRole } from '../../../../src/core/models/types';
import type { Team } from '../../../../src/core/models/Team';
import type { Ability } from '../../../../src/data/schemas/AbilitySchema';

const mockUnitDef = {
  id: 'test-unit',
  name: 'Test Unit',
  element: 'Venus' as Element,
  role: 'Balanced Warrior' as UnitRole,
  baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 10, spd: 10 },
  growthRates: { hp: 10, pp: 2, atk: 1, def: 1, mag: 1, spd: 1 },
  abilities: [],
  manaContribution: 1,
  description: 'Test'
};

const mockTeam: Team = {
  equippedDjinn: [],
  djinnTrackers: {},
  units: [],
  collectedDjinn: [],
  currentTurn: 0,
  activationsThisTurn: {},
  djinnStates: {},
};

describe('Damage Algorithms', () => {
  describe('applyDamageModifiers', () => {
    it('should NOT apply any elemental resistance (Zero Resistance)', () => {
      const unit = createUnit(mockUnitDef);
      const baseDamage = 100;
      const modified = applyDamageModifiers(baseDamage, 'Venus', unit);
      
      // Should remain 100 because resistance is removed
      expect(modified).toBe(100);
    });

    it('should still apply damage reduction', () => {
      const unit = createUnit(mockUnitDef);
      unit.statusEffects = [
        { type: 'damageReduction', percent: 0.3, duration: 3 }
      ] as any;

      const baseDamage = 100;
      const modified = applyDamageModifiers(baseDamage, undefined, unit);
      
      // 100 * (1 - 0.3) = 70
      expect(modified).toBeCloseTo(70);
    });
  });

  describe('calculatePhysicalDamage', () => {
    it('should calculate base physical damage correctly', () => {
      const attacker = createUnit(mockUnitDef);
      const defender = createUnit(mockUnitDef);
      
      const ability: Ability = {
        id: 'strike',
        name: 'Strike',
        element: 'Neutral',
        type: 'Physical',
        basePower: 0,
        cost: 0,
        targetType: 'single',
        unlockLevel: 1
      } as any;

      // Attacker ATK = 10, Defender DEF = 10
      // Base damage = 10 + 10 - (10 * 0.5) = 15
      const damage = calculatePhysicalDamage(attacker, defender, mockTeam, ability);
      expect(damage).toBe(15);
    });
  });

  describe('calculatePsynergyDamage', () => {
    it('should calculate base psynergy damage correctly', () => {
      const attacker = createUnit(mockUnitDef);
      const defender = createUnit(mockUnitDef);
      defender.element = 'Venus'; 

      const ability: Ability = {
        id: 'quake',
        name: 'Quake',
        element: 'Venus',
        type: 'Psynergy',
        basePower: 40,
        cost: 0,
        targetType: 'single',
        unlockLevel: 1
      } as any;

      // Attacker MAG = 10, Defender DEF = 10
      // magicDefense = 10 * 0.3 = 3
      // elementModifier = 1.0 (Venus vs Venus)
      // rawDamage = (40 + 10 - 3) * 1.0 = 47
      const damage = calculatePsynergyDamage(attacker, defender, mockTeam, ability);
      expect(damage).toBe(47);
    });
  });
});
