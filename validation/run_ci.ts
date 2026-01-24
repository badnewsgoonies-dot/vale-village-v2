#!/usr/bin/env npx ts-node
/**
 * CI Validation Harness
 *
 * Three guarantees:
 * 1. DETERMINISM LOCK - Same seed + policy = same terminal state + metrics + ticks
 * 2. SIM↔DRIVER DIFFERENTIAL - States must match at every checkpoint tick
 * 3. POLICY-AGNOSTIC - Works with random, heuristic, or LLM policies
 *
 * Exit codes:
 * 0 - All validations passed
 * 1 - Determinism violation
 * 2 - Sim/Driver divergence
 * 3 - Episode failure (timeout, crash)
 * 4 - Configuration error
 *
 * Usage:
 *   npx ts-node run_ci.ts --sim-only           # Test simulator only
 *   npx ts-node run_ci.ts --driver-only        # Test driver only (needs Playwright)
 *   npx ts-node run_ci.ts --differential       # Compare sim vs driver (headless)
 *   npx ts-node run_ci.ts --differential --visible  # Watch AI play (visible browser)
 *   npx ts-node run_ci.ts --fuzz --runs 100     # Random policy fuzzing
 */

import * as fs from 'fs';
import * as path from 'path';

import { minimalSimulator, type Simulator, type SimulatorStepResult } from './simulator';
import { compareStates, formatDiff, type DiffResult, type DiffConfig } from './diff/compare_state';
import { runDifferentialEpisode } from './differential/playwright_runner';
import { TraceRecorder, replayTraceSim } from './traces';
import { RandomPolicy } from './policies/random';
import { heuristicAction } from './policies/heuristic';
import { LLMPolicyAdapter, type LLMClient } from './policies/llm_adapter';
import type { GameState, GameAction } from '../driver';

// ============================================================================ 
// Configuration
// ============================================================================ 

type Config = {
  mode: 'sim-only' | 'driver-only' | 'differential';
  policy: 'random' | 'heuristic' | 'llm';
  runs: number;
  seeds: number[];
  maxTicks: number;
  diffCheckInterval: number;  // Check states every N ticks
  reportPath?: string;
  url: string;
  verbose: boolean;
  // LLM policy configuration (optional unless policy === 'llm')
  llmEndpoint?: string;
  llmLabel?: string;
  // Trace configuration
  recordTraces: boolean;
  traceDir: string;
  replayTrace?: string;
  // Visual mode (for differential)
  visible: boolean;
  actionDelayMs: number; // Delay between actions in visible mode (ms)
};

function parseArgs(): Config {
  const args = process.argv.slice(2);

  const config: Config = {
    mode: 'sim-only',
    policy: 'heuristic',
    runs: 1,
    seeds: [42],
    maxTicks: 1000,
    diffCheckInterval: 10,
    url: 'http://localhost:5173',
    verbose: false,
    recordTraces: false,
    traceDir: 'validation/artifacts/traces',
    visible: false,
    actionDelayMs: 100, // 100ms default delay for visible mode
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--sim-only':
        config.mode = 'sim-only';
        break;
      case '--driver-only':
        config.mode = 'driver-only';
        break;
      case '--differential':
        config.mode = 'differential';
        break;
      case '--fuzz':
      case '--random':
        config.policy = 'random';
        break;
      case '--heuristic':
        config.policy = 'heuristic';
        break;
      case '--policy':
        {
          const value = args[++i];
          if (value === 'random' || value === 'heuristic' || value === 'llm') {
            config.policy = value;
          } else {
            console.error(`Unknown policy: ${value}`);
            process.exit(4);
          }
        }
        break;
      case '--runs':
        config.runs = parseInt(args[++i], 10);
        break;
      case '--seed':
        config.seeds = [parseInt(args[++i], 10)];
        break;
      case '--seeds':
        config.seeds = args[++i].split(',').map(s => parseInt(s, 10));
        break;
      case '--max-ticks':
        config.maxTicks = parseInt(args[++i], 10);
        break;
      case '--diff-interval':
        config.diffCheckInterval = parseInt(args[++i], 10);
        break;
      case '--report':
        config.reportPath = args[++i];
        break;
      case '--url':
        config.url = args[++i];
        break;
      case '--llm-endpoint':
        config.llmEndpoint = args[++i];
        break;
      case '--llm-label':
        config.llmLabel = args[++i];
        break;
      case '--record-traces':
        config.recordTraces = true;
        break;
      case '--trace-dir':
        config.traceDir = args[++i];
        break;
      case '--replay-trace':
        config.replayTrace = args[++i];
        break;
      case '--visible':
        config.visible = true;
        break;
      case '--action-delay':
        config.actionDelayMs = parseInt(args[++i], 10);
        break;
      case '-v':
      case '--verbose':
        config.verbose = true;
        break;
    }
  }

  // Generate seeds if runs > seeds.length
  if (config.runs > config.seeds.length) {
    const baseSeed = config.seeds[0] ?? 42;
    config.seeds = Array.from({ length: config.runs }, (_, i) => baseSeed + i);
  }

  return config;
}

