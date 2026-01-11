"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityPanel = AbilityPanel;
const jsx_runtime_1 = require("preact/jsx-runtime");
const SimpleSprite_1 = require("../../sprites/SimpleSprite");
const mappings_1 = require("../../sprites/mappings");
function AbilityPanel({ coreAbilities, djinnAbilities, onSelectAbility, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { class: "ability-panel", children: [coreAbilities.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-section-title", children: "Core (Level / Equipment)" }), (0, jsx_runtime_1.jsx)("div", { class: "ability-list", children: coreAbilities.map((ability) => ((0, jsx_runtime_1.jsxs)("div", { class: "ability-item", onClick: () => onSelectAbility(ability.id), children: [(0, jsx_runtime_1.jsxs)("div", { class: "ability-item__top", children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-icon", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityEffectSprite)(ability.id) ?? (0, mappings_1.getAbilityIconSprite)(ability.id), width: 32, height: 32, style: { borderRadius: '4px' } }) }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-info", children: [(0, jsx_runtime_1.jsx)("span", { class: "ability-name", children: ability.name }), (0, jsx_runtime_1.jsxs)("span", { class: "ability-meta", children: [ability.manaCost, " mana \u00B7 [", ability.sourceLabel, "]"] })] })] }), (0, jsx_runtime_1.jsx)("div", { class: "ability-detail", children: ability.description })] }, ability.id))) })] })), djinnAbilities.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-section-title", children: "Djinn-Granted (Current State)" }), (0, jsx_runtime_1.jsx)("div", { class: "ability-list", children: djinnAbilities.map((ability) => {
                            const classes = [
                                'ability-item',
                                ability.isLocked ? 'ability-item--locked' : '',
                            ].filter(Boolean).join(' ');
                            return ((0, jsx_runtime_1.jsxs)("div", { class: classes, onClick: () => !ability.isLocked && onSelectAbility(ability.id), children: [(0, jsx_runtime_1.jsxs)("div", { class: "ability-item__top", children: [(0, jsx_runtime_1.jsx)("div", { class: "ability-icon", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getAbilityEffectSprite)(ability.id) ?? (0, mappings_1.getAbilityIconSprite)(ability.id), width: 32, height: 32, style: {
                                                        borderRadius: '4px',
                                                        opacity: ability.isLocked ? 0.5 : 1
                                                    } }) }), (0, jsx_runtime_1.jsxs)("div", { class: "ability-info", children: [(0, jsx_runtime_1.jsx)("span", { class: "ability-name", children: ability.name }), (0, jsx_runtime_1.jsxs)("span", { class: "ability-meta", children: [ability.manaCost, " mana \u00B7 [", ability.sourceLabel, "]"] })] })] }), (0, jsx_runtime_1.jsx)("div", { class: "ability-detail", children: ability.description }), ability.isLocked && ability.lockedReason && ((0, jsx_runtime_1.jsx)("div", { class: "ability-lock-label", children: ability.lockedReason }))] }, ability.id));
                        }) })] }))] }));
}
