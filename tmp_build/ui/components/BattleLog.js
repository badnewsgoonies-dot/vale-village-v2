"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleLog = BattleLog;
const jsx_runtime_1 = require("preact/jsx-runtime");
function BattleLog({ events, renderText }) {
    // Throttle announcements for accessibility (batch adjacent events)
    const announcementText = events.length > 0
        ? events.slice(0, 3).map(renderText).join('. ') // Announce first 3 events
        : '';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "battle-log", role: "log", "aria-live": "polite", "aria-label": "Battle log", style: {
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
        }, children: [(0, jsx_runtime_1.jsx)("h4", { style: { marginTop: 0 }, children: "Battle Log" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: '0.25rem' }, children: events.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { style: { color: '#888', fontStyle: 'italic' }, children: "No events yet..." })) : (events.map((event, index) => ((0, jsx_runtime_1.jsx)("div", { style: {
                        fontSize: '0.875rem',
                        padding: '0.25rem',
                        backgroundColor: index === 0 ? '#333' : 'transparent',
                        borderRadius: '2px',
                    }, children: renderText(event) }, index)))) }), announcementText && ((0, jsx_runtime_1.jsx)("div", { "aria-hidden": "true", style: { position: 'absolute', left: '-9999px' }, children: announcementText }))] }));
}
