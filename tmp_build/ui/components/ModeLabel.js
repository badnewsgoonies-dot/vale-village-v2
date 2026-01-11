"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeLabel = ModeLabel;
const jsx_runtime_1 = require("preact/jsx-runtime");
function ModeLabel({ battleType, locationName, floorNumber }) {
    const isTower = battleType === 'tower';
    const label = isTower && floorNumber ? `Battle Tower - Floor ${floorNumber}` : locationName;
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            background: 'rgba(0,0,0,0.75)',
            border: '2px solid rgba(255,215,0,0.65)',
            borderRadius: 8,
            padding: '6px 12px',
            color: '#ffd87f',
            fontWeight: 700,
            letterSpacing: 0.5,
            textShadow: '1px 1px 2px #000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
        }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,215,0,0.5)',
                    color: '#ffe9a1',
                    fontSize: '0.8rem',
                }, children: battleType === 'tower' ? 'Battle Tower' : battleType === 'demo' ? 'Demo' : 'Story Battle' }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.9rem' }, children: label })] }));
}
