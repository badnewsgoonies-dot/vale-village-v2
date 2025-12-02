import { render } from 'preact';
import { App } from './App';
import './index.css';

// Bootstrap the game
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Expected element with id="root" in index.html.'
  );
}

// TODO: Add data validation with Zod at startup
// TODO: Add error boundary component

render(<App />, rootElement);
