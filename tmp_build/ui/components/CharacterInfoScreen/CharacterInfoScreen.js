"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterInfoScreen = CharacterInfoScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * CharacterInfoScreen Component
 * Detailed character view: portrait, stats, equipment, abilities
 * Golden Sun-inspired two-column layout
 */
const hooks_1 = require("preact/hooks");
const Equipment_1 = require("@/core/models/Equipment");
const Unit_1 = require("@/core/models/Unit");
const xp_1 = require("@/core/algorithms/xp");
const SimpleSprite_1 = require("../../sprites/SimpleSprite");
const mappings_1 = require("../../sprites/mappings");
const EquipmentIcon_1 = require("../EquipmentIcon");
require("./CharacterInfoScreen.css");
const ELEMENT_COLORS = {
    Venus: '#E8A050',
    Mars: '#FF6B6B',
    Mercury: '#4A9BFF',
    Jupiter: '#9B59B6',
};
const ELEMENT_ICONS = {
    Venus: '🌍',
    Mars: '🔥',
    Mercury: '💧',
    Jupiter: '💨',
};
const EQUIPMENT_SLOTS = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
function CharacterInfoScreen({ unit, equipment, onClose, onEquipmentClick }) {
    // Keyboard handler
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    // Calculate XP progress
    const xpInfo = (0, xp_1.getXpProgress)(unit.xp);
    const nextLevelXp = (0, xp_1.getXpForLevel)(unit.level + 1);
    const xpProgress = xpInfo.progress * 100;
    const xpToNext = xpInfo.needed - xpInfo.current;
    // Calculate total stats with equipment
    const equipmentBonuses = (0, hooks_1.useMemo)(() => (0, Equipment_1.calculateEquipmentBonuses)(equipment), [equipment]);
    const maxHp = (0, Unit_1.calculateMaxHp)(unit);
    const totalStats = {
        hp: maxHp,
        atk: unit.baseStats.atk + (equipmentBonuses.atk ?? 0),
        def: unit.baseStats.def + (equipmentBonuses.def ?? 0),
        mag: unit.baseStats.mag + (equipmentBonuses.mag ?? 0),
        spd: unit.baseStats.spd + (equipmentBonuses.spd ?? 0),
    };
    const elementColor = ELEMENT_COLORS[unit.element] ?? '#888';
    const elementIcon = ELEMENT_ICONS[unit.element] ?? '?';
    return ((0, jsx_runtime_1.jsx)("div", { class: "character-info-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "character-info-screen", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "character-left-column", children: [(0, jsx_runtime_1.jsxs)("div", { class: "character-portrait-panel", children: [(0, jsx_runtime_1.jsx)("div", { class: "character-element-badge", style: { backgroundColor: elementColor }, children: elementIcon }), (0, jsx_runtime_1.jsx)("div", { class: "character-sprite-container", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 64, height: 64 }) }), (0, jsx_runtime_1.jsx)("h2", { class: "character-name", children: unit.name }), (0, jsx_runtime_1.jsx)("div", { class: "character-class", children: unit.role }), (0, jsx_runtime_1.jsxs)("div", { class: "character-level", children: ["Level ", unit.level] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-xp-container", children: [(0, jsx_runtime_1.jsxs)("div", { class: "character-xp-label", children: [(0, jsx_runtime_1.jsx)("span", { children: "EXP" }), (0, jsx_runtime_1.jsxs)("span", { children: [unit.xp.toLocaleString(), " / ", nextLevelXp.toLocaleString()] })] }), (0, jsx_runtime_1.jsx)("div", { class: "character-xp-bar", children: (0, jsx_runtime_1.jsx)("div", { class: "character-xp-fill", style: { width: `${xpProgress}%` } }) }), (0, jsx_runtime_1.jsx)("div", { class: "character-xp-next", children: xpToNext > 0 ? `${xpToNext.toLocaleString()} to next level` : 'Max Level' })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stats-panel", children: [(0, jsx_runtime_1.jsx)("h3", { class: "character-panel-title", children: "STATS" }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stats-grid", children: [(0, jsx_runtime_1.jsxs)("div", { class: "character-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-stat-label", children: "HP" }), (0, jsx_runtime_1.jsxs)("span", { class: "character-stat-value hp", children: [unit.currentHp, "/", totalStats.hp] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-stat-label", children: "ATK" }), (0, jsx_runtime_1.jsxs)("span", { class: "character-stat-value", children: [totalStats.atk, equipmentBonuses.atk ? (0, jsx_runtime_1.jsxs)("span", { class: "stat-bonus", children: ["+", equipmentBonuses.atk] }) : null] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-stat-label", children: "DEF" }), (0, jsx_runtime_1.jsxs)("span", { class: "character-stat-value", children: [totalStats.def, equipmentBonuses.def ? (0, jsx_runtime_1.jsxs)("span", { class: "stat-bonus", children: ["+", equipmentBonuses.def] }) : null] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-stat-label", children: "MAG" }), (0, jsx_runtime_1.jsxs)("span", { class: "character-stat-value", children: [totalStats.mag, equipmentBonuses.mag ? (0, jsx_runtime_1.jsxs)("span", { class: "stat-bonus", children: ["+", equipmentBonuses.mag] }) : null] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-stat-label", children: "SPD" }), (0, jsx_runtime_1.jsxs)("span", { class: "character-stat-value", children: [totalStats.spd, equipmentBonuses.spd ? (0, jsx_runtime_1.jsxs)("span", { class: "stat-bonus", children: ["+", equipmentBonuses.spd] }) : null] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-stat-label", children: "Element" }), (0, jsx_runtime_1.jsx)("span", { class: "character-stat-value", style: { color: elementColor }, children: unit.element })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-right-column", children: [(0, jsx_runtime_1.jsxs)("div", { class: "character-equipment-panel", children: [(0, jsx_runtime_1.jsx)("h3", { class: "character-panel-title", children: "EQUIPMENT" }), (0, jsx_runtime_1.jsx)("div", { class: "character-equipment-grid", children: EQUIPMENT_SLOTS.map((slot) => {
                                        const item = equipment[slot];
                                        return ((0, jsx_runtime_1.jsx)("div", { class: `character-equipment-slot ${item ? 'equipped' : 'empty'}`, onClick: () => onEquipmentClick?.(slot), children: item ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item, size: "small" }), (0, jsx_runtime_1.jsxs)("div", { class: "character-equipment-info", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-equipment-label", children: slot }), (0, jsx_runtime_1.jsx)("span", { class: "character-equipment-name", children: item.name })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "character-equipment-empty-icon" }), (0, jsx_runtime_1.jsxs)("div", { class: "character-equipment-info", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-equipment-label", children: slot }), (0, jsx_runtime_1.jsx)("span", { class: "character-equipment-name empty", children: "[None]" })] })] })) }, slot));
                                    }) })] }), (0, jsx_runtime_1.jsxs)("div", { class: "character-abilities-panel", children: [(0, jsx_runtime_1.jsx)("h3", { class: "character-panel-title", children: "ABILITIES" }), (0, jsx_runtime_1.jsx)("div", { class: "character-abilities-grid", children: unit.abilities.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "character-no-abilities", children: "No abilities learned yet" })) : (unit.abilities.map((ability, idx) => ((0, jsx_runtime_1.jsxs)("div", { class: "character-ability-item", children: [(0, jsx_runtime_1.jsx)("div", { class: "character-ability-icon", children: ability.element === 'Venus' ? '🌍' : ability.element === 'Mars' ? '🔥' : ability.element === 'Mercury' ? '💧' : '💨' }), (0, jsx_runtime_1.jsxs)("div", { class: "character-ability-info", children: [(0, jsx_runtime_1.jsx)("span", { class: "character-ability-name", children: ability.name }), (0, jsx_runtime_1.jsxs)("span", { class: "character-ability-cost", children: [ability.manaCost, " Mana"] })] })] }, idx)))) })] }), (0, jsx_runtime_1.jsx)("button", { class: "character-close-btn", onClick: onClose, children: "Close" })] })] }) }));
}
