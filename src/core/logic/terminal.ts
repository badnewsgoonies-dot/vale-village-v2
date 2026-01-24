/**
 * Terminal Conditions - Win/Loss detection
 *
 * SINGLE SOURCE OF TRUTH for what "winning" and "losing" means.
 * Both Game and Simulator import from here.
 */

import type { GameState, TerminalState } from './types';

/**
 * Check if the game has reached a terminal state.
 *
 * Win conditions:
 * - All enemies defeated
 * - (Future: boss defeated, objective completed, etc.)
 *
 * Lose conditions:
 * - Player HP <= 0
 * - (Future: timeout, etc.)
 */
export function checkTerminal(state: GameState): TerminalState {
  // Lose: Player death
  if (state.player.hp <= 0) {
    return { kind: 'lose', reason: 'player_death' };
  }

  // Win: All enemies defeated (only if there were enemies to begin with)
  if (state.world.enemies.length === 0 && state.tick > 0) {
    // Check if we actually had combat (not just an empty level)
    const hadCombat = (state.metrics?.enemiesDefeated ?? 0) > 0;
    if (hadCombat) {
      return { kind: 'win', reason: 'all_enemies_defeated' };
    }
  }

  // Still running
  return { kind: 'running' };
}

/**
 * Check if state is terminal (convenience function).
 */
export function isTerminal(state: GameState): boolean {
  return state.terminal.kind !== 'running';
}

/**
 * Check if state is a win.
 */
export function isWin(state: GameState): boolean {
  return state.terminal.kind === 'win';
}

/**
 * Check if state is a loss.
 */
export function isLoss(state: GameState): boolean {
  return state.terminal.kind === 'lose';
}
