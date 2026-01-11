"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PauseMenu = PauseMenu;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * PauseMenu Component
 *
 * Redesigned with Golden Sun aesthetic
 */
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
require("./PauseMenu.css");
function PauseMenu({ onClose, onTeamManagement, onInventory, onDjinnCollection, onSaveGame, onSettings, onHowToPlay, onReturnToTitle, }) {
    const [selectedIndex, setSelectedIndex] = (0, hooks_1.useState)(0);
    const [flashIndex, setFlashIndex] = (0, hooks_1.useState)(null);
    const menuRef = (0, hooks_1.useRef)(null);
    // Get game state for status bar
    const story = (0, store_1.useStore)((s) => s.story);
    const gold = (0, store_1.useStore)((s) => s.gold);
    const roster = (0, store_1.useStore)((s) => s.roster);
    // Define menu items
    const menuItems = [
        { id: 'resume', icon: '▶️', label: 'Resume Game', shortcut: 'ESC', action: onClose },
        { id: 'team', icon: '👥', label: 'Team Management', shortcut: 'T', action: onTeamManagement },
        { id: 'inventory', icon: '🎒', label: 'Inventory', shortcut: 'I', action: onInventory },
        { id: 'djinn', icon: '✨', label: 'Djinn Collection', shortcut: 'D', action: onDjinnCollection, dividerAfter: true },
        { id: 'save', icon: '💾', label: 'Save Game', shortcut: 'S', action: onSaveGame },
        { id: 'settings', icon: '⚙️', label: 'Settings', shortcut: 'O', action: onSettings },
        { id: 'help', icon: '❓', label: 'How to Play', shortcut: 'H', action: onHowToPlay, dividerAfter: true },
        { id: 'title', icon: '🏠', label: 'Return to Title', shortcut: 'Q', action: onReturnToTitle },
    ];
    // Execute menu action with flash effect
    const executeAction = (0, hooks_1.useCallback)((index) => {
        const item = menuItems[index];
        if (item?.action) {
            setFlashIndex(index);
            setTimeout(() => {
                setFlashIndex(null);
                item.action?.();
            }, 150);
        }
    }, [menuItems]);
    // Keyboard navigation
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            // Prevent default for navigation keys
            if (['ArrowUp', 'ArrowDown', 'Enter', ' ', 'Escape'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
            }
            switch (e.key) {
                case 'ArrowDown':
                    setSelectedIndex((prev) => (prev + 1) % menuItems.length);
                    break;
                case 'ArrowUp':
                    setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
                    break;
                case 'Enter':
                case ' ':
                    executeAction(selectedIndex);
                    break;
                case 'Escape':
                    onClose();
                    break;
                // Keyboard shortcuts
                case 't':
                case 'T':
                    if (onTeamManagement) {
                        const idx = menuItems.findIndex((m) => m.id === 'team');
                        executeAction(idx);
                    }
                    break;
                case 'i':
                case 'I':
                    if (onInventory) {
                        const idx = menuItems.findIndex((m) => m.id === 'inventory');
                        executeAction(idx);
                    }
                    break;
                case 'd':
                case 'D':
                    if (onDjinnCollection) {
                        const idx = menuItems.findIndex((m) => m.id === 'djinn');
                        executeAction(idx);
                    }
                    break;
                case 's':
                case 'S':
                    if (onSaveGame) {
                        const idx = menuItems.findIndex((m) => m.id === 'save');
                        executeAction(idx);
                    }
                    break;
                case 'o':
                case 'O':
                    if (onSettings) {
                        const idx = menuItems.findIndex((m) => m.id === 'settings');
                        executeAction(idx);
                    }
                    break;
                case 'h':
                case 'H':
                    if (onHowToPlay) {
                        const idx = menuItems.findIndex((m) => m.id === 'help');
                        executeAction(idx);
                    }
                    break;
                case 'q':
                case 'Q':
                    if (onReturnToTitle) {
                        const idx = menuItems.findIndex((m) => m.id === 'title');
                        executeAction(idx);
                    }
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [selectedIndex, menuItems, executeAction, onClose, onTeamManagement, onInventory, onDjinnCollection, onSaveGame, onSettings, onHowToPlay, onReturnToTitle]);
    // Focus management
    (0, hooks_1.useEffect)(() => {
        menuRef.current?.focus();
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { class: "pause-overlay", role: "dialog", "aria-modal": "true", "aria-label": "Pause Menu", children: [(0, jsx_runtime_1.jsxs)("div", { class: "pause-status-bar gs-window", children: [(0, jsx_runtime_1.jsxs)("div", { class: "status-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Chapter:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: story.chapter })] }), (0, jsx_runtime_1.jsxs)("div", { class: "status-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Units:" }), (0, jsx_runtime_1.jsxs)("span", { class: "gs-value", children: [roster.length, "/10"] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "status-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Gold:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: gold.toLocaleString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "pause-menu gs-window", ref: menuRef, tabIndex: -1, children: [(0, jsx_runtime_1.jsx)("h1", { class: "gs-title", children: "PAUSED" }), (0, jsx_runtime_1.jsx)("div", { class: "menu-options", role: "menu", children: menuItems.map((item, index) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${selectedIndex === index ? 'selected' : ''} ${flashIndex === index ? 'flash' : ''}`, onClick: () => {
                                        setSelectedIndex(index);
                                        executeAction(index);
                                    }, onMouseEnter: () => setSelectedIndex(index), role: "menuitem", "aria-selected": selectedIndex === index, disabled: !item.action, children: [(0, jsx_runtime_1.jsx)("span", { class: "menu-icon", "aria-hidden": "true", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { class: "menu-label", children: item.label }), (0, jsx_runtime_1.jsx)("span", { class: "menu-hint", children: item.shortcut })] }), item.dividerAfter && (0, jsx_runtime_1.jsx)("div", { class: "menu-divider" })] }, item.id))) }), (0, jsx_runtime_1.jsx)("div", { class: "pause-footer", children: (0, jsx_runtime_1.jsxs)("div", { class: "keyboard-hints", children: [(0, jsx_runtime_1.jsxs)("div", { class: "hint", children: [(0, jsx_runtime_1.jsx)("span", { class: "key", children: "\u2191\u2193" }), (0, jsx_runtime_1.jsx)("span", { children: "Navigate" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "hint", children: [(0, jsx_runtime_1.jsx)("span", { class: "key", children: "Enter" }), (0, jsx_runtime_1.jsx)("span", { children: "Select" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "hint", children: [(0, jsx_runtime_1.jsx)("span", { class: "key", children: "ESC" }), (0, jsx_runtime_1.jsx)("span", { children: "Resume" })] })] }) })] })] }));
}
