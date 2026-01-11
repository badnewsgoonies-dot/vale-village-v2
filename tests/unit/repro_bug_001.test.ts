import { describe, it, expect } from 'vitest';
import { createUnit, calculateMaxHp } from '../../src/core/models/Unit';

describe('BUG-001: HP Clamping Inconsistency', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: { hp: 100, pp: 20, atk: 20, def: 10, mag: 20, spd: 10 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should include equipment HP bonuses in calculateMaxHp', () => {
    const unit = createUnit(mockUnitDef, 1);
    
    // Add equipment with HP bonus
    const hpArmor: any = {
      id: 'hp-armor',
      name: 'HP Armor',
      slot: 'armor',
      statBonus: { hp: 50 }
    };
    
    unit.equipment.armor = hpArmor;
    
    // IF THE BUG EXISTS, calculateMaxHp will return 100
    // IF THE BUG IS FIXED, it will return 150
    expect(calculateMaxHp(unit)).toBe(150);
  });

  it('should include status HP bonuses in calculateMaxHp', () => {
    const unit = createUnit(mockUnitDef, 1);
    
    // Add status effect with HP bonus
    unit.statusEffects = [{
      type: 'buff',
      stat: 'hp',
      modifier: 30,
      duration: 3
    }];
    
    // IF THE BUG EXISTS, calculateMaxHp will return 100
    // IF THE BUG IS FIXED, it will return 130
    expect(calculateMaxHp(unit)).toBe(130);
  });
});
