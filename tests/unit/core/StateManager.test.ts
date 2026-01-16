import { describe, it, expect } from 'vitest';
import StateManager from '../../../src/core/StateManager';

describe('StateManager', () => {
  it('returns the initial state', () => {
    const reducer = (s: any) => s;
    const initial = { foo: 'bar' };
    const sm = new StateManager(reducer, initial);
    expect(sm.getState()).toEqual(initial);
  });

  it('dispatch updates state via reducer', () => {
    type S = { count: number };
    const reducer = (s: S, a: any) => {
      if (a.type === 'inc') return { ...s, count: s.count + (a.payload ?? 1) };
      return s;
    };
    const sm = new StateManager<S>(reducer, { count: 0 });
    sm.dispatch({ type: 'inc' });
    expect(sm.getState().count).toBe(1);
    sm.dispatch({ type: 'inc', payload: 2 });
    expect(sm.getState().count).toBe(3);
  });

  it('notifies subscribers and supports unsubscribe', () => {
    let calls = 0;
    const reducer = (s = { v: 0 }, a: any) => (a.type === 'add' ? { ...s, v: s.v + 1 } : s);
    const sm = new StateManager(reducer, { v: 0 });
    const unsubscribe = sm.subscribe(() => { calls += 1; });
    sm.dispatch({ type: 'add' });
    expect(calls).toBe(1);
    unsubscribe();
    sm.dispatch({ type: 'add' });
    expect(calls).toBe(1);
  });
});
