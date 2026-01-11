"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuePanel = QueuePanel;
const jsx_runtime_1 = require("preact/jsx-runtime");
function QueuePanel({ roundNumber, queueSlots, mana, canExecute, targetingMode, onSelectSlot, onClearSlot, onPrevUnit, onNextUnit, onExecuteRound, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "queue-mana-panel", children: [(0, jsx_runtime_1.jsxs)("div", { class: "queue-header", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Action Queue \u2013 Round ", roundNumber] }), (0, jsx_runtime_1.jsxs)("div", { class: "queue-nav", children: [(0, jsx_runtime_1.jsx)("button", { class: "queue-nav-button", onClick: onPrevUnit, children: "[Q] Prev Unit" }), (0, jsx_runtime_1.jsx)("button", { class: "queue-nav-button", onClick: onNextUnit, children: "[E] Next Unit" })] })] }), (0, jsx_runtime_1.jsx)("div", { class: "action-queue", children: queueSlots.map((slot) => {
                    const classes = [
                        'action-slot',
                        slot.isEmpty ? 'action-slot--empty' : 'action-slot--filled',
                        slot.isCurrent ? 'action-slot--current' : '',
                        slot.isKo ? 'action-slot--ko' : '',
                    ].filter(Boolean).join(' ');
                    return ((0, jsx_runtime_1.jsxs)("div", { class: classes, onClick: () => onSelectSlot(slot.unitId), children: [(0, jsx_runtime_1.jsx)("div", { class: "action-slot__unit", children: slot.unitName }), (0, jsx_runtime_1.jsx)("div", { class: "action-slot__summary", children: slot.summary }), !slot.isEmpty && !slot.isKo && ((0, jsx_runtime_1.jsxs)("div", { class: "action-slot__meta", children: [(0, jsx_runtime_1.jsxs)("span", { children: [slot.manaCost, " mana"] }), (0, jsx_runtime_1.jsx)("span", { class: "action-slot__clear", onClick: (e) => {
                                            e.stopPropagation();
                                            onClearSlot(slot.unitId);
                                        }, children: "\u00D7 Clear" })] }))] }, slot.unitId));
                }) }), (0, jsx_runtime_1.jsxs)("div", { class: "mana-row", children: [(0, jsx_runtime_1.jsx)("div", { class: "mana-orbs", children: Array.from({ length: mana.max }, (_, i) => ((0, jsx_runtime_1.jsx)("div", { class: `mana-orb ${i < mana.current ? 'mana-orb--filled' : ''}` }, i))) }), (0, jsx_runtime_1.jsxs)("div", { class: `mana-display ${mana.overBudget ? 'mana-display--over-budget' : ''}`, children: ["Mana: ", mana.current, " / ", mana.max] })] }), targetingMode && ((0, jsx_runtime_1.jsx)("div", { class: "execute-row", children: (0, jsx_runtime_1.jsx)("span", { class: "target-mode-banner", children: "Select Target: Use arrow keys or click on a unit" }) })), (0, jsx_runtime_1.jsx)("div", { class: "execute-row", children: (0, jsx_runtime_1.jsx)("button", { class: `execute-button ${!canExecute ? 'execute-button--disabled' : ''}`, onClick: onExecuteRound, disabled: !canExecute, children: "Execute Round" }) })] }));
}
