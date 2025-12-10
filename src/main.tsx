import { render } from 'preact';
import { App } from './App';
import { ErrorBoundary } from './ui/components/ErrorBoundary';
import './index.css';

// Bootstrap the game
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Expected element with id="root" in index.html.'
  );
}

// TODO: Add data validation with Zod at startup

render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  rootElement
);
