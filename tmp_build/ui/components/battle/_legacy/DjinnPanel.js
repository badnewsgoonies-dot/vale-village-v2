"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnPanel = DjinnPanel;
const jsx_runtime_1 = require("preact/jsx-runtime");
function DjinnPanel({ djinns, onSelectDjinn }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-popup", children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-popup-title", children: "Djinn \u2013 Activation" }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-list", children: djinns.map((djinn) => {
                    const classes = [
                        'djinn-entry',
                        !djinn.isSelectable ? 'djinn-entry--disabled' : '',
                    ].filter(Boolean).join(' ');
                    const stateLabel = djinn.state === 'set' ? '[SET]' :
                        djinn.state === 'standby' ? `[STANDBY – ${djinn.turnsRemaining} turns]` :
                            `[RECOVERY – ${djinn.turnsRemaining} turns]`;
                    const stateClass = djinn.state === 'set' ? 'djinn-state--set' :
                        djinn.state === 'standby' ? 'djinn-state--standby' :
                            'djinn-state--recovery';
                    return ((0, jsx_runtime_1.jsxs)("div", { class: classes, onClick: () => djinn.isSelectable && onSelectDjinn(djinn.id), children: [(0, jsx_runtime_1.jsxs)("div", { class: "djinn-entry-header", children: [(0, jsx_runtime_1.jsx)("span", { class: "djinn-name", children: djinn.name }), (0, jsx_runtime_1.jsx)("span", { class: stateClass, children: stateLabel })] }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-effect", children: djinn.summonDescription })] }, djinn.id));
                }) })] }));
}
