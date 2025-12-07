import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

interface SettingsModalProps {
  onClose?: () => void;
}

export const SettingsModal: FunctionComponent<SettingsModalProps> = ({ onClose }) => {
  // Local state for settings (could be moved to global store later)
  const [musicVolume, setMusicVolume] = useState(70);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [battleSpeed, setBattleSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showDamageNumbers, setShowDamageNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal modal--settings" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Settings</h2>
          <button class="close-btn" onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </div>

        <div class="modal-content">
          <section class="settings-section">
            <h3>Audio</h3>

            <div class="setting-item">
              <label class="setting-label" for="music-volume">
                Music Volume: {musicVolume}%
              </label>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onInput={(e) => setMusicVolume(parseInt((e.target as HTMLInputElement).value))}
                class="setting-slider"
              />
            </div>

            <div class="setting-item">
              <label class="setting-label" for="sfx-volume">
                Sound Effects: {sfxVolume}%
              </label>
              <input
                id="sfx-volume"
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onInput={(e) => setSfxVolume(parseInt((e.target as HTMLInputElement).value))}
                class="setting-slider"
              />
            </div>
          </section>

          <section class="settings-section">
            <h3>Gameplay</h3>

            <div class="setting-item">
              <label class="setting-label">Battle Speed</label>
              <div class="setting-buttons">
                <button
                  class={`setting-btn ${battleSpeed === 'slow' ? 'active' : ''}`}
                  onClick={() => setBattleSpeed('slow')}
                >
                  Slow
                </button>
                <button
                  class={`setting-btn ${battleSpeed === 'normal' ? 'active' : ''}`}
                  onClick={() => setBattleSpeed('normal')}
                >
                  Normal
                </button>
                <button
                  class={`setting-btn ${battleSpeed === 'fast' ? 'active' : ''}`}
                  onClick={() => setBattleSpeed('fast')}
                >
                  Fast
                </button>
              </div>
            </div>

            <div class="setting-item">
              <label class="setting-checkbox">
                <input
                  type="checkbox"
                  checked={showDamageNumbers}
                  onChange={(e) => setShowDamageNumbers((e.target as HTMLInputElement).checked)}
                />
                <span>Show Damage Numbers</span>
              </label>
            </div>

            <div class="setting-item">
              <label class="setting-checkbox">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave((e.target as HTMLInputElement).checked)}
                />
                <span>Auto-Save After Battles</span>
              </label>
            </div>
          </section>

          <section class="settings-section">
            <h3>Display</h3>
            <div class="setting-info">
              Resolution: {window.innerWidth} × {window.innerHeight}
            </div>
          </section>

          <div class="settings-footer">
            <button class="btn btn-primary" onClick={onClose}>
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
