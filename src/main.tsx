import { render } from 'preact';
import { App } from './App';
import { ErrorBoundary } from './ui/components/ErrorBoundary';
import { validateGameData, formatValidationResult } from './data/validateData';
import './index.css';

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
