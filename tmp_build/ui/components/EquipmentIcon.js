"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentIcon = EquipmentIcon;
const jsx_runtime_1 = require("preact/jsx-runtime");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const equipmentSprites_1 = require("../sprites/mappings/equipmentSprites");
const SIZE_MAP = {
    small: { width: 24, height: 24 },
    medium: { width: 32, height: 32 },
    large: { width: 48, height: 48 },
};
/**
 * Get emoji icon for equipment slot
 */
function getSlotIcon(slot) {
    switch (slot) {
        case 'weapon':
            return '⚔️';
        case 'armor':
            return '🛡️';
        case 'helm':
            return '⛑️';
        case 'boots':
            return '👢';
        case 'accessory':
            return '💍';
        default:
            return '📦';
    }
}
/**
 * Get color for equipment tier
 */
function getTierColor(tier) {
    switch (tier) {
        case 'basic':
            return '#9ca3af';
        case 'bronze':
            return '#cd7f32';
        case 'iron':
            return '#4a5568';
        case 'steel':
            return '#718096';
        case 'silver':
            return '#c0c0c0';
        case 'mythril':
            return '#a0a0ff';
        case 'legendary':
            return '#ffd700';
        case 'artifact':
            return '#ff00ff';
        default:
            return '#9ca3af';
    }
}
/**
 * EquipmentIcon component
 * Displays equipment sprite with automatic fallback to colored emoji icons
 */
function EquipmentIcon({ equipment, size = 'medium', className, style, }) {
    const sizeStyles = SIZE_MAP[size];
    const icon = getSlotIcon(equipment.slot);
    const tierColor = getTierColor(equipment.tier);
    const spriteId = (0, equipmentSprites_1.getEquipmentSpriteId)(equipment) ?? equipment.id.toLowerCase();
    // SimpleSprite will automatically show fallback if sprite not found
    return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: spriteId, width: sizeStyles.width, height: sizeStyles.height, className: className, style: style, fallback: (0, jsx_runtime_1.jsx)("div", { style: {
                ...sizeStyles,
                backgroundColor: tierColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                fontSize: size === 'small' ? '12px' : size === 'medium' ? '16px' : '24px',
                border: '2px solid rgba(0,0,0,0.2)',
            }, title: `${equipment.name} (${equipment.tier})`, children: icon }) }));
}