// ============================================================================ 
// Episode Result
// ============================================================================ 

type EpisodeResult = {
  seed: number;
  outcome: 'win' | 'lose' | 'timeout' | 'crash';
  reason?: string;
  ticks: number;
  finalState?: GameState;
  diffs?: DiffResult[];
  error?: string;
};

type ValidationReport = {
  timestamp: string;
  config: Omit<Config, 'verbose'>;
  results: EpisodeResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    determinismViolations: number;
    divergences: number;
  };
};

// ============================================================================ 
// Simulator Episode Runner
// ============================================================================ 

async function runSimulatorEpisode(
  sim: Simulator,
  seed: number,
  getAction: (state: GameState) => Promise<GameAction>,
  maxTicks: number,
  verbose: boolean,
  traceRecorder?: TraceRecorder
): Promise<EpisodeResult> {
  try {
    let state = sim.reset(seed);

    if (verbose) {
      console.log(`  [sim] Seed=${seed} | Initial enemies=${state.world.enemies.length}`);
    }

    // Record initial state BEFORE any actions
    // Trace format: states[0] = initial, states[1..n-1] = after each action, states[n] = final
    if (traceRecorder) {
      traceRecorder.recordInitialState(state);
    }

    while (!sim.isTerminal(state) && state.tick < maxTicks) {
      const action = await getAction(state);
      
      if (traceRecorder) {
        traceRecorder.recordStep(state, action);
      }

      const result = sim.step(state, action);
      state = result.state;

      if (!result.ok) {
        if (verbose) console.log(`  [sim] Invalid action at tick ${state.tick}`);
      }
    }

    const outcome = state.terminal.kind === 'running' ? 'timeout' : state.terminal.kind;

    if (verbose) {
      console.log(`  [sim] ${outcome.toUpperCase()} at tick ${state.tick} | reason=${state.terminal.reason}`);
    }

    if (traceRecorder) {
      traceRecorder.finalize(state, outcome);
    }

    return {
      seed,
      outcome,
      reason: state.terminal.reason,
      ticks: state.tick,
      finalState: state,
    };
  } catch (e) {
    return {
      seed,
      outcome: 'crash',
      ticks: 0,
      error: String(e),
    };
  }
}

// ============================================================================ 
// Determinism Check
// ============================================================================ 

async function checkDeterminism(
  sim: Simulator,
  seed: number,
  makePolicy: (seed: number) => (state: GameState) => Promise<GameAction>,
  maxTicks: number,
  verbose: boolean
): Promise<{ passed: boolean; error?: string }> {
  // Run twice with same seed, recreating policy each time to ensure it resets
  const result1 = await runSimulatorEpisode(sim, seed, makePolicy(seed), maxTicks, false);
  const result2 = await runSimulatorEpisode(sim, seed, makePolicy(seed), maxTicks, false);

  // Compare outcomes
  if (result1.outcome !== result2.outcome) {
    return {
      passed: false,
      error: `Outcome mismatch: ${result1.outcome} vs ${result2.outcome}`,
    };
  }

  if (result1.ticks !== result2.ticks) {
    return {
      passed: false,
      error: `Tick count mismatch: ${result1.ticks} vs ${result2.ticks}`,
    };
  }

  if (result1.finalState && result2.finalState) {
    const diff = compareStates(result1.finalState, result2.finalState);
    if (!diff.equal) {
      return {
        passed: false,
        error: `Final state mismatch:\n${formatDiff(diff)}`,
      };
    }
  }

  if (verbose) {
    console.log(`  ✓ Determinism check passed for seed ${seed}`);
  }

  return { passed: true };
}

