"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevModeOverlay = DevModeOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Dev Mode Overlay Component
 * Displays house selection UI for rapid testing
 *
 * IMPORTANT: This component only renders when dev mode is enabled (Ctrl+D)
 */
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
const DevModeService_1 = require("../../core/services/DevModeService");
function DevModeOverlay() {
    const devModeEnabled = (0, store_1.useStore)((state) => state.devModeEnabled);
    const setDevModeEnabled = (0, store_1.useStore)((state) => state.setDevModeEnabled);
    const story = (0, store_1.useStore)((state) => state.story);
    const team = (0, store_1.useStore)((state) => state.team);
    const roster = (0, store_1.useStore)((state) => state.roster);
    const setStoryState = (0, store_1.useStore)((state) => state.setStoryState);
    const setTeam = (0, store_1.useStore)((state) => state.setTeam);
    const setRoster = (0, store_1.useStore)((state) => state.setRoster);
    const setPendingBattle = (0, store_1.useStore)((state) => state.setPendingBattle);
    // Listen for ESC key to close
    (0, hooks_1.useEffect)(() => {
        if (!devModeEnabled)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setDevModeEnabled(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [devModeEnabled, setDevModeEnabled]);
    // Don't render if dev mode is disabled
    if (!devModeEnabled)
        return null;
    const houses = (0, DevModeService_1.getAllHousesMetadata)();
    // Handle jumping to a specific house
    const handleJumpToHouse = (houseId) => {
        if (!team) {
            console.error('Cannot jump to house: no team exists');
            return;
        }
        // Apply jump-to-house logic
        const { story: newStory, team: newTeam, roster: newRoster } = (0, DevModeService_1.jumpToHouse)(story, team, roster, houseId);
        // Update state
        setStoryState(newStory);
        setTeam(newTeam);
        setRoster(newRoster);
        // Start the encounter (sets pending battle, which shows team select screen)
        setPendingBattle(houseId);
        // Close dev mode overlay
        setDevModeEnabled(false);
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            overflow: 'auto',
            padding: '40px 20px',
            color: '#fff',
            fontFamily: 'monospace',
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: '900px', margin: '0 auto' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '30px', textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { fontSize: '24px', marginBottom: '8px', borderBottom: '2px solid #666', paddingBottom: '8px' }, children: "\uD83C\uDFE0 DEV MODE: HOUSE SELECTION" }), (0, jsx_runtime_1.jsxs)("p", { style: { color: '#888', fontSize: '14px' }, children: ["Press ", (0, jsx_runtime_1.jsx)("strong", { children: "ESC" }), " to close | Click a house to jump and start battle"] })] }), [1, 2, 3].map((act) => {
                    const actHouses = houses.filter((h) => h.act === act);
                    const actName = act === 1
                        ? 'Act 1: Discovery (Houses 1-7)'
                        : act === 2
                            ? 'Act 2: Resistance (Houses 8-14)'
                            : 'Act 3: Liberation (Houses 15-20)';
                    return ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '30px' }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { fontSize: '18px', color: '#ffa500', marginBottom: '16px' }, children: actName }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gap: '12px' }, children: actHouses.map((house) => {
                                    const rewards = [];
                                    if (house.rewards.unit)
                                        rewards.push(`+${house.rewards.unit}`);
                                    if (house.rewards.storyJoinUnit)
                                        rewards.push(`+${house.rewards.storyJoinUnit} (story join)`);
                                    if (house.rewards.djinn)
                                        rewards.push(`+${house.rewards.djinn} (Djinn)`);
                                    const isCompleted = story.flags[house.id] === true;
                                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleJumpToHouse(house.id), style: {
                                            padding: '16px',
                                            backgroundColor: house.isFinalBoss
                                                ? '#8b0000'
                                                : house.isSpike
                                                    ? '#ff6600'
                                                    : isCompleted
                                                        ? '#2a5a2a'
                                                        : '#1a1a2e',
                                            border: `2px solid ${isCompleted ? '#4a7a4a' : '#444'}`,
                                            borderRadius: '8px',
                                            color: '#fff',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontFamily: 'monospace',
                                            fontSize: '14px',
                                            transition: 'all 0.2s',
                                        }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor = house.isFinalBoss
                                                ? '#a00000'
                                                : house.isSpike
                                                    ? '#ff7700'
                                                    : isCompleted
                                                        ? '#3a6a3a'
                                                        : '#2a2a3e';
                                            e.currentTarget.style.borderColor = '#888';
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = house.isFinalBoss
                                                ? '#8b0000'
                                                : house.isSpike
                                                    ? '#ff6600'
                                                    : isCompleted
                                                        ? '#2a5a2a'
                                                        : '#1a1a2e';
                                            e.currentTarget.style.borderColor = isCompleted ? '#4a7a4a' : '#444';
                                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }, children: [(0, jsx_runtime_1.jsxs)("span", { style: { fontWeight: 'bold', fontSize: '16px' }, children: [house.displayName, isCompleted && ' ✓', house.isSpike && ' ⚠️', house.isFinalBoss && ' 💀'] }), (0, jsx_runtime_1.jsxs)("span", { style: { color: '#aaa' }, children: [house.rewards.xp, " XP | ", house.rewards.gold, " Gold"] })] }), rewards.length > 0 && ((0, jsx_runtime_1.jsx)("div", { style: { color: '#ffa500', fontSize: '12px' }, children: rewards.join(' | ') }))] }, house.id));
                                }) })] }, act));
                }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }, children: [(0, jsx_runtime_1.jsx)("p", { children: "Legend: \u26A0\uFE0F = XP Spike (H08, H15) | \uD83D\uDC80 = Final Boss (H20) | \u2713 = Completed" }), (0, jsx_runtime_1.jsxs)("p", { style: { marginTop: '8px' }, children: ["Dev Mode active - Press ", (0, jsx_runtime_1.jsx)("strong", { children: "Ctrl+D" }), " to toggle"] })] })] }) }));
}
