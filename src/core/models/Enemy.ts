import type { BreakGauge } from '../combat/breakGauge';
import { createBreakGauge, resetBreakGauge } from '../combat/breakGauge';
import { BREAK_RULES } from '../combat/breakRules';

export type StatusEffect = { type: string; duration?: number; [key: string]: any };

export type Enemy = {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  breakGauge?: BreakGauge;
  statusEffects: StatusEffect[];
  // Optional multiplier applied when enemy is in Broken state
  brokenDamageMultiplier?: number;
};

export function createEnemy(id: string, name: string, maxHp: number, breakGaugeMax = 100): Enemy {
  return {
    id,
    name,
    maxHp,
    currentHp: maxHp,
    breakGauge: createBreakGauge(breakGaugeMax),
    statusEffects: [],
    brokenDamageMultiplier: 1,
  };
}

export function markEnemyBroken(enemy: Enemy): Enemy {
  // Add a stun status and set damage multiplier
  const stun: StatusEffect = { type: 'stun', duration: BREAK_RULES.BROKEN_STUN_TURNS };
  const updated: Enemy = {
    ...enemy,
    breakGauge: enemy.breakGauge ? { ...enemy.breakGauge, current: 0 } : enemy.breakGauge,
    statusEffects: [...enemy.statusEffects.filter(s => s.type !== 'stun'), stun],
    brokenDamageMultiplier: BREAK_RULES.BROKEN_DAMAGE_MULTIPLIER,
  };
  return updated;
}

export function clearBroken(enemy: Enemy): Enemy {
  // Remove stun and reset multiplier
  return {
    ...enemy,
    statusEffects: enemy.statusEffects.filter(s => s.type !== 'stun'),
    brokenDamageMultiplier: 1,
    breakGauge: enemy.breakGauge ? resetBreakGauge(enemy.breakGauge) : enemy.breakGauge,
  };
}
