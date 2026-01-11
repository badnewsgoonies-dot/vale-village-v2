import { describe, it, expect, vi } from 'vitest';
import { createHitPopupManager, POPUP_LIFETIME_MS } from '../../src/ui/components/battle/HitPopup';

describe('HitPopup manager', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('creates a popup with correct payload and removes after lifetime', () => {
    const manager = createHitPopupManager();
    const p = manager.add({ x: 100, y: 200, value: 42, critical: true });
    let list = manager.get();
    expect(list.some((i: any) => i.id === p.id && i.value === 42)).toBe(true);

    // advance past lifetime and ensure removal
    vi.advanceTimersByTime(POPUP_LIFETIME_MS + 10);
    list = manager.get();
    expect(list.some((i: any) => i.id === p.id)).toBe(false);
  });
});
