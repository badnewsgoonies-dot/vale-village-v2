import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/ui/state/store';

describe('towerSlice', () => {
  it('has default towerRecord and setTowerRecord updates it', () => {
    const s = createStore();
    expect(s.towerRecord).toHaveProperty('highestFloorEver');
    s.setTowerRecord({ highestFloorEver: 5, totalRuns: 2, bestRunTurns: 10, bestRunDamageDealt: 100 });
    expect(s.towerRecord.highestFloorEver).toBe(5);
  });
});
