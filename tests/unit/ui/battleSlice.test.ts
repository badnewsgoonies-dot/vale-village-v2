import { describe, it, expect, beforeEach } from 'vitest';
import { createWithEqualityFn } from 'zustand/traditional';
import { createBattleSlice } from '../../../src/ui/state/battleSlice';

describe('battleSlice', () => {
  let useStore: any;

  beforeEach(() => {
    useStore = createWithEqualityFn()((set, get, api) => ({ ...createBattleSlice(set, get, api) }));
  });

  describe('Initial State', () => {
    it('should start with null battle', () => {
      const s = useStore.getState();
      expect(s.battle).toBeNull();
    });

    it('should start with empty events array', () => {
      const s = useStore.getState();
      expect(Array.isArray(s.events)).toBe(true);
      expect(s.events).toHaveLength(0);
    });

    it('should have a default RNG seed', () => {
      const s = useStore.getState();
      expect(typeof s.rngSeed).toBe('number');
    });

    it('should have turnNumber starting at 0', () => {
      const s = useStore.getState();
      expect(s.turnNumber).toBe(0);
    });
  });

  describe('API Methods', () => {
    it('exposes expected keys and methods', () => {
      const s = useStore.getState();
      expect(typeof s.setBattle).toBe('function');
      expect(typeof s.startTurnTick).toBe('function');
      expect(typeof s.perform).toBe('function');
      expect(typeof s.dequeueEvent).toBe('function');
      expect(typeof s.endTurn).toBe('function');
      expect(typeof s.preview).toBe('function');
    });
  });

  describe('dequeueEvent', () => {
    it('should remove the first event from the events array', () => {
      const mockEvents = [
        { type: 'hit', amount: 10 } as any,
        { type: 'miss' } as any,
      ];
      useStore.setState({ events: mockEvents });

      useStore.getState().dequeueEvent();

      const s = useStore.getState();
      expect(s.events).toHaveLength(1);
      expect(s.events[0].type).toBe('miss');
    });

    it('should handle empty events array gracefully', () => {
      useStore.setState({ events: [] });

      useStore.getState().dequeueEvent();

      const s = useStore.getState();
      expect(s.events).toHaveLength(0);
    });
  });
});
