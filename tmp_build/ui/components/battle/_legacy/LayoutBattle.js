"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutBattle = LayoutBattle;
const jsx_runtime_1 = require("preact/jsx-runtime");
function LayoutBattle({ children, phase }) {
    return ((0, jsx_runtime_1.jsx)("div", { class: "game-root", "data-battle-phase": phase, children: (0, jsx_runtime_1.jsx)("div", { class: "battle-screen", children: children }) }));
}
