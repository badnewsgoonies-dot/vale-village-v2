/**
 * Simulator Interface v1.0
 *
 * Pure state machine for headless game execution.
 * NO side effects, NO DOM, NO Playwright - just logic.
 *
 * The simulator is the GROUND TRUTH. The driver talks to the UI.
 * When they disagree, the simulator wins.
 *
 * Contract:
 * - reset(seed) -> GameState  // Deterministic initial state
 * - step(state, action) -> GameState  // Pure transition function
 * - getLegalActions(state) -> GameAction[]  // What can be done now
 *
 * Determinism guarantee:
 *   reset(42) -> S0
 *   step(S0, A) -> S1
 *   reset(42) -> S0'
 *   step(S0', A) -> S1'
 *   S0 === S0' && S1 === S1'
 */

import type {
  GameState,
  GameAction,
  TerminalState,
  DispatchResult,
} from '../driver';

// ============================================================================
// Simulator Interface
// ============================================================================

export interface Simulator {
  /** Create initial state from seed. Must be deterministic. */
  reset(seed: number): GameState;

  /**
   * Apply action to state, return new state.
   * MUST be pure: no side effects, no mutation of input state.
   */
  step(state: GameState, action: GameAction): SimulatorStepResult;

  /** Get all legal actions from current state. */
  getLegalActions(state: GameState): GameAction[];

  /** Check if state is terminal (win/lose). */
  isTerminal(state: GameState): boolean;
}

/**
 * Result of a simulation step.
 * Mirrors DispatchResult but includes the new state.
 */
export type SimulatorStepResult = {
  state: GameState;
  ok: boolean;
  notes?: string[];
  terminal: TerminalState;
};

// ============================================================================
// Reference Implementation (Minimal Game for Testing)
// ============================================================================

/**
 * Minimal simulator for CI harness testing.
 * Implements a trivial game: player walks around, attacks enemies.
 */
export class MinimalSimulator implements Simulator {
  private readonly gridSize = 10;

  reset(seed: number): GameState {
    // Deterministic RNG from seed
    const rng = this.seededRandom(seed);

    // Player starts at center
    const player = {
      hp: 100,
      maxHp: 100,
      position: { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) },
      deaths: 0,
    };

    // Spawn some enemies deterministically
    const enemies = [];
    const numEnemies = 3 + Math.floor(rng() * 3); // 3-5 enemies
    for (let i = 0; i < numEnemies; i++) {
      enemies.push({
        id: `enemy_${i}`,
        type: 'goblin',
        hp: 20 + Math.floor(rng() * 20),
        position: {
          x: Math.floor(rng() * this.gridSize),
          y: Math.floor(rng() * this.gridSize),
        },
      });
    }

    return {
      tick: 0,
      player,
      world: {
        levelId: 'test_arena',
        timeElapsed: 0,
        enemies,
      },
      terminal: { kind: 'running' },
      flags: {},
      metrics: {
        enemiesDefeated: 0,
        itemsCollected: 0,
        novelty: 0,
      },
    };
  }

  step(state: GameState, action: GameAction): SimulatorStepResult {
    // Deep clone to ensure purity
    const next = this.cloneState(state);
    next.tick++;

    const notes: string[] = [];
    let ok = true;

    switch (action.type) {
      case 'MOVE': {
        const newX = next.player.position.x + action.dx;
        const newY = next.player.position.y + action.dy;

        if (this.isInBounds(newX, newY)) {
          next.player.position.x = newX;
          next.player.position.y = newY;
        } else {
          notes.push('move_blocked');
        }
        break;
      }

      case 'ATTACK': {
        // Find nearest enemy within range
        const nearbyEnemy = this.findNearestEnemy(next.player.position, next.world.enemies);
        if (nearbyEnemy) {
          // Deal damage (Deterministic: 10 + (tick % 10))
          const damage = 10 + (next.tick % 10);
          nearbyEnemy.hp -= damage;
          notes.push(`hit_${nearbyEnemy.id}_for_${damage}`);

          if (nearbyEnemy.hp <= 0) {
            // Remove dead enemy
            next.world.enemies = next.world.enemies.filter(e => e.id !== nearbyEnemy.id);
            if (next.metrics) next.metrics.enemiesDefeated++;
            notes.push(`killed_${nearbyEnemy.id}`);
          }
        } else {
          notes.push('attack_missed');
        }
        break;
      }

      case 'INTERACT': {
        notes.push('no_interactable');
        break;
      }

      case 'NOOP': {
        // Time passes, nothing happens
        break;
      }

      default: {
        ok = false;
        notes.push('invalid_action');
      }
    }

    // Enemy turn: each enemy moves toward player and attacks if adjacent
    for (const enemy of next.world.enemies) {
      const dx = Math.sign(next.player.position.x - enemy.position.x);
      const dy = Math.sign(next.player.position.y - enemy.position.y);

      const dist = this.distance(enemy.position, next.player.position);
      if (dist <= 1.5) {
        // Attack player
        const damage = 5;
        next.player.hp -= damage;
      } else {
        // Move toward player
        enemy.position.x += dx;
        enemy.position.y += dy;
      }
    }

    // Check terminal conditions
    if (next.player.hp <= 0) {
      next.terminal = { kind: 'lose', reason: 'player_death' };
      next.player.deaths++;
    } else if (next.world.enemies.length === 0) {
      next.terminal = { kind: 'win', reason: 'all_enemies_defeated' };
    }

    // Advance time
    next.world.timeElapsed += 0.1;

    return {
      state: next,
      ok,
      notes: notes.length > 0 ? notes : undefined,
      terminal: next.terminal,
    };
  }

  getLegalActions(state: GameState): GameAction[] {
    if (state.terminal.kind !== 'running') {
      return [];
    }

    const actions: GameAction[] = [
      { type: 'NOOP' },
      { type: 'ATTACK' },
    ];

    // All 8 directions + stationary
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;
        const newX = state.player.position.x + dx;
        const newY = state.player.position.y + dy;
        if (this.isInBounds(newX, newY)) {
          actions.push({ type: 'MOVE', dx, dy });
        }
      }
    }

    return actions;
  }

  isTerminal(state: GameState): boolean {
    return state.terminal.kind !== 'running';
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }

  private cloneState(state: GameState): GameState {
    return JSON.parse(JSON.stringify(state));
  }

  private isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize;
  }

  private distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  private findNearestEnemy(
    playerPos: { x: number; y: number },
    enemies: Array<{ id: string; hp: number; position: { x: number; y: number } }>
  ) {
    const range = 2;
    let nearest = null;
    let nearestDist = Infinity;

    for (const enemy of enemies) {
      const dist = this.distance(playerPos, enemy.position);
      if (dist <= range && dist < nearestDist) {
        nearest = enemy;
        nearestDist = dist;
      }
    }

    return nearest;
  }
}

// ============================================================================
// Singleton for testing
// ============================================================================

export const minimalSimulator = new MinimalSimulator();
