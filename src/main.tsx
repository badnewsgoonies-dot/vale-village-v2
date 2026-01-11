import { render } from 'preact';
import { App } from './App';
import { ErrorBoundary } from './ui/components/ErrorBoundary';
import { validateGameData, formatValidationResult } from './data/validateData';
import { useGameStore } from './store/gameStore';
import { makePRNG } from './core/random/prng';
import { createTeam } from './core/models/Team';
import { createUnit } from './core/models/Unit';
import { UNIT_DEFINITIONS } from './data/definitions/units';
import { ENCOUNTERS } from './data/definitions/encounters';
import { createBattleFromEncounter } from './core/services/EncounterService';
import { store as v1Store } from './ui/state/store';
import './index.css';

// Expose store for testing/debugging
if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
  (window as any).gameStore = useGameStore;
  (window as any).v1Store = v1Store;
  (window as any).createBattleFromEncounter = createBattleFromEncounter;
  (window as any).makePRNG = makePRNG;
  (window as any).createTeam = createTeam;
  (window as any).createUnit = createUnit;
  (window as any).UNIT_DEFINITIONS = UNIT_DEFINITIONS;
  (window as any).ENCOUNTERS = ENCOUNTERS;
}

// Bootstrap the game
const rootElement = document.getElementById('root');

function pushBootError(err: unknown, context = '') {
  try {
    const entry = {
      ts: new Date().toISOString(),
      context,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    };
    // Always surface boot errors clearly in console with a prefix
    console.error('[BOOT-ERROR]', entry);
    try {
      const key = 'vv2:boot_errors';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(entry);
      // keep only recent 50 entries
      localStorage.setItem(key, JSON.stringify(existing.slice(-50)));
    } catch (e) {
      // Ignore storage failures (privacy or storage quota) to remain non-invasive
    }
  } catch (_) {
    // Best-effort only
  }
}

// Global handlers to capture uncaught runtime failures during boot
window.addEventListener('error', (ev) => {
  // ev.error may be undefined in some browsers
  // @ts-ignore
  pushBootError(ev.error || ev.message || 'window error', 'window.onerror');
});
window.addEventListener('unhandledrejection', (ev) => {
  // @ts-ignore
  pushBootError(ev.reason || 'unhandledrejection', 'unhandledrejection');
});

(async () => {
  if (!rootElement) {
    const err = new Error('Root element not found. Expected element with id="root" in index.html.');
    pushBootError(err, 'root-missing');
    throw err;
  }

  // Validate game data at startup (guarding against runtime exceptions in validation)
  let validationResult;
  try {
    // validateGameData may now be async; await it
    // eslint-disable-next-line @typescript-eslint/await-thenable
    validationResult = await validateGameData();
  } catch (err) {
    pushBootError(err, 'validateGameData-threw');
    validationResult = {
      valid: false,
      errors: [
        {
          category: 'ValidationRuntime',
          id: 'validateGameData',
          errors: [err instanceof Error ? (err.stack || err.message) : String(err)],
        },
      ],
      warnings: [],
    };
  }

  if (!validationResult.valid) {
    // Always log validation failures
    console.error(formatValidationResult(validationResult));
    pushBootError(formatValidationResult(validationResult), 'validation-failure');

    // Show a safe fallback UI so the app doesn't attempt to render with invalid data
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: monospace; background: #1a1a2e; color: #ff6b6b; min-height: 100vh;">
        <h1>Game Data Validation Failed</h1>
        <p style="color: #ffd966;">See browser console and localStorage key <code>vv2:boot_errors</code> for details.</p>
        <pre style="white-space: pre-wrap;">${formatValidationResult(validationResult)}</pre>
      </div>
    `;

    // In development, log a warning but do not throw to allow the fallback UI to display.
    if (import.meta.env.DEV) {
      console.warn('Game data validation failed (DEV). Check console and localStorage key vv2:boot_errors for details.');
    }
  } else {
    try {
      render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>,
        rootElement
      );
    } catch (err) {
      pushBootError(err, 'render-threw');
      throw err; // rethrow so dev tooling can surface the failure
    }
  }
})();
