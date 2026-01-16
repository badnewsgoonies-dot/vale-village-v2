import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/ui/state/store';

describe('battleSlice', () => {
  it('exposes basic API and accepts setBattle', () => {
    const s = createStore();
    expect(typeof s.setBattle).toBe('function');
    expect(typeof s.perform).toBe('function');
    expect(s.battle).toBeNull();
    s.setBattle(null, 123);
    expect(s.rngSeed).toBe(123);
    s.dequeueEvent();
    expect(Array.isArray(s.events)).toBe(true);
  });
});
