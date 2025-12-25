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
    expect(state.shopEntryContext).toBe('overworld');
    expect(state.lastTrigger?.id).toBe('test-shop');
  });

  it('openShopFromMainMenu() sets shopEntryContext=menu and currentShopId', () => {
    const store = createVV2Store();
    store.setState({ mode: 'main-menu' });

    store.getState().openShopFromMainMenu();

    const state = store.getState();
    expect(state.mode).toBe('shop');
    expect(state.shopEntryContext).toBe('menu');
    expect(state.currentShopId).toBe('vale-armory');
    expect(state.lastTrigger?.type).toBe('shop');
  });

  it('exitShop() returns to main-menu when opened from menu', () => {
    const store = createVV2Store();
    store.setState({ mode: 'main-menu' });

    store.getState().openShopFromMainMenu();
    store.getState().exitShop();

    const state = store.getState();
    expect(state.mode).toBe('main-menu');
    expect(state.shopEntryContext).toBeNull();
    expect(state.currentShopId).toBeNull();
    expect(state.lastTrigger).toBeNull();
  });

  it('exitShop() returns to overworld when opened from overworld', () => {
    const store = createVV2Store();

    store.setState({
      mode: 'shop',
      shopEntryContext: 'overworld',
      currentShopId: 'vale-armory',
      lastTrigger: {
        id: 'test-shop',
        type: 'shop',
        position: { x: 0, y: 0 },
        data: { shopId: 'vale-armory' },
      },
    });

    store.getState().exitShop();

    const state = store.getState();
    expect(state.mode).toBe('overworld');
  });
});
