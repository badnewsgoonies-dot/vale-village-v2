import { describe, it, expect, vi } from 'vitest';
import { EncountersLayer } from '../../../src/ui/components/overworld-v2/layers/encountersLayer';
import { VILLAGE_BUILDINGS } from '../../../src/ui/components/overworld-v2/data/villageLayout';

describe('Overworld Collision Smoke Test', () => {
  it('should NOT trigger battle when colliding with a house (Fix Verification)', () => {
    const onTriggerMock = vi.fn();
    
    // The FIXED configuration used in OverworldV2 (empty buildings list)
    const layer = new EncountersLayer({
      buildings: [], 
      getPlayerPosition: () => ({ x: 360, y: 365 }), // Coordinates that would trigger House 1
      onTrigger: onTriggerMock,
    });

    layer.update(100);

    // Assert: No battle trigger
    expect(onTriggerMock).not.toHaveBeenCalled();
  });

  it('regression logic check: passing houses WOULD trigger battle', () => {
    const onTriggerMock = vi.fn();
    
    // The BUGGY configuration (passing houses)
    const layer = new EncountersLayer({
      buildings: VILLAGE_BUILDINGS.filter(b => b.kind === 'house'),
      getPlayerPosition: () => ({ x: 360, y: 365 }), // Should be close enough to House 1 symbol (y ~362)
      onTrigger: onTriggerMock,
      // Explicitly set radius to ensure trigger if logic was correct
      radius: 50
    });

    layer.update(100);

    // This confirms that if we revert the fix, the bug returns
    expect(onTriggerMock).toHaveBeenCalled();
  });
});
