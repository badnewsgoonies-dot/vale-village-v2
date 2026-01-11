/**
 * Dev Mode State Slice
 * Manages development mode overlay for rapid house testing
 *
 * IMPORTANT: Dev mode is OFF by default and only activates via keyboard shortcut (Ctrl+D)
 */

import type { StateCreator } from 'zustand';

export interface DevModeSlice {
  /** Whether dev mode overlay is visible */
  devModeEnabled: boolean;
  /** God Mode: Infinite HP/MP, 1-hit kills */
  godMode: boolean;
  /** Skip Animations: Instant battle actions, fast movement */
  skipAnimations: boolean;
  /** Currently selected house for inspection */
  selectedHouseId: string | null;

  /** Toggle dev mode overlay on/off */
  toggleDevMode: () => void;
  /** Set dev mode enabled state */
  setDevModeEnabled: (enabled: boolean) => void;
  /** Toggle God Mode */
  toggleGodMode: () => void;
  /** Toggle Skip Animations */
  toggleSkipAnimations: () => void;
  /** Set selected house */
  setSelectedHouse: (houseId: string | null) => void;
}

export const createDevModeSlice: StateCreator<
  DevModeSlice,
  [['zustand/devtools', never]],
  [],
  DevModeSlice
> = (set) => ({
  devModeEnabled: false,
  godMode: false,
  skipAnimations: false,
  selectedHouseId: null,

  toggleDevMode: () => set((state) => ({
    devModeEnabled: !state.devModeEnabled
  })),

  setDevModeEnabled: (enabled) => set({ devModeEnabled: enabled }),

  toggleGodMode: () => set((state) => ({ godMode: !state.godMode })),

  toggleSkipAnimations: () => set((state) => ({ skipAnimations: !state.skipAnimations })),

  setSelectedHouse: (houseId) => set({ selectedHouseId: houseId }),
});