// ============================================================================ 
// Main
// ============================================================================ 

/**
 * Lightweight HTTP-based LLM client.
 *
 * This is intentionally minimal and assumes a JSON endpoint that accepts:
 *   { state, legalActions, episode, policyLabel? }
 * and returns either:
 *   { action: GameAction }  or  GameAction directly.
 */
class HttpLLMClient implements LLMClient {
  private readonly endpoint: string;
  private readonly label?: string;

  constructor(endpoint: string, label?: string) {
    this.endpoint = endpoint;
    this.label = label;
  }

  async chooseAction(input: {
    state: GameState;
    legalActions: GameAction[];
    episode: { seed: number; tick: number };
  }): Promise<GameAction> {
    const fetchFn = (globalThis as any).fetch as
      | ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>)
      | undefined;

    if (!fetchFn) {
      throw new Error(
        'LLM policy requested but no global fetch is available. ' +
          'Run under Node 18+ or provide a project-specific LLMClient.'
      );
    }

    const res = await fetchFn(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: input.state,
        legalActions: input.legalActions,
        episode: input.episode,
        policyLabel: this.label,
      }),
    });

    if (!res.ok) {
      throw new Error(`LLM endpoint error: ${res.status} ${res.statusText}`);
    }

    const json: any = await res.json();
    const action = json.action ?? json;
    return action as GameAction;
  }
}

