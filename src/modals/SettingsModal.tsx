import { FunctionComponent } from 'preact';
import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import { useSettings } from '../ui/hooks/useSettings';
import './modals.css';

interface SettingsModalProps {
  onClose?: () => void;
}

type SettingsTab = 'audio' | 'gameplay' | 'display';

export const SettingsModal: FunctionComponent<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>('audio');
  const modalRef = useRef<HTMLDivElement>(null);

  const openerRef = useRef<HTMLElement | null>(null);
  // Capture opener and focus modal on mount for accessibility and keyboard navigation
  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => {
    onClose?.();
    setTimeout(() => {
      openerRef.current?.focus();
    }, 0);
  }, [onClose]);

  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      handleClose();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, handleClose]);

  return (
    <div class="modal-overlay" onClick={handleClose} role="presentation">
      <div
        class="modal modal--settings"
        data-testid="settings-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div class="modal-header">
          <h2 id="settings-title">Settings</h2>
          <button class="close-btn" onClick={handleClose} data-testid="settings-close" aria-label="Close settings">
            ×
          </button>
        </div>

        <div class="modal-content">
          {/* Internal Tab Navigation */}
          <div class="setting-buttons" style={{ marginBottom: '20px' }}>
            <button
              class={`setting-btn ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
              role="tab"
              aria-selected={activeTab === 'audio'}
            >
              Audio
            </button>
            <button
              class={`setting-btn ${activeTab === 'gameplay' ? 'active' : ''}`}
              onClick={() => setActiveTab('gameplay')}
              role="tab"
              aria-selected={activeTab === 'gameplay'}
            >
              Gameplay
            </button>
            <button
              class={`setting-btn ${activeTab === 'display' ? 'active' : ''}`}
              onClick={() => setActiveTab('display')}
              role="tab"
              aria-selected={activeTab === 'display'}
            >
              Display
            </button>
          </div>

          <div class="settings-tab-content">
            {activeTab === 'audio' && (
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
            )}

            {activeTab === 'gameplay' && (
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
            )}

            {activeTab === 'display' && (
              <section class="settings-section">
                <h3>Display</h3>
                <div class="setting-info">
                  <div class="setting-label">Resolution</div>
                  <div>{typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : 'N/A'}</div>
                </div>
                <div class="setting-info" style={{ marginTop: '16px' }}>
                  <div class="setting-label">UI Scaling</div>
                  <div>100% (Native)</div>
                </div>
              </section>
            )}
          </div>

          <div class="settings-footer">
            <button class="btn btn-secondary" onClick={resetSettings}>
              Reset to Defaults
            </button>
            <button class="btn btn-primary" onClick={handleClose} data-testid="settings-close">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};