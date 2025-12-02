import { useEffect, useState } from 'preact/hooks';
import './index.css';

// Game modes - will expand as we add components
type GameMode = 'title' | 'overworld' | 'battle' | 'dialogue';

export function App() {
  const [mode, setMode] = useState<GameMode>('title');
  const [initialized, setInitialized] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      // TODO: Load save data, initialize state
    }
  }, [initialized]);

  // ESC key handler for pause menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'overworld') {
        e.preventDefault();
        // TODO: Show pause menu
        console.log('Pause menu triggered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  return (
    <div class="game-container">
      {/* Header HUD - hidden on title */}
      {mode !== 'title' && (
        <header class="game-hud">
          <span class="game-hud__title">Vale Village v2</span>
          <span class="game-hud__hint">Press ESC for menu</span>
        </header>
      )}

      {/* Main content based on mode */}
      <main class="game-main">
        {mode === 'title' && (
          <div class="title-screen">
            <h1>Vale Village</h1>
            <button onClick={() => setMode('overworld')}>Start Game</button>
          </div>
        )}

        {mode === 'overworld' && (
          <div class="overworld">
            <p>Overworld placeholder</p>
            <button onClick={() => setMode('battle')}>Test Battle</button>
          </div>
        )}

        {mode === 'battle' && (
          <div class="battle-screen">
            <p>Battle placeholder</p>
            <button onClick={() => setMode('overworld')}>End Battle</button>
          </div>
        )}

        {mode === 'dialogue' && (
          <div class="dialogue-screen">
            <p>Dialogue placeholder</p>
            <button onClick={() => setMode('overworld')}>Close</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
