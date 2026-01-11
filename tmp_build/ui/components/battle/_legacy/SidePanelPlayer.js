"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidePanelPlayer = SidePanelPlayer;
const jsx_runtime_1 = require("preact/jsx-runtime");
const UnitCard_1 = require("./UnitCard");
function SidePanelPlayer({ units, onSelectUnit }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "player-side", children: [(0, jsx_runtime_1.jsx)("div", { class: "side-title", children: "Player Party" }), (0, jsx_runtime_1.jsx)("div", { class: "unit-list", children: units.map((unit) => ((0, jsx_runtime_1.jsx)(UnitCard_1.UnitCard, { unit: unit, onClick: () => onSelectUnit(unit.id) }, unit.id))) })] }));
}
