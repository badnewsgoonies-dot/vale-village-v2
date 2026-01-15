/**
 * Validation Module Index
 *
 * CI-grade validation harness for game automation.
 * Proves determinism, detects sim↔driver divergence, policy-agnostic.
 */

// Core simulator
export {
  type Simulator,
  type SimulatorStepResult,
  MinimalSimulator,
  minimalSimulator,
} from './simulator';

// State comparison
export {
  compareStates,
  formatDiff,
  assertStatesEqual,
  type DiffResult,
  type FieldDiff,
  type DiffConfig,
  DEFAULT_DIFF_CONFIG,
} from './diff/compare_state';

// Policies
export { RandomPolicy, randomAction } from './policies/random';
export {
  heuristicAction,
  configurableHeuristicAction,
  type HeuristicConfig,
  DEFAULT_HEURISTIC_CONFIG,
} from './policies/heuristic';
