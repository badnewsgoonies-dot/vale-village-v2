import { describe, it, expect } from 'vitest';
import { EncountersLayer } from '../../src/ui/components/overworld-v2/layers/encountersLayer';

describe('EncountersLayer', () => {
  it('detects nearby encounter when player is on top of symbol', () => {
    const building = {
      id: 'house-01',
      kind: 'house',
      x: 200,
      y: 450,
      width: 90,
      height: 80,
      spritePath: '/sprites/buildings/Vale/Vale_Building1.gif',
      interiorMapId: 'house-01-interior',
    } as any;

    const layer = new EncountersLayer({
      buildings: [building],
      getPlayerPosition: () => ({ x: 200, y: 450 }),
      onTrigger: () => {},
      showPredicate: () => true,
    });

    const nearby = layer.getNearbyEncounter(200, 450, 40);
    expect(nearby).not.toBeNull();
    expect(nearby?.id).toBe('house-01');
  });
});
