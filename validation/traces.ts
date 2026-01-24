/**
 * Trace Recorder & Replayer
 *
 * Captures "Golden Traces" of successful episodes for regression testing.
 * A trace is a portable, deterministic record of:
 *   Initial State + Sequence of Actions => Terminal State
 */

import * as fs from 'fs';
import * as path from 'path';
import type { GameState, GameAction } from '../src/dev/driver';
import type { Simulator } from './simulator';
import { assertStatesEqual } from './diff/compare_state';

// ============================================================================ 
// Schema
// ============================================================================ 

export type TraceJson = {
  version: 1;
  policy: {
    name: string;
    label?: string;
    capabilities?: Record<string, boolean>;
  };
  episode: {
    seed: number;
    maxTicks: number;
    outcome: 'win' | 'lose' | 'timeout' | 'crash';
  };
  driverVersion: string;
  states: GameState[]; // index 0 = initial
  actions: GameAction[]; // index i applies to states[i] -> states[i+1]
};

// ============================================================================ 
// Recorder
// ============================================================================ 

export class TraceRecorder {
  private trace: TraceJson;

  constructor(
    policyName: string,
    seed: number,
    maxTicks: number,
    policyLabel?: string
  ) {
    this.trace = {
      version: 1,
      policy: {
        name: policyName,
        label: policyLabel,
        capabilities: { deterministic: true },
      },
      episode: {
        seed,
        maxTicks,
        outcome: 'timeout', // Default, updated on finalize
      },
      driverVersion: 'v1',
      states: [],
      actions: [],
    };
  }

  recordStep(state: GameState, action: GameAction): void {
    // Clone to ensure snapshot purity
    this.trace.states.push(JSON.parse(JSON.stringify(state)));
    this.trace.actions.push(JSON.parse(JSON.stringify(action)));
  }

  /**
   * Must be called with the final terminal state and outcome
   */
  finalize(
    finalState: GameState,
    outcome: 'win' | 'lose' | 'timeout' | 'crash'
  ): TraceJson {
    this.trace.states.push(JSON.parse(JSON.stringify(finalState)));
    this.trace.episode.outcome = outcome;
    return this.trace;
  }

  save(dir: string): string {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const name = `trace_${this.trace.policy.name}_${this.trace.episode.seed}_${ts}.json`;
    const fullPath = path.join(dir, name);
    
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(this.trace, null, 2));
    return fullPath;
  }
}

// ============================================================================ 
// Replayer
// ============================================================================ 

export function replayTraceSim(
  tracePath: string,
  sim: Simulator,
  verbose: boolean = false
): boolean {
  try {
    const content = fs.readFileSync(tracePath, 'utf-8');
    const trace = JSON.parse(content) as TraceJson;

    if (trace.version !== 1) {
      throw new Error(`Unsupported trace version: ${trace.version}`);
    }

    if (verbose) {
      console.log(`Replaying trace: ${path.basename(tracePath)} (seed=${trace.episode.seed})`);
    }

    // 1. Reset Sim
    let state = sim.reset(trace.episode.seed);
    
    // 2. Assert Initial State
    try {
      assertStatesEqual(state, trace.states[0]);
    } catch (e) {
      throw new Error(`Initial state mismatch:\n${e}`);
    }

    // 3. Replay Loop
    for (let i = 0; i < trace.actions.length; i++) {
      const action = trace.actions[i];
      const expectedNextState = trace.states[i + 1];

      if (verbose) {
        console.log(`  Tick ${state.tick}: ${action.type}`);
      }

      // Step
      const result = sim.step(state, action);
      state = result.state;

      // Verify
      try {
        assertStatesEqual(state, expectedNextState);
      } catch (e) {
        throw new Error(`State mismatch at tick ${state.tick} (step ${i}):\n${e}`);
      }
    }

    if (verbose) console.log('✓ Trace replay successful');
    return true;

  } catch (e) {
    console.error(`✗ Trace replay failed: ${e}`);
    return false;
  }
}
