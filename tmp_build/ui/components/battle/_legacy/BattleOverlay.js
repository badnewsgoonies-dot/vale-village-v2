"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleOverlay = BattleOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
function BattleOverlay({ status, rewards, onContinue, onReturnToVillage, onRetry, onReturnToTitle, }) {
    if (status === 'ongoing') {
        return null;
    }
    const isVictory = status === 'victory';
    const overlayClass = isVictory ? 'battle-overlay--victory' : 'battle-overlay--defeat';
    return ((0, jsx_runtime_1.jsxs)("div", { class: `battle-overlay ${overlayClass}`, children: [(0, jsx_runtime_1.jsx)("div", { class: "battle-overlay-title", children: isVictory ? 'Victory!' : 'Defeat' }), isVictory && rewards && ((0, jsx_runtime_1.jsxs)("div", { class: "battle-overlay-subtitle", children: ["XP: +", rewards.xp, " \u00B7 Gold: +", rewards.gold] })), !isVictory && ((0, jsx_runtime_1.jsx)("div", { class: "battle-overlay-subtitle", children: "Your party has fallen." })), (0, jsx_runtime_1.jsx)("div", { class: "battle-overlay-actions", children: isVictory ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { class: "overlay-button", onClick: onContinue, children: "Continue (Rewards)" }), (0, jsx_runtime_1.jsx)("button", { class: "overlay-button", onClick: onReturnToVillage, children: "Return to Village" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { class: "overlay-button", onClick: onRetry, children: "Retry Battle" }), (0, jsx_runtime_1.jsx)("button", { class: "overlay-button", onClick: onReturnToTitle, children: "Return to Title" })] })) })] }));
}
