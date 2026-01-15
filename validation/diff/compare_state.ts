/**
 * State Differential Oracle
 *
 * Answers the real question:
 * "Did the engine and the driver DISAGREE about reality?"
 *
 * This is the core invariant:
 *   sim.step(state, action).state ≡ driver.getState() after dispatch(action)
 *
 * With explicit tolerance zones for:
 * - Floating point noise (position, time)
 * - Non-deterministic cosmetics (particle IDs, animation frames)
 */

import type { GameState } from '../../src/dev/driver';
import { DEFAULT_DIFF_IGNORE_PATHS } from '../config';

// ============================================================================
// Configuration
// ============================================================================

export type DiffConfig = {
  /** Fields to ignore completely (cosmetic, non-deterministic) */
  ignorePaths: string[];

  /** Numeric tolerance for floating point comparisons */
  numericTolerance: number;

  /** Maximum depth for recursive comparison */
  maxDepth: number;
};

export const DEFAULT_DIFF_CONFIG: DiffConfig = {
  ignorePaths: DEFAULT_DIFF_IGNORE_PATHS,
  // Use a small but non-zero tolerance to absorb sub‑pixel jitter and
  // floating point noise between headless JS and browser runtimes.
  // Roughly equivalent to comparing values at ~2 decimal places.
  numericTolerance: 0.01,
  maxDepth: 10,
};

// ============================================================================
// Diff Result
// ============================================================================

export type FieldDiff = {
  path: string;
  simValue: unknown;
  driverValue: unknown;
  reason: 'missing_in_sim' | 'missing_in_driver' | 'type_mismatch' | 'value_mismatch';
};

export type DiffResult = {
  equal: boolean;
  diffs: FieldDiff[];
  simTick: number;
  driverTick: number;
};

// ============================================================================
// Core Comparison
// ============================================================================

export function compareStates(
  simState: GameState,
  driverState: GameState,
  config: DiffConfig = DEFAULT_DIFF_CONFIG
): DiffResult {
  const diffs: FieldDiff[] = [];

  // Tick mismatch is critical - check first
  if (simState.tick !== driverState.tick) {
    diffs.push({
      path: 'tick',
      simValue: simState.tick,
      driverValue: driverState.tick,
      reason: 'value_mismatch',
    });
  }

  // Deep compare
  compareRecursive(
    simState,
    driverState,
    '',
    diffs,
    config,
    0
  );

  return {
    equal: diffs.length === 0,
    diffs,
    simTick: simState.tick,
    driverTick: driverState.tick,
  };
}

function compareRecursive(
  sim: unknown,
  driver: unknown,
  path: string,
  diffs: FieldDiff[],
  config: DiffConfig,
  depth: number
): void {
  // Bail on max depth
  if (depth > config.maxDepth) return;

  // Skip ignored paths
  for (const ignore of config.ignorePaths) {
    if (path === ignore || path.startsWith(ignore + '.')) return;
  }

  // Type comparison
  const simType = getType(sim);
  const driverType = getType(driver);

  if (simType !== driverType) {
    diffs.push({
      path: path || 'root',
      simValue: sim,
      driverValue: driver,
      reason: 'type_mismatch',
    });
    return;
  }

  // Handle by type
  switch (simType) {
    case 'null':
    case 'undefined':
      // Both null/undefined - equal
      return;

    case 'number':
      if (!numbersEqual(sim as number, driver as number, config.numericTolerance)) {
        diffs.push({
          path,
          simValue: sim,
          driverValue: driver,
          reason: 'value_mismatch',
        });
      }
      return;

    case 'string':
    case 'boolean':
      if (sim !== driver) {
        diffs.push({
          path,
          simValue: sim,
          driverValue: driver,
          reason: 'value_mismatch',
        });
      }
      return;

    case 'array':
      compareArrays(
        sim as unknown[],
        driver as unknown[],
        path,
        diffs,
        config,
        depth
      );
      return;

    case 'object':
      compareObjects(
        sim as Record<string, unknown>,
        driver as Record<string, unknown>,
        path,
        diffs,
        config,
        depth
      );
      return;
  }
}

function compareArrays(
  simArr: unknown[],
  driverArr: unknown[],
  path: string,
  diffs: FieldDiff[],
  config: DiffConfig,
  depth: number
): void {
  if (simArr.length !== driverArr.length) {
    diffs.push({
      path: path + '.length',
      simValue: simArr.length,
      driverValue: driverArr.length,
      reason: 'value_mismatch',
    });
    // Continue comparing elements that exist in both
  }

  const minLen = Math.min(simArr.length, driverArr.length);
  for (let i = 0; i < minLen; i++) {
    compareRecursive(
      simArr[i],
      driverArr[i],
      `${path}[${i}]`,
      diffs,
      config,
      depth + 1
    );
  }
}

