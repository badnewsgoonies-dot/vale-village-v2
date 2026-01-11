import { useState, useCallback, useEffect } from 'preact/hooks';

/**
 * Game settings interface
 * All settings are persisted to localStorage
 */
export interface GameSettings {
  musicVolume: number;      // 0-100
  sfxVolume: number;        // 0-100
  battleSpeed: 'slow' | 'normal' | 'fast';
  showDamageNumbers: boolean;
  autoSave: boolean;
}

const STORAGE_KEY = 'vale:settings';

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 70,
  sfxVolume: 80,
  battleSpeed: 'normal',
  showDamageNumbers: true,
  autoSave: true,
};

/**
 * Load settings from localStorage
 */
function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(saved);
    // Merge with defaults to handle new settings fields
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Hook for managing game settings with localStorage persistence
 *
 * Usage:
 * ```tsx
 * const { settings, updateSettings, resetSettings } = useSettings();
 *
 * // Update a single setting
 * updateSettings({ musicVolume: 50 });
 *
 * // Update multiple settings
 * updateSettings({ musicVolume: 50, sfxVolume: 60 });
 * ```
 */
export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  // Sync battle speed with existing useBattleSpeed localStorage key for compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('battleSpeed', settings.battleSpeed);
    }
  }, [settings.battleSpeed]);

  const updateSettings = useCallback((updates: Partial<GameSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    DEFAULT_SETTINGS,
  };
}

/**
 * Get settings synchronously (for non-React contexts)
 * Useful for audio systems, etc.
 */
export function getSettings(): GameSettings {
  return loadSettings();
}
