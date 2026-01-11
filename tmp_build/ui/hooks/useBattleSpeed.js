"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBattleSpeed = useBattleSpeed;
const hooks_1 = require("preact/hooks");
const animationTiming_1 = require("../constants/animationTiming");
/**
 * Hook for managing battle animation speed
 * Persists preference to localStorage
 */
function useBattleSpeed() {
    const [speedPreset, setSpeedPreset] = (0, hooks_1.useState)(() => {
        if (typeof window === 'undefined')
            return 'normal';
        const saved = localStorage.getItem('battleSpeed');
        return saved || 'normal';
    });
    const setSpeed = (0, hooks_1.useCallback)((preset) => {
        setSpeedPreset(preset);
        if (typeof window !== 'undefined') {
            localStorage.setItem('battleSpeed', preset);
        }
    }, []);
    const multiplier = (0, hooks_1.useMemo)(() => animationTiming_1.SPEED_PRESETS[speedPreset], [speedPreset]);
    /** Apply multiplier to a timing value */
    const applySpeed = (0, hooks_1.useCallback)((ms) => Math.round(ms * multiplier), [multiplier]);
    /** Cycle through presets (for quick toggle) */
    const cycleSpeed = (0, hooks_1.useCallback)(() => {
        const presets = ['slow', 'normal', 'fast', 'instant'];
        const currentIndex = presets.indexOf(speedPreset);
        const nextIndex = (currentIndex + 1) % presets.length;
        setSpeed(presets[nextIndex]);
    }, [speedPreset, setSpeed]);
    return {
        speedPreset,
        multiplier,
        setSpeed,
        applySpeed,
        cycleSpeed,
    };
}
