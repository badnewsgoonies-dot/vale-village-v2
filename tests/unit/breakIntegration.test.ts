import { describe, it, expect } from 'vitest';
import { createEnemy, markEnemyBroken } from '../../src/core/models/Enemy';
import { reduceEnemyBreakOnHit } from '../../src/core/battleEngine';

describe('Break integration', () => {
  it('non-weak hit reduces gauge a small amount and does not break', () => {
    const e = createEnemy('e1', 'Goblin', 100, 100);
    const { enemy: e2, reduced, broken } = reduceEnemyBreakOnHit(e, 20, false);
    expect(broken).toBe(false);
    expect(typeof reduced).toBe('number');
    expect(e2.breakGauge?.current).toBeLessThanOrEqual(e.breakGauge!.max);
  });

  it('weakness hit can break and applies stun and damage multiplier', () => {
    const e = createEnemy('e2', 'Crab', 200, 50);
    // Hit with large damage and weakness to ensure break
    const { enemy: e2, broken } = reduceEnemyBreakOnHit(e, 200, true);
    expect(broken).toBe(true);
    expect(e2.breakGauge?.current).toBe(0);
    // Should have a stun status
    const hasStun = e2.statusEffects.some(s => s.type === 'stun');
    expect(hasStun).toBe(true);
    // Damage multiplier should be applied
    expect(e2.brokenDamageMultiplier).toBeGreaterThan(1);
  });
});
