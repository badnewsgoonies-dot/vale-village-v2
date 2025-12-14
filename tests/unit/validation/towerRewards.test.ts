import { describe, it, expect } from 'vitest';
import { TOWER_REWARDS } from '../../../src/data/definitions/towerRewards';
import { EQUIPMENT } from '../../../src/data/definitions/equipment';
import { DJINN } from '../../../src/data/definitions/djinn';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';

describe('Tower rewards data', () => {
  it('uses unique floor numbers', () => {
    const floors = TOWER_REWARDS.map((entry) => entry.floorNumber);
    const unique = new Set(floors);
    expect(unique.size).toBe(floors.length);
  });

  it('references valid content IDs', () => {
    for (const milestone of TOWER_REWARDS) {
      for (const reward of milestone.rewards) {
        for (const id of reward.ids) {
          switch (reward.type) {
            case 'equipment':
              expect(EQUIPMENT[id], `Missing equipment id "${id}" (floor ${milestone.floorNumber})`).toBeDefined();
              break;
            case 'djinn':
              expect(DJINN[id], `Missing djinn id "${id}" (floor ${milestone.floorNumber})`).toBeDefined();
              break;
            case 'recruit':
              expect(UNIT_DEFINITIONS[id], `Missing unit id "${id}" (floor ${milestone.floorNumber})`).toBeDefined();
              break;
          }
        }
      }
    }
  });
});

