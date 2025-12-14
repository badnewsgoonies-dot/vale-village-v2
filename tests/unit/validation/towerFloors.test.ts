import { describe, it, expect } from 'vitest';
import { TOWER_FLOORS } from '../../../src/data/definitions/towerFloors';
import { ENCOUNTERS } from '../../../src/data/definitions/encounters';

describe('Tower floors data', () => {
  it('uses unique ids and floor numbers', () => {
    const ids = TOWER_FLOORS.map((floor) => floor.id);
    expect(new Set(ids).size).toBe(ids.length);

    const floorNumbers = TOWER_FLOORS.map((floor) => floor.floorNumber);
    expect(new Set(floorNumbers).size).toBe(floorNumbers.length);
  });

  it('references valid encounter ids for battle floors', () => {
    for (const floor of TOWER_FLOORS) {
      if (floor.type === 'rest') {
        expect(floor.encounterId ?? null).toBeNull();
        continue;
      }

      expect(
        ENCOUNTERS[floor.encounterId],
        `Missing encounter id "${floor.encounterId}" (tower floor ${floor.floorNumber})`
      ).toBeDefined();
    }
  });
});

