import { ContentValidator } from '../simulator';
import { EntityBlueprint } from '../content';

// Mock Blueprint Factory
function createBlueprint(hp: number, attack: number): EntityBlueprint {
  return {
    id: 'test_mob',
    metadata: { displayName: 'Test Mob', description: 'Unit Test' },
    stats: {
      maxHp: hp,
      attack: attack,
      speed: 10
    },
    behavior: {
      type: 'aggressive',
      detectionRadius: 5
    }
  };
}

describe('ContentValidator', () => {
  test('accepts balanced entity', () => {
    // Player has 100 HP, 10 DMG.
    // Entity: 30 HP (3 hits to kill), 10 DMG (10 hits to kill player).
    // TTK Player -> Entity: 3
    // TTK Entity -> Player: 10
    // Passes both sponge (<=20) and unfair (>1) checks.
    const bp = createBlueprint(30, 10);
    expect(ContentValidator.isEntityBalanced(bp)).toBe(true);
  });

  test('rejects sponge entity (too much HP)', () => {
    // 300 HP -> 30 hits to kill (> 20 limit)
    const bp = createBlueprint(300, 10);
    expect(ContentValidator.isEntityBalanced(bp)).toBe(false);
  });

  test('rejects glass cannon (OHKO player)', () => {
    // 100 Attack -> 1 hit to kill player (<= 1 limit)
    const bp = createBlueprint(30, 100);
    expect(ContentValidator.isEntityBalanced(bp)).toBe(false);
  });

  test('rejects immortal entity (0 HP)', () => {
    const bp = createBlueprint(0, 10);
    expect(ContentValidator.isEntityBalanced(bp)).toBe(false);
  });

  test('accepts weak entity (damage 1)', () => {
    // 20 HP -> 2 hits
    // 1 DMG -> 100 hits to kill player
    const bp = createBlueprint(20, 1);
    expect(ContentValidator.isEntityBalanced(bp)).toBe(true);
  });
});
