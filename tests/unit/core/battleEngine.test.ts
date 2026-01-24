import { describe, it, expect } from 'vitest';
import { createEnemy } from '../../../src/core/models/Enemy';
import { reduceEnemyBreakOnHit } from '../../../src/core/battleEngine';

describe('battleEngine.reduceEnemyBreakOnHit', () => {
  it('reduces break gauge by computed amount and does not break when not depleted', () => {
    const enemy = createEnemy('e1','Goblin',100, 100);
    const res = reduceEnemyBreakOnHit(enemy, 50, true); // weakness: reduction = floor(50*0.5)=25
    expect(res.reduced).toBe(25);
    expect(res.broken).toBe(false);
    expect(res.enemy.breakGauge?.current).toBe(75);
  });

  it('marks enemy broken when gauge reaches zero', () => {
    const enemy = createEnemy('e2','Slime',30, 30);
    const res = reduceEnemyBreakOnHit(enemy, 100, true); // reduction=50 -> breaks for gauge max 30
    expect(res.broken).toBe(true);
    expect(res.enemy.statusEffects.some(s => s.type === 'stun')).toBe(true);
    expect(res.enemy.breakGauge?.current).toBe(0);
  });
});
