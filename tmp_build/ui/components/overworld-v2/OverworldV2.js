"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldV2 = OverworldV2;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * OverworldV2
 * Clean-slate overworld renderer with player movement and interior transitions.
 */
const hooks_1 = require("preact/hooks");
const store_1 = require("../../state/store");
const gameStore_1 = require("../../../store/gameStore");
const StoryService_1 = require("../../../core/services/StoryService");
const OverworldEngineV2_1 = require("./engine/OverworldEngineV2");
const playerBounds_1 = require("./engine/playerBounds");
const SkyLayer_1 = require("./layers/SkyLayer");
const BackgroundLayer_1 = require("./layers/BackgroundLayer");
const TerrainLayer_1 = require("./layers/TerrainLayer");
const TreeLayer_1 = require("./layers/TreeLayer");
const RoadLayer_1 = require("./layers/RoadLayer");
const VillageLayer_1 = require("./layers/VillageLayer");
const PlayerLayer_1 = require("./layers/PlayerLayer");
const InteriorNpcLayer_1 = require("./layers/InteriorNpcLayer");
const InteriorFloorLayer_1 = require("../overworld/layers/InteriorFloorLayer");
const InteriorFurnitureLayer_1 = require("../overworld/layers/InteriorFurnitureLayer");
const constants_1 = require("./data/constants");
const villageLayout_1 = require("./data/villageLayout");
const math_1 = require("./engine/math");
require("../overworld/OverworldCanvas.css");
const VirtualJoystick_1 = require("../VirtualJoystick");
const overworldSprites_1 = require("../../sprites/mappings/overworldSprites");
const TelemetryService_1 = require("../../../core/services/TelemetryService");
/** Movement speed in world pixels per second */
const PLAYER_SPEED = 160;
/** Interior room configuration */
const INTERIOR_ROOM_WIDTH = 320;
const INTERIOR_ROOM_HEIGHT = 240;
const INTERIOR_ROOM_X = (constants_1.VIEWPORT_WIDTH - INTERIOR_ROOM_WIDTH) / 2;
const INTERIOR_ROOM_Y = (constants_1.VIEWPORT_HEIGHT - INTERIOR_ROOM_HEIGHT) / 2 + 50;
/** Interior player speed (slower indoors) */
const INTERIOR_PLAYER_SPEED = 120;
/** Exit trigger zone (bottom center of room) */
const EXIT_ZONE_WIDTH = 60;
const EXIT_ZONE_HEIGHT = 30;
const INTERIOR_ENEMY_OFFSET_Y = 70;
const INTERIOR_NPC_TRIGGER_RADIUS = 40;
function OverworldV2({ width = constants_1.VIEWPORT_WIDTH, height = constants_1.VIEWPORT_HEIGHT }) {
    const canvasRef = (0, hooks_1.useRef)(null);
    const engineRef = (0, hooks_1.useRef)(null);
    const playerLayerRef = (0, hooks_1.useRef)(null);
    const villageLayerRef = (0, hooks_1.useRef)(null);
    const interiorFloorRef = (0, hooks_1.useRef)(null);
    const interiorFurnitureRef = (0, hooks_1.useRef)(null);
    const interiorNpcRef = (0, hooks_1.useRef)(null);
    const interiorBattleTriggeredRef = (0, hooks_1.useRef)(false);
    const keysRef = (0, hooks_1.useRef)(new Set());
    const touchInputRef = (0, hooks_1.useRef)({ h: 0, v: 0, action: false });
    const lastGamepadStartRef = (0, hooks_1.useRef)(false);
    const lastGamepadActionRef = (0, hooks_1.useRef)(false);
    // DOM Player Overlay Refs
    const playerDomRef = (0, hooks_1.useRef)(null);
    const playerDomContainerRef = (0, hooks_1.useRef)(null);
    // Track scene state
    const sceneTypeRef = (0, hooks_1.useRef)('overworld');
    const savedOverworldXRef = (0, hooks_1.useRef)(200); // Save X position when entering interior
    const currentHouseNumRef = (0, hooks_1.useRef)(1);
    // Transition state
    const [isTransitioning, setIsTransitioning] = (0, hooks_1.useState)(false);
    const isTransitioningRef = (0, hooks_1.useRef)(false);
    const transitionAlphaRef = (0, hooks_1.useRef)(0);
    const transitionTargetRef = (0, hooks_1.useRef)(null);
    // Store subscriptions
    const currentMapId = (0, store_1.useStore)((s) => s.currentMapId);
    const teleportPlayer = (0, store_1.useStore)((s) => s.teleportPlayer);
    const enterTowerFromOverworld = (0, store_1.useStore)((s) => s.enterTowerFromOverworld);
    const handleTrigger = (0, store_1.useStore)((s) => s.handleTrigger);
    const mode = (0, store_1.useStore)((s) => s.mode);
    const startDialogueTree = (0, store_1.useStore)((s) => s.startDialogueTree);
    const story = (0, store_1.useStore)((s) => s.story);
    const hasSeenDjinnIntro = Boolean(story.flags.first_djinn_intro_completed);
    // gameStore subscriptions
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const openModal = (0, gameStore_1.useGameStore)((s) => s.openModal);
    const closeModal = (0, gameStore_1.useGameStore)((s) => s.closeModal);
    const activeModal = (0, gameStore_1.useGameStore)((s) => s.flow.modal);
    // Avoid stale closures inside setInterval loops and global listeners.
    const modeRef = (0, hooks_1.useRef)(mode);
    modeRef.current = mode;
    const storyRef = (0, hooks_1.useRef)(story);
    storyRef.current = story;
    const activeModalRef = (0, hooks_1.useRef)(activeModal);
    activeModalRef.current = activeModal;
    const getUnlockedBuildingIds = (0, hooks_1.useCallback)(() => {
        const unlocked = new Set();
        const storyState = storyRef.current;
        for (const building of villageLayout_1.VILLAGE_BUILDINGS) {
            if (building.kind === 'tower' || building.kind === 'shop') {
                unlocked.add(building.id);
                continue;
            }
            if ((0, StoryService_1.isHouseUnlocked)(storyState, building.id)) {
                unlocked.add(building.id);
            }
        }
        return unlocked;
    }, []);
    const isGameplayInputLocked = (currentMode) => currentMode === 'dialogue' ||
        currentMode === 'team-select' ||
        currentMode === 'battle' ||
        currentMode === 'shop' ||
        currentMode === 'rewards' ||
        currentMode === 'compendium' ||
        currentMode === 'tower';
    // Detect scene type from map ID
    const getSceneTypeFromMapId = (0, hooks_1.useCallback)((mapId) => {
        return mapId.includes('-interior') ? 'interior' : 'overworld';
    }, []);
    // Extract house number from map ID (e.g., "house-05-interior" -> 5)
    const getHouseNumberFromMapId = (0, hooks_1.useCallback)((mapId) => {
        const match = mapId.match(/house-(\d+)/);
        return match && match[1] ? parseInt(match[1], 10) : 1;
    }, []);
    // Handle keyboard input
    const handleKeyDown = (0, hooks_1.useCallback)((e) => {
        // Don't steal input while a modal is open (pause/settings/etc) or when not in overworld mode.
        if (activeModalRef.current !== null)
            return;
        if (isGameplayInputLocked(modeRef.current))
            return;
        if (e.key === 'Escape') {
            e.preventDefault();
            openModal('pause');
            return;
        }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'Enter'].includes(e.key)) {
            e.preventDefault();
            keysRef.current.add(e.key);
        }
    }, [openModal]);
    const handleKeyUp = (0, hooks_1.useCallback)((e) => {
        keysRef.current.delete(e.key);
    }, []);
    // Create overworld layers
    const createOverworldLayers = (0, hooks_1.useCallback)(() => {
        const villageLayer = new VillageLayer_1.VillageLayer();
        villageLayerRef.current = villageLayer;
        villageLayer.setUnlockedHouses(getUnlockedBuildingIds());
        const playerLayer = new PlayerLayer_1.PlayerLayer({
            x: savedOverworldXRef.current,
            y: 450,
            facing: 'right',
            unitId: 'adept',
        });
        // Disable canvas rendering for player sprite (only render shadow)
        playerLayer.shouldRenderSprite = false;
        playerLayerRef.current = playerLayer;
        villageLayer.setPlayerPosition(savedOverworldXRef.current, 450);
        return [
            new SkyLayer_1.SkyLayer(),
            new BackgroundLayer_1.BackgroundLayer(),
            new TerrainLayer_1.TerrainLayer(),
            new TreeLayer_1.TreeLayer(),
            new RoadLayer_1.RoadLayer(),
            villageLayer,
            playerLayer,
        ];
    }, [getUnlockedBuildingIds]);
    // Keep house unlock visuals in sync with story flags (and ensure new VillageLayer instances inherit them).
    (0, hooks_1.useEffect)(() => {
        villageLayerRef.current?.setUnlockedHouses(getUnlockedBuildingIds());
    }, [story, getUnlockedBuildingIds]);
    // Create interior layers
    const createInteriorLayers = (0, hooks_1.useCallback)((houseNum) => {
        const houseId = `house-${String(houseNum).padStart(2, '0')}`;
        const floorLayer = new InteriorFloorLayer_1.InteriorFloorLayer();
        floorLayer.setRoomSize(INTERIOR_ROOM_WIDTH, INTERIOR_ROOM_HEIGHT);
        interiorFloorRef.current = floorLayer;
        const furnitureLayer = new InteriorFurnitureLayer_1.InteriorFurnitureLayer();
        furnitureLayer.setRenderPlayer(false);
        furnitureLayer.setRoomConfig({
            roomX: INTERIOR_ROOM_X,
            roomY: INTERIOR_ROOM_Y,
            roomWidth: INTERIOR_ROOM_WIDTH,
            roomHeight: INTERIOR_ROOM_HEIGHT,
        });
        furnitureLayer.generateHouseFurniture(houseNum);
        interiorFurnitureRef.current = furnitureLayer;
        // Interior access is already gated by door unlocks; only suppress enemies after completion.
        const shouldSpawnEnemy = storyRef.current.flags[houseId] !== true;
        const enemyOffsetY = houseNum === 1 ? INTERIOR_ROOM_HEIGHT / 2 : INTERIOR_ENEMY_OFFSET_Y;
        const npcLayer = shouldSpawnEnemy
            ? new InteriorNpcLayer_1.InteriorNpcLayer({
                id: `${houseId}-enemy`,
                x: INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH / 2,
                y: INTERIOR_ROOM_Y + enemyOffsetY,
            })
            : null;
        interiorNpcRef.current = npcLayer;
        interiorBattleTriggeredRef.current = false;
        // Create player layer for interior (centered at entrance)
        const playerLayer = new PlayerLayer_1.PlayerLayer({
            x: INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH / 2,
            y: INTERIOR_ROOM_Y + INTERIOR_ROOM_HEIGHT - 30,
            facing: 'up',
            unitId: 'adept',
        });
        // Disable canvas rendering for player sprite (only render shadow)
        playerLayer.shouldRenderSprite = false;
        playerLayerRef.current = playerLayer;
        return npcLayer ? [floorLayer, furnitureLayer, npcLayer, playerLayer] : [floorLayer, furnitureLayer, playerLayer];
    }, []);
    // Switch scene type with fade transition
    const transitionToScene = (0, hooks_1.useCallback)((targetScene, houseNum = 1, teleportTo) => {
        if (isTransitioningRef.current)
            return;
        const isInstant = typeof localStorage !== "undefined" && localStorage.getItem("battleSpeed") === "instant";
        if (isInstant) {
            const engine = engineRef.current;
            if (engine) {
                sceneTypeRef.current = targetScene;
                currentHouseNumRef.current = houseNum;
                if (teleportTo) {
                    try {
                        teleportPlayer(teleportTo.mapId, teleportTo.position ?? { x: 5, y: 7 });
                    }
                    catch (err) {
                        console.error("Failed to teleport", err);
                    }
                }
                if (targetScene === "interior") {
                    engine.setLayers(createInteriorLayers(houseNum));
                    engine.getCamera().setTarget(constants_1.VIEWPORT_WIDTH / 2, constants_1.VIEWPORT_HEIGHT / 2);
                    engine.getCamera().snapToTarget();
                }
                else {
                    engine.setLayers(createOverworldLayers());
                    const pos = playerLayerRef.current?.getPosition();
                    if (pos) {
                        engine.getCamera().setTarget(pos.x, pos.y);
                        engine.getCamera().snapToTarget();
                    }
                }
            }
            return;
        }
        isTransitioningRef.current = true;
        setIsTransitioning(true);
        transitionTargetRef.current = targetScene;
        currentHouseNumRef.current = houseNum;
        // Fade out
        const fadeOut = () => {
            transitionAlphaRef.current += 0.05;
            if (transitionAlphaRef.current >= 1) {
                // Switch layers at peak darkness
                const engine = engineRef.current;
                if (engine) {
                    sceneTypeRef.current = targetScene;
                    // Perform teleport at the same point we switch layers to avoid double transitions
                    if (teleportTo) {
                        try {
                            teleportPlayer(teleportTo.mapId, teleportTo.position ?? { x: 5, y: 7 });
                        }
                        catch (err) {
                            // Teleport failure should not block rendering
                            console.error('Failed to teleport during transition', err);
                        }
                    }
                    if (targetScene === 'interior') {
                        engine.setLayers(createInteriorLayers(houseNum));
                        // Reset camera for interior (no scrolling)
                        engine.getCamera().setTarget(constants_1.VIEWPORT_WIDTH / 2, constants_1.VIEWPORT_HEIGHT / 2);
                        engine.getCamera().snapToTarget();
                    }
                    else {
                        engine.setLayers(createOverworldLayers());
                        // Restore camera to player position
                        const pos = playerLayerRef.current?.getPosition();
                        if (pos) {
                            engine.getCamera().setTarget(pos.x, pos.y);
                            engine.getCamera().snapToTarget();
                        }
                    }
                }
                // Fade in
                requestAnimationFrame(fadeIn);
            }
            else {
                requestAnimationFrame(fadeOut);
            }
        };
        const fadeIn = () => {
            transitionAlphaRef.current -= 0.05;
            if (transitionAlphaRef.current <= 0) {
                transitionAlphaRef.current = 0;
                transitionTargetRef.current = null;
                isTransitioningRef.current = false;
                setIsTransitioning(false);
            }
            else {
                requestAnimationFrame(fadeIn);
            }
        };
        requestAnimationFrame(fadeOut);
    }, [createOverworldLayers, createInteriorLayers, teleportPlayer]);
    // Handle entering a building
    const enterBuilding = (0, hooks_1.useCallback)((buildingId) => {
        const building = villageLayout_1.VILLAGE_BUILDINGS.find(b => b.id === buildingId);
        if (!building)
            return;
        // Save current X position for return
        const playerPos = playerLayerRef.current?.getPosition();
        if (playerPos) {
            savedOverworldXRef.current = playerPos.x;
        }
        // Handle tower entry separately - triggers tower game mode
        if (building.kind === 'tower') {
            enterTowerFromOverworld({
                mapId: 'vale-village',
                position: { x: Math.floor(playerPos?.x ?? 100) / 32, y: 14 },
            });
            return;
        }
        if (building.kind === 'shop') {
            handleTrigger({
                id: 'overworld-shop',
                type: 'shop',
                position: { x: 0, y: 0 },
                data: { shopId: building.shopId ?? 'vale-armory' },
            });
            return;
        }
        // Get house number (e.g., "house-05" -> 5)
        const houseNum = getHouseNumberFromMapId(building.id);
        // Transition to interior and request teleport when layers switch
        transitionToScene('interior', houseNum, building.interiorMapId ? { mapId: building.interiorMapId, position: { x: 5, y: 7 } } : undefined);
    }, [transitionToScene, getHouseNumberFromMapId, teleportPlayer, enterTowerFromOverworld, handleTrigger, hasSeenDjinnIntro, startDialogueTree]);
    // Handle exiting interior
    const exitInterior = (0, hooks_1.useCallback)(() => {
        // Transition back to overworld and teleport at scene switch
        transitionToScene('overworld', 1, { mapId: 'vale-village', position: { x: Math.floor(savedOverworldXRef.current / 32), y: 14 } });
    }, [transitionToScene, teleportPlayer]);
    // Check if player is in exit zone
    const isInExitZone = (0, hooks_1.useCallback)(() => {
        const player = playerLayerRef.current;
        if (!player)
            return false;
        const pos = player.getPosition();
        const exitCenterX = INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH / 2;
        const exitY = INTERIOR_ROOM_Y + INTERIOR_ROOM_HEIGHT;
        return (Math.abs(pos.x - exitCenterX) < EXIT_ZONE_WIDTH / 2 &&
            pos.y > exitY - EXIT_ZONE_HEIGHT);
    }, []);
    (0, hooks_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const engine = new OverworldEngineV2_1.OverworldEngineV2(canvas, {
            viewportWidth: width,
            viewportHeight: height,
            worldWidth: villageLayout_1.VILLAGE_WORLD_WIDTH,
            worldHeight: height,
        });
        // Start with overworld layers
        engine.setLayers(createOverworldLayers());
        // Set camera to follow player position
        const playerPos = playerLayerRef.current?.getPosition();
        if (playerPos) {
            engine.getCamera().setTarget(playerPos.x, playerPos.y);
            engine.getCamera().snapToTarget();
        }
        engine.start();
        engineRef.current = engine;
        // Add keyboard listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        engine.onUpdate((dtMs, eng) => {
            const dt = dtMs / 1000;
            const player = playerLayerRef.current;
            const village = villageLayerRef.current;
            // Update telemetry each frame with lightweight navigation assist data
            try {
                const nearestDoor = village?.getNearestDoor ? village.getNearestDoor() : null;
                TelemetryService_1.TelemetryService.updateFrame({ navigationAssist: { nearestDoorId: nearestDoor?.id ?? null } });
            }
            catch (e) {
                // swallow telemetry errors
            }
            if (!player || isTransitioningRef.current)
                return;
            // Sync DOM player position
            if (playerDomContainerRef.current && playerDomRef.current) {
                const state = player.getPlayerState();
                const pos = player.getPosition();
                // Determine sprite source (handling direction)
                const spriteSrc = (0, overworldSprites_1.getPlayerSprite)(state.unitId, state.facing, state.isMoving);
                if (playerDomRef.current.src !== window.location.origin + spriteSrc) {
                    playerDomRef.current.src = spriteSrc;
                }
                // Handle mirroring for left facing
                const mirror = state.facing === 'left';
                playerDomRef.current.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
                // Position DOM element via camera projection
                // We use worldToScreenSnapped to align with canvas pixel grid
                const screenPos = eng.getCamera().worldToScreenSnapped(pos.x, pos.y);
                // The container is centered at player feet (like the canvas render)
                // Sprite is 32x48, anchor is bottom-center
                // container is 0x0 at screenPos.
                // We offset the image inside the container
                playerDomContainerRef.current.style.transform = `translate(${screenPos.x}px, ${screenPos.y}px)`;
            }
            // Freeze player control when not actively in overworld mode or while a modal is open.
            if (isGameplayInputLocked(modeRef.current) || activeModalRef.current !== null) {
                player.setPlayerState({ isMoving: false });
                return;
            }
            const keys = keysRef.current;
            const isOverworld = sceneTypeRef.current === 'overworld';
            // Poll Gamepad
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0]; // Support first controller
            let gpAction = false;
            let gpStart = false;
            if (gp) {
                // Standard mapping: 0 = Bottom (A/Cross), 9 = Start/Options
                if (gp.buttons[0]?.pressed)
                    gpAction = true;
                if (gp.buttons[9]?.pressed)
                    gpStart = true;
                // Handle Start Button (Toggle Pause) - Rising Edge Only
                if (gpStart && !lastGamepadStartRef.current) {
                    openModal('pause');
                }
                lastGamepadStartRef.current = gpStart;
            }
            // Handle SPACE/Enter for interactions or touch/gamepad action
            const actionPressed = keys.has(' ') || keys.has('Enter') || touchInputRef.current.action || (gpAction && !lastGamepadActionRef.current);
            // Update gamepad latch
            lastGamepadActionRef.current = gpAction;
            if (actionPressed) {
                keys.delete(' ');
                keys.delete('Enter');
                // consume touch action once to mirror keyboard single-press behaviour
                if (touchInputRef.current.action)
                    touchInputRef.current.action = false;
                if (isOverworld) {
                    // Check for nearby door
                    const nearestDoor = village?.getNearestDoor();
                    if (nearestDoor) {
                        enterBuilding(nearestDoor.id);
                        return;
                    }
                }
            }
            let dx = 0;
            let dy = 0;
            // Read input (touch > gamepad > keyboard)
            const t = touchInputRef.current;
            if (t.h !== 0 || t.v !== 0) {
                dx = t.h;
                dy = t.v;
            }
            else if (gp) {
                // Gamepad Axis (Left Stick)
                const axisX = gp.axes[0] || 0;
                const axisY = gp.axes[1] || 0;
                // Deadzone
                if (Math.abs(axisX) > 0.2)
                    dx = axisX;
                if (Math.abs(axisY) > 0.2)
                    dy = axisY;
                // Gamepad D-Pad (Buttons 12-15: Up, Down, Left, Right)
                if (gp.buttons[12]?.pressed)
                    dy -= 1; // Up
                if (gp.buttons[13]?.pressed)
                    dy += 1; // Down
                if (gp.buttons[14]?.pressed)
                    dx -= 1; // Left
                if (gp.buttons[15]?.pressed)
                    dx += 1; // Right
            }
            // Fallback to keyboard if no other input
            if (dx === 0 && dy === 0) {
                if (keys.has('ArrowLeft') || keys.has('a'))
                    dx -= 1;
                if (keys.has('ArrowRight') || keys.has('d'))
                    dx += 1;
                if (keys.has('ArrowUp') || keys.has('w'))
                    dy -= 1;
                if (keys.has('ArrowDown') || keys.has('s'))
                    dy += 1;
            }
            const isMoving = dx !== 0 || dy !== 0;
            player.setPlayerState({ isMoving });
            if (!isMoving)
                return;
            // Normalize diagonal movement
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            const pos = player.getPosition();
            const speed = isOverworld ? PLAYER_SPEED : INTERIOR_PLAYER_SPEED;
            let newX;
            let newY;
            if (isOverworld) {
                // Overworld bounds
                newX = (0, playerBounds_1.clampPlayerXToWorldBounds)(pos.x + dx * speed * dt, villageLayout_1.VILLAGE_WORLD_WIDTH);
                newY = (0, math_1.clamp)(pos.y + dy * speed * dt, constants_1.PLAYER_Y_MIN, constants_1.PLAYER_Y_MAX);
            }
            else {
                // Interior bounds
                newX = (0, math_1.clamp)(pos.x + dx * speed * dt, INTERIOR_ROOM_X + 20, INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH - 20);
                newY = (0, math_1.clamp)(pos.y + dy * speed * dt, INTERIOR_ROOM_Y + 20, INTERIOR_ROOM_Y + INTERIOR_ROOM_HEIGHT + 10 // Allow slight overshoot for exit
                );
            }
            if (!isOverworld) {
                // Interior collision against furniture footprints (slide along obstacles).
                const furniture = interiorFurnitureRef.current;
                const collider = { halfWidth: 10, halfHeight: 7 };
                let finalX = pos.x;
                let finalY = pos.y;
                if (!furniture?.isBlocked(newX, pos.y, collider)) {
                    finalX = newX;
                }
                if (!furniture?.isBlocked(finalX, newY, collider)) {
                    finalY = newY;
                }
                // If blocked in both axes, cancel movement to avoid jitter (but still allow facing updates).
                if (finalX === pos.x && finalY === pos.y) {
                    player.setPlayerState({ isMoving: false });
                    newX = pos.x;
                    newY = pos.y;
                }
                else {
                    newX = finalX;
                    newY = finalY;
                }
            }
            player.setPlayerState({ x: newX, y: newY });
            // Update facing direction
            if (dx > 0) {
                player.setPlayerState({ facing: 'right' });
            }
            else if (dx < 0) {
                player.setPlayerState({ facing: 'left' });
            }
            else if (dy < 0) {
                player.setPlayerState({ facing: 'up' });
            }
            else if (dy > 0) {
                player.setPlayerState({ facing: 'down' });
            }
            if (isOverworld) {
                // Update camera target
                eng.getCamera().setTarget(newX, newY);
                // Update village layer for door proximity
                village?.setPlayerPosition(newX, newY);
            }
            else {
                // Update interior furniture layer with player position
                const state = player.getPlayerState();
                interiorFurnitureRef.current?.setPlayerPosition({ x: newX, y: newY }, state.facing);
                // Check for exit trigger
                if (isInExitZone() && dy > 0) {
                    exitInterior();
                }
                else {
                    const npcLayer = interiorNpcRef.current;
                    if (npcLayer && !interiorBattleTriggeredRef.current) {
                        const npcPos = npcLayer.getPosition();
                        const dxNpc = newX - npcPos.x;
                        const dyNpc = newY - npcPos.y;
                        const distanceSq = dxNpc * dxNpc + dyNpc * dyNpc;
                        if (distanceSq <= INTERIOR_NPC_TRIGGER_RADIUS * INTERIOR_NPC_TRIGGER_RADIUS) {
                            const houseId = `house-${String(currentHouseNumRef.current).padStart(2, '0')}`;
                            if (storyRef.current.flags[houseId] !== true) {
                                interiorBattleTriggeredRef.current = true;
                                handleTrigger({
                                    id: `${houseId}-enemy`,
                                    type: 'battle',
                                    position: { x: 0, y: 0 },
                                    data: { encounterId: houseId },
                                });
                            }
                        }
                    }
                }
            }
        });
        // Render transition overlay
        const renderOverlay = () => {
            // Publish sanitized telemetry each frame (Navigation Assist)
            try {
                TelemetryService_1.TelemetryService.updateFrame();
            }
            catch (e) { /* ignore telemetry errors */ }
            if (transitionAlphaRef.current > 0) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlphaRef.current})`;
                    ctx.fillRect(0, 0, width, height);
                }
            }
            requestAnimationFrame(renderOverlay);
        };
        requestAnimationFrame(renderOverlay);
        return () => {
            engine.stop();
            engineRef.current = null;
            playerLayerRef.current = null;
            villageLayerRef.current = null;
            interiorFloorRef.current = null;
            interiorFurnitureRef.current = null;
            interiorNpcRef.current = null;
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [width, height, handleKeyDown, handleKeyUp, createOverworldLayers, enterBuilding, exitInterior, isInExitZone, handleTrigger]);
    // Sync V1 store mode to V2 gameStore screens.
    // (Overworld V2 doesn't use tile triggers yet, but dialogue/battle effects still depend on mode transitions.)
    (0, hooks_1.useEffect)(() => {
        if (mode === 'team-select') {
            startTransition('team-select');
        }
        else if (mode === 'battle') {
            startTransition('battle');
        }
        else if (mode === 'shop') {
            startTransition('shop');
        }
        else if (mode === 'rewards') {
            startTransition('rewards');
        }
        else if (mode === 'overworld') {
            // When returning to overworld (e.g., dialogue ends), ensure no stale modal is left open.
            closeModal();
        }
    }, [mode, startTransition, closeModal]);
    // React to map changes from store (e.g., from save/load)
    (0, hooks_1.useEffect)(() => {
        const targetScene = getSceneTypeFromMapId(currentMapId);
        if (targetScene !== sceneTypeRef.current && !isTransitioning) {
            const houseNum = getHouseNumberFromMapId(currentMapId);
            transitionToScene(targetScene, houseNum);
        }
    }, [currentMapId, getSceneTypeFromMapId, getHouseNumberFromMapId, transitionToScene, isTransitioning]);
    const computedSceneType = getSceneTypeFromMapId(currentMapId);
    const computedHouseNum = getHouseNumberFromMapId(currentMapId);
    const sceneName = computedSceneType === "interior"
        ? `House ${computedHouseNum} Interior`
        : 'Vale Village';
    return ((0, jsx_runtime_1.jsxs)("div", { class: "overworld-shell", children: [(0, jsx_runtime_1.jsxs)("div", { class: "location-banner", children: [(0, jsx_runtime_1.jsx)("div", { class: "location-title", children: sceneName }), (0, jsx_runtime_1.jsx)("div", { class: "location-meta", children: (0, jsx_runtime_1.jsx)("span", { class: "location-chip location-chip--ghost", children: sceneTypeRef.current === 'interior' ? 'Walk to EXIT to leave' : 'SPACE to enter buildings' }) })] }), (0, jsx_runtime_1.jsx)("div", { class: "overworld-stage", children: (0, jsx_runtime_1.jsxs)("div", { class: "overworld-canvas-container", style: { position: 'relative' }, children: [(0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: width, height: height, class: "overworld-canvas" }), (0, jsx_runtime_1.jsx)("div", { ref: playerDomContainerRef, style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                                pointerEvents: 'none',
                                zIndex: 10,
                                willChange: 'transform',
                            }, children: (0, jsx_runtime_1.jsx)("img", { ref: playerDomRef, src: (0, overworldSprites_1.getPlayerSprite)('adept', 'right', false), style: {
                                    position: 'absolute',
                                    left: '-16px', // -width/2
                                    top: '-58px', // -height + 10px shift
                                    width: '32px',
                                    height: '48px',
                                    imageRendering: 'pixelated',
                                }, alt: "" }) })] }) }), (0, jsx_runtime_1.jsx)(VirtualJoystick_1.VirtualJoystick, { onMove: (h, v) => {
                    touchInputRef.current.h = Math.max(-1, Math.min(1, h));
                    touchInputRef.current.v = Math.max(-1, Math.min(1, v));
                }, onAction: (pressed) => {
                    touchInputRef.current.action = pressed;
                } })] }));
}
