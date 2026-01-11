"use strict";
/**
 * useDevMode Hook
 * Listens for Ctrl+D (or Cmd+D on Mac) to toggle dev mode overlay
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDevMode = useDevMode;
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
function useDevMode() {
    const toggleDevMode = (0, store_1.useStore)((state) => state.toggleDevMode);
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            // Listen for Ctrl+D or Cmd+D
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault(); // Prevent browser bookmark dialog
                toggleDevMode();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleDevMode]);
}
