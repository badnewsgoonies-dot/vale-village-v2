"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManaCirclesBar = ManaCirclesBar;
const jsx_runtime_1 = require("preact/jsx-runtime");
function ManaCirclesBar({ remainingMana, maxMana, className, style }) {
    const circles = Array.from({ length: maxMana }, (_, i) => i < remainingMana);
    return ((0, jsx_runtime_1.jsxs)("div", { class: `mana-circles-bar ${className || ''}`, style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '1rem',
            ...style,
        }, role: "status", "aria-label": `Mana: ${remainingMana} of ${maxMana} circles available`, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 'bold', color: '#4CAF50' }, children: "MANA:" }), (0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'flex',
                    gap: '0.25rem',
                    alignItems: 'center',
                }, "aria-hidden": "true", children: circles.map((filled, index) => ((0, jsx_runtime_1.jsx)("span", { style: {
                        display: 'inline-block',
                        width: '1rem',
                        height: '1rem',
                        borderRadius: '50%',
                        backgroundColor: filled ? '#4CAF50' : '#666',
                        border: '1px solid #333',
                    }, title: filled ? 'Available' : 'Spent', children: filled ? '●' : '○' }, index))) }), (0, jsx_runtime_1.jsxs)("span", { style: { color: '#e0e0e0' }, children: [remainingMana, "/", maxMana] })] }));
}
