"use strict";
/**
 * Save state slice for Zustand
 * Handles save/load operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSaveSlice = void 0;
const SaveService_1 = require("../../core/services/SaveService");
const towerSlice_1 = require("./towerSlice");
/**
 * Create SaveV1 data from current game state
 */
function createSaveData(team, roster, inventory, story, overworld, towerRecord, recruitmentFlags, npcStates, statsTracker) {
    // Ensure we have units to save
    if (!team || !team.units || team.units.length === 0) {
        return null;
    }
    // Build activeParty with actual team size (1-4 units, no padding)
    const partyIds = team.units.map(u => u.id);
    // No slice, no padding - save actual team size (1-4 units)
    const activeParty = partyIds;
    // Get collected Djinn from team (they're stored team-wide, not per-unit)
    const djinnCollected = team?.collectedDjinn ? [...team.collectedDjinn] : [];
    const equippedDjinn = team?.equippedDjinn ? [...team.equippedDjinn] : [];
    const djinnTrackers = team?.djinnTrackers ? { ...team.djinnTrackers } : {};
    // Convert story flags to boolean-only (SaveV1Schema expects boolean)
    const storyFlags = {};
    Object.entries(story.flags).forEach(([key, value]) => {
        storyFlags[key] = Boolean(value);
    });
    // Get overworld position or default
    const playerPosition = overworld?.playerPosition ?? { x: 0, y: 0 };
    const currentScene = overworld?.currentMapId ?? 'vale-village';
    return {
        version: '1.0.0',
        timestamp: Date.now(),
        chapter: story.chapter,
        playerData: {
            unitsCollected: roster.map(u => {
                // Clamp HP to base max (Djinn bonuses not persisted)
                const baseMaxHp = u.baseStats.hp + (u.level - 1) * u.growthRates.hp;
                return {
                    ...u,
                    currentHp: Math.min(u.currentHp, baseMaxHp),
                    djinn: [...u.djinn],
                    abilities: [...u.abilities],
                    unlockedAbilityIds: [...u.unlockedAbilityIds],
                    statusEffects: [...u.statusEffects],
                };
            }),
            activeParty,
            inventory: inventory.equipment,
            gold: inventory.gold,
            djinnCollected,
            equippedDjinn,
            djinnTrackers,
            recruitmentFlags: { ...recruitmentFlags },
            storyFlags,
        },
        overworldState: {
            playerPosition,
            currentScene,
            npcStates: { ...npcStates },
        },
        stats: {
            battlesWon: statsTracker.battlesWon,
            battlesLost: statsTracker.battlesLost,
            totalDamageDealt: statsTracker.totalDamageDealt,
            totalHealingDone: statsTracker.totalHealingDone,
            playtime: statsTracker.playtime,
        },
        towerStats: towerRecord ?? towerSlice_1.DEFAULT_TOWER_RECORD,
    };
}
function getStoryStateFromSave(saveData) {
    const storySection = saveData.story;
    const flags = storySection?.flags ?? saveData.playerData.storyFlags ?? {};
    return {
        chapter: saveData.chapter ?? storySection?.chapter ?? 1,
        flags: { ...flags },
    };
}
const createSaveSlice = (_set, get) => ({
    recruitmentFlags: {},
    npcStates: {},
    statsTracker: {
        battlesWon: 0,
        battlesLost: 0,
        totalDamageDealt: 0,
        totalHealingDone: 0,
        playtime: 0,
    },
    hasSave: () => (0, SaveService_1.hasSave)(),
    loadGame: () => {
        const result = (0, SaveService_1.loadGame)();
        if (!result.ok) {
            console.error('Failed to load game:', result.error);
            return;
        }
        const saveData = result.value;
        const state = get();
        // 1. Restore roster from unitsCollected (bench + active party)
        state.setRoster(saveData.playerData.unitsCollected);
        // 2. Build active party from activeParty IDs (references roster units)
        const activeUnits = saveData.playerData.activeParty
            .map(unitId => saveData.playerData.unitsCollected.find(u => u.id === unitId))
            .filter((u) => u !== undefined);
        if (activeUnits.length > 0) {
            // No padding - use actual team size (1-4 units)
            // Restore equippedDjinn and djinnTrackers from save data
            const team = {
                units: activeUnits,
                equippedDjinn: saveData.playerData.equippedDjinn || [],
                djinnTrackers: saveData.playerData.djinnTrackers || {},
                collectedDjinn: saveData.playerData.djinnCollected,
                currentTurn: 0,
                activationsThisTurn: {},
                djinnStates: {},
            };
            state.setTeam(team);
        }
        // Hydrate inventory
        state.setEquipment(saveData.playerData.inventory ?? []);
        state.setGold(saveData.playerData.gold ?? 0);
        // Hydrate story state
        state.setStoryState(getStoryStateFromSave(saveData));
        // Hydrate overworld state
        state.teleportPlayer(saveData.overworldState.currentScene, saveData.overworldState.playerPosition);
        state.setTowerRecord(saveData.towerStats ?? towerSlice_1.DEFAULT_TOWER_RECORD);
        _set({
            recruitmentFlags: saveData.playerData.recruitmentFlags ?? {},
            npcStates: saveData.overworldState.npcStates ?? {},
            statsTracker: {
                battlesWon: saveData.stats.battlesWon ?? 0,
                battlesLost: saveData.stats.battlesLost ?? 0,
                totalDamageDealt: saveData.stats.totalDamageDealt ?? 0,
                totalHealingDone: saveData.stats.totalHealingDone ?? 0,
                playtime: saveData.stats.playtime ?? 0,
            },
        });
        _set({
            recruitmentFlags: saveData.playerData.recruitmentFlags ?? {},
            npcStates: saveData.overworldState.npcStates ?? {},
            statsTracker: {
                battlesWon: saveData.stats.battlesWon ?? 0,
                battlesLost: saveData.stats.battlesLost ?? 0,
                totalDamageDealt: saveData.stats.totalDamageDealt ?? 0,
                totalHealingDone: saveData.stats.totalHealingDone ?? 0,
                playtime: saveData.stats.playtime ?? 0,
            },
        });
        _set({
            recruitmentFlags: saveData.playerData.recruitmentFlags ?? {},
            npcStates: saveData.overworldState.npcStates ?? {},
            statsTracker: {
                battlesWon: saveData.stats.battlesWon ?? 0,
                battlesLost: saveData.stats.battlesLost ?? 0,
                totalDamageDealt: saveData.stats.totalDamageDealt ?? 0,
                totalHealingDone: saveData.stats.totalHealingDone ?? 0,
                playtime: saveData.stats.playtime ?? 0,
            },
        });
        _set({
            recruitmentFlags: saveData.playerData.recruitmentFlags ?? {},
            npcStates: saveData.overworldState.npcStates ?? {},
            statsTracker: {
                battlesWon: saveData.stats.battlesWon ?? 0,
                battlesLost: saveData.stats.battlesLost ?? 0,
                totalDamageDealt: saveData.stats.totalDamageDealt ?? 0,
                totalHealingDone: saveData.stats.totalHealingDone ?? 0,
                playtime: saveData.stats.playtime ?? 0,
            },
        });
        _set({
            recruitmentFlags: saveData.playerData.recruitmentFlags ?? {},
            npcStates: saveData.overworldState.npcStates ?? {},
            statsTracker: {
                battlesWon: saveData.stats.battlesWon ?? 0,
                battlesLost: saveData.stats.battlesLost ?? 0,
                totalDamageDealt: saveData.stats.totalDamageDealt ?? 0,
                totalHealingDone: saveData.stats.totalHealingDone ?? 0,
                playtime: saveData.stats.playtime ?? 0,
            },
        });
        _set({
            recruitmentFlags: saveData.playerData.recruitmentFlags ?? {},
            npcStates: saveData.overworldState.npcStates ?? {},
            statsTracker: {
                battlesWon: saveData.stats.battlesWon ?? 0,
                battlesLost: saveData.stats.battlesLost ?? 0,
                totalDamageDealt: saveData.stats.totalDamageDealt ?? 0,
                totalHealingDone: saveData.stats.totalHealingDone ?? 0,
                playtime: saveData.stats.playtime ?? 0,
            },
        });
        // Hydrate battle state from localStorage
        const battleStateJson = localStorage.getItem('vale-v2/battle-state');
        if (battleStateJson) {
            try {
                const battleState = JSON.parse(battleStateJson);
                if (battleState?.battle) {
                    const rngSeed = typeof battleState.rngSeed === 'number' ? battleState.rngSeed : 0;
                    state.setBattle(battleState.battle, rngSeed);
                }
            }
            catch (error) {
                // [REMOVED] console.warn('Failed to parse battle state:', error);
            }
        }
    },
    saveGame: () => {
        const { team, roster, story, currentMapId, playerPosition, gold, equipment, recruitmentFlags, npcStates, statsTracker } = get();
        const overworldSnapshot = {
            currentMapId,
            playerPosition,
        };
        const saveData = createSaveData(team, roster, { gold, equipment }, story, overworldSnapshot, get().towerRecord ?? towerSlice_1.DEFAULT_TOWER_RECORD, recruitmentFlags, npcStates, statsTracker);
        if (!saveData) {
            console.error('Cannot save: no team data');
            return;
        }
        // Store battle state separately for now
        const { battle, rngSeed } = get();
        const battleState = {
            battle,
            rngSeed,
        };
        localStorage.setItem('vale-v2/battle-state', JSON.stringify(battleState));
        const result = (0, SaveService_1.saveGame)(saveData);
        if (!result.ok) {
            console.error('Failed to save game:', result.error);
        }
    },
    deleteSave: () => {
        const result = (0, SaveService_1.deleteSave)();
        if (!result.ok) {
            console.error('Failed to delete save:', result.error);
        }
        localStorage.removeItem('vale-v2/battle-state');
    },
    // Slot-based operations
    saveGameSlot: (slot) => {
        const { team, roster, story, currentMapId, playerPosition, gold, equipment, recruitmentFlags, npcStates, statsTracker } = get();
        const overworldSnapshot = {
            currentMapId,
            playerPosition,
        };
        const saveData = createSaveData(team, roster, { gold, equipment }, story, overworldSnapshot, get().towerRecord ?? towerSlice_1.DEFAULT_TOWER_RECORD, recruitmentFlags, npcStates, statsTracker);
        if (!saveData) {
            console.error('Cannot save: no team data');
            return;
        }
        // Store battle state separately
        const { battle, rngSeed } = get();
        const battleState = {
            battle,
            rngSeed,
        };
        localStorage.setItem(`vale-v2/battle-state-slot-${slot}`, JSON.stringify(battleState));
        const result = (0, SaveService_1.saveGameSlot)(slot, saveData);
        if (!result.ok) {
            console.error(`Failed to save game to slot ${slot}:`, result.error);
        }
    },
    loadGameSlot: (slot) => {
        const result = (0, SaveService_1.loadGameSlot)(slot);
        if (!result.ok) {
            console.error(`Failed to load game from slot ${slot}:`, result.error);
            return;
        }
        const saveData = result.value;
        const state = get();
        // 1. Restore roster from unitsCollected (bench + active party)
        state.setRoster(saveData.playerData.unitsCollected);
        // 2. Build active party from activeParty IDs (references roster units)
        const activeUnits = saveData.playerData.activeParty
            .map(unitId => saveData.playerData.unitsCollected.find(u => u.id === unitId))
            .filter((u) => u !== undefined);
        if (activeUnits.length > 0) {
            // No padding - use actual team size (1-4 units)
            // Restore equippedDjinn and djinnTrackers from save data
            const team = {
                units: activeUnits,
                equippedDjinn: saveData.playerData.equippedDjinn || [],
                djinnTrackers: saveData.playerData.djinnTrackers || {},
                collectedDjinn: saveData.playerData.djinnCollected,
                currentTurn: 0,
                activationsThisTurn: {},
                djinnStates: {},
            };
            state.setTeam(team);
        }
        // Hydrate inventory
        state.setEquipment(saveData.playerData.inventory ?? []);
        state.setGold(saveData.playerData.gold ?? 0);
        // Hydrate story state
        state.setStoryState(getStoryStateFromSave(saveData));
        // Hydrate overworld state
        state.teleportPlayer(saveData.overworldState.currentScene, saveData.overworldState.playerPosition);
        state.setTowerRecord(saveData.towerStats ?? towerSlice_1.DEFAULT_TOWER_RECORD);
        // Hydrate battle state from localStorage
        const battleStateJson = localStorage.getItem(`vale-v2/battle-state-slot-${slot}`);
        if (battleStateJson) {
            try {
                const battleState = JSON.parse(battleStateJson);
                if (battleState?.battle) {
                    const rngSeed = typeof battleState.rngSeed === 'number' ? battleState.rngSeed : 0;
                    state.setBattle(battleState.battle, rngSeed);
                }
            }
            catch (error) {
                // [REMOVED] console.warn('Failed to parse battle state:', error);
            }
        }
    },
    hasSaveSlot: (slot) => (0, SaveService_1.hasSaveSlot)(slot),
    deleteSaveSlot: (slot) => {
        const result = (0, SaveService_1.deleteSaveSlot)(slot);
        if (!result.ok) {
            console.error(`Failed to delete save slot ${slot}:`, result.error);
        }
        localStorage.removeItem(`vale-v2/battle-state-slot-${slot}`);
    },
    getSaveSlotMetadata: (slot) => (0, SaveService_1.getSaveSlotMetadata)(slot),
    autoSave: () => {
        // Auto-save to slot 0 (quick save)
        get().saveGameSlot(0);
    },
    setRecruitmentFlag: (id, recruited) => {
        _set((state) => ({
            recruitmentFlags: { ...state.recruitmentFlags, [id]: recruited },
        }));
    },
    setNpcState: (id, statePatch) => {
        _set((state) => ({
            npcStates: {
                ...state.npcStates,
                [id]: { ...(state.npcStates[id] ?? {}), ...statePatch },
            },
        }));
    },
    incrementBattleStats: ({ outcome, damageDealt = 0, healingDone = 0 }) => {
        _set((state) => ({
            statsTracker: {
                ...state.statsTracker,
                battlesWon: state.statsTracker.battlesWon + (outcome === 'win' ? 1 : 0),
                battlesLost: state.statsTracker.battlesLost + (outcome === 'loss' ? 1 : 0),
                totalDamageDealt: state.statsTracker.totalDamageDealt + Math.max(0, Math.floor(damageDealt)),
                totalHealingDone: state.statsTracker.totalHealingDone + Math.max(0, Math.floor(healingDone)),
            },
        }));
    },
    addPlaytime: (seconds) => {
        _set((state) => ({
            statsTracker: {
                ...state.statsTracker,
                playtime: state.statsTracker.playtime + Math.max(0, Math.floor(seconds)),
            },
        }));
    },
});
exports.createSaveSlice = createSaveSlice;
