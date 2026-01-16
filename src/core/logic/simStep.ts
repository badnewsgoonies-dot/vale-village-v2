/**
 * Simulation Step - Pure state transition function
 *
 * SINGLE SOURCE OF TRUTH for game logic.
 * Both Game and Simulator import from here.
 *
 * This is PURE: no side effects, no DOM, no async.
 * Input state is not mutated; returns new state.
 */

import type { GameState, GameAction, TerminalState } from './types';
import { checkTerminal } from './terminal';
import {
  resolvePlayerAttack,
  processEnemyAttacks,
  processEnemyMovement,
} from './combat';

// ============================================================================
// Step Result
// ============================================================================

export interface StepResult {
  state: GameState;
  terminal: TerminalState;
  notes: string[];
}

// ============================================================================
// Pure Step Function
// ============================================================================

/**
 * Apply one action to the game state.
 *
 * This is the CORE GAME LOOP in pure form:
 * 1. Clone state (immutability)
 * 2. Process player action
 * 3. Process enemy turn
 * 4. Check terminal conditions
 * 5. Return new state
 */
export function simStep(
  prevState: GameState,
  action: GameAction
): StepResult {
  // 1. Clone state (defensive copy)
  const state: GameState = structuredClone(prevState);
  const notes: string[] = [];

  // Early exit if already terminal
  if (state.terminal.kind !== 'running') {
    return { state, terminal: state.terminal, notes: ['already_terminal'] };
  }

  // 2. Process player action
  switch (action.type) {
    case 'MOVE': {
      // Simple movement (no collision for now)
      state.player.position.x += action.dx;
      state.player.position.y += action.dy;
      notes.push('moved');
      break;
    }

    case 'ATTACK': {
      const result = resolvePlayerAttack(state, action.targetId);
      notes.push(...result.notes);
      break;
    }

    case 'INTERACT': {
      // Placeholder - implement item pickup, NPC talk, etc.
      notes.push('interact_noop');
      break;
    }

    case 'NOOP': {
      // Time passes, nothing else
      notes.push('noop');
      break;
    }

    default: {
      notes.push('invalid_action');
    }
  }

  // 3. Process enemy turn
  processEnemyMovement(state);
  const enemyDamage = processEnemyAttacks(state);
  if (enemyDamage > 0) {
    notes.push(`took_${enemyDamage}_damage`);
  }

  // 4. Advance tick
  state.tick++;

  // 5. Check terminal conditions
  state.terminal = checkTerminal(state);

  return {
    state,
    terminal: state.terminal,
    notes,
  };
}

// ============================================================================
// Legal Actions
// ============================================================================

/**
 * Get all legal actions from current state.
 */
export function getLegalActions(state: GameState): GameAction[] {
  // If terminal, no actions available
  if (state.terminal.kind !== 'running') {
    return [];
  }

  const actions: GameAction[] = [
    { type: 'NOOP' },
    { type: 'ATTACK' },
    { type: 'INTERACT' },
  ];

  // 8-directional movement
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx === 0 && dy === 0) continue;
      actions.push({ type: 'MOVE', dx, dy });
    }
  }

  return actions;
}
