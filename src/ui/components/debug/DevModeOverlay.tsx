// @ts-nocheck
import { useState, useEffect } from 'preact/hooks';
import { useStore } from '../../state/store';
import { useGameStore } from '../../../store/gameStore';
import { ENCOUNTERS } from '../../../data/definitions/encounters';
import { HOUSE_IDS } from '../../../data/definitions/maps';
import './DevModeOverlay.css';

export function DevModeOverlay() {
  const { 
    devModeEnabled, toggleDevMode, 
    godMode, toggleGodMode,
    skipAnimations, toggleSkipAnimations
  } = useStore(s => ({
    devModeEnabled: s.devModeEnabled,
    toggleDevMode: s.toggleDevMode,
    godMode: s.godMode,
    toggleGodMode: s.toggleGodMode,
    skipAnimations: s.skipAnimations,
    toggleSkipAnimations: s.toggleSkipAnimations
  }));

  const { startTransition, setScreen } = useGameStore(s => ({
    startTransition: s.startTransition,
    setScreen: s.setScreen
  }));

  const v1SetBattle = useStore(s => s.setBattle);
  const v1SetMode = useStore(s => s.setMode);

  const [activeTab, setActiveTab] = useState<'cheats' | 'teleport' | 'state'>('cheats');

  // Keyboard toggle (Ctrl+D)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        toggleDevMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleDevMode]);

  if (!devModeEnabled) return null;

  const handleTeleport = (encounterId: string) => {
    console.log(`[DevMode] Teleporting to ${encounterId}`);
    
    // 1. Force battle for this encounter
    // This is a "Battle Teleport" - we jump straight to the fight
    const encounter = ENCOUNTERS[encounterId];
    if (!encounter) {
      alert(`Encounter ${encounterId} not found!`);
      return;
    }

    // Reset UI to overworld first to clear any weird states
    setScreen('overworld');
    
    // Small delay then trigger battle
    setTimeout(() => {
      // Use the global window helpers if available, or direct store manipulation
      // Ideally we call startBattle(encounterId)
      // Since we don't have a direct 'startBattle' hook here easily without more wiring,
      // we'll use the V1 store to set pending battle.
      useStore.getState().setPendingBattle(encounterId);
      useStore.getState().setMode('team-select');
      startTransition('team-select');
      toggleDevMode(); // Close overlay
    }, 100);
  };

  const handleWinBattle = () => {
    const battle = useStore.getState().battle;
    if (!battle) return;
    
    // Kill all enemies
    const newEnemies = battle.enemies.map(e => ({ ...e, currentHp: 0 }));
    v1SetBattle({ ...battle, enemies: newEnemies, phase: 'victory' });
  };

  return (
    <div className="dev-overlay-root">
      <div className="dev-window">
        <div className="dev-header">
          <span className="dev-title">Developer Tools</span>
          <button className="dev-close" onClick={toggleDevMode}>×</button>
        </div>
        
        <div className="dev-tabs">
          <button className={activeTab === 'cheats' ? 'active' : ''} onClick={() => setActiveTab('cheats')}>Cheats</button>
          <button className={activeTab === 'teleport' ? 'active' : ''} onClick={() => setActiveTab('teleport')}>Teleport</button>
          <button className={activeTab === 'state' ? 'active' : ''} onClick={() => setActiveTab('state')}>State</button>
        </div>

        <div className="dev-content">
          {activeTab === 'cheats' && (
            <div className="dev-panel cheats-panel">
              <div className="control-row">
                <label>
                  <input type="checkbox" checked={godMode} onChange={toggleGodMode} />
                  God Mode (Invincible + 1-Hit Kill)
                </label>
              </div>
              <div className="control-row">
                <label>
                  <input type="checkbox" checked={skipAnimations} onChange={toggleSkipAnimations} />
                  Skip Animations (Instant Actions)
                </label>
              </div>
              <hr />
              <div className="action-row">
                <button className="dev-action-btn" onClick={handleWinBattle}>Force Victory</button>
                <button className="dev-action-btn" onClick={() => useStore.getState().addGold(10000)}>+10,000 Gold</button>
                <button className="dev-action-btn" onClick={() => useStore.getState().healParty()}>Full Heal</button>
              </div>
            </div>
          )}

          {activeTab === 'teleport' && (
            <div className="dev-panel teleport-panel">
              <p className="hint">Jump directly to a House Battle</p>
              <div className="house-grid">
                {HOUSE_IDS.map(id => {
                  const encounterId = `house-${id}`;
                  return (
                    <button 
                      key={id} 
                      className="teleport-btn"
                      onClick={() => handleTeleport(encounterId)}
                    >
                      {id}
                    </button>
                  );
                })}
              </div>
              <p className="hint" style={{marginTop: 10}}>Bosses</p>
              <div className="boss-grid">
                <button className="teleport-btn" onClick={() => handleTeleport('house-50')}>The Golden Sun</button>
                <button className="teleport-btn" onClick={() => handleTeleport('house-45')}>The Eye</button>
              </div>
            </div>
          )}

          {activeTab === 'state' && (
            <div className="dev-panel state-panel">
              <pre>{JSON.stringify({
                mode: useStore.getState().mode,
                screen: useGameStore.getState().flow.screen,
                battlePhase: useStore.getState().battle?.phase,
                turn: useStore.getState().battle?.currentTurn,
              }, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
