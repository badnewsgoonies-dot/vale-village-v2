"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionQueuePanel = ActionQueuePanel;
const jsx_runtime_1 = require("preact/jsx-runtime");
const abilities_1 = require("../../data/definitions/abilities");
const djinnAbilities_1 = require("../../data/definitions/djinnAbilities");
function ActionQueuePanel({ battle, onClearAction, className, style }) {
    const { queuedActions, playerTeam } = battle;
    return ((0, jsx_runtime_1.jsxs)("div", { class: `action-queue-panel ${className || ''}`, style: {
            backgroundColor: '#1a1a1a',
            border: '2px solid #444',
            borderRadius: '0',
            padding: '1rem',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '10px',
            ...style,
        }, role: "region", "aria-label": "Action queue", children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                    marginTop: 0,
                    marginBottom: '1rem',
                    fontSize: '8px',
                    color: '#FFD87F',
                    textAlign: 'center',
                    textShadow: '1px 1px 0 #000',
                }, children: "ACTION QUEUE" }), (0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }, children: queuedActions.map((action, index) => {
                    const unit = playerTeam.units[index];
                    if (!unit)
                        return null;
                    // Phase 3: Lookup ability from both ABILITIES and DJINN_ABILITIES
                    const ability = action?.abilityId
                        ? abilities_1.ABILITIES[action.abilityId] ?? djinnAbilities_1.DJINN_ABILITIES[action.abilityId] ?? null
                        : null;
                    return ((0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: action ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                            border: `2px solid ${action ? '#4CAF50' : '#444'}`,
                            borderRightColor: action ? '#66bb6a' : '#666',
                            borderBottomColor: action ? '#66bb6a' : '#666',
                            borderRadius: '0',
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { flex: 1 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { fontWeight: 'normal', color: '#fff', fontSize: '8px', textShadow: '1px 1px 0 #000' }, children: [index + 1, ". ", unit.name.toUpperCase(), ":"] }), action ? ((0, jsx_runtime_1.jsxs)("div", { style: { fontSize: '8px', color: '#a0a0a0', marginTop: '0.25rem', textShadow: '1px 1px 0 #000' }, children: [ability ? ability.name.toUpperCase() : 'ATTACK', " [", action.manaCost, "\u25CB]", action.targetIds.length > 0 && ((0, jsx_runtime_1.jsxs)("span", { style: { color: '#888' }, children: [' → ', action.targetIds.length === 1
                                                        ? `TARGET ${action.targetIds[0]?.slice(0, 8).toUpperCase() || 'UNKNOWN'}`
                                                        : `${action.targetIds.length} TARGETS`] }))] })) : ((0, jsx_runtime_1.jsx)("div", { style: { fontSize: '8px', color: '#666', fontStyle: 'normal' }, children: "[EMPTY]" }))] }), action && ((0, jsx_runtime_1.jsx)("button", { onClick: () => onClearAction(index), style: {
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: '#d32f2f',
                                    color: '#fff',
                                    border: '2px solid #e57373',
                                    borderRightColor: '#b71c1c',
                                    borderBottomColor: '#b71c1c',
                                    borderRadius: '0',
                                    cursor: 'pointer',
                                    fontSize: '8px',
                                    fontFamily: "'Press Start 2P', monospace",
                                    textShadow: '1px 1px 0 #000',
                                }, "aria-label": `Clear action for ${unit.name}`, children: "CLEAR" }))] }, index));
                }) })] }));
}
