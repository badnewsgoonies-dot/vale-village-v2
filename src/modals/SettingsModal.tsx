import { FunctionComponent } from 'preact';
import { useSettings } from '../ui/hooks/useSettings';
import './modals.css';

interface SettingsModalProps {
  onClose?: () => void;
}

export const SettingsModal: FunctionComponent<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();

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
                Music Volume: {settings.musicVolume}%
              </label>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume}
                onInput={(e) => updateSettings({ musicVolume: parseInt((e.target as HTMLInputElement).value) })}
                class="setting-slider"
              />
            </div>

            <div class="setting-item">
              <label class="setting-label" for="sfx-volume">
                Sound Effects: {settings.sfxVolume}%
              </label>
              <input
                id="sfx-volume"
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onInput={(e) => updateSettings({ sfxVolume: parseInt((e.target as HTMLInputElement).value) })}
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
                  class={`setting-btn ${settings.battleSpeed === 'slow' ? 'active' : ''}`}
                  onClick={() => updateSettings({ battleSpeed: 'slow' })}
                >
                  Slow
                </button>
                <button
                  class={`setting-btn ${settings.battleSpeed === 'normal' ? 'active' : ''}`}
                  onClick={() => updateSettings({ battleSpeed: 'normal' })}
                >
                  Normal
                </button>
                <button
                  class={`setting-btn ${settings.battleSpeed === 'fast' ? 'active' : ''}`}
                  onClick={() => updateSettings({ battleSpeed: 'fast' })}
                >
                  Fast
                </button>
              </div>
            </div>

            <div class="setting-item">
              <label class="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.showDamageNumbers}
                  onChange={(e) => updateSettings({ showDamageNumbers: (e.target as HTMLInputElement).checked })}
                />
                <span>Show Damage Numbers</span>
              </label>
            </div>

            <div class="setting-item">
              <label class="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSettings({ autoSave: (e.target as HTMLInputElement).checked })}
                />
                <span>Auto-Save After Battles</span>
              </label>
            </div>
          </section>

          <section class="settings-section">
            <h3>Display</h3>
            <div class="setting-info">
              Resolution: {typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : 'N/A'}
            </div>
          </section>

          <div class="settings-footer">
            <button class="btn btn-secondary" onClick={resetSettings}>
              Reset to Defaults
            </button>
            <button class="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
