"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleManaBar = BattleManaBar;
const jsx_runtime_1 = require("preact/jsx-runtime");
function BattleManaBar({ currentMana, maxMana, pendingThisRound, pendingNextRound, }) {
    const circles = Array.from({ length: maxMana }, (_, idx) => {
        if (idx < currentMana)
            return 'solid';
        if (idx < currentMana + pendingThisRound)
            return 'pending';
        return 'empty';
    });
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 12px',
            borderRadius: 6,
            border: '2px solid rgba(255,215,0,0.5)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }, "aria-label": `Mana ${currentMana}/${maxMana}`, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                    color: '#ffd87f',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textShadow: '1px 1px 2px #000',
                    letterSpacing: '0.5px',
                }, children: "MANA" }), (0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                }, children: circles.map((state, idx) => ((0, jsx_runtime_1.jsx)("div", { style: {
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 215, 0, 0.7)',
                        backgroundColor: state === 'solid'
                            ? '#FFD54A'
                            : state === 'pending'
                                ? 'rgba(255, 213, 74, 0.4)'
                                : 'rgba(0,0,0,0.5)',
                        boxShadow: state === 'solid'
                            ? '0 0 6px rgba(255,215,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.3)'
                            : state === 'pending'
                                ? '0 0 4px rgba(255,215,0,0.4)'
                                : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                        transition: 'all 0.2s ease',
                    }, title: state === 'solid'
                        ? 'Available mana'
                        : state === 'pending'
                            ? 'Pending this round'
                            : 'Empty' }, idx))) }), pendingNextRound > 0 && ((0, jsx_runtime_1.jsxs)("span", { style: {
                    fontSize: '0.75rem',
                    color: '#90EE90',
                    fontWeight: 600,
                    textShadow: '1px 1px 2px #000',
                }, children: ["+", pendingNextRound] }))] }));
}
