import type { BreakGauge } from './breakGauge';

export const BREAK_RULES = {
  WEAK_REDUCTION_FACTOR: 0.5, // reduce by 50% of damage when hitting weakness
  NORMAL_REDUCTION_FACTOR: 0.1, // reduce by 10% of damage otherwise
  BROKEN_STUN_TURNS: 2,
  BROKEN_DAMAGE_MULTIPLIER: 1.5,
} as const;

/**
 * Compute how much to reduce an enemy's break gauge based on damage and whether the hit was a weakness.
 * This returns an integer (floor) amount to subtract from the gauge.
 */
export function computeBreakReduction(damage: number, isWeakness: boolean): number {
  const factor = isWeakness ? BREAK_RULES.WEAK_REDUCTION_FACTOR : BREAK_RULES.NORMAL_REDUCTION_FACTOR;
  return Math.max(0, Math.floor(damage * factor));
}

export function applyBreakReductionToGauge(gauge: BreakGauge, reduction: number) {
  const next = Math.max(0, Math.floor(gauge.current - reduction));
  return { gauge: { ...gauge, current: next }, broken: next <= 0 };
}
