"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnCollectionScreen = DjinnCollectionScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
const djinn_1 = require("@/data/definitions/djinn");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const warnIfPlaceholderSprite_1 = require("../sprites/utils/warnIfPlaceholderSprite");
const DjinnDetailModal_1 = require("./DjinnDetailModal");
require("./DjinnCollectionScreen.css");
function DjinnCollectionScreen({ onClose }) {
    const { team } = (0, store_1.useStore)((s) => ({
        team: s.team,
    }));
    const [selectedDjinnId, setSelectedDjinnId] = (0, hooks_1.useState)(null);
    if (!team) {
        return ((0, jsx_runtime_1.jsx)("div", { class: "djinn-collection-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "djinn-collection-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-error", children: "No team data available" }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, children: "Close" })] }) }));
    }
    const collectedDjinn = team.collectedDjinn || [];
    const equippedDjinn = team.equippedDjinn || [];
    // Group Djinn by element
    const djinnByElement = {
        Venus: [],
        Mars: [],
        Mercury: [],
        Jupiter: [],
    };
    collectedDjinn.forEach((djinnId) => {
        const djinn = djinn_1.DJINN[djinnId];
        if (djinn) {
            const elementList = djinnByElement[djinn.element];
            if (elementList) {
                elementList.push(djinn);
            }
        }
    });
    // Sort by tier within each element (convert string tier to number for comparison)
    Object.keys(djinnByElement).forEach((element) => {
        const elementList = djinnByElement[element];
        if (elementList) {
            elementList.sort((a, b) => parseInt(a.tier, 10) - parseInt(b.tier, 10));
        }
    });
    const getElementColor = (element) => {
        switch (element) {
            case 'Venus': return '#8B4513'; // Brown
            case 'Mars': return '#DC143C'; // Crimson
            case 'Mercury': return '#1E90FF'; // Dodger Blue
            case 'Jupiter': return '#32CD32'; // Lime Green
            default: return '#666';
        }
    };
    const getDjinnSprite = (element) => {
        // Map element to Djinn sprite (using Front variant)
        const elementLower = element.toLowerCase();
        return `${elementLower}-djinn-front`;
    };
    return ((0, jsx_runtime_1.jsx)("div", { class: "djinn-collection-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "djinn-collection-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "djinn-collection-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Djinn Collection" }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close Djinn collection", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-collection-note", style: { padding: '0 1rem', fontSize: '0.85rem', color: '#ccc' }, children: "Your collected Djinn live in a global 3-slot team configuration. Use the Pre-Battle screen to lock in which Djinn you want active for the upcoming fight\u2014the bonuses apply to every unit at once." }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-stats", children: [(0, jsx_runtime_1.jsxs)("div", { class: "stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "stat-label", children: "Collected:" }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-value", children: [collectedDjinn.length, " / 12"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "stat-label", children: "Equipped:" }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-value", children: [equippedDjinn.length, " / 3"] })] })] }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-collection-subnote", style: { fontSize: '0.8rem', color: '#888', textAlign: 'center', marginBottom: '0.25rem' }, children: "Equipped Djinn occupy the shared team slots; swapping them is done here, but final confirmation happens pre-battle." }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-collection-content", children: Object.entries(djinnByElement).map(([element, djinnList]) => ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-element-section", children: [(0, jsx_runtime_1.jsxs)("h2", { class: "element-header", style: { color: getElementColor(element) }, children: [element, " Djinn"] }), djinnList.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { class: "no-djinn-message", children: ["No ", element, " Djinn collected yet"] })) : ((0, jsx_runtime_1.jsx)("div", { class: "djinn-grid", children: djinnList.map((djinn) => {
                                    const isEquipped = equippedDjinn.includes(djinn.id);
                                    const tracker = team.djinnTrackers[djinn.id];
                                    const state = tracker?.state || 'Set';
                                    return ((0, jsx_runtime_1.jsxs)("div", { class: `djinn-card ${isEquipped ? 'equipped' : ''} ${state.toLowerCase()}`, onClick: () => setSelectedDjinnId(djinn.id), children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-icon", style: { backgroundColor: getElementColor(element) + '40' }, children: (() => {
                                                    const djinnSpriteId = getDjinnSprite(element);
                                                    (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('DjinnCollectionScreen', djinnSpriteId);
                                                    return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: djinnSpriteId, width: 48, height: 48, style: { filter: state === 'Standby' ? 'brightness(0.6)' : 'none' } }));
                                                })() }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-info", children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-name", children: djinn.name }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-tier", children: ["Tier ", djinn.tier] }), djinn.summonEffect && ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-effect", children: [djinn.summonEffect.type === 'damage' && djinn.summonEffect.damage && ((0, jsx_runtime_1.jsxs)("span", { class: "effect-damage", children: ["\u2694\uFE0F ", djinn.summonEffect.damage, " DMG"] })), djinn.summonEffect.type === 'buff' && djinn.summonEffect.statBonus && ((0, jsx_runtime_1.jsx)("span", { class: "effect-bonus", children: Object.entries(djinn.summonEffect.statBonus).map(([stat, val]) => ((0, jsx_runtime_1.jsxs)("span", { class: "bonus-stat", children: ["+", val, " ", stat.toUpperCase()] }, stat))) }))] })), isEquipped && ((0, jsx_runtime_1.jsx)("div", { class: "djinn-equipped-status", children: state.toUpperCase() }))] })] }, djinn.id));
                                }) }))] }, element))) }), selectedDjinnId && ((0, jsx_runtime_1.jsx)(DjinnDetailModal_1.DjinnDetailModal, { djinnId: selectedDjinnId, onClose: () => setSelectedDjinnId(null) }))] }) }));
}
