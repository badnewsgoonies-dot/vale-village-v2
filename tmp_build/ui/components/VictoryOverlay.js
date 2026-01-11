"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictoryOverlay = VictoryOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * VictoryOverlay Component
 * Displays victory fanfare animation after battle win
 */
const hooks_1 = require("preact/hooks");
require("./VictoryOverlay.css");
function VictoryOverlay({ onComplete, duration = 2000 }) {
    const [stage, setStage] = (0, hooks_1.useState)('fanfare');
    (0, hooks_1.useEffect)(() => {
        const fanfareTimer = setTimeout(() => {
            setStage('sparkles');
        }, 800);
        const completeTimer = setTimeout(() => {
            setStage('complete');
            onComplete();
        }, duration);
        return () => {
            clearTimeout(fanfareTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onComplete]);
    if (stage === 'complete')
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "victory-overlay", children: [(0, jsx_runtime_1.jsx)("div", { className: "victory-flash" }), (0, jsx_runtime_1.jsxs)("div", { className: "victory-text", children: [(0, jsx_runtime_1.jsx)("h1", { className: "victory-title", children: "VICTORY!" }), (0, jsx_runtime_1.jsxs)("div", { className: "victory-stars", children: [(0, jsx_runtime_1.jsx)("span", { className: "star star-1", children: "*" }), (0, jsx_runtime_1.jsx)("span", { className: "star star-2", children: "*" }), (0, jsx_runtime_1.jsx)("span", { className: "star star-3", children: "*" })] })] }), stage === 'sparkles' && ((0, jsx_runtime_1.jsx)("div", { className: "victory-particles", children: [...Array(20)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "particle", style: {
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1 + Math.random()}s`
                    } }, i))) }))] }));
}
