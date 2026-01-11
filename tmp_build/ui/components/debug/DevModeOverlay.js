"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevModeOverlay = DevModeOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
// @ts-nocheck
const hooks_1 = require("preact/hooks");
const store_1 = require("../../state/store");
const gameStore_1 = require("../../../store/gameStore");
const encounters_1 = require("../../../data/definitions/encounters");
const maps_1 = require("../../../data/definitions/maps");
require("./DevModeOverlay.css");
function DevModeOverlay() {
    const { devModeEnabled, toggleDevMode, godMode, toggleGodMode, skipAnimations, toggleSkipAnimations } = (0, store_1.useStore)(s => ({
        devModeEnabled: s.devModeEnabled,
        toggleDevMode: s.toggleDevMode,
        godMode: s.godMode,
        toggleGodMode: s.toggleGodMode,
        skipAnimations: s.skipAnimations,
        toggleSkipAnimations: s.toggleSkipAnimations
    }));
    const { startTransition, setScreen } = (0, gameStore_1.useGameStore)(s => ({
        startTransition: s.startTransition,
        setScreen: s.setScreen
    }));
    const v1SetBattle = (0, store_1.useStore)(s => s.setBattle);
    const v1SetMode = (0, store_1.useStore)(s => s.setMode);
    const [activeTab, setActiveTab] = (0, hooks_1.useState)('cheats');
    // Keyboard toggle (Ctrl+D)
    (0, hooks_1.useEffect)(() => {
        const handler = (e) => {
            if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault();
                toggleDevMode();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [toggleDevMode]);
    if (!devModeEnabled)
        return null;
    const handleTeleport = (encounterId) => {
        console.log(`[DevMode] Teleporting to ${encounterId}`);
        // 1. Force battle for this encounter
        // This is a "Battle Teleport" - we jump straight to the fight
        const encounter = encounters_1.ENCOUNTERS[encounterId];
        if (!encounter) {
            alert(`Encounter ${encounterId} not found!`);
            return;
        }
        // Reset UI to overworld first to clear any weird states
        setScreen('overworld');
        // Small delay then trigger battle
        setTimeout(() => {
            // Use the global window helpers if available, or direct store manipulation
            // Ideally we call startBattle(encounterId)
            // Since we don't have a direct 'startBattle' hook here easily without more wiring,
            // we'll use the V1 store to set pending battle.
            store_1.useStore.getState().setPendingBattle(encounterId);
            store_1.useStore.getState().setMode('team-select');
            startTransition('team-select');
            toggleDevMode(); // Close overlay
        }, 100);
    };
    const handleWinBattle = () => {
        const battle = store_1.useStore.getState().battle;
        if (!battle)
            return;
        // Kill all enemies
        const newEnemies = battle.enemies.map(e => ({ ...e, currentHp: 0 }));
        v1SetBattle({ ...battle, enemies: newEnemies, phase: 'victory' });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "dev-overlay-root", children: (0, jsx_runtime_1.jsxs)("div", { className: "dev-window", children: [(0, jsx_runtime_1.jsxs)("div", { className: "dev-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "dev-title", children: "Developer Tools" }), (0, jsx_runtime_1.jsx)("button", { className: "dev-close", onClick: toggleDevMode, children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dev-tabs", children: [(0, jsx_runtime_1.jsx)("button", { className: activeTab === 'cheats' ? 'active' : '', onClick: () => setActiveTab('cheats'), children: "Cheats" }), (0, jsx_runtime_1.jsx)("button", { className: activeTab === 'teleport' ? 'active' : '', onClick: () => setActiveTab('teleport'), children: "Teleport" }), (0, jsx_runtime_1.jsx)("button", { className: activeTab === 'state' ? 'active' : '', onClick: () => setActiveTab('state'), children: "State" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dev-content", children: [activeTab === 'cheats' && ((0, jsx_runtime_1.jsxs)("div", { className: "dev-panel cheats-panel", children: [(0, jsx_runtime_1.jsx)("div", { className: "control-row", children: (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: godMode, onChange: toggleGodMode }), "God Mode (Invincible + 1-Hit Kill)"] }) }), (0, jsx_runtime_1.jsx)("div", { className: "control-row", children: (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: skipAnimations, onChange: toggleSkipAnimations }), "Skip Animations (Instant Actions)"] }) }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsxs)("div", { className: "action-row", children: [(0, jsx_runtime_1.jsx)("button", { className: "dev-action-btn", onClick: handleWinBattle, children: "Force Victory" }), (0, jsx_runtime_1.jsx)("button", { className: "dev-action-btn", onClick: () => store_1.useStore.getState().addGold(10000), children: "+10,000 Gold" }), (0, jsx_runtime_1.jsx)("button", { className: "dev-action-btn", onClick: () => store_1.useStore.getState().healParty(), children: "Full Heal" })] })] })), activeTab === 'teleport' && ((0, jsx_runtime_1.jsxs)("div", { className: "dev-panel teleport-panel", children: [(0, jsx_runtime_1.jsx)("p", { className: "hint", children: "Jump directly to a House Battle" }), (0, jsx_runtime_1.jsx)("div", { className: "house-grid", children: maps_1.HOUSE_IDS.map(id => {
                                        const encounterId = `house-${id}`;
                                        return ((0, jsx_runtime_1.jsx)("button", { className: "teleport-btn", onClick: () => handleTeleport(encounterId), children: id }, id));
                                    }) }), (0, jsx_runtime_1.jsx)("p", { className: "hint", style: { marginTop: 10 }, children: "Bosses" }), (0, jsx_runtime_1.jsxs)("div", { className: "boss-grid", children: [(0, jsx_runtime_1.jsx)("button", { className: "teleport-btn", onClick: () => handleTeleport('house-50'), children: "The Golden Sun" }), (0, jsx_runtime_1.jsx)("button", { className: "teleport-btn", onClick: () => handleTeleport('house-45'), children: "The Eye" })] })] })), activeTab === 'state' && ((0, jsx_runtime_1.jsx)("div", { className: "dev-panel state-panel", children: (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify({
                                    mode: store_1.useStore.getState().mode,
                                    screen: gameStore_1.useGameStore.getState().flow.screen,
                                    battlePhase: store_1.useStore.getState().battle?.phase,
                                    turn: store_1.useStore.getState().battle?.currentTurn,
                                }, null, 2) }) }))] })] }) }));
}
