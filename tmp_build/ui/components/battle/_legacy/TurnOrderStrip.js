"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnOrderStrip = TurnOrderStrip;
const jsx_runtime_1 = require("preact/jsx-runtime");
function TurnOrderStrip({ units }) {
    return ((0, jsx_runtime_1.jsx)("div", { class: "turn-order-strip", children: units.map((unit) => {
            const classes = [
                'turn-order-unit',
                unit.side === 'player' ? 'turn-order-unit--player' : 'turn-order-unit--enemy',
                unit.isCurrent ? 'turn-order-unit--current' : '',
            ].filter(Boolean).join(' ');
            return ((0, jsx_runtime_1.jsx)("div", { class: classes, title: unit.name, children: unit.name.slice(0, 5) }, unit.id));
        }) }));
}
