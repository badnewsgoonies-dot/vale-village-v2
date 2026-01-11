"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("preact/jsx-runtime");
const preact_1 = require("preact");
const App_1 = require("./App");
const ErrorBoundary_1 = require("./ui/components/ErrorBoundary");
const validateData_1 = require("./data/validateData");
const gameStore_1 = require("./store/gameStore");
const prng_1 = require("./core/random/prng");
const Team_1 = require("./core/models/Team");
const Unit_1 = require("./core/models/Unit");
const units_1 = require("./data/definitions/units");
const encounters_1 = require("./data/definitions/encounters");
const EncounterService_1 = require("./core/services/EncounterService");
const store_1 = require("./ui/state/store");
require("./index.css");
// Expose store for testing/debugging
if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
    window.gameStore = gameStore_1.useGameStore;
    window.v1Store = store_1.store;
    window.createBattleFromEncounter = EncounterService_1.createBattleFromEncounter;
    window.makePRNG = prng_1.makePRNG;
    window.createTeam = Team_1.createTeam;
    window.createUnit = Unit_1.createUnit;
    window.UNIT_DEFINITIONS = units_1.UNIT_DEFINITIONS;
    window.ENCOUNTERS = encounters_1.ENCOUNTERS;
}
// Bootstrap the game
const rootElement = document.getElementById('root');
function pushBootError(err, context = '') {
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
        }
        catch (e) {
            // Ignore storage failures (privacy or storage quota) to remain non-invasive
        }
    }
    catch (_) {
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
        validationResult = await (0, validateData_1.validateGameData)();
    }
    catch (err) {
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
        console.error((0, validateData_1.formatValidationResult)(validationResult));
        pushBootError((0, validateData_1.formatValidationResult)(validationResult), 'validation-failure');
        // Show a safe fallback UI so the app doesn't attempt to render with invalid data
        rootElement.innerHTML = `
      <div style="padding: 20px; font-family: monospace; background: #1a1a2e; color: #ff6b6b; min-height: 100vh;">
        <h1>Game Data Validation Failed</h1>
        <p style="color: #ffd966;">See browser console and localStorage key <code>vv2:boot_errors</code> for details.</p>
        <pre style="white-space: pre-wrap;">${(0, validateData_1.formatValidationResult)(validationResult)}</pre>
      </div>
    `;
        // In development, log a warning but do not throw to allow the fallback UI to display.
        if (import.meta.env.DEV) {
            console.warn('Game data validation failed (DEV). Check console and localStorage key vv2:boot_errors for details.');
        }
    }
    else {
        try {
            (0, preact_1.render)((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(App_1.App, {}) }), rootElement);
        }
        catch (err) {
            pushBootError(err, 'render-threw');
            throw err; // rethrow so dev tooling can surface the failure
        }
    }
})();
