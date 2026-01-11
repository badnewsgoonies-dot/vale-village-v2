"use strict";
/**
 * Zustand store combining all slices
 * Provides unified state management for the UI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.useStore = void 0;
exports.createStore = createStore;
const traditional_1 = require("zustand/traditional");
const middleware_1 = require("zustand/middleware");
const queueBattleSlice_1 = require("./queueBattleSlice");
const teamSlice_1 = require("./teamSlice");
const saveSlice_1 = require("./saveSlice");
const storySlice_1 = require("./storySlice");
const inventorySlice_1 = require("./inventorySlice");
const rewardsSlice_1 = require("./rewardsSlice");
const gameFlowSlice_1 = require("./gameFlowSlice");
const overworldSlice_1 = require("./overworldSlice");
const dialogueSlice_1 = require("./dialogueSlice");
const devModeSlice_1 = require("./devModeSlice");
const towerSlice_1 = require("./towerSlice");
// Store factory function to combine all slices
const storeFactory = (set, get, api) => ({
    ...(0, teamSlice_1.createTeamSlice)(set, get, api),
    ...(0, queueBattleSlice_1.createQueueBattleSlice)(set, get, api),
    ...(0, saveSlice_1.createSaveSlice)(set, get, api),
    ...(0, storySlice_1.createStorySlice)(set, get, api),
    ...(0, inventorySlice_1.createInventorySlice)(set, get, api),
    ...(0, rewardsSlice_1.createRewardsSlice)(set, get, api),
    ...(0, gameFlowSlice_1.createGameFlowSlice)(set, get, api),
    ...(0, overworldSlice_1.createOverworldSlice)(set, get, api),
    ...(0, dialogueSlice_1.createDialogueSlice)(set, get, api),
    ...(0, devModeSlice_1.createDevModeSlice)(set, get, api),
    ...(0, towerSlice_1.createTowerSlice)(set, get, api),
});
function createStore() {
    return (0, traditional_1.createWithEqualityFn)()(storeFactory);
}
// Only enable devtools in development to prevent state manipulation in production
exports.useStore = import.meta.env.DEV
    ? (0, traditional_1.createWithEqualityFn)()((0, middleware_1.devtools)(storeFactory, { name: 'vale-v2' }))
    : createStore();
// Export store instance for direct access (used in App.tsx for handleRewardsContinue)
exports.store = exports.useStore;
