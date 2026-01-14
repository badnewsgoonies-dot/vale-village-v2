
import { applyBreakDamage, isWeakness } from './weakness';
import { createUnit, Unit } from '../models/Unit';

describe('Weakness & Break System', () => {
  const baseUnit = createUnit({
    id: 'test-enemy',
    name: 'Goblin',
    element: 'Mars', // Fire
    role: 'Balanced Warrior',
    baseStats: { hp: 100, pp: 10, atk: 10, def: 10, mag: 10, spd: 10 },
    growthRates: { hp: 1, pp: 1, atk: 1, def: 1, mag: 1, spd: 1 },
    abilities: [],
    manaContribution: 1,
    description: 'A test goblin'
  });

  // Override defaults to ensure clean state
  const target: Unit = {
    ...baseUnit,
    breakGauge: 100,
    breakThreshold: 100,
    isBroken: false
  };

  test('isWeakness identifies opposites', () => {
    expect(isWeakness('Mercury', 'Mars')).toBe(true); // Water beats Fire
    expect(isWeakness('Mars', 'Mercury')).toBe(true); // Fire beats Water? (Golden Sun logic is usually mutual weakness or resistance, simplistic here)
    
    // In our implementation: Mars <> Mercury are weak to each other
    expect(isWeakness('Venus', 'Jupiter')).toBe(true);
    expect(isWeakness('Venus', 'Mars')).toBe(false);
  });

  test('applyBreakDamage reduces gauge on normal hit', () => {
    const res = applyBreakDamage(target, 'Venus'); // Earth vs Fire (Neutral)
    expect(res.unit.breakGauge).toBe(90); // 100 - 10
    expect(res.broke).toBe(false);
    expect(res.damageMultiplier).toBe(1.0);
  });

  test('applyBreakDamage reduces gauge more on weakness', () => {
    const res = applyBreakDamage(target, 'Mercury'); // Water vs Fire (Weakness)
    expect(res.unit.breakGauge).toBe(75); // 100 - 25
    expect(res.broke).toBe(false);
  });

  test('applyBreakDamage triggers break at 0', () => {
    const nearBreak = { ...target, breakGauge: 10 };
    const res = applyBreakDamage(nearBreak, 'Venus');
    
    expect(res.unit.breakGauge).toBe(0);
    expect(res.unit.isBroken).toBe(true);
    expect(res.broke).toBe(true);
    expect(res.damageMultiplier).toBe(1.5);
  });

  test('applyBreakDamage returns multiplier if already broken', () => {
    const brokenUnit = { ...target, isBroken: true, breakGauge: 0 };
    const res = applyBreakDamage(brokenUnit, 'Venus');
    
    expect(res.unit.isBroken).toBe(true);
    expect(res.damageMultiplier).toBe(1.5);
    expect(res.broke).toBe(false); // Already broken
  });
});
