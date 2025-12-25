import { useState, useCallback, useMemo } from 'preact/hooks';
import { SPEED_PRESETS, type SpeedPreset } from '../constants/animationTiming';

/**
 * Hook for managing battle animation speed
 * Persists preference to localStorage
 */
export function useBattleSpeed() {
  const [speedPreset, setSpeedPreset] = useState<SpeedPreset>(() => {
    if (typeof window === 'undefined') return 'normal';
    const saved = localStorage.getItem('battleSpeed');
    return (saved as SpeedPreset) || 'normal';
  });

  const setSpeed = useCallback((preset: SpeedPreset) => {
    setSpeedPreset(preset);
    if (typeof window !== 'undefined') {
      localStorage.setItem('battleSpeed', preset);
    }
  }, []);

  const multiplier = useMemo(() => SPEED_PRESETS[speedPreset], [speedPreset]);

  /** Apply multiplier to a timing value */
  const applySpeed = useCallback((ms: number) => Math.round(ms * multiplier), [multiplier]);

  /** Cycle through presets (for quick toggle) */
  const cycleSpeed = useCallback(() => {
    const presets: SpeedPreset[] = ['slow', 'normal', 'fast', 'instant'];
    const currentIndex = presets.indexOf(speedPreset);
    const nextIndex = (currentIndex + 1) % presets.length;
    setSpeed(presets[nextIndex] as SpeedPreset);
  }, [speedPreset, setSpeed]);

  return {
    speedPreset,
    multiplier,
    setSpeed,
    applySpeed,
    cycleSpeed,
  };
}
