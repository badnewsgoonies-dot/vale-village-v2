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

if (!rootElement) {
  throw new Error(
    'Root element not found. Expected element with id="root" in index.html.'
  );
}

// Validate game data at startup
const validationResult = validateGameData();
if (!validationResult.valid) {
  console.error(formatValidationResult(validationResult));
  if (import.meta.env.DEV) {
    // In development, show detailed error
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: monospace; background: #1a1a2e; color: #ff6b6b; min-height: 100vh;">
        <h1>Game Data Validation Failed</h1>
        <pre style="white-space: pre-wrap;">${formatValidationResult(validationResult)}</pre>
      </div>
    `;
    throw new Error('Game data validation failed. Check console for details.');
  }
}

render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  rootElement
);
