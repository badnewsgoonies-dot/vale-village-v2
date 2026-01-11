"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battlefield = Battlefield;
const jsx_runtime_1 = require("preact/jsx-runtime");
const BackgroundSprite_1 = require("../../sprites/BackgroundSprite");
const BattleUnitSprite_1 = require("../BattleUnitSprite");
function Battlefield({ playerUnits, enemyUnits, targetingMode, onSelectTarget, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "battlefield", style: { position: 'relative' }, children: [(0, jsx_runtime_1.jsx)(BackgroundSprite_1.BackgroundSprite, { id: "random", category: "backgrounds-gs1", style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                } }), (0, jsx_runtime_1.jsxs)("div", { class: "battlefield-inner", style: { position: 'relative', zIndex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { class: "battlefield-column", children: playerUnits.map((unit) => {
                            const classes = [
                                'battlefield-unit',
                                unit.isSelected ? 'battlefield-unit--current' : '',
                                targetingMode && !unit.isKo ? 'targetable' : '',
                            ].filter(Boolean).join(' ');
                            return ((0, jsx_runtime_1.jsx)("div", { class: classes, onClick: () => targetingMode && onSelectTarget?.(unit.id), style: { opacity: unit.isKo ? 0.4 : 1 }, children: (0, jsx_runtime_1.jsx)(BattleUnitSprite_1.BattleUnitSprite, { unitId: unit.id, state: "idle", size: "medium" }) }, unit.id));
                        }) }), (0, jsx_runtime_1.jsx)("div", { class: "battlefield-column", children: enemyUnits.map((enemy) => {
                            const classes = [
                                'battlefield-unit',
                                targetingMode && !enemy.isKo ? 'targetable' : '',
                            ].filter(Boolean).join(' ');
                            return ((0, jsx_runtime_1.jsx)("div", { class: classes, onClick: () => targetingMode && onSelectTarget?.(enemy.id), style: { opacity: enemy.isKo ? 0.4 : 1 }, children: (0, jsx_runtime_1.jsx)(BattleUnitSprite_1.BattleUnitSprite, { unitId: enemy.id, state: "idle", size: "medium" }) }, enemy.id));
                        }) })] })] }));
}
