"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnDetailModal = DjinnDetailModal;
const jsx_runtime_1 = require("preact/jsx-runtime");
const store_1 = require("../state/store");
const djinn_1 = require("@/data/definitions/djinn");
const djinn_2 = require("@/core/algorithms/djinn");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const warnIfPlaceholderSprite_1 = require("../sprites/utils/warnIfPlaceholderSprite");
require("./DjinnDetailModal.css");
function DjinnDetailModal({ djinnId, onClose }) {
    const { team, updateTeam } = (0, store_1.useStore)((s) => ({
        team: s.team,
        updateTeam: s.updateTeam,
    }));
    const djinn = djinn_1.DJINN[djinnId];
    if (!djinn || !team) {
        return null;
    }
    const isCollected = team.collectedDjinn.includes(djinnId);
    const isEquipped = team.equippedDjinn.includes(djinnId);
    const equippedIndex = team.equippedDjinn.indexOf(djinnId);
    const tracker = team.djinnTrackers[djinnId];
    const state = tracker?.state || 'Set';
    const handleEquip = (slotIndex) => {
        if (!team)
            return;
        // Create new equippedDjinn array (max 3 slots)
        const newEquippedDjinn = [];
        // Copy existing equipped Djinn, skipping the one being moved
        team.equippedDjinn.forEach((id, idx) => {
            if (id !== djinnId && idx !== slotIndex) {
                newEquippedDjinn.push(id);
            }
        });
        // Add to target slot (will be inserted at correct position)
        // Ensure we have exactly 3 slots
        while (newEquippedDjinn.length < slotIndex) {
            newEquippedDjinn.push('');
        }
        newEquippedDjinn[slotIndex] = djinnId;
        // Filter out empty strings and ensure max 3
        const filteredDjinn = newEquippedDjinn.filter(Boolean).slice(0, 3);
        // Update trackers
        const newTrackers = { ...team.djinnTrackers };
        if (!newTrackers[djinnId]) {
            newTrackers[djinnId] = {
                djinnId,
                state: 'Set',
                lastActivatedTurn: 0,
            };
        }
        // Remove tracker for Djinn that was in the target slot (if different)
        if (isEquipped && equippedIndex !== slotIndex) {
            const oldDjinnId = team.equippedDjinn[slotIndex];
            if (oldDjinnId && oldDjinnId !== djinnId) {
                delete newTrackers[oldDjinnId];
            }
        }
        updateTeam({
            equippedDjinn: filteredDjinn,
            djinnTrackers: newTrackers,
        });
    };
    const handleUnequip = () => {
        if (!team || !isEquipped)
            return;
        const newEquippedDjinn = team.equippedDjinn.filter((id) => id !== djinnId);
        const newTrackers = { ...team.djinnTrackers };
        delete newTrackers[djinnId];
        updateTeam({
            equippedDjinn: newEquippedDjinn,
            djinnTrackers: newTrackers,
        });
    };
    // Calculate synergy preview
    const previewEquipped = [...team.equippedDjinn];
    if (!isEquipped) {
        // Preview with this Djinn in slot 0
        previewEquipped[0] = djinnId;
    }
    const previewDjinn = previewEquipped
        .filter(Boolean)
        .map((id) => djinn_1.DJINN[id])
        .filter((d) => d !== null && d !== undefined);
    const synergy = (0, djinn_2.calculateDjinnSynergy)(previewDjinn.map((d) => d.element));
    const getElementColor = (element) => {
        switch (element) {
            case 'Venus': return '#8B4513';
            case 'Mars': return '#DC143C';
            case 'Mercury': return '#1E90FF';
            case 'Jupiter': return '#32CD32';
            default: return '#666';
        }
    };
    const getDjinnSprite = (element) => {
        const elementLower = element.toLowerCase();
        return `${elementLower}-djinn-front`;
    };
    return ((0, jsx_runtime_1.jsx)("div", { class: "djinn-detail-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "djinn-detail-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "djinn-detail-header", children: [(0, jsx_runtime_1.jsx)("h2", { children: djinn.name }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close Djinn details", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-detail-content", children: [(0, jsx_runtime_1.jsxs)("div", { class: "djinn-main-info", children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-icon-large", style: { backgroundColor: getElementColor(djinn.element) + '40' }, children: (() => {
                                        const djinnSpriteId = getDjinnSprite(djinn.element);
                                        (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('DjinnDetailModal', djinnSpriteId);
                                        return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: djinnSpriteId, width: 64, height: 64, style: { display: 'block' } }));
                                    })() }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-details", children: [(0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Element:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", style: { color: getElementColor(djinn.element) }, children: djinn.element })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Tier:" }), (0, jsx_runtime_1.jsxs)("span", { class: "detail-value", children: ["Tier ", djinn.tier] })] }), isEquipped && ((0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "detail-label", children: "Status:" }), (0, jsx_runtime_1.jsx)("span", { class: "detail-value", children: state })] }))] })] }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-detail-note", style: { fontSize: '0.85rem', color: '#ccc', margin: '0.5rem 0', padding: '0 0.25rem' }, children: "Djinn live in the shared 3-slot team pool. Updates here affect that pool, and the Pre-Battle screen lets you choose which of the equipped Djinn apply to the next encounter." }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-summon-effect", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Summon Effect" }), (0, jsx_runtime_1.jsx)("p", { children: djinn.summonEffect.description })] }), isCollected && ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-assignment", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Global Team Slots" }), (0, jsx_runtime_1.jsx)("div", { class: "slot-buttons", children: [0, 1, 2].map((slotIndex) => {
                                        const slotDjinnId = team.equippedDjinn[slotIndex];
                                        const slotDjinn = slotDjinnId ? djinn_1.DJINN[slotDjinnId] : null;
                                        const isSlotEquipped = slotDjinnId === djinnId;
                                        return ((0, jsx_runtime_1.jsxs)("button", { class: `slot-btn ${isSlotEquipped ? 'active' : ''} ${slotDjinn && !isSlotEquipped ? 'occupied' : ''}`, onClick: () => handleEquip(slotIndex), disabled: !isCollected, children: [(0, jsx_runtime_1.jsxs)("div", { class: "slot-number", children: ["Slot ", slotIndex + 1] }), slotDjinn ? ((0, jsx_runtime_1.jsx)("div", { class: "slot-djinn-name", children: slotDjinn.name })) : ((0, jsx_runtime_1.jsx)("div", { class: "slot-empty", children: "Empty" }))] }, slotIndex));
                                    }) }), isEquipped && ((0, jsx_runtime_1.jsx)("button", { class: "unequip-btn", onClick: handleUnequip, children: "Unequip" }))] })), previewDjinn.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-synergy-preview", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Synergy Preview" }), (0, jsx_runtime_1.jsxs)("div", { class: "synergy-info", children: [(0, jsx_runtime_1.jsxs)("div", { class: "synergy-row", children: [(0, jsx_runtime_1.jsx)("span", { children: "Class:" }), (0, jsx_runtime_1.jsx)("span", { class: "synergy-value", children: synergy.classChange })] }), (0, jsx_runtime_1.jsxs)("div", { class: "synergy-row", children: [(0, jsx_runtime_1.jsx)("span", { children: "ATK Bonus:" }), (0, jsx_runtime_1.jsxs)("span", { class: "synergy-value", children: ["+", synergy.atk] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "synergy-row", children: [(0, jsx_runtime_1.jsx)("span", { children: "DEF Bonus:" }), (0, jsx_runtime_1.jsxs)("span", { class: "synergy-value", children: ["+", synergy.def] })] }), synergy.spd !== undefined && ((0, jsx_runtime_1.jsxs)("div", { class: "synergy-row", children: [(0, jsx_runtime_1.jsx)("span", { children: "SPD Bonus:" }), (0, jsx_runtime_1.jsxs)("span", { class: "synergy-value", children: ["+", synergy.spd] })] })), synergy.abilitiesUnlocked.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "synergy-row", children: [(0, jsx_runtime_1.jsx)("span", { children: "Abilities:" }), (0, jsx_runtime_1.jsx)("span", { class: "synergy-value", children: synergy.abilitiesUnlocked.join(', ') })] }))] })] }))] })] }) }));
}
