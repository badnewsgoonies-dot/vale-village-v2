"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOverworldSlice = void 0;
const maps_1 = require("../../data/definitions/maps");
const OverworldService_1 = require("../../core/services/OverworldService");
const StoryService_1 = require("../../core/services/StoryService");
const dialogues_1 = require("@/data/definitions/dialogues");
const startMap = maps_1.MAPS['vale-village'];
if (!startMap) {
    throw new Error('Starting map "vale-village" not found');
}
const STARTING_MAP = startMap;
const createOverworldSlice = (set, get) => {
    const getStore = () => get();
    return {
        currentMapId: 'vale-village',
        playerPosition: STARTING_MAP.spawnPoint,
        facing: 'down',
        currentTrigger: null,
        setFacing: (direction) => set({ facing: direction }),
        movePlayer: (direction) => {
            const store = getStore();
            const map = maps_1.MAPS[store.currentMapId];
            if (!map)
                return;
            const result = (0, OverworldService_1.processMovement)(map, store.playerPosition, direction);
            if (!result.blocked) {
                const trigger = result.trigger ?? null;
                // Filter out locked/defeated battle triggers
                let filteredTrigger = trigger;
                if (trigger?.type === 'battle') {
                    const encounterId = trigger.data.encounterId;
                    if (encounterId) {
                        const story = store.story;
                        // Skip defeated encounters (liberation encounters are one-time only)
                        if (story.flags[encounterId] === true) {
                            filteredTrigger = null;
                        }
                        // Skip locked encounters (progressive unlock system)
                        else if (!(0, StoryService_1.isHouseUnlocked)(story, encounterId)) {
                            filteredTrigger = null;
                        }
                    }
                }
                set({
                    playerPosition: result.newPos,
                    facing: direction,
                    currentTrigger: filteredTrigger,
                });
                // Handle NPC dialogue (use original trigger for NPCs)
                if (trigger?.type === 'npc') {
                    const npcId = trigger.data.npcId;
                    if (npcId && dialogues_1.DIALOGUES[npcId]) {
                        store.startDialogueTree(dialogues_1.DIALOGUES[npcId]);
                    }
                }
                // Process filtered trigger (respects unlock status and defeated state)
                store.handleTrigger(filteredTrigger);
            }
        },
        teleportPlayer: (mapId, position) => {
            if (!maps_1.MAPS[mapId])
                return;
            set({ currentMapId: mapId, playerPosition: position, facing: 'down' });
        },
        clearTrigger: () => set({ currentTrigger: null }),
    };
};
exports.createOverworldSlice = createOverworldSlice;
