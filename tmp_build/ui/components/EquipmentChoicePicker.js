"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentChoicePicker = EquipmentChoicePicker;
const jsx_runtime_1 = require("preact/jsx-runtime");
const EquipmentIcon_1 = require("./EquipmentIcon");
function EquipmentChoicePicker({ options, onSelect }) {
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '2rem',
            borderRadius: '8px',
            border: '2px solid gold',
            marginTop: '1.5rem',
            textAlign: 'center',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
        }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { color: '#FFD700', marginBottom: '1.5rem' }, children: "\uD83C\uDFC6 Choose Your Reward! \uD83C\uDFC6" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }, children: options.map((equipment) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onSelect(equipment), style: {
                        padding: '1rem',
                        backgroundColor: '#2c2c2c',
                        border: '2px solid #FFD700',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minWidth: '200px',
                        maxWidth: '260px',
                        color: '#fff',
                        textAlign: 'left',
                    }, onMouseEnter: (event) => {
                        const target = event.currentTarget;
                        target.style.transform = 'scale(1.05)';
                        target.style.backgroundColor = '#3c3c3c';
                        target.style.borderColor = '#FFA500';
                    }, onMouseLeave: (event) => {
                        const target = event.currentTarget;
                        target.style.transform = 'scale(1)';
                        target.style.backgroundColor = '#2c2c2c';
                        target.style.borderColor = '#FFD700';
                    }, children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: equipment, size: "medium" }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '0.5rem' }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        color: getTierColor(equipment.tier),
                                    }, children: equipment.name }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '0.85rem', color: '#ccc', marginTop: '0.25rem' }, children: equipment.slot.toUpperCase() }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: '0.5rem', fontSize: '0.85rem', color: '#fff' }, children: formatStatBonus(equipment.statBonus) }), equipment.unlocksAbility && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                        marginTop: '0.5rem',
                                        fontSize: '0.75rem',
                                        color: '#FFD700',
                                        fontStyle: 'italic',
                                    }, children: ["Unlocks: ", equipment.unlocksAbility] }))] })] }, equipment.id))) })] }));
}
function getTierColor(tier) {
    const colors = {
        basic: '#999999',
        bronze: '#CD7F32',
        iron: '#C0C0C0',
        steel: '#B0C4DE',
        silver: '#E8E8E8',
        mythril: '#9370DB',
        legendary: '#FFD700',
        artifact: '#FF1493',
    };
    return colors[tier] ?? '#fff';
}
function formatStatBonus(statBonus) {
    const parts = [];
    if (statBonus.atk)
        parts.push(`+${statBonus.atk} ATK`);
    if (statBonus.def)
        parts.push(`+${statBonus.def} DEF`);
    if (statBonus.hp)
        parts.push(`+${statBonus.hp} HP`);
    if (statBonus.mag)
        parts.push(`+${statBonus.mag} MAG`);
    if (statBonus.spd)
        parts.push(`+${statBonus.spd} SPD`);
    return parts.length > 0 ? parts.join(' • ') : 'No stat bonus';
}
