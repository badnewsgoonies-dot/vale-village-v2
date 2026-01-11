import type { GetState, SetState, StoreApi } from 'zustand';

export type FanfareSlice = {
  isPlaying: boolean;
  currentName: string | null;
  queue: string[];
  startFanfare: (name: string, durationMs?: number) => void;
  stopFanfare: () => void;
};

const FANFARE_DEFAULT_DURATION_MS = 1500;

export const createFanfareSlice = (set: SetState<FanfareSlice>, get: GetState<FanfareSlice>, _api: StoreApi<FanfareSlice>) => {
  let timer: number | null = null;
  // internal queue to avoid relying on get() across async callbacks
  let internalQueue: string[] = [];

  const playNext = () => {
    const q = internalQueue;
    if (q.length === 0) {
      set(() => ({ isPlaying: false, currentName: null }));
      return;
    }

    const next = q[0];
    // remove from internal queue
    internalQueue = internalQueue.slice(1);

    set((state: any) => ({
      ...(state || {}),
      currentName: next,
      isPlaying: true,
      queue: (state?.queue ?? []).slice(1),
    }));

    const duration = FANFARE_DEFAULT_DURATION_MS;
    timer = window.setTimeout(() => {
      timer = null;
      // finished current
      set((state: any) => ({ ...(state || {}), isPlaying: false, currentName: null }));
      // continue with next in queue
      if (internalQueue.length > 0) playNext();
    }, duration);
  };

  return {
    isPlaying: false,
    currentName: null,
    queue: [],

    startFanfare: (name: string, _durationMs?: number) => {
      // Use provided duration when queuing first item; but keep default for simplicity
      // Safely capture whether something was already playing before mutating the queue
      let wasPlaying = false;
      try {
        const g = get ? get() : undefined;
        wasPlaying = !!(g && (g as any).isPlaying);
      } catch (e) {
        wasPlaying = false;
      }

      set((state: any) => ({ ...(state || {}), queue: [...(state?.queue ?? []), name] }));
      // mirror into internal queue used by async callbacks
      internalQueue.push(name);

      // If nothing was playing before, start immediately
      if (!wasPlaying) {
        playNext();
      }
    },

    stopFanfare: () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
      internalQueue = [];
      set(() => ({ isPlaying: false, currentName: null, queue: [] }));
    },
  } as FanfareSlice;
};
