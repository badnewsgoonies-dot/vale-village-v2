/**
 * SettingsScreen Component
 * Golden Sun-inspired settings with tabs for Audio, Display, Controls, Gameplay
 */

import { useState, useEffect, useCallback } from 'preact/hooks';
import './SettingsScreen.css';

type Tab = 'audio' | 'display' | 'controls' | 'gameplay';
type BattleSpeed = 'slow' | 'normal' | 'fast' | 'ultra';
type Difficulty = 'easy' | 'normal' | 'hard';

interface SettingsScreenProps {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('audio');

  // Audio settings
  const [masterVolume, setMasterVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [battleMusic, setBattleMusic] = useState(true);
  const [uiSounds, setUiSounds] = useState(true);

  // Display settings
  const [screenShake, setScreenShake] = useState(true);
  const [battleAnimations, setBattleAnimations] = useState(true);
  const [showDamageNumbers, setShowDamageNumbers] = useState(true);

  // Gameplay settings
  const [battleSpeed, setBattleSpeed] = useState<BattleSpeed>('normal');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [autoSave, setAutoSave] = useState(true);
  const [battleTooltips, setBattleTooltips] = useState(true);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleResetDefaults = useCallback(() => {
    setMasterVolume(80);
    setMusicVolume(70);
    setSfxVolume(80);
    setBattleMusic(true);
    setUiSounds(true);
    setScreenShake(true);
    setBattleAnimations(true);
    setShowDamageNumbers(true);
    setBattleSpeed('normal');
    setDifficulty('normal');
    setAutoSave(true);
    setBattleTooltips(true);
  }, []);

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'audio', icon: '🔊', label: 'Audio' },
    { id: 'display', icon: '🖥️', label: 'Display' },
    { id: 'controls', icon: '🎮', label: 'Controls' },
    { id: 'gameplay', icon: '⚔️', label: 'Gameplay' },
  ];

  const keybinds = [
    { action: 'Move', key: 'WASD / Arrows' },
    { action: 'Confirm', key: 'Enter / Space' },
    { action: 'Cancel', key: 'Escape' },
    { action: 'Pause', key: 'P / Escape' },
    { action: 'Inventory', key: 'I' },
    { action: 'Team', key: 'T' },
    { action: 'Djinn', key: 'D' },
    { action: 'Quick Attack', key: 'Q' },
  ];

  return (
    <div class="settings-overlay">
      <div class="settings-container">
        {/* Header */}
        <div class="settings-header">
          <h1 class="settings-title">
            <span>⚙️</span>
            <span>Settings</span>
          </h1>
          <button class="settings-close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Tab Navigation */}
        <div class="settings-tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              class={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div class="settings-content">
          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div class="settings-panel">
              <div class="settings-group">
                <h3 class="settings-group-title">Volume</h3>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Master Volume</div>
                    <div class="setting-description">Overall game volume</div>
                  </div>
                  <div class="slider-container">
                    <input
                      type="range"
                      class="settings-slider"
                      min="0"
                      max="100"
                      value={masterVolume}
                      onInput={(e) => setMasterVolume(parseInt((e.target as HTMLInputElement).value))}
                      style={{ '--value': `${masterVolume}%` } as any}
                    />
                    <span class="slider-value">{masterVolume}%</span>
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Music Volume</div>
                    <div class="setting-description">Background music level</div>
                  </div>
                  <div class="slider-container">
                    <input
                      type="range"
                      class="settings-slider"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onInput={(e) => setMusicVolume(parseInt((e.target as HTMLInputElement).value))}
                      style={{ '--value': `${musicVolume}%` } as any}
                    />
                    <span class="slider-value">{musicVolume}%</span>
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Sound Effects</div>
                    <div class="setting-description">Battle and UI sounds</div>
                  </div>
                  <div class="slider-container">
                    <input
                      type="range"
                      class="settings-slider"
                      min="0"
                      max="100"
                      value={sfxVolume}
                      onInput={(e) => setSfxVolume(parseInt((e.target as HTMLInputElement).value))}
                      style={{ '--value': `${sfxVolume}%` } as any}
                    />
                    <span class="slider-value">{sfxVolume}%</span>
                  </div>
                </div>
              </div>

              <div class="settings-group">
                <h3 class="settings-group-title">Options</h3>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Battle Music</div>
                    <div class="setting-description">Play music during battles</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={battleMusic}
                      onChange={(e) => setBattleMusic((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">UI Sounds</div>
                    <div class="setting-description">Menu and selection sounds</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={uiSounds}
                      onChange={(e) => setUiSounds((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div class="settings-panel">
              <div class="settings-group">
                <h3 class="settings-group-title">Visual Effects</h3>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Screen Shake</div>
                    <div class="setting-description">Shake effect on impacts</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={screenShake}
                      onChange={(e) => setScreenShake((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Battle Animations</div>
                    <div class="setting-description">Show attack animations</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={battleAnimations}
                      onChange={(e) => setBattleAnimations((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Damage Numbers</div>
                    <div class="setting-description">Show floating damage text</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={showDamageNumbers}
                      onChange={(e) => setShowDamageNumbers((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>
              </div>

              <div class="settings-group">
                <h3 class="settings-group-title">Display Info</h3>
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Resolution</div>
                    <div class="setting-description">Current window size</div>
                  </div>
                  <span class="setting-value">{window.innerWidth} × {window.innerHeight}</span>
                </div>
              </div>
            </div>
          )}

          {/* Controls Tab */}
          {activeTab === 'controls' && (
            <div class="settings-panel">
              <div class="settings-group">
                <h3 class="settings-group-title">Key Bindings</h3>
                <div class="keybind-grid">
                  {keybinds.map((bind) => (
                    <div key={bind.action} class="keybind-item">
                      <span class="keybind-action">{bind.action}</span>
                      <span class="keybind-key">{bind.key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gameplay Tab */}
          {activeTab === 'gameplay' && (
            <div class="settings-panel">
              <div class="settings-group">
                <h3 class="settings-group-title">Battle</h3>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Battle Speed</div>
                    <div class="setting-description">Animation playback speed</div>
                  </div>
                  <div class="button-group">
                    {(['slow', 'normal', 'fast', 'ultra'] as BattleSpeed[]).map((speed) => (
                      <button
                        key={speed}
                        class={`button-option ${battleSpeed === speed ? 'selected' : ''}`}
                        onClick={() => setBattleSpeed(speed)}
                      >
                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Battle Tooltips</div>
                    <div class="setting-description">Show ability descriptions</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={battleTooltips}
                      onChange={(e) => setBattleTooltips((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>
              </div>

              <div class="settings-group">
                <h3 class="settings-group-title">Game</h3>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Difficulty</div>
                    <div class="setting-description">Enemy strength modifier</div>
                  </div>
                  <div class="button-group">
                    {(['easy', 'normal', 'hard'] as Difficulty[]).map((diff) => (
                      <button
                        key={diff}
                        class={`button-option ${difficulty === diff ? 'selected' : ''}`}
                        onClick={() => setDifficulty(diff)}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-label">Auto-Save</div>
                    <div class="setting-description">Save after each battle</div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave((e.target as HTMLInputElement).checked)}
                    />
                    <span class="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div class="settings-footer">
          <div class="footer-info">
            Press ESC to close
          </div>
          <div class="footer-buttons">
            <button class="footer-btn" onClick={handleResetDefaults}>
              Reset Defaults
            </button>
            <button class="footer-btn primary" onClick={onClose}>
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
