"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonIcon = ButtonIcon;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Button Icon Component
 * Renders UI button sprites (Fight, Psynergy, Djinn, etc.)
 */
const SimpleSprite_1 = require("../sprites/SimpleSprite");
function ButtonIcon({ id, label, size = 32, onClick, disabled = false, className, }) {
    const spriteId = id.toLowerCase();
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: onClick, disabled: disabled, className: className, style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.5rem',
            backgroundColor: disabled ? '#e0e0e0' : '#f5f5f5',
            border: '2px solid',
            borderColor: disabled ? '#bdbdbd' : '#2196F3',
            borderRadius: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'all 0.2s',
        }, onMouseEnter: (e) => {
            if (!disabled) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#e3f2fd';
            }
        }, onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = disabled ? '#e0e0e0' : '#f5f5f5';
        }, children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: spriteId, width: size, height: size }), label && ((0, jsx_runtime_1.jsx)("span", { style: {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: disabled ? '#999' : '#333',
                }, children: label }))] }));
}
