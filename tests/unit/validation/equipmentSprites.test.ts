import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { EQUIPMENT } from '../../../src/data/definitions/equipment';
import { getEquipmentSpriteId } from '../../../src/ui/sprites/mappings/equipmentSprites';

describe('Equipment sprite mapping', () => {
  it('points to an existing icon file for each equipment item', () => {
    for (const equipment of Object.values(EQUIPMENT)) {
      const spriteId = getEquipmentSpriteId(equipment);
      expect(spriteId, `Missing sprite mapping for equipment id "${equipment.id}"`).toBeTruthy();
      if (!spriteId) continue;

      expect(
        spriteId.startsWith('/sprites/'),
        `Equipment "${equipment.id}" sprite path must start with "/sprites/", got "${spriteId}"`
      ).toBe(true);

      const filePath = path.resolve(process.cwd(), 'public', spriteId.replace(/^\//, ''));
      expect(existsSync(filePath), `Missing sprite file for "${equipment.id}": ${spriteId}`).toBe(true);
    }
  });
});

