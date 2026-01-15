
import { chromium, Page, Browser } from 'playwright';
import { minimalSimulator, type Simulator } from '../simulator';
import { compareStates, formatDiff } from '../diff/compare_state';
import type { GameState, GameAction, GameDriver } from '../../src/dev/driver';

// ============================================================================
// Types
// ============================================================================

export type DifferentialResult = {
  seed: number;
  ticks: number;
  outcome: 'pass' | 'fail' | 'divergence' | 'crash';
  error?: string;
  diffs?: string;
};

// ============================================================================
// Runner
// ============================================================================

export async function runDifferentialEpisode(
  url: string,
  seed: number,
  maxTicks: number,
  policy: (state: GameState) => GameAction | Promise<GameAction>,
  verbose: boolean = false
): Promise<DifferentialResult> {
  let browser: Browser | undefined;
  
  try {
    // 1. Launch Browser
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // 2. Load Game
    await page.goto(url);
    await page.waitForFunction(() => (window as any).__GAME_DRIVER__ !== undefined);

    // 3. Initialize Sim & Driver
    const sim = minimalSimulator;
    let simState = sim.reset(seed);
    
    await page.evaluate((s) => {
      (window as any).__GAME_DRIVER__.resetRun(s);
    }, seed);

    let driverState = await page.evaluate(() => {
      return (window as any).__GAME_DRIVER__.getState();
    });

    // 4. Verify Initial State
    let diff = compareStates(simState, driverState);
    if (!diff.equal) {
      return {
        seed,
        ticks: 0,
        outcome: 'divergence',
        error: 'Initial state mismatch',
        diffs: formatDiff(diff)
      };
    }

    if (verbose) console.log(`  [diff] Episode started. Seed=${seed}`);

    // 5. Differential Loop
    while (!sim.isTerminal(simState) && simState.tick < maxTicks) {
      // A. Pick Action (using Sim state as truth)
      const action = await policy(simState);

      // B. Step Sim
      const simStep = sim.step(simState, action);
      const nextSimState = simStep.state;

      // C. Step Driver
      await page.evaluate((act) => {
        return (window as any).__GAME_DRIVER__.dispatch(act);
      }, action);

      // D. Fetch Driver State
      const nextDriverState = await page.evaluate(() => {
        return (window as any).__GAME_DRIVER__.getState();
      });

      // E. Compare
      diff = compareStates(nextSimState, nextDriverState);
      
      if (!diff.equal) {
        if (verbose) {
           console.error(`  [diff] DIVERGENCE at tick ${nextSimState.tick}`);
           console.error(formatDiff(diff));
        }
        return {
          seed,
          ticks: nextSimState.tick,
          outcome: 'divergence',
          error: `Divergence at tick ${nextSimState.tick}`,
          diffs: formatDiff(diff)
        };
      }

      // Advance
      simState = nextSimState;
      driverState = nextDriverState; // Not strictly needed as we fetch fresh, but good for debug
    }

    if (verbose) console.log(`  [diff] Episode finished. Ticks=${simState.tick}`);

    return {
      seed,
      ticks: simState.tick,
      outcome: 'pass'
    };

  } catch (e) {
    return {
      seed,
      ticks: 0,
      outcome: 'crash',
      error: String(e)
    };
  } finally {
    if (browser) await browser.close();
  }
}
