"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattlePortraitRow = void 0;
const jsx_runtime_1 = require("preact/jsx-runtime");
const compat_1 = require("preact/compat");
const Unit_1 = require("../../core/models/Unit");
const statusIconMap = {
    burn: '/sprites/icons/misc/Poison.gif',
    poison: '/sprites/icons/misc/Poison.gif',
    paralyze: '/sprites/icons/misc/Psynergy_Seal.gif',
    freeze: '/sprites/icons/misc/Haunted.gif',
    stun: '/sprites/icons/misc/Exclamatory.gif',
    buff: '/sprites/icons/misc/Stat-Up.gif',
    debuff: '/sprites/icons/misc/Stat-Down.gif',
    damageReduction: '/sprites/icons/misc/Stat-Up.gif',
    shield: '/sprites/icons/misc/Stat-Up.gif',
    invulnerable: '/sprites/icons/misc/Stat-Up.gif',
    immunity: '/sprites/icons/misc/Stat-Up.gif',
    autoRevive: '/sprites/icons/misc/Up_Arrow.gif',
};
function getPortraitSprite(unit) {
    // Prefer portrait headshots to keep the action UI focused and readable
    const portraitDir = '/sprites/icons/characters';
    const portraitByElement = {
        Venus: 'Isaac1.gif',
        Mars: 'Garet1.gif',
        Mercury: 'Mia.gif',
        Jupiter: 'Ivan.gif',
    };
    const portrait = portraitByElement[unit.element];
    if (portrait) {
        return `${portraitDir}/${portrait}`;
    }
    // Fallback to the battle sprite front pose if we don't have a portrait mapping
    const baseDir = '/sprites/battle/party';
    const fallback = { folder: 'isaac', prefix: 'Isaac', weapon: 'lSword' };
    const sprite = fallback;
    return `${baseDir}/${sprite.folder}/${sprite.prefix}_${sprite.weapon}_Front.gif`;
}
function StatusChips({ unit }) {
    const maxVisible = 3;
    const effects = unit.statusEffects.slice(0, maxVisible);
    return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: 4 }, children: effects.map((status, idx) => ((0, jsx_runtime_1.jsxs)("div", { title: status.type, style: {
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: 'rgba(0,0,0,0.45)',
                padding: '2px 4px',
                borderRadius: 3,
                border: '1px solid rgba(255,216,127,0.25)',
                minWidth: 18,
            }, children: [(0, jsx_runtime_1.jsx)("img", { src: statusIconMap[status.type] ?? '/sprites/icons/misc/Stat-Up.gif', alt: status.type, width: 14, height: 14, style: { imageRendering: 'pixelated' } }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.7rem', color: '#f6e8b1' }, children: 'duration' in status && typeof status.duration === 'number'
                        ? status.duration
                        : 'remainingCharges' in status
                            ? status.remainingCharges
                            : '' })] }, `${status.type}-${idx}`))) }));
}
exports.BattlePortraitRow = (0, compat_1.memo)(function BattlePortraitRow({ units, activeIndex, queuedActions, critCounters, critThresholds, critFlashes, onSelect, }) {
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            display: 'flex',
            gap: 6,
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 8px',
            border: '2px solid rgba(255,215,0,0.5)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        }, children: units.map((unit, idx) => {
            const maxHp = (0, Unit_1.calculateMaxHp)(unit);
            const hpPct = Math.max(0, Math.min(1, unit.currentHp / maxHp));
            const critCount = critCounters[unit.id] ?? 0;
            const critThreshold = critThresholds[unit.id] ?? 10;
            const queued = queuedActions[idx] !== null;
            const isActive = idx === activeIndex;
            const flash = critFlashes?.[unit.id];
            return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onSelect?.(idx), style: {
                    width: 80,
                    height: 80,
                    position: 'relative',
                    border: isActive ? '3px solid #FFD54A' : '2px solid rgba(255,215,0,0.3)',
                    borderRadius: 8,
                    padding: 0,
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f18 100%)',
                    boxShadow: flash
                        ? '0 0 15px 4px rgba(255, 216, 74, 0.95), inset 0 0 10px rgba(255,215,0,0.3)'
                        : isActive
                            ? '0 0 10px rgba(255, 216, 74, 0.7), inset 0 0 5px rgba(255,215,0,0.2)'
                            : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    cursor: onSelect ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            fontSize: '0.65rem',
                            color: '#FFD54A',
                            background: 'rgba(0,0,0,0.85)',
                            padding: '1px 4px',
                            borderRadius: 3,
                            border: '1px solid #FFD54A',
                            fontWeight: 700,
                            textShadow: '0 0 4px rgba(255,215,0,0.8)',
                            letterSpacing: '-0.5px',
                        }, title: "Crit counter", children: [critCount, "/", critThreshold] }), queued && ((0, jsx_runtime_1.jsx)("div", { title: "Queued (click to cancel)", style: {
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            background: '#4CAF50',
                            color: '#fff',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            borderRadius: 4,
                            cursor: 'pointer',
                            boxShadow: '0 0 4px rgba(76, 175, 80, 0.8)',
                        }, children: "OK" })), (0, jsx_runtime_1.jsx)("div", { style: {
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 10,
                            background: 'rgba(0,0,0,0.7)',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                        }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                                width: `${hpPct * 100}%`,
                                height: '100%',
                                background: hpPct > 0.5
                                    ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                                    : hpPct > 0.25
                                        ? 'linear-gradient(90deg, #FF9800, #FFC107)'
                                        : 'linear-gradient(90deg, #f44336, #FF5722)',
                                transition: 'width 0.3s ease',
                                boxShadow: '0 0 4px rgba(255,255,255,0.3)',
                            } }) }), (0, jsx_runtime_1.jsx)(StatusChips, { unit: unit }), (0, jsx_runtime_1.jsx)("img", { src: getPortraitSprite(unit), alt: `${unit.name} portrait`, width: 64, height: 64, style: {
                            imageRendering: 'pixelated',
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08), transparent 60%)',
                        } })] }, unit.id));
        }) }));
});
