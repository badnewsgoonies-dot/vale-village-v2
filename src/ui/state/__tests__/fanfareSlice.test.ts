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

  it('queues and plays items sequentially', async () => {
    const s = useStore.getState();
    s.startFanfare('A');
    s.startFanfare('B');

    // allow state update to flush
    await Promise.resolve();

    // allow A to finish and B to start
    vi.advanceTimersByTime(1600);
    await Promise.resolve();
    let state = useStore.getState();
    expect(state.isPlaying).toBe(true);
    expect(state.currentName).toBe('B');

    // finish B
    vi.advanceTimersByTime(1600);
    await Promise.resolve();
    state = useStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.currentName).toBe(null);
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
