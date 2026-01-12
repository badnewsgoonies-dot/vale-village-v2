import { describe, expect, it } from 'vitest';

import { VILLAGE_BUILDINGS } from '../../../src/ui/components/overworld-v2/data/villageLayout';

describe('OverworldV2 village layout', () => {
  it('includes a Vale Armory shop building', () => {
    const shop = VILLAGE_BUILDINGS.find((building) => building.kind === 'shop');
    expect(shop).toBeDefined();
    expect(shop?.interaction?.type).toBe('open-shop');
    expect(shop?.interaction?.payload?.shopId).toBe('vale-armory');
  });
});

