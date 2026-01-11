"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component3;
const jsx_runtime_1 = require("preact/jsx-runtime");
const gameStore_1 = require("../../store/gameStore");
function Component3() {
    // Use the team slice for playerData to read inventory safely
    const itemCount = (0, gameStore_1.useTeamStore)((s) => s.playerData.inventory.items.length);
    const openModal = (0, gameStore_1.useFlowStore)((s) => s.openModal);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Inventory items: ", itemCount] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => openModal('inventory'), children: "Open Inventory" })] }));
}
