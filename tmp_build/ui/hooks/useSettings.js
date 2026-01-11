"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSettings = useSettings;
exports.getSettings = getSettings;
const hooks_1 = require("preact/hooks");
const STORAGE_KEY = 'vale:settings';
const DEFAULT_SETTINGS = {
    musicVolume: 70,
    sfxVolume: 80,
    battleSpeed: 'normal',
    showDamageNumbers: true,
    autoSave: true,
};
/**
 * Load settings from localStorage
 */
function loadSettings() {
    if (typeof window === 'undefined')
        return DEFAULT_SETTINGS;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved)
            return DEFAULT_SETTINGS;
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new settings fields
        return { ...DEFAULT_SETTINGS, ...parsed };
    }
    catch {
        return DEFAULT_SETTINGS;
    }
}
/**
 * Save settings to localStorage
 */
function saveSettings(settings) {
    if (typeof window === 'undefined')
        return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
    catch (error) {
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
function useSettings() {
    const [settings, setSettings] = (0, hooks_1.useState)(loadSettings);
    // Sync battle speed with existing useBattleSpeed localStorage key for compatibility
    (0, hooks_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('battleSpeed', settings.battleSpeed);
        }
    }, [settings.battleSpeed]);
    const updateSettings = (0, hooks_1.useCallback)((updates) => {
        setSettings(prev => {
            const next = { ...prev, ...updates };
            saveSettings(next);
            return next;
        });
    }, []);
    const resetSettings = (0, hooks_1.useCallback)(() => {
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
function getSettings() {
    return loadSettings();
}
