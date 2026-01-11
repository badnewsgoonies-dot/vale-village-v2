"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPanel = CommandPanel;
const jsx_runtime_1 = require("preact/jsx-runtime");
const AbilityPanel_1 = require("./AbilityPanel");
const SimpleSprite_1 = require("../../sprites/SimpleSprite");
function CommandPanel({ currentUnit, selectedCommand, coreAbilities, djinnAbilities, onCommandSelect, onSelectAbility, }) {
    const renderCommandButton = (command, label, icon) => ((0, jsx_runtime_1.jsxs)("div", { class: `command-button${selectedCommand === command ? ' selected' : ''}`, onClick: () => onCommandSelect(command), children: [icon && ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: `/sprites/icons/buttons/${icon}.gif`, width: 32, height: 32, style: { borderRadius: 6 } })), (0, jsx_runtime_1.jsx)("span", { children: label })] }));
    return ((0, jsx_runtime_1.jsxs)("div", { class: "command-bar", children: [(0, jsx_runtime_1.jsx)("div", { class: "command-header", children: currentUnit ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Current Unit: ", (0, jsx_runtime_1.jsxs)("strong", { children: [currentUnit.name, " (", currentUnit.element, " Adept)"] })] })) : ('Waiting...') }), (0, jsx_runtime_1.jsxs)("div", { class: "command-buttons", children: [renderCommandButton('attack', '[A] Attack', 'Attack'), renderCommandButton('psynergy', '[S] Psynergy', 'Psynergy'), renderCommandButton('djinn', '[D] Djinn', 'Djinni'), renderCommandButton('abilities', '[F] Abilities', 'Summon')] }), (0, jsx_runtime_1.jsx)(AbilityPanel_1.AbilityPanel, { coreAbilities: coreAbilities, djinnAbilities: djinnAbilities, onSelectAbility: onSelectAbility })] }));
}
