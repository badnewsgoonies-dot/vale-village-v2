import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createWithEqualityFn } from 'zustand/traditional';
import { createFanfareSlice } from '../fanfareSlice';

describe('fanfareSlice', () => {
  let useStore: any;

  beforeEach(() => {
    useStore = createWithEqualityFn()( (set: any, get: any, api: any) => ({ ...createFanfareSlice(set, get, api) }));
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('queues and plays items sequentially', () => {
    const s = useStore.getState();
    s.startFanfare('A');
    s.startFanfare('B');

    // immediately playing A
    expect(useStore.getState().isPlaying).toBe(true);
    expect(useStore.getState().currentName).toBe('A');

    // advance past A duration
    vi.advanceTimersByTime(1600);
    expect(useStore.getState().isPlaying).toBe(true);
    expect(useStore.getState().currentName).toBe('B');

    // finish B
    vi.advanceTimersByTime(1600);
    expect(useStore.getState().isPlaying).toBe(false);
    expect(useStore.getState().currentName).toBe(null);
  });

  it('stopFanfare cancels playback and clears queue', () => {
    const s = useStore.getState();
    s.startFanfare('X');
    expect(useStore.getState().isPlaying).toBe(true);
    s.stopFanfare();
    expect(useStore.getState().isPlaying).toBe(false);
    expect(useStore.getState().queue.length).toBe(0);
  });
});
