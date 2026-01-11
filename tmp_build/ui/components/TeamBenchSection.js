"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamBenchSection = TeamBenchSection;
const jsx_runtime_1 = require("preact/jsx-runtime");
const constants_1 = require("@/core/constants");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const layout_1 = require("../constants/layout");
function TeamBenchSection({ activeParty, benchUnits, selectedSlotIndex, onSelectSlot, onAddToSlot, }) {
    const handleSlotClick = (index) => {
        onSelectSlot(index);
    };
    const handleBenchUnitClick = (unitId) => {
        if (selectedSlotIndex !== null) {
            onAddToSlot(selectedSlotIndex, unitId);
        }
    };
    // Create array of 4 slots (filled or empty)
    const filledUnitCount = activeParty.filter((unit) => Boolean(unit)).length;
    const slots = Array.from({ length: constants_1.MAX_PARTY_SIZE }, (_, i) => ({
        index: i,
        unit: activeParty[i],
    }));
    return ((0, jsx_runtime_1.jsxs)("div", { class: "section-card team-bench-section", children: [(0, jsx_runtime_1.jsxs)("div", { class: "current-party-panel", children: [(0, jsx_runtime_1.jsxs)("div", { class: "section-title", children: ["YOUR TEAM (", filledUnitCount, "/", constants_1.MAX_PARTY_SIZE, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "current-party-grid", children: slots.map(({ index, unit }) => ((0, jsx_runtime_1.jsx)("div", { class: `party-slot ${unit ? 'filled' : 'empty'} ${selectedSlotIndex === index ? 'selected' : ''}`, onClick: () => handleSlotClick(index), children: unit ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-portrait", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: layout_1.PORTRAIT_SIZE_MD, height: layout_1.PORTRAIT_SIZE_MD, alt: `${unit.name} portrait` }) }), (0, jsx_runtime_1.jsx)("div", { class: "unit-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-level", children: ["Lv. ", unit.level] }), (0, jsx_runtime_1.jsx)("div", { class: "unit-element", children: unit.element })] })) : ((0, jsx_runtime_1.jsx)("div", { class: "empty-slot-text", children: "[+]" })) }, index))) })] }), (0, jsx_runtime_1.jsxs)("div", { class: "bench-panel", children: [(0, jsx_runtime_1.jsx)("div", { class: "section-title", children: "BENCH UNITS" }), (0, jsx_runtime_1.jsx)("div", { class: "bench-grid", children: benchUnits.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "empty-slot-text", style: { textAlign: 'center', padding: '1rem' }, children: "No bench units available" })) : (benchUnits.slice(0, 4).map((unit) => ((0, jsx_runtime_1.jsxs)("div", { class: "bench-unit-compact", onClick: () => handleBenchUnitClick(unit.id), children: [(0, jsx_runtime_1.jsx)("div", { class: "bench-portrait", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: layout_1.PORTRAIT_SIZE_SM, height: layout_1.PORTRAIT_SIZE_SM, alt: `${unit.name} portrait` }) }), (0, jsx_runtime_1.jsxs)("div", { class: "bench-unit-info", children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-level", children: ["Lv. ", unit.level] }), (0, jsx_runtime_1.jsx)("div", { class: "unit-element", children: unit.element })] })] }, unit.id)))) }), benchUnits.length > 4 && ((0, jsx_runtime_1.jsxs)("div", { style: {
                            fontSize: '0.7rem',
                            color: '#666',
                            textAlign: 'center',
                            padding: '0.5rem',
                            fontStyle: 'italic',
                            marginTop: '0.25rem',
                        }, children: ["+", benchUnits.length - 4, " more units in roster"] }))] })] }));
}
