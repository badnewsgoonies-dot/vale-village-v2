import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import hitStop, { startHitStop } from '../../src/ui/components/battle/HitStop';

describe('HitStop manager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('activates for approximately the requested duration', () => {
    expect(hitStop.isActive()).toBe(false);
    startHitStop(100);
    expect(hitStop.isActive()).toBe(true);
    vi.advanceTimersByTime(90);
    expect(hitStop.isActive()).toBe(true);
    vi.advanceTimersByTime(20);
    expect(hitStop.isActive()).toBe(false);
  });
});
