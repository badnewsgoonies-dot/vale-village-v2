"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitCard = UnitCard;
const jsx_runtime_1 = require("preact/jsx-runtime");
const SimpleSprite_1 = require("../../sprites/SimpleSprite");
const mappings_1 = require("../../sprites/mappings");
const StatusIcon_1 = require("./StatusIcon");
function UnitCard({ unit, onClick }) {
    const classes = [
        'unit-card',
        unit.isSelected ? 'unit-card--selected' : '',
        unit.isKo ? 'unit-card--ko' : '',
    ].filter(Boolean).join(' ');
    const hpPercentage = unit.hp && unit.maxHp ? (unit.hp / unit.maxHp) * 100 : 0;
    return ((0, jsx_runtime_1.jsxs)("div", { class: classes, onClick: onClick, children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 32, height: 32, style: { borderRadius: '4px' }, debug: false }) }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-header", children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-name", children: unit.name }), (0, jsx_runtime_1.jsx)("div", { class: "unit-element", children: unit.element })] }), unit.hp !== undefined && unit.maxHp !== undefined && ((0, jsx_runtime_1.jsxs)("div", { class: "unit-hp-row", children: [(0, jsx_runtime_1.jsx)("div", { class: "hp-bar", children: (0, jsx_runtime_1.jsx)("div", { class: `hp-fill ${unit.isKo ? 'hp-fill--empty' : ''}`, style: { width: `${hpPercentage}%` } }) }), (0, jsx_runtime_1.jsxs)("div", { class: "hp-text", children: [unit.hp, " / ", unit.maxHp] })] })), (0, jsx_runtime_1.jsxs)("div", { class: "unit-status-row", children: [unit.isKo && (0, jsx_runtime_1.jsx)("div", { class: "unit-status-label", children: "KO" }), (0, jsx_runtime_1.jsx)("div", { class: "status-icons", children: unit.statuses.map((status) => ((0, jsx_runtime_1.jsx)(StatusIcon_1.StatusIcon, { statusType: status.id, title: status.title, size: 20 }, status.id))) })] })] }));
}
