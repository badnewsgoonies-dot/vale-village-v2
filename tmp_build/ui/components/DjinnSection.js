"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnSection = DjinnSection;
const jsx_runtime_1 = require("preact/jsx-runtime");
const djinnAbilities_1 = require("@/core/algorithms/djinnAbilities");
const djinn_1 = require("@/data/definitions/djinn");
function DjinnSection({ unit, team, selectedSlot, onSelectSlot, djinnSlots, onEquipDjinn, onUnequipDjinn, }) {
    const selectedDjinnIds = djinnSlots.filter((id) => Boolean(id));
    const availableDjinn = team.collectedDjinn.filter((djinnId) => !selectedDjinnIds.includes(djinnId));
    // Get granted abilities for this unit
    const abilityMetadata = (0, djinnAbilities_1.getDjinnAbilityMetadataForUnit)(unit, team);
    const handleEquipClick = (djinnId) => {
        if (selectedSlot === null)
            return;
        onEquipDjinn(djinnId, selectedSlot);
        onSelectSlot(null);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { class: "section-card djinn-section", children: [(0, jsx_runtime_1.jsxs)("div", { class: "djinn-slots-panel", children: [(0, jsx_runtime_1.jsx)("div", { class: "section-title", children: "DJINN CONFIGURATION" }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-slots-grid", children: [0, 1, 2].map((slotIndex) => {
                            const djinnId = djinnSlots[slotIndex];
                            const hasDjinn = Boolean(djinnId);
                            const djinn = hasDjinn ? djinn_1.DJINN[djinnId] : null;
                            const isSelected = selectedSlot === slotIndex;
                            return ((0, jsx_runtime_1.jsx)("div", { class: `djinn-slot ${djinn ? '' : 'empty'} ${isSelected ? 'selected' : ''}`, onClick: () => onSelectSlot(isSelected ? null : slotIndex), children: djinn ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-sprite", children: djinn.element[0] }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-name", children: djinn.name }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-element", children: djinn.element }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-state", children: hasDjinn && djinnId ? team.djinnTrackers[djinnId]?.state : 'Set' }), isSelected && ((0, jsx_runtime_1.jsx)("button", { class: "change-btn", style: { marginTop: '0.5rem', width: '100%', fontSize: '0.7rem' }, onClick: (e) => {
                                                e.stopPropagation();
                                                onUnequipDjinn(slotIndex);
                                                onSelectSlot(null);
                                            }, children: "Unequip" }))] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "empty-slot-text", children: "(Empty)" }), isSelected && availableDjinn.length > 0 && ((0, jsx_runtime_1.jsx)("div", { style: { marginTop: '0.5rem', fontSize: '0.7rem', color: '#4a9eff' }, children: "Click Djinn below to equip" }))] })) }, slotIndex));
                        }) }), selectedSlot !== null && availableDjinn.length > 0 && ((0, jsx_runtime_1.jsx)("div", { style: { marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }, children: availableDjinn.slice(0, 4).map((djinnId) => {
                            const djinn = djinn_1.DJINN[djinnId];
                            if (!djinn)
                                return null;
                            return ((0, jsx_runtime_1.jsxs)("button", { class: "compendium-tab", onClick: () => handleEquipClick(djinnId), children: [djinn.name, " (", djinn.element, ")"] }, djinnId));
                        }) }))] }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-abilities-panel", children: [(0, jsx_runtime_1.jsxs)("div", { class: "abilities-title", children: ["GRANTED ABILITIES (", unit.name, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "abilities-content", children: abilityMetadata.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "ability-item", style: { color: '#666', textAlign: 'center' }, children: "No abilities granted by Djinn" })) : (abilityMetadata.slice(0, 6).map((meta, index) => {
                            const ability = unit.abilities.find((a) => a.id === meta.abilityId);
                            const djinn = djinn_1.DJINN[meta.djinnId];
                            const compatibilityColor = meta.compatibility === 'same'
                                ? '#4a9eff'
                                : meta.compatibility === 'counter'
                                    ? '#ff4a4a'
                                    : '#ffaa4a';
                            return ((0, jsx_runtime_1.jsxs)("div", { class: "ability-item", children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-name", children: ability?.name || meta.abilityId }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-source", style: { color: compatibilityColor }, children: ["From ", djinn?.name, " (", meta.compatibility, ")"] })] }, index));
                        })) })] })] }));
}
