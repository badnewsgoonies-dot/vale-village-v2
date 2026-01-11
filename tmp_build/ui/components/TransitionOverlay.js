"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionOverlay = TransitionOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
/**
 * Simple fade-to-black overlay for transitions (e.g., floor changes)
 */
function TransitionOverlay({ isVisible, durationMs = 400, onComplete }) {
    const [render, setRender] = (0, hooks_1.useState)(isVisible);
    (0, hooks_1.useEffect)(() => {
        if (isVisible) {
            setRender(true);
            const timer = setTimeout(() => {
                onComplete?.();
            }, durationMs);
            return () => clearTimeout(timer);
        }
        // Fade out then unmount
        const timer = setTimeout(() => setRender(false), durationMs);
        return () => clearTimeout(timer);
    }, [isVisible, durationMs, onComplete]);
    if (!render)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            position: 'fixed',
            inset: 0,
            background: '#000',
            opacity: isVisible ? 1 : 0,
            transition: `opacity ${durationMs}ms ease`,
            pointerEvents: 'none',
            zIndex: 9999,
        } }));
}
