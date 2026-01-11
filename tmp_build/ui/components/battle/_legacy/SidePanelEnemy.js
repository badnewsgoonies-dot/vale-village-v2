"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidePanelEnemy = SidePanelEnemy;
const jsx_runtime_1 = require("preact/jsx-runtime");
const UnitCard_1 = require("./UnitCard");
function SidePanelEnemy({ units, onSelectUnit }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "enemy-side", children: [(0, jsx_runtime_1.jsx)("div", { class: "side-title", children: "Enemies" }), (0, jsx_runtime_1.jsx)("div", { class: "unit-list", children: units.map((unit) => ((0, jsx_runtime_1.jsx)(UnitCard_1.UnitCard, { unit: unit, onClick: () => onSelectUnit(unit.id) }, unit.id))) })] }));
}