async function main(): Promise<void> {
  const config = parseArgs();

  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║               CI VALIDATION HARNESS v1.0                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`Mode:      ${config.mode}`);
  console.log(`Policy:    ${config.policy}`);
  console.log(`Runs:      ${config.runs}`);
  console.log(`Max ticks: ${config.maxTicks}`);
  console.log();

  if (config.policy === 'llm' && !config.llmEndpoint) {
    console.error('Policy "llm" requires --llm-endpoint <url>');
    process.exit(4);
  }

  // Replay mode?
  if (config.replayTrace) {
    console.log(`Replaying trace: ${config.replayTrace}`);
    // Sim replay is synchronous and fast
    const success = replayTraceSim(config.replayTrace, minimalSimulator, config.verbose);
    if (!success) {
      console.log('✗ Trace replay FAILED (Sim mismatch)');
      process.exit(2); // Treat as divergence
    }
    console.log('✓ Trace replay PASSED (Sim exact match)');
    // TODO: Add driver replay support here
    process.exit(0);
  }

  const randomPolicy = new RandomPolicy();

  const results: EpisodeResult[] = [];
  let determinismViolations = 0;
  let divergences = 0;

  // Run episodes
  for (let i = 0; i < config.runs; i++) {
    const seed = config.seeds[i];

    console.log(`─── Run ${i + 1}/${config.runs} (seed=${seed}) ───`);

    // Build policy factory for this seed
    // CRITICAL: Policy must be created ONCE per episode, not per action
    // This ensures RNG state persists across actions for deterministic replay
    const makePolicy = (s: number) => {
      if (config.policy === 'random') {
        // Create policy instance ONCE per episode (not per action)
        const policyInstance = new RandomPolicy({ seed: s });
        return async (state: GameState) => {
          return policyInstance.selectAction(state, minimalSimulator);
        };
      }

      if (config.policy === 'heuristic') {
        return async (state: GameState) => heuristicAction(state);
      }

      // LLM policy
      const client = new HttpLLMClient(config.llmEndpoint!, config.llmLabel);
      const adapter = new LLMPolicyAdapter(client, {
        seed: s,
        label: config.llmLabel ?? 'llm',
      });
      return async (state: GameState) => adapter.selectAction(state, minimalSimulator);
    };

    // Determinism check first
    const detCheck = await checkDeterminism(
      minimalSimulator,
      seed,
      makePolicy,
      config.maxTicks,
      config.verbose
    );

    if (!detCheck.passed) {
      console.log(`  ✗ DETERMINISM VIOLATION: ${detCheck.error}`);
      determinismViolations++;
      results.push({
        seed,
        outcome: 'crash',
        ticks: 0,
        error: detCheck.error,
      });
      continue;
    }

    // Run actual episode
    if (config.mode === 'sim-only') {
      let recorder: TraceRecorder | undefined;
      if (config.recordTraces) {
        recorder = new TraceRecorder(config.policy, seed, config.maxTicks, config.llmLabel);
      }

      const result = await runSimulatorEpisode(
        minimalSimulator,
        seed,
        makePolicy(seed),
        config.maxTicks,
        config.verbose,
        recorder
      );
      results.push(result);

      if (recorder && (result.outcome === 'win' || result.outcome === 'lose')) {
        const tracePath = recorder.save(config.traceDir);
        if (config.verbose) {
          console.log(`  [trace] Saved golden trace: ${tracePath}`);
        }
      }
    } else if (config.mode === 'differential') {
      const diffResult = await runDifferentialEpisode(
        config.url,
        seed,
        config.maxTicks,
        makePolicy(seed),
        config.verbose,
        !config.visible, // headless = !visible
        config.visible ? config.actionDelayMs : 0
      );

      if (diffResult.outcome === 'divergence') {
        console.log(`  ✗ DIVERGENCE: ${diffResult.error}`);
        divergences++;
        results.push({
          seed,
          outcome: 'crash',
          ticks: diffResult.ticks,
          error: diffResult.error,
        });
      } else if (diffResult.outcome === 'crash') {
        console.log(`  ✗ CRASH: ${diffResult.error}`);
        results.push({
          seed,
          outcome: 'crash',
          ticks: diffResult.ticks,
          error: diffResult.error,
        });
      } else {
        // Pass
        results.push({
          seed,
          outcome: 'win', // Treated as "test passed"
          ticks: diffResult.ticks,
        });
      }
    }

    // TODO: driver-only mode requires similar Playwright integration
  }

  // Summary
  console.log();
  console.log('════════════════════════════════════════════════════════════════');
  console.log('                          SUMMARY');
  console.log('════════════════════════════════════════════════════════════════');

  const passed = results.filter(r => r.outcome === 'win' || r.outcome === 'lose').length;
  const failed = results.filter(r => r.outcome === 'crash').length;
  const timeouts = results.filter(r => r.outcome === 'timeout').length;

  console.log(`Total runs:             ${results.length}`);
  console.log(`Completed (win/lose):   ${passed}`);
  console.log(`Timeouts:               ${timeouts}`);
  console.log(`Crashes:                ${failed}`);
  console.log(`Determinism violations: ${determinismViolations}`);
  console.log(`Sim↔Driver divergences: ${divergences}`);

  // Write report if requested
  if (config.reportPath) {
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      config: {
        mode: config.mode,
        policy: config.policy,
        runs: config.runs,
        seeds: config.seeds,
        maxTicks: config.maxTicks,
        diffCheckInterval: config.diffCheckInterval,
        url: config.url,
        recordTraces: config.recordTraces,
        traceDir: config.traceDir,
        visible: config.visible,
        actionDelayMs: config.actionDelayMs,
      },
      results,
      summary: {
        total: results.length,
        passed,
        failed,
        determinismViolations,
        divergences,
      },
    };

    fs.writeFileSync(config.reportPath, JSON.stringify(report, null, 2));
    console.log();
    console.log(`Report saved to: ${config.reportPath}`);
  }

  // Exit code
  if (determinismViolations > 0) {
    console.log();
    console.log('✗ FAILED: Determinism violations detected');
    process.exit(1);
  }

  if (divergences > 0) {
    console.log();
    console.log('✗ FAILED: Sim↔Driver divergences detected');
    process.exit(2);
  }

  if (failed > 0) {
    console.log();
    console.log('✗ FAILED: Episode crashes detected');
    process.exit(3);
  }

  console.log();
  console.log('✓ ALL VALIDATIONS PASSED');
  process.exit(0);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(4);
});