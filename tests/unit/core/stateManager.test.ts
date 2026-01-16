import { describe, it, expect } from 'vitest';
import { StateManager } from '../../../src/core/stateManager';

describe('StateManager', () => {
  it('get/set and subscribers work', () => {
    const sm = new StateManager({ a: 1, b: 'x' });
    const states: any[] = [];
    const unsub = sm.subscribe(s => states.push(s));
    sm.setState({ a: 2 });
    expect(sm.getState().a).toBe(2);
    expect(states.length).toBe(1);
    unsub();
    sm.setState({ b: 'y' });
    expect(states.length).toBe(1);
  });
});
