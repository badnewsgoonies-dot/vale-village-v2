import { describe, it, expect } from 'vitest';
import { isNegativeStatus, isImmuneToStatus } from '../../../../src/core/algorithms/status';
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
    it('should identify poison and burn as negative', () => {
      expect(isNegativeStatus({ type: 'poison' } as any)).toBe(true);
      expect(isNegativeStatus({ type: 'burn' } as any)).toBe(true);
    });

    it('should identify debuffs as negative', () => {
      expect(isNegativeStatus({ type: 'debuff' } as any)).toBe(true);
    });

    it('should identify buffs and healOverTime as positive', () => {
      expect(isNegativeStatus({ type: 'buff' } as any)).toBe(false);
      expect(isNegativeStatus({ type: 'healOverTime' } as any)).toBe(false);
    });
  });

  describe('isImmuneToStatus', () => {
    it('should return true if unit has immunity to that type', () => {
      const unit = createUnit(mockUnitDef);
      unit.statusEffects = [
        { type: 'immunity', all: false, types: ['poison'], duration: 3 }
      ] as any;
      
      expect(isImmuneToStatus(unit, { type: 'poison' } as any)).toBe(true);
      expect(isImmuneToStatus(unit, { type: 'burn' } as any)).toBe(false);
    });
  });
});
