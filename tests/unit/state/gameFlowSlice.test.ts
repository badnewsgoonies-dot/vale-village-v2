/**
 * Unit tests for game flow slice (shop entry)
 */

import { describe, expect, it } from 'vitest';

import { createStore as createVV2Store } from '../../../src/ui/state/store';

describe('GameFlowSlice', () => {
  it('handleTrigger(shop) sets currentShopId and mode=shop', () => {
    const store = createVV2Store();
    store.setState({ mode: 'overworld' });

    store.getState().handleTrigger({
      id: 'test-shop',
      type: 'shop',
      position: { x: 0, y: 0 },
      data: { shopId: 'vale-armory' },
    });

    const state = store.getState();
    expect(state.mode).toBe('shop');
    expect(state.currentShopId).toBe('vale-armory');
    expect(state.lastTrigger?.id).toBe('test-shop');
  });
});

