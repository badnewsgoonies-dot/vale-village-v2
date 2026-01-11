"use strict";
/**
 * Dev Mode State Slice
 * Manages development mode overlay for rapid house testing
 *
 * IMPORTANT: Dev mode is OFF by default and only activates via keyboard shortcut (Ctrl+D)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevModeSlice = void 0;
const createDevModeSlice = (set) => ({
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
exports.createDevModeSlice = createDevModeSlice;
