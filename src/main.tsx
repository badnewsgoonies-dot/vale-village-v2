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

function Bootstrap() {
  try {
    const validationResult = validateGameData();
    if (!validationResult.valid) {
      const details = formatValidationResult(validationResult);
      console.error(details);

      if (import.meta.env.DEV) {
        return (
          <div
            style={{
              padding: '20px',
              fontFamily: 'monospace',
              background: '#1a1a2e',
              color: '#ff6b6b',
              minHeight: '100vh',
              whiteSpace: 'pre-wrap',
            }}
          >
            <h1>Game Data Validation Failed</h1>
            <pre>{details}</pre>
          </div>
        );
      }
    }

    return <App />;
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return (
      <div
        style={{
          padding: '20px',
          fontFamily: 'monospace',
          background: '#1a1a2e',
          color: '#ff6b6b',
          minHeight: '100vh',
          whiteSpace: 'pre-wrap',
        }}
      >
        <h1>Startup Failed</h1>
        <pre>{message}</pre>
      </div>
    );
  }
}

render(
  <ErrorBoundary>
    <Bootstrap />
  </ErrorBoundary>,
  rootElement
);
