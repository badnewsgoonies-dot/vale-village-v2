"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusIcon = StatusIcon;
const jsx_runtime_1 = require("preact/jsx-runtime");
const SimpleSprite_1 = require("../../sprites/SimpleSprite");
const mappings_1 = require("../../sprites/mappings");
/**
 * StatusIcon component
 * Renders a status effect icon sprite with tooltip
 */
function StatusIcon({ statusType, title, size = 24, className }) {
    const spriteId = (0, mappings_1.getStatusIconSprite)(statusType);
    return ((0, jsx_runtime_1.jsx)("div", { class: `status-icon ${className || ''}`, title: title || statusType, style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        }, children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: spriteId, width: size, height: size, style: { display: 'block' } }) }));
}
