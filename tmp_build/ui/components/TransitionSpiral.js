"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionSpiral = TransitionSpiral;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
/**
 * Spiral transition overlay for entering battle.
 * Renders a radial gradient that spins while scaling up.
 */
function TransitionSpiral({ isVisible, durationMs = 900, onComplete }) {
    const [render, setRender] = (0, hooks_1.useState)(isVisible);
    (0, hooks_1.useEffect)(() => {
        if (isVisible) {
            setRender(true);
            const timer = setTimeout(() => onComplete?.(), durationMs);
            return () => clearTimeout(timer);
        }
        const timer = setTimeout(() => setRender(false), durationMs);
        return () => clearTimeout(timer);
    }, [isVisible, durationMs, onComplete]);
    if (!render)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 9998,
            overflow: 'hidden',
        }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                width: '180vmax',
                height: '180vmax',
                background: 'conic-gradient(from 90deg, rgba(255,216,127,0.9), rgba(255,122,81,0.85), rgba(76,175,255,0.85), rgba(255,216,127,0.9))',
                borderRadius: '50%',
                transform: isVisible ? 'scale(1) rotate(1080deg)' : 'scale(0.2) rotate(0deg)',
                transition: `transform ${durationMs}ms ease-in`,
                filter: 'blur(1px)',
            } }) }));
}
