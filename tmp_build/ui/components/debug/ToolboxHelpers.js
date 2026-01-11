"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolboxHelpers = ToolboxHelpers;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * ToolboxHelpers
 * Lightweight floating helper panel for QA/debug without breaking layout layers.
 * - Container uses pointer-events: none; only buttons are interactive.
 * - Positions stick to viewport corners; toggle via hotkey (Alt+T) or button.
 */
const hooks_1 = require("preact/hooks");
require("./ToolboxHelpers.css");
function ToolboxHelpers({ title = 'Toolbox', actions, position = 'bottom-right', initiallyOpen = false, }) {
    const [open, setOpen] = (0, hooks_1.useState)(initiallyOpen);
    // Hotkey toggle (Alt+T) to avoid colliding with gameplay keys
    (0, hooks_1.useEffect)(() => {
        const handler = (e) => {
            if (e.altKey && (e.key === 't' || e.key === 'T')) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
    if (!actions.length)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { class: `toolbox-root ${position}`, children: [(0, jsx_runtime_1.jsx)("button", { class: "toolbox-toggle", onClick: (e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }, title: `${open ? 'Hide' : 'Show'} ${title} (Alt+T)`, children: "\uD83E\uDDF0" }), (0, jsx_runtime_1.jsxs)("div", { class: `toolbox-panel ${open ? 'open' : 'closed'}`, onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "toolbox-header", children: [(0, jsx_runtime_1.jsx)("span", { class: "toolbox-title", children: title }), (0, jsx_runtime_1.jsx)("button", { class: "toolbox-close", onClick: () => setOpen(false), "aria-label": "Close toolbox", title: "Close (Alt+T)", children: "\u00D7" })] }), (0, jsx_runtime_1.jsx)("div", { class: "toolbox-actions", children: actions.map((action) => ((0, jsx_runtime_1.jsx)("button", { class: "toolbox-action", onClick: (e) => {
                                e.stopPropagation();
                                action.onClick();
                            }, title: action.tooltip, children: action.label }, action.id))) })] })] }));
}
