"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnAdvisorPanel = DjinnAdvisorPanel;
const jsx_runtime_1 = require("preact/jsx-runtime");
const djinnSprites = [
    { id: 'venus', name: 'Flint', path: '/sprites/battle/djinn/Venus_Djinn_Front.gif' },
    { id: 'mars', name: 'Granite', path: '/sprites/battle/djinn/Mars_Djinn_Front.gif' },
    { id: 'mercury', name: 'Echo', path: '/sprites/battle/djinn/Mercury_Djinn_Front.gif' },
];
function DjinnAdvisorPanel({ tutorialMessage, onClick }) {
    return ((0, jsx_runtime_1.jsxs)("div", { onClick: onClick, style: {
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '8px 10px',
            width: 180,
            cursor: onClick ? 'pointer' : 'default',
        }, children: [tutorialMessage && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    background: '#fff',
                    color: '#000',
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #000',
                    position: 'relative',
                    marginBottom: 8,
                    fontSize: '0.85rem',
                }, children: [tutorialMessage, (0, jsx_runtime_1.jsx)("div", { style: {
                            position: 'absolute',
                            left: 12,
                            bottom: -6,
                            width: 10,
                            height: 10,
                            background: '#fff',
                            borderLeft: '1px solid #000',
                            borderBottom: '1px solid #000',
                            transform: 'rotate(45deg)',
                        } })] })), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }, children: djinnSprites.map((djinn) => ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', width: 50 }, children: [(0, jsx_runtime_1.jsx)("img", { src: djinn.path, alt: djinn.name, width: 50, height: 50, style: { imageRendering: 'pixelated' } }), (0, jsx_runtime_1.jsx)("div", { style: { color: '#f6e8b1', fontSize: '0.75rem', marginTop: 4 }, children: djinn.name })] }, djinn.id))) })] }));
}
