import { describe, it, expect } from 'vitest';
import { GameLoop } from '../../../src/core/engine';

describe('GameLoop', () => {
  it('tick calls update with expected dt', () => {
    let receivedDt = 0;
    const g = new GameLoop((dt) => { receivedDt = dt; }, 20);
    g.tick();
    expect(receivedDt).toBeCloseTo(0.02);
  });

  it('start toggles running and stop stops', () => {
    const g = new GameLoop(() => {}, 50);
    expect(g.isRunning()).toBe(false);
    g.start();
    expect(g.isRunning()).toBe(true);
    g.stop();
    expect(g.isRunning()).toBe(false);
  });
});
