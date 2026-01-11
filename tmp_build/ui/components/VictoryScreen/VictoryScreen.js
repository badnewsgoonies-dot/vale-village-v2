"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictoryScreen = VictoryScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * VictoryScreen Component
 * Displays battle victory rewards with animations
 */
const hooks_1 = require("preact/hooks");
const SimpleSprite_1 = require("../../sprites/SimpleSprite");
const mappings_1 = require("../../sprites/mappings");
require("./VictoryScreen.css");
function VictoryScreen({ partyUnits, rewards, levelUps = [], onContinue, }) {
    // Handle keyboard input
    const handleKeyDown = (0, hooks_1.useCallback)((e) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            onContinue();
        }
    }, [onContinue]);
    (0, hooks_1.useEffect)(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    return ((0, jsx_runtime_1.jsxs)("div", { class: "victory-overlay", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-sparkles", children: Array.from({ length: 7 }).map((_, i) => ((0, jsx_runtime_1.jsx)("div", { class: "victory-sparkle" }, i))) }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-banner", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-title", children: "VICTORY" }), (0, jsx_runtime_1.jsx)("div", { class: "victory-subtitle", children: "Battle Complete" })] }), (0, jsx_runtime_1.jsx)("div", { class: "victory-party-display", children: partyUnits.map((unit) => ((0, jsx_runtime_1.jsxs)("div", { class: "victory-party-member", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-party-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 64, height: 64 }) }), (0, jsx_runtime_1.jsx)("div", { class: "victory-party-name", children: unit.name })] }, unit.id))) }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-rewards-panel", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-rewards-header", children: "Battle Rewards" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-rewards-grid", children: [(0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-item", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-reward-icon", children: "\u2B50" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-reward-label", children: "Experience" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-value xp", children: ["+", rewards.xp, " XP"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-item", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-reward-icon", children: "\uD83D\uDCB0" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-reward-label", children: "Gold" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-value gold", children: ["+", rewards.gold, " G"] })] })] }), rewards.items?.map((item, i) => ((0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-item", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-reward-icon", children: "\uD83D\uDCE6" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-reward-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "victory-reward-label", children: "Item Found" }), (0, jsx_runtime_1.jsx)("div", { class: "victory-reward-value item", children: item })] })] }, i)))] }), levelUps.map((levelUp) => ((0, jsx_runtime_1.jsxs)("div", { class: "victory-level-up", children: [(0, jsx_runtime_1.jsxs)("div", { class: "victory-level-up-text", children: ["\uD83C\uDF89 ", levelUp.unitName, " reached Level ", levelUp.newLevel, "!"] }), levelUp.newAbility && ((0, jsx_runtime_1.jsxs)("div", { class: "victory-level-up-detail", children: ["Learned new ability: ", (0, jsx_runtime_1.jsx)("strong", { children: levelUp.newAbility })] }))] }, levelUp.unitId)))] }), (0, jsx_runtime_1.jsx)("button", { class: "victory-continue-btn", onClick: onContinue, children: "Continue" }), (0, jsx_runtime_1.jsxs)("div", { class: "victory-hint", children: ["Tap or press ", (0, jsx_runtime_1.jsx)("kbd", { children: "SPACE" }), " to continue"] })] }));
}
