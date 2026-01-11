"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldMap = OverworldMap;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const maps_1 = require("@/data/definitions/maps");
const store_1 = require("../state/store");
const gameStore_1 = require("../../store/gameStore");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const ToolboxHelpers_1 = require("./debug/ToolboxHelpers");
const warnIfPlaceholderSprite_1 = require("../sprites/utils/warnIfPlaceholderSprite");
const OverworldService_1 = require("@/core/services/OverworldService");
const StoryService_1 = require("@/core/services/StoryService");
require("./OverworldMap.css");
function OverworldMap() {
    // Use gameStore for screen navigation state
    const screen = (0, gameStore_1.useGameStore)((s) => s.flow.screen);
    const modal = (0, gameStore_1.useGameStore)((s) => s.flow.modal);
    const isTransitioning = (0, gameStore_1.useGameStore)((s) => s.flow.isTransitioning);
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const openModal = (0, gameStore_1.useGameStore)((s) => s.openModal);
    const closeModal = (0, gameStore_1.useGameStore)((s) => s.closeModal);
    // Use V1 store for domain state (overworld data)
    const { currentMapId, playerPosition, facing, movePlayer, currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger, team, mode, handleTrigger, story } = (0, store_1.useStore)(state => ({
        currentMapId: state.currentMapId,
        playerPosition: state.playerPosition,
        facing: state.facing,
        movePlayer: state.movePlayer,
        currentTrigger: state.currentTrigger,
        clearTrigger: state.clearTrigger,
        teleportPlayer: state.teleportPlayer,
        resetLastTrigger: state.resetLastTrigger,
        team: state.team,
        mode: state.mode,
        handleTrigger: state.handleTrigger,
        story: state.story,
    }));
    // Sync V1 store's mode to V2 gameStore screen/modal when mode changes
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
        else if (mode === 'dialogue') {
            openModal('dialogue');
        }
        else if (mode === 'overworld') {
            // Close any open modal when returning to overworld (e.g., after dialogue ends)
            closeModal();
        }
    }, [mode, startTransition, openModal, closeModal]);
    const map = maps_1.MAPS[currentMapId];
    // Helper function to get adjacent positions based on facing direction
    const getInteractionPosition = () => {
        const delta = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
        };
        return {
            x: playerPosition.x + delta[facing].x,
            y: playerPosition.y + delta[facing].y,
        };
    };
    // Handle space/enter interaction with NPCs
    const handleInteraction = () => {
        if (!map)
            return;
        // Check for trigger at current position (player is on the same tile as NPC)
        let trigger = (0, OverworldService_1.getTriggerAt)(map, playerPosition);
        // If no trigger at current position, check adjacent position (facing the NPC)
        if (!trigger) {
            const facingPos = getInteractionPosition();
            trigger = (0, OverworldService_1.getTriggerAt)(map, facingPos);
        }
        if (!trigger)
            return;
        // Apply the same filtering logic as movePlayer for battle triggers
        let shouldTrigger = true;
        if (trigger.type === 'battle') {
            const encounterId = trigger.data.encounterId;
            if (encounterId) {
                // Skip defeated encounters (liberation encounters are one-time only)
                if (story.flags[encounterId] === true) {
                    shouldTrigger = false;
                }
                // Skip locked encounters (progressive unlock system)
                else if (!(0, StoryService_1.isHouseUnlocked)(story, encounterId)) {
                    shouldTrigger = false;
                }
            }
        }
        // Only trigger if it passed the filters
        if (shouldTrigger) {
            handleTrigger(trigger);
        }
    };
    (0, hooks_1.useEffect)(() => {
        // Only listen when on overworld screen with no modal open
        if (screen !== 'overworld' || modal !== null || isTransitioning)
            return;
        const handleKeyDown = (event) => {
            // Only handle movement when in overworld mode (not during dialogue, shops, etc.)
            if (screen !== 'overworld' || modal !== null || isTransitioning)
                return;
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                movePlayer('up');
            }
            else if (event.key === 'ArrowDown') {
                event.preventDefault();
                movePlayer('down');
            }
            else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                movePlayer('left');
            }
            else if (event.key === 'ArrowRight') {
                event.preventDefault();
                movePlayer('right');
            }
            else if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                handleInteraction();
            }
            else if (event.key === 'Escape') {
                event.preventDefault();
                openModal('pause');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, openModal, screen, modal, isTransitioning, playerPosition, facing, map, handleTrigger, story]);
    (0, hooks_1.useEffect)(() => {
        if (!currentTrigger)
            return;
        if (currentTrigger.type === 'transition') {
            const data = currentTrigger.data;
            if (data.targetMap && data.targetPos) {
                teleportPlayer(data.targetMap, data.targetPos);
            }
        }
        clearTrigger();
        resetLastTrigger();
    }, [currentTrigger, clearTrigger, teleportPlayer, resetLastTrigger]);
    if (!map) {
        return (0, jsx_runtime_1.jsx)("div", { children: "No overworld map loaded." });
    }
    // Calculate encounter rate display
    const encounterRatePercent = map.encounterRate ? Math.round(map.encounterRate * 100) : 0;
    const hasRandomEncounters = map.encounterRate && map.encounterPool && map.encounterPool.length > 0;
    return ((0, jsx_runtime_1.jsxs)("div", { class: "overworld-shell", children: [(0, jsx_runtime_1.jsxs)("div", { class: "location-banner", children: [(0, jsx_runtime_1.jsx)("div", { class: "location-title", children: map.name }), (0, jsx_runtime_1.jsxs)("div", { class: "location-meta", children: [hasRandomEncounters && ((0, jsx_runtime_1.jsxs)("span", { class: "location-chip", children: ["Encounters ", encounterRatePercent, "%"] })), (0, jsx_runtime_1.jsx)("span", { class: "location-chip location-chip--ghost", children: "ESC for pause menu" })] })] }), (0, jsx_runtime_1.jsx)(ToolboxHelpers_1.ToolboxHelpers, { title: "Overworld", actions: [
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
                ], position: "top-right" }), (0, jsx_runtime_1.jsx)("div", { class: "overworld-stage", children: (0, jsx_runtime_1.jsx)("div", { class: "overworld-container", children: map.tiles.map((row, y) => ((0, jsx_runtime_1.jsx)("div", { class: "tile-row", children: row.map((tile, x) => {
                            const isPlayer = playerPosition.x === x && playerPosition.y === y;
                            // Find NPC at this position
                            const npcAtPosition = map.npcs.find(npc => npc.position.x === x && npc.position.y === y);
                            return ((0, jsx_runtime_1.jsxs)("div", { class: `tile tile-${tile.type}`, style: {
                                    backgroundImage: tile.spriteId && (tile.spriteId.startsWith('/') || tile.spriteId.startsWith('http'))
                                        ? `url(${tile.spriteId})`
                                        : undefined,
                                    position: 'relative',
                                }, "data-sprite": tile.spriteId ?? undefined, children: [npcAtPosition && !isPlayer && ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (() => {
                                            const directSpriteId = npcAtPosition.spriteId;
                                            const resolvedSpriteId = directSpriteId && (directSpriteId.startsWith('/') || directSpriteId.startsWith('http'))
                                                ? directSpriteId
                                                : (0, mappings_1.getNPCSprite)(npcAtPosition.id);
                                            (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('OverworldMap', resolvedSpriteId);
                                            return resolvedSpriteId;
                                        })(), width: 32, height: 32, style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 2, // Above tiles, below player
                                        } })), isPlayer && team && team.units[0] && ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (() => {
                                            const playerSpriteId = (0, mappings_1.getPlayerSprite)(team.units[0].id, facing);
                                            (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('OverworldMap', playerSpriteId);
                                            return playerSpriteId;
                                        })(), width: 32, height: 32, style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 3, // Above NPCs
                                            transform: (0, mappings_1.shouldMirrorSprite)(facing) ? 'scaleX(-1)' : 'none',
                                        } }))] }, `${x}-${y}`));
                        }) }, y))) }) })] }));
}
