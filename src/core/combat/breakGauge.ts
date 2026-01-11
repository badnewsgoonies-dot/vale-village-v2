export type BreakGauge = { current: number; max: number };

export const BREAK_CONSTANTS = {
  // Fraction of a "damage-derived" value applied to gauge when hitting a non-weakness hit
  NORMAL_REDUCTION_FACTOR: 0.1,
  // Fraction when hitting an elemental/weakness hit
  WEAK_REDUCTION_FACTOR: 0.5,
};

export function createBreakGauge(max: number): BreakGauge {
  return { current: Math.max(0, Math.floor(max)), max: Math.max(0, Math.floor(max)) };
}

export function getBreakGauge(g: BreakGauge): number {
  return g.current;
}

export function resetBreakGauge(g: BreakGauge): BreakGauge {
  return { ...g, current: g.max };
}

/**
 * Reduce the gauge by an absolute amount. Returns the new gauge and whether it became broken.
 */
export function reduceBreakGauge(g: BreakGauge, amount: number): { gauge: BreakGauge; reduced: number; broken: boolean } {
  const toReduce = Math.max(0, Math.floor(amount));
  const prev = g.current;
  const next = Math.max(0, prev - toReduce);
  const broken = next <= 0;
  return { gauge: { ...g, current: next }, reduced: prev - next, broken };
}
