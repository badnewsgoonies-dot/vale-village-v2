"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component2;
const jsx_runtime_1 = require("preact/jsx-runtime");
const gameStore_1 = require("../../store/gameStore");
function Component2() {
    // Read only the flow properties needed and the action to mutate them
    const { isTransitioning, setTransitioning } = (0, gameStore_1.useFlowStore)((s) => ({
        isTransitioning: s.flow.isTransitioning,
        setTransitioning: s.setTransitioning,
    }));
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Transitioning: ", isTransitioning ? 'Yes' : 'No'] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setTransitioning(!isTransitioning), children: "Toggle Transition" })] }));
}
