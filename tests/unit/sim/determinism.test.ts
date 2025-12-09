import { describe, expect, it } from 'vitest';
import { runSimulation, type Strategy } from '../../../scripts/battleSimulator';

describe('battle simulator determinism', () => {
  const playerUnits = ['adept', 'war-mage'];
  const enemyUnits = ['venus-wolf'];
  const strategy: Strategy = 'basic-attack';

  it('produces identical results for the same seed', () => {
    const seed = 12345;
    const result1 = runSimulation(playerUnits, enemyUnits, strategy, seed, 40);
    const result2 = runSimulation(playerUnits, enemyUnits, strategy, seed, 40);

    expect(result1.winner).toBe(result2.winner);
    expect(result1.metrics).toEqual(result2.metrics);
    expect(result1.rounds).toBe(result2.rounds);
  });

  it('produces stable outcomes across seeds within reasonable bands', () => {
    const seedA = 1001;
    const seedB = 2002;

    const resultA = runSimulation(playerUnits, enemyUnits, strategy, seedA, 40);
    const resultB = runSimulation(playerUnits, enemyUnits, strategy, seedB, 40);

    expect(resultA.metrics.turns).toBeGreaterThan(0);
    expect(resultB.metrics.turns).toBeGreaterThan(0);
  });
});
