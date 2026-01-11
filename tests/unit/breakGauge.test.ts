import { describe, it, expect } from 'vitest';
import { createBreakGauge, getBreakGauge, resetBreakGauge, reduceBreakGauge } from '../../src/core/combat/breakGauge';

describe('BreakGauge basic API', () => {
  it('creates gauge with correct max and current', () => {
    const g = createBreakGauge(100);
    expect(getBreakGauge(g)).toBe(100);
    expect(g.max).toBe(100);
  });

  it('reducing gauge subtracts correctly and does not go negative', () => {
    const g = createBreakGauge(50);
    const res1 = reduceBreakGauge(g, 10);
    expect(res1.gauge.current).toBe(40);
    expect(res1.reduced).toBe(10);
    expect(res1.broken).toBe(false);

    const res2 = reduceBreakGauge(res1.gauge, 1000);
    expect(res2.gauge.current).toBe(0);
    expect(res2.broken).toBe(true);
  });

  it('reset sets current back to max', () => {
    let g = createBreakGauge(30);
    g = reduceBreakGauge(g, 15).gauge;
    const r = resetBreakGauge(g);
    expect(r.current).toBe(r.max);
  });
});
