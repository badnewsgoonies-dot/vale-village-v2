"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldCanvas = OverworldCanvas;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * OverworldCanvas
 * React wrapper component for the canvas-based overworld renderer
 * Handles store subscription, lifecycle management, and UI chrome
 */
const hooks_1 = require("preact/hooks");
const store_1 = require("../../state/store");
const gameStore_1 = require("../../../store/gameStore");
const OverworldEngine_1 = require("./engine/OverworldEngine");
const maps_1 = require("../../../data/definitions/maps");
const OverworldService_1 = require("../../../core/services/OverworldService");
const StoryService_1 = require("../../../core/services/StoryService");
const ToolboxHelpers_1 = require("../debug/ToolboxHelpers");
require("./OverworldCanvas.css");
const overworld_1 = require("../../../constants/overworld");
const DEFAULT_HOUSE_PROFILES = [
    { spritePath: '/sprites/buildings/Vale/Vale_Building1.gif', width: 90, height: 80 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building2.gif', width: 90, height: 80 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building3.gif', width: 100, height: 90 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building4.gif', width: 90, height: 80 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building5.gif', width: 100, height: 90 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building6.gif', width: 95, height: 85 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building7.gif', width: 90, height: 80 },
    { spritePath: '/sprites/buildings/Vale/Vale_Building8.gif', width: 100, height: 90 },
];
const SPECIAL_HOUSE_PROFILES = {
    1: { id: 'isaacs-house', spritePath: '/sprites/buildings/Vale/Vale_Isaacs_House.gif', width: 120, height: 100 },
    2: { id: 'kradens-house', spritePath: '/sprites/buildings/Vale/Vale_Kradens_House.gif', width: 140, height: 120 },
    6: { id: 'inn', spritePath: '/sprites/buildings/Vale/Vale_Inn.gif', width: 120, height: 100 },
    10: { id: 'garets-house', spritePath: '/sprites/buildings/Vale/Vale_Garets_House.gif', width: 120, height: 100 },
    11: { id: 'jennas-house', spritePath: '/sprites/buildings/Vale/Vale_Jennas_House.gif', width: 110, height: 95 },
};
const toWorldCenterX = (tileX) => tileX * overworld_1.TILE_SIZE + overworld_1.TILE_SIZE / 2;
const buildHouseBuilding = (houseNum) => {
    const houseId = String(houseNum).padStart(2, '0');
    const tileX = overworld_1.HOUSE_START_TILE_X + (houseNum - 1) * overworld_1.HOUSE_TILE_SPACING;
    const centerX = toWorldCenterX(tileX);
    const profile = SPECIAL_HOUSE_PROFILES[houseNum]
        ?? DEFAULT_HOUSE_PROFILES[(houseNum - 1) % DEFAULT_HOUSE_PROFILES.length]
        ?? DEFAULT_HOUSE_PROFILES[0];
    return {
        id: profile.id ?? `house-${houseId}`,
        spritePath: profile.spritePath,
        x: centerX,
        y: overworld_1.BUILDING_GROUND_Y,
        width: profile.width,
        height: profile.height,
        triggerId: `house-${houseId}-door`,
    };
};
const HOUSE_BUILDINGS = Array.from({ length: overworld_1.HOUSE_COUNT }, (_, index) => buildHouseBuilding(index + 1));
const TOWER_TILE_X = 134;
const WEAPON_SHOP_TILE_X = 2;
const VALE_VILLAGE_SCENE_BUILDINGS = [
    {
        id: 'battle-tower',
        spritePath: '/sprites/buildings/Vale/Vale_Sanctum.gif',
        x: toWorldCenterX(TOWER_TILE_X),
        y: overworld_1.BUILDING_GROUND_Y,
        width: 100,
        height: 120,
        triggerId: 'tower-entrance',
    },
    {
        id: 'weapon-shop',
        spritePath: '/sprites/buildings/Vale/Vale_WepArm_Shop.gif',
        x: toWorldCenterX(WEAPON_SHOP_TILE_X),
        y: overworld_1.BUILDING_GROUND_Y,
        width: 100,
        height: 90,
        triggerId: 'shop-weapons',
    },
    ...HOUSE_BUILDINGS,
];
function OverworldCanvas({ width = overworld_1.DEFAULT_CANVAS_WIDTH, height = overworld_1.DEFAULT_CANVAS_HEIGHT }) {
    const canvasRef = (0, hooks_1.useRef)(null);
    const engineRef = (0, hooks_1.useRef)(null);
    const lastTileRef = (0, hooks_1.useRef)(null);
    // Subscribe to overworld store
    const currentMapId = (0, store_1.useStore)((s) => s.currentMapId);
    const playerPosition = (0, store_1.useStore)((s) => s.playerPosition);
    const facing = (0, store_1.useStore)((s) => s.facing);
    const team = (0, store_1.useStore)((s) => s.team);
    const movePlayer = (0, store_1.useStore)((s) => s.movePlayer);
    const story = (0, store_1.useStore)((s) => s.story);
    const handleTrigger = (0, store_1.useStore)((s) => s.handleTrigger);
    const teleportPlayer = (0, store_1.useStore)((s) => s.teleportPlayer);
    // Subscribe to game flow store
    const screen = (0, gameStore_1.useGameStore)((s) => s.flow.screen);
    const modal = (0, gameStore_1.useGameStore)((s) => s.flow.modal);
    const openModal = (0, gameStore_1.useGameStore)((s) => s.openModal);
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    // Check if we should be active
    const isActive = screen === 'overworld' && modal === null;
    // Get current map data
    const map = maps_1.MAPS[currentMapId];
    // Initialize engine on mount
    (0, hooks_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const engine = new OverworldEngine_1.OverworldEngine(canvas, {
            canvasWidth: width,
            canvasHeight: height,
        });
        engineRef.current = engine;
        // Start the engine
        engine.start();
        // Set up collision checker using store's map data
        engine.setCollisionCheck((tile) => {
            const mapData = maps_1.MAPS[currentMapId];
            if (!mapData)
                return false;
            const { x, y } = tile;
            if (x < 0 || x >= mapData.width || y < 0 || y >= mapData.height) {
                return false;
            }
            const row = mapData.tiles[y];
            if (!row)
                return false;
            const tileData = row[x];
            return tileData?.walkable ?? false;
        });
        return () => {
            engine.stop();
            engineRef.current = null;
        };
    }, [width, height, currentMapId]);
    // Update engine when map changes
    (0, hooks_1.useEffect)(() => {
        const engine = engineRef.current;
        if (!engine)
            return;
        const mapData = maps_1.MAPS[currentMapId];
        if (mapData) {
            engine.setMap(mapData);
            // Detect interior maps (have '-interior' suffix) and switch scene type
            const isInterior = currentMapId.includes('-interior');
            const targetSceneType = isInterior ? 'interior' : 'overworld';
            // Use smooth transition when switching between overworld and interior
            const currentSceneType = engine.getCurrentSceneType();
            if (currentSceneType !== targetSceneType) {
                engine.transitionToScene(targetSceneType);
            }
            else {
                // Same scene type, just update instantly (e.g., different interior rooms)
                engine.setSceneType(targetSceneType);
            }
            // Set scene buildings for vale-village (pseudo-3D layout)
            if (currentMapId === 'vale-village') {
                engine.setSceneBuildings(VALE_VILLAGE_SCENE_BUILDINGS);
            }
            else {
                // Clear scene buildings for other maps (use tile-based layout)
                engine.setSceneBuildings([]);
            }
        }
    }, [currentMapId]);
    // Update engine when player position changes (from store)
    (0, hooks_1.useEffect)(() => {
        const engine = engineRef.current;
        if (!engine)
            return;
        engine.setPlayerPosition(playerPosition);
        lastTileRef.current = { ...playerPosition };
    }, [playerPosition]);
    // Update engine when facing changes
    (0, hooks_1.useEffect)(() => {
        const engine = engineRef.current;
        if (!engine)
            return;
        engine.setPlayerFacing(facing);
    }, [facing]);
    // Update player unit when team changes
    (0, hooks_1.useEffect)(() => {
        const engine = engineRef.current;
        if (!engine)
            return;
        const unitId = team?.units[0]?.id || 'adept';
        engine.setPlayerUnit(unitId);
    }, [team]);
    // Pause/resume engine based on screen state
    (0, hooks_1.useEffect)(() => {
        const engine = engineRef.current;
        if (!engine)
            return;
        if (isActive) {
            engine.resume();
        }
        else {
            engine.pause();
        }
    }, [isActive]);
    // Handle interaction with NPCs/triggers
    const handleInteraction = (0, hooks_1.useCallback)(() => {
        if (!map)
            return;
        const engine = engineRef.current;
        // First check SceneBuildings (for canvas-based pseudo-3D layout)
        if (engine) {
            const nearbyBuilding = engine['entityLayer']?.getNearbyBuilding?.();
            if (nearbyBuilding && nearbyBuilding.triggerId) {
                // Find the trigger in map data by ID
                const sceneTrigger = map.triggers.find(t => t.id === nearbyBuilding.triggerId);
                if (sceneTrigger) {
                    handleTrigger(sceneTrigger);
                    return;
                }
            }
        }
        // Fallback to tile-based triggers for backwards compatibility
        // Get facing position for interaction check
        const delta = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };
        const facingPos = {
            x: playerPosition.x + delta[facing].x,
            y: playerPosition.y + delta[facing].y,
        };
        // Check for trigger at current position first
        let trigger = (0, OverworldService_1.getTriggerAt)(map, playerPosition);
        // If no trigger at current position, check adjacent position
        if (!trigger) {
            trigger = (0, OverworldService_1.getTriggerAt)(map, facingPos);
        }
        if (!trigger)
            return;
        // Filter battle triggers by story state
        let shouldTrigger = true;
        if (trigger.type === 'battle') {
            const encounterId = trigger.data.encounterId;
            if (encounterId) {
                if (story.flags[encounterId] === true) {
                    shouldTrigger = false;
                }
                else if (!(0, StoryService_1.isHouseUnlocked)(story, encounterId)) {
                    shouldTrigger = false;
                }
            }
        }
        if (shouldTrigger) {
            handleTrigger(trigger);
        }
    }, [map, playerPosition, facing, story, handleTrigger]);
    // Sync engine position back to store when tile changes
    (0, hooks_1.useEffect)(() => {
        const engine = engineRef.current;
        if (!engine || !isActive)
            return;
        const syncInterval = setInterval(() => {
            const currentTile = engine.getPlayerTilePosition();
            const lastTile = lastTileRef.current;
            // Check if we've entered a new tile
            if (lastTile && (currentTile.x !== lastTile.x || currentTile.y !== lastTile.y)) {
                // Calculate movement direction
                let direction = 'down';
                const dx = currentTile.x - lastTile.x;
                const dy = currentTile.y - lastTile.y;
                if (Math.abs(dx) > Math.abs(dy)) {
                    direction = dx > 0 ? 'right' : 'left';
                }
                else {
                    direction = dy > 0 ? 'down' : 'up';
                }
                // Dispatch to store (this triggers collision checks and trigger handling)
                movePlayer(direction);
                lastTileRef.current = currentTile;
            }
        }, overworld_1.SYNC_INTERVAL_MS); // Check interval
        return () => clearInterval(syncInterval);
    }, [isActive, movePlayer]);
    // Handle keyboard input
    const handleKeyDown = (0, hooks_1.useCallback)((e) => {
        const engine = engineRef.current;
        if (!engine || !isActive)
            return;
        // Don't handle if typing in an input
        if (e.target.tagName === 'INPUT')
            return;
        const key = e.key;
        // Handle movement and interaction keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(key)) {
            e.preventDefault();
            engine.handleKeyDown(key);
        }
        // Handle interaction (Space/Enter)
        if (key === ' ' || key === 'Enter') {
            e.preventDefault();
            handleInteraction();
        }
        // Handle ESC for pause menu
        if (key === 'Escape') {
            e.preventDefault();
            openModal('pause');
        }
        // Toggle debug mode with backtick
        if (key === '`') {
            engine.setDebugMode(true);
        }
    }, [isActive, handleInteraction, openModal]);
    const handleKeyUp = (0, hooks_1.useCallback)((e) => {
        const engine = engineRef.current;
        if (!engine)
            return;
        engine.handleKeyUp(e.key);
        if (e.key === '`') {
            engine.setDebugMode(false);
        }
    }, []);
    // Attach keyboard listeners
    (0, hooks_1.useEffect)(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);
    // Calculate encounter rate display
    const encounterRatePercent = map?.encounterRate ? Math.round(map.encounterRate * 100) : 0;
    const hasRandomEncounters = map?.encounterRate && map?.encounterPool && map.encounterPool.length > 0;
    return ((0, jsx_runtime_1.jsxs)("div", { class: "overworld-shell", children: [(0, jsx_runtime_1.jsxs)("div", { class: "location-banner", children: [(0, jsx_runtime_1.jsx)("div", { class: "location-title", children: map?.name ?? 'Unknown' }), (0, jsx_runtime_1.jsxs)("div", { class: "location-meta", children: [hasRandomEncounters && ((0, jsx_runtime_1.jsxs)("span", { class: "location-chip", children: ["Encounters ", encounterRatePercent, "%"] })), (0, jsx_runtime_1.jsx)("span", { class: "location-chip location-chip--ghost", children: "ESC for pause menu" })] })] }), (0, jsx_runtime_1.jsx)(ToolboxHelpers_1.ToolboxHelpers, { title: "Overworld", actions: [
                    {
                        id: 'pause',
                        label: 'Pause Menu',
                        tooltip: 'Open pause (Esc)',
                        onClick: () => openModal('pause'),
                    },
                    {
                        id: 'help',
                        label: 'How to Play',
                        tooltip: 'Open how-to-play modal',
                        onClick: () => openModal('help'),
                    },
                    {
                        id: 'tower',
                        label: 'Jump to Tower',
                        tooltip: 'Jump to Battle Tower hub',
                        onClick: () => startTransition('tower'),
                    },
                    {
                        id: 'reset',
                        label: 'Reset Position',
                        tooltip: 'Teleport to Vale spawn',
                        onClick: () => teleportPlayer('vale-village', maps_1.MAPS['vale-village']?.spawnPoint ?? playerPosition),
                    },
                ], position: "top-right" }), (0, jsx_runtime_1.jsx)("div", { class: "overworld-stage", children: (0, jsx_runtime_1.jsxs)("div", { class: "overworld-canvas-container", children: [(0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: width, height: height, class: "overworld-canvas" }), (0, jsx_runtime_1.jsx)("div", { class: "sprite-overlay" })] }) })] }));
}
