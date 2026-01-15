/**
 * Random Policy
 *
 * Pure chaos. Picks uniformly from legal actions.
 * Essential for fuzzing - finds edge cases that heuristics miss.
 *
 * Deterministic when seeded.
 */

import type { GameState, GameAction } from '../../driver';
import type { Simulator } from '../simulator';

export type RandomPolicyConfig = {
  seed?: number;
};

export class RandomPolicy {
  private rngState: number;

  constructor(config: RandomPolicyConfig = {}) {
    this.rngState = config.seed ?? Date.now();
  }

  /**
   * Pick a random legal action.
   * If no legal actions, returns NOOP.
   */
  selectAction(state: GameState, sim: Simulator): GameAction {
    const legal = sim.getLegalActions(state);

    if (legal.length === 0) {
      return { type: 'NOOP' };
    }

    const idx = this.randomInt(legal.length);
    return legal[idx];
  }

  /**
   * Reset RNG state for reproducible episodes.
   */
  setSeed(seed: number): void {
    this.rngState = seed;
  }

  // Linear congruential generator
  private randomInt(max: number): number {
    this.rngState = (this.rngState * 1103515245 + 12345) & 0x7fffffff;
    return this.rngState % max;
  }
}

/**
 * Factory for stateless random selection.
 * Use when you don't need reproducibility.
 */
export function randomAction(state: GameState, sim: Simulator): GameAction {
  const legal = sim.getLegalActions(state);
  if (legal.length === 0) return { type: 'NOOP' };
  return legal[Math.floor(Math.random() * legal.length)];
}
