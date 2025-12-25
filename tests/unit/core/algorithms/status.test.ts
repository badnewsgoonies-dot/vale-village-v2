import { describe, it, expect } from 'vitest';
import { isImmuneToStatus, applyStatusToUnit, isNegativeStatus } from '../../../../src/core/algorithms/status';
import { createUnit } from '../../../../src/core/models/Unit';
import { Element, UnitRole } from '../../../../src/core/models/types';

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

describe('Status Algorithms', () => {
  describe('isNegativeStatus', () => {
    it('should identify negative statuses', () => {
      expect(isNegativeStatus({ type: 'poison' })).toBe(true);
      expect(isNegativeStatus({ type: 'burn' })).toBe(true);
      expect(isNegativeStatus({ type: 'freeze' })).toBe(true);
      expect(isNegativeStatus({ type: 'paralyze' })).toBe(true);
      expect(isNegativeStatus({ type: 'stun' })).toBe(true);
      expect(isNegativeStatus({ type: 'debuff', stat: 'atk', modifier: -0.2, duration: 3 })).toBe(true);
      // This might fail before fix as it's not implemented yet
      expect(isNegativeStatus({ type: 'elementalResistance', element: 'Mars', modifier: -0.2, duration: 3 })).toBe(true);
    });

    it('should identify positive statuses', () => {
      expect(isNegativeStatus({ type: 'buff', stat: 'atk', modifier: 0.2, duration: 3 })).toBe(false);
      expect(isNegativeStatus({ type: 'healOverTime', healPerTurn: 10, duration: 3 })).toBe(false);
      expect(isNegativeStatus({ type: 'elementalResistance', element: 'Mars', modifier: 0.2, duration: 3 })).toBe(false);
      expect(isNegativeStatus({ type: 'shield', remainingCharges: 3, duration: 3 })).toBe(false);
    });
  });

  describe('isImmuneToStatus with "all" immunity', () => {
    const unit = {
      ...createUnit(mockUnitDef),
      statusEffects: [{ type: 'immunity', all: true, duration: 5 }]
    } as any;

    it('should block negative statuses', () => {
      expect(isImmuneToStatus(unit, { type: 'poison' })).toBe(true);
      expect(isImmuneToStatus(unit, { type: 'debuff' })).toBe(true);
    });

    it('should NOT block positive statuses (BUG-012)', () => {
      const buffStatus = { type: 'buff', stat: 'atk', modifier: 0.2, duration: 3 };
      // This will FAIL with current implementation because it doesn't check if status is negative
      // and currently it expects a string so it might even just return true if we pass 'buff'
      expect(isImmuneToStatus(unit, 'buff' as any)).toBe(false);
    });

    it('should NOT block positive elemental resistance', () => {
      const resStatus = { type: 'elementalResistance', element: 'Mars', modifier: 0.2, duration: 3 };
      expect(isImmuneToStatus(unit, resStatus as any)).toBe(false);
    });
    
    it('should block negative elemental resistance (weakness)', () => {
      const weaknessStatus = { type: 'elementalResistance', element: 'Mars', modifier: -0.2, duration: 3 };
      expect(isImmuneToStatus(unit, weaknessStatus as any)).toBe(true);
    });
  });

  describe('applyStatusToUnit', () => {
    it('should apply buff even if unit has "all" immunity', () => {
      const unit = {
        ...createUnit(mockUnitDef),
        statusEffects: [{ type: 'immunity', all: true, duration: 5 }]
      } as any;
      
      const buffStatus = { type: 'buff', stat: 'atk', modifier: 0.2, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, buffStatus as any);
      
      expect(updatedUnit.statusEffects).toContainEqual(buffStatus);
      expect(updatedUnit.statusEffects.length).toBe(2);
    });

    it('should NOT apply poison if unit has "all" immunity', () => {
      const unit = {
        ...createUnit(mockUnitDef),
        statusEffects: [{ type: 'immunity', all: true, duration: 5 }]
      } as any;
      
      const poisonStatus = { type: 'poison', damagePerTurn: 10, duration: 3 };
      const updatedUnit = applyStatusToUnit(unit, poisonStatus as any);
      
      expect(updatedUnit.statusEffects).not.toContainEqual(poisonStatus);
      expect(updatedUnit.statusEffects.length).toBe(1);
    });
  });
});
