import { describe, it, expect } from 'vitest';
import { 
  calculatePhysicalDamage, 
  calculatePsynergyDamage, 
  calculateTotalEquipmentElementalResistance,
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
  describe('calculateTotalEquipmentElementalResistance', () => {
    it('should sum resistance from armor, helm, boots, and accessory', () => {
      const unit = createUnit(mockUnitDef);
      unit.equipment = {
        weapon: { id: 'w', name: 'W', slot: 'weapon', tier: 'basic', cost: 0, allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.1 },
        armor: { id: 'a', name: 'A', slot: 'armor', tier: 'basic', cost: 0, allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.2 },
        helm: { id: 'h', name: 'H', slot: 'helm', tier: 'basic', cost: 0, allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.05 },
        boots: { id: 'b', name: 'B', slot: 'boots', tier: 'basic', cost: 0, allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.05 },
        accessory: { id: 'acc', name: 'Acc', slot: 'accessory', tier: 'basic', cost: 0, allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.1 },
      };

      // 0.2 + 0.05 + 0.05 + 0.1 = 0.4
      // Weapon (0.1) should be ignored
      expect(calculateTotalEquipmentElementalResistance(unit)).toBeCloseTo(0.4);
    });

    it('should return 0 if no equipment has resistance', () => {
      const unit = createUnit(mockUnitDef);
      expect(calculateTotalEquipmentElementalResistance(unit)).toBe(0);
    });
  });

  describe('applyDamageModifiers', () => {
    it('should apply equipment resistance to elemental attacks', () => {
      const unit = createUnit(mockUnitDef);
      unit.equipment.armor = { 
        id: 'a', name: 'A', slot: 'armor', tier: 'basic', cost: 0, 
        allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.2 
      };

      const baseDamage = 100;
      const modified = applyDamageModifiers(baseDamage, 'Venus', unit);
      
      // 100 * (1 - 0.2) = 80
      expect(modified).toBeCloseTo(80);
    });

    it('should NOT apply equipment resistance to Neutral attacks', () => {
      const unit = createUnit(mockUnitDef);
      unit.equipment.armor = { 
        id: 'a', name: 'A', slot: 'armor', tier: 'basic', cost: 0, 
        allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.2 
      };

      const baseDamage = 100;
      const modified = applyDamageModifiers(baseDamage, 'Neutral', unit);
      
      expect(modified).toBe(100);
    });

    it('should sum status effect resistance and equipment resistance', () => {
      const unit = createUnit(mockUnitDef);
      unit.equipment.armor = { 
        id: 'a', name: 'A', slot: 'armor', tier: 'basic', cost: 0, 
        allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.2 
      };
      unit.statusEffects = [
        { type: 'elementalResistance', element: 'Venus', modifier: 0.15, duration: 3 }
      ];

      const baseDamage = 100;
      const modified = applyDamageModifiers(baseDamage, 'Venus', unit);
      
      // 100 * (1 - (0.2 + 0.15)) = 100 * 0.65 = 65
      expect(modified).toBeCloseTo(65);
    });
  });

  describe('calculatePhysicalDamage with element', () => {
    it('should reduce physical damage if ability has an element and defender has resistance', () => {
      const attacker = createUnit(mockUnitDef);
      const defender = createUnit(mockUnitDef);
      defender.equipment.armor = { 
        id: 'a', name: 'A', slot: 'armor', tier: 'basic', cost: 0, 
        allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.5 
      };

      const ability: Ability = {
        id: 'gaia',
        name: 'Gaia',
        element: 'Venus',
        type: 'Physical',
        basePower: 50,
        cost: 0,
        targetType: 'single',
        unlockLevel: 1
      };

      // Attacker ATK = 10, Defender DEF = 10
      // Base damage = 50 + 10 - (10 * 0.5) = 55
      // Resistance = 0.5
      // Final damage = 55 * (1 - 0.5) = 27.5 -> 27
      const damage = calculatePhysicalDamage(attacker, defender, mockTeam, ability);
      expect(damage).toBe(27);
    });
  });

  describe('calculatePsynergyDamage', () => {
    it('should use total equipment resistance', () => {
      const attacker = createUnit(mockUnitDef);
      const defender = createUnit(mockUnitDef);
      defender.element = 'Venus'; // Same as ability to avoid element modifier
      defender.equipment.helm = { 
        id: 'h', name: 'H', slot: 'helm', tier: 'basic', cost: 0, 
        allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.2 
      };
      defender.equipment.boots = { 
        id: 'b', name: 'B', slot: 'boots', tier: 'basic', cost: 0, 
        allowedElements: ['Venus'], statBonus: {}, elementalResist: 0.1 
      };

      const ability: Ability = {
        id: 'quake',
        name: 'Quake',
        element: 'Venus',
        type: 'Psynergy',
        basePower: 40,
        cost: 0,
        targetType: 'single',
        unlockLevel: 1
      };

      // Attacker MAG = 10, Defender DEF = 10
      // effectiveDefense = 10
      // magicDefense = 10 * 0.3 = 3 (BATTLE_CONSTANTS.PSYNERGY_DEFENSE_MULTIPLIER is 0.3)
      // elementModifier = 1.0 (Venus vs Venus)
      // rawDamage = (40 + 10 - 3) * 1.0 = 47
      // Total Resist = 0.2 + 0.1 = 0.3
      // Final damage = 47 * (1 - 0.3) = 32.9 -> 32
      const damage = calculatePsynergyDamage(attacker, defender, mockTeam, ability);
      expect(damage).toBe(32);
    });
  });
});
