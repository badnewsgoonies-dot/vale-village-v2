/**
 * LLM Policy Adapter
 *
 * Bridges a language-model (or any external agent) into the
 * `(state: GameState) => GameAction` policy slot used by:
 *  - `run_ci.ts` (sim-only / determinism mode)
 *  - `differential/playwright_runner.ts` (sim↔driver loop)
 *
 * Design goals:
 *  - Keep the core harness synchronous today
 *  - Provide a clear async boundary for real LLM calls
 *  - Make it easy for tools/agents to plug in by implementing `LLMClient`
 *
 * The default implementation here is a NO-OP stub that documents the
 * expected protocol. Repos consuming this archetype should provide their
 * own `LLMClient` that actually calls an LLM or remote agent.
 */

import type { GameState, GameAction } from '../../driver';
import type { Simulator } from '../simulator';

// ============================================================================
// Client Contract
// ============================================================================

/**
 * Minimal interface an LLM-backed client must implement.
 *
 * Implementations may call:
 *  - local HTTP servers (e.g. memory daemon / LLM proxy)
 *  - cloud LLM APIs
 *  - other processes on disk
 */
export interface LLMClient {
  /**
   * Given the current state and legal actions, choose the next action.
   *
   * Implementations SHOULD:
   *  - Treat `state` as immutable (do not mutate)
   *  - Only return actions from `legalActions` (or a safe NOOP)
   *  - Be deterministic when seeded (for CI replay)
   */
  chooseAction(input: {
    state: GameState;
    legalActions: GameAction[];
    episode: {
      seed: number;
      tick: number;
    };
  }): Promise<GameAction>;
}

// ============================================================================
// Adapter
// ============================================================================

export type LLMPolicyOptions = {
  /** Logical episode seed, for logging and determinism in clients */
  seed: number;
  /** Optional label to identify this policy in logs (e.g. 'llm:swarm') */
  label?: string;
};

/**
 * Thin adapter that turns an asynchronous LLM client into a policy
 * function. The core harness remains synchronous; callers using this
 * adapter are expected to handle the async boundary explicitly.
 */
export class LLMPolicyAdapter {
  private readonly client: LLMClient;
  private readonly seed: number;
  private readonly label?: string;

  constructor(client: LLMClient, options: LLMPolicyOptions) {
    this.client = client;
    this.seed = options.seed;
    this.label = options.label;
  }

  /**
   * Async policy function:
   *   (state, sim) -> Promise<GameAction>
   *
   * This mirrors the RandomPolicy interface but returns a Promise so that
   * the client can call out to an LLM.
   */
  async selectAction(state: GameState, sim: Simulator): Promise<GameAction> {
    const legal = sim.getLegalActions(state);

    // If there are no legal actions, return a safe NOOP.
    if (legal.length === 0) {
      return { type: 'NOOP' };
    }

    return this.client.chooseAction({
      state,
      legalActions: legal,
      episode: {
        seed: this.seed,
        tick: state.tick,
      },
    });
  }

  /**
   * Helper to expose a "best effort" synchronous policy that can be used
   * in existing synchronous harnesses. By default this WILL THROW, to
   * force callers to consciously handle asynchrony instead of silently
   * blocking in CI.
   *
   * Repos that want a blocking adapter can replace this with a
   * project-specific implementation that performs a synchronous IPC call.
   */
  toSynchronousPolicy(): (state: GameState, sim: Simulator) => GameAction {
    return () => {
      throw new Error(
        'LLMPolicyAdapter.toSynchronousPolicy() was called, ' +
          'but no synchronous bridge is implemented. ' +
          'Use the async `selectAction` API with an async-aware harness.'
      );
    };
  }
}

