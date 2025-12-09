import { render } from 'preact';
import { App } from './App';
import { GameErrorBoundary } from './ui/components/GameErrorBoundary';
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
  // Show user-friendly error screen for data corruption
  const errorMessage = formatValidationResult(validationResult);
  console.error('Game data validation failed:', errorMessage);

  render(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff6b6b' }}>
        Game Data Error
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
        Unable to start the game due to corrupted or invalid data.
        Please try refreshing the page or clearing your browser cache.
      </p>
      <details style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#2a2a3e',
        borderRadius: '4px',
        maxWidth: '800px',
        width: '100%',
      }}>
        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
          Technical Details ({validationResult.errors.length} errors)
        </summary>
        <pre style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '0.85rem',
          color: '#ff6b6b',
          marginTop: '1rem',
        }}>
          {errorMessage}
        </pre>
      </details>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#2196F3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Reload Game
      </button>
    </div>,
    rootElement
  );
} else {
  // Log warnings if any
  if (validationResult.warnings.length > 0) {
    console.warn('Game data warnings:', validationResult.warnings);
  }

  // Render app wrapped in ErrorBoundary
  render(
    <GameErrorBoundary>
      <App />
    </GameErrorBoundary>,
    rootElement
  );
}
