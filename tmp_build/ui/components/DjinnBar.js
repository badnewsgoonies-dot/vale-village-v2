"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnBar = DjinnBar;
const jsx_runtime_1 = require("preact/jsx-runtime");
const djinn_1 = require("../../core/algorithms/djinn");
function DjinnBar({ team, queuedDjinn, onDjinnClick, className, style }) {
    if (team.equippedDjinn.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { class: `djinn-bar ${className || ''}`, style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: '#888',
                ...style,
            }, children: [(0, jsx_runtime_1.jsx)("span", { children: "DJINN:" }), (0, jsx_runtime_1.jsx)("span", { children: "None equipped" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { class: `djinn-bar ${className || ''}`, style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            ...style,
        }, role: "toolbar", "aria-label": "Djinn activation", children: [(0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 'bold', color: '#FFD700' }, children: "DJINN:" }), (0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                }, children: team.equippedDjinn.map((djinnId) => {
                    const tracker = team.djinnTrackers[djinnId];
                    const state = tracker?.state || 'Set';
                    const canActivate = (0, djinn_1.canActivateDjinn)(team, djinnId);
                    const isQueued = queuedDjinn.includes(djinnId);
                    let stateColor = '#4CAF50'; // Set (green)
                    let stateText = 'Set';
                    if (state === 'Standby') {
                        stateColor = '#FF9800'; // Standby (orange)
                        stateText = `CD:${tracker?.lastActivatedTurn ? '1' : '?'}`;
                    }
                    else if (state === 'Recovery') {
                        stateColor = '#2196F3'; // Recovery (blue)
                        stateText = 'Recovery';
                    }
                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onDjinnClick(djinnId), disabled: !canActivate && !isQueued, style: {
                            padding: '0.25rem 0.5rem',
                            backgroundColor: isQueued ? '#4CAF50' : stateColor,
                            color: '#fff',
                            border: isQueued ? '2px solid #FFD700' : '1px solid #333',
                            borderRadius: '4px',
                            cursor: canActivate || isQueued ? 'pointer' : 'not-allowed',
                            opacity: canActivate || isQueued ? 1 : 0.5,
                            fontSize: '0.85rem',
                            fontWeight: isQueued ? 'bold' : 'normal',
                        }, title: isQueued
                            ? 'Click to unqueue'
                            : canActivate
                                ? 'Click to activate'
                                : `${stateText} - Cannot activate`, "aria-label": `Djinn ${djinnId}, ${stateText}${isQueued ? ', queued' : ''}`, children: [djinnId, " [", stateText, "]"] }, djinnId));
                }) })] }));
}
