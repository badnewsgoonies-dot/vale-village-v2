"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefeatOverlay = DefeatOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * DefeatOverlay Component
 * Displays defeat animation after battle loss
 */
const hooks_1 = require("preact/hooks");
require("./DefeatOverlay.css");
function DefeatOverlay({ onComplete, duration = 2500 }) {
    const [stage, setStage] = (0, hooks_1.useState)('fadeIn');
    (0, hooks_1.useEffect)(() => {
        const textTimer = setTimeout(() => {
            setStage('text');
        }, 500);
        const completeTimer = setTimeout(() => {
            setStage('complete');
            onComplete();
        }, duration);
        return () => {
            clearTimeout(textTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onComplete]);
    if (stage === 'complete')
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { class: "defeat-overlay", children: [(0, jsx_runtime_1.jsx)("div", { class: "defeat-vignette" }), (0, jsx_runtime_1.jsx)("div", { class: "defeat-particles", children: [...Array(15)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { class: "defeat-ember", style: {
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    } }, i))) }), (0, jsx_runtime_1.jsxs)("div", { class: "defeat-text", children: [(0, jsx_runtime_1.jsx)("h1", { class: "defeat-title", children: "DEFEAT..." }), (0, jsx_runtime_1.jsx)("p", { class: "defeat-subtitle", children: "Your party has fallen." })] }), (0, jsx_runtime_1.jsx)("button", { class: "defeat-continue", onClick: onComplete, children: "Continue" })] }));
}
