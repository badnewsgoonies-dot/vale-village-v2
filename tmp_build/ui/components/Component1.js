"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component1;
const jsx_runtime_1 = require("preact/jsx-runtime");
const gameStore_1 = require("../../store/gameStore");
function Component1() {
    // Use the flow slice to avoid pulling the entire store and keep selectors typed
    const { screen, startTransition } = (0, gameStore_1.useFlowStore)((s) => ({ screen: s.flow.screen, startTransition: s.startTransition }));
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Current screen: ", screen] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => startTransition('overworld'), children: "Go to Overworld" })] }));
}