function compareObjects(
  simObj: Record<string, unknown>,
  driverObj: Record<string, unknown>,
  path: string,
  diffs: FieldDiff[],
  config: DiffConfig,
  depth: number
): void {
  const simKeys = new Set(Object.keys(simObj));
  const driverKeys = new Set(Object.keys(driverObj));

  // Keys in sim but not driver
  for (const key of simKeys) {
    if (!driverKeys.has(key)) {
      const fullPath = path ? `${path}.${key}` : key;
      // Skip ignored paths
      if (!config.ignorePaths.some(p => fullPath === p || fullPath.startsWith(p + '.'))) {
        diffs.push({
          path: fullPath,
          simValue: simObj[key],
          driverValue: undefined,
          reason: 'missing_in_driver',
        });
      }
    }
  }

  // Keys in driver but not sim
  for (const key of driverKeys) {
    if (!simKeys.has(key)) {
      const fullPath = path ? `${path}.${key}` : key;
      if (!config.ignorePaths.some(p => fullPath === p || fullPath.startsWith(p + '.'))) {
        diffs.push({
          path: fullPath,
          simValue: undefined,
          driverValue: driverObj[key],
          reason: 'missing_in_sim',
        });
      }
    }
  }

  // Keys in both - recurse
  for (const key of simKeys) {
    if (driverKeys.has(key)) {
      const fullPath = path ? `${path}.${key}` : key;
      compareRecursive(
        simObj[key],
        driverObj[key],
        fullPath,
        diffs,
        config,
        depth + 1
      );
    }
  }
}

// ============================================================================
// Helpers
// ============================================================================

type ValueType = 'null' | 'undefined' | 'number' | 'string' | 'boolean' | 'array' | 'object';

function getType(value: unknown): ValueType {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value as ValueType;
}

function numbersEqual(a: number, b: number, tolerance: number): boolean {
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a - b) <= tolerance;
}

// ============================================================================
// Pretty Print
// ============================================================================

export function formatDiff(result: DiffResult): string {
  if (result.equal) {
    return `✓ States match at tick ${result.simTick}`;
  }

  const lines = [
    `✗ States DIVERGED at tick sim=${result.simTick} driver=${result.driverTick}`,
    `  ${result.diffs.length} difference(s):`,
  ];

  for (const diff of result.diffs.slice(0, 10)) {
    const simStr = JSON.stringify(diff.simValue);
    const driverStr = JSON.stringify(diff.driverValue);
    lines.push(`  - ${diff.path}: sim=${simStr} driver=${driverStr} (${diff.reason})`);
  }

  if (result.diffs.length > 10) {
    lines.push(`  ... and ${result.diffs.length - 10} more`);
  }

  return lines.join('\n');
}

// ============================================================================
// Assertions
// ============================================================================

export function assertStatesEqual(
  simState: GameState,
  driverState: GameState,
  config?: DiffConfig
): void {
  const result = compareStates(simState, driverState, config);
  if (!result.equal) {
    throw new Error(formatDiff(result));
  }
}

// ============================================================================
// Divergence Oracle (LLM-friendly)
// ============================================================================

export type DiffContext = {
  /** Logical tick when the divergence check was performed */
  tick?: number;
  /** Optional episode seed for easier reproduction */
  seed?: number;
  /** Optional label for the calling harness (e.g. 'ci-differential') */
  label?: string;
};

/**
 * Hard assertion helper for CI / agents.
 *
 * - Normalizes numeric jitter via DiffConfig.numericTolerance
 * - Emits a compact list of divergent field paths for fast debugging
 * - Throws with a machine-readable error signature
 */
export function diffStatesOrThrow(
  simState: GameState,
  driverState: GameState,
  ctx: DiffContext = {},
  config?: DiffConfig
): void {
  const result = compareStates(simState, driverState, config);
  if (result.equal) return;

  const divergentFields = Array.from(
    new Set(result.diffs.map(d => d.path || 'root'))
  );

  const headerParts: string[] = [];
  if (typeof ctx.tick === 'number') headerParts.push(`tick=${ctx.tick}`);
  if (typeof ctx.seed === 'number') headerParts.push(`seed=${ctx.seed}`);
  if (ctx.label) headerParts.push(`label=${ctx.label}`);

  // Human-friendly log for console / CI output
  // (agents can still parse the thrown error message)
  // eslint-disable-next-line no-console
  console.error('❌ STATE DIVERGENCE', headerParts.length ? `[${headerParts.join(' ')}]` : '');
  // eslint-disable-next-line no-console
  console.error(`Fields: ${divergentFields.join(', ')}`);
  // eslint-disable-next-line no-console
  console.error(formatDiff(result));

  throw new Error(
    `STATE_DIVERGENCE:${divergentFields.join(',')}` +
      (headerParts.length ? `|${headerParts.join('|')}` : '')
  );
}
