"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameFlowSlice = void 0;
const Team_1 = require("@/core/models/Team");
const Unit_1 = require("@/core/models/Unit");
const Equipment_1 = require("@/core/models/Equipment");
const encounters_1 = require("@/data/definitions/encounters");
const EncounterService_1 = require("@/core/services/EncounterService");
const prng_1 = require("@/core/random/prng");
const dialogues_1 = require("@/data/definitions/dialogues");
const preBattleDialogues_1 = require("@/data/definitions/preBattleDialogues");
const constants_1 = require("@/core/constants");
const battleConfig_1 = require("./battleConfig");
const TowerService_1 = require("@/core/services/TowerService");
const towerFloors_1 = require("@/data/definitions/towerFloors");
const createGameFlowSlice = (set, get) => {
    const buildTeamFromBattleConfig = () => {
        const store = get();
        const { currentBattleConfig, team: existingTeam } = store;
        if (!currentBattleConfig) {
            console.error('No battle configuration available when building team');
            return null;
        }
        const units = [];
        for (const slot of currentBattleConfig.slots) {
            if (!slot.unitId) {
                continue;
            }
            let unit = store.getUnitFromRoster(slot.unitId);
            if (!unit && existingTeam) {
                unit = existingTeam.units.find((candidate) => candidate.id === slot.unitId);
            }
            if (!unit) {
                console.error(`Unit ${slot.unitId} missing from roster/team when building battle team`);
                return null;
            }
            const equipmentLoadout = slot.equipmentLoadout ?? (0, Equipment_1.createEmptyLoadout)();
            const unitWithEquipment = (0, Unit_1.updateUnit)(unit, { equipment: (0, battleConfig_1.cloneEquipmentLoadout)(equipmentLoadout) });
            units.push(unitWithEquipment);
        }
        if (units.length < constants_1.MIN_PARTY_SIZE) {
            console.error(`Battle requires at least ${constants_1.MIN_PARTY_SIZE} units, found ${units.length}`);
            return null;
        }
        const baseTeam = existingTeam ? (0, Team_1.updateTeam)(existingTeam, { units }) : (0, Team_1.createTeam)(units);
        const selectedDjinn = currentBattleConfig.djinnSlots.filter((djinnId) => Boolean(djinnId));
        if (selectedDjinn.length > 0) {
            try {
                return (0, Team_1.updateTeam)(baseTeam, { equippedDjinn: selectedDjinn });
            }
            catch (error) {
                console.error('Failed to apply Djinn selection from BattleConfig', error);
                return null;
            }
        }
        return baseTeam;
    };
    const initializeBattleConfig = () => (0, battleConfig_1.buildBattleConfigForNextBattle)(get().team, get().roster);
    return {
        mode: 'title-screen',
        lastTrigger: null,
        currentEncounter: null,
        currentShopId: null,
        shopEntryContext: null,
        preBattlePosition: null,
        currentBattleConfig: null,
        pendingBattleEncounterId: null,
        compendiumReturnMode: null,
        setMode: (mode) => set({ mode }),
        setPendingBattle: (encounterId) => {
            // When setting a pending battle, automatically transition to team-select mode
            // This matches the behavior of handleTrigger when a battle trigger is encountered
            const battleConfig = encounterId ? initializeBattleConfig() : null;
            set({
                pendingBattleEncounterId: encounterId,
                mode: encounterId ? 'team-select' : 'overworld',
                currentBattleConfig: battleConfig,
            });
        },
        handleTrigger: (trigger, skipPreBattleDialogue = false) => {
            if (!trigger) {
                set({ lastTrigger: null });
                return;
            }
            // ========================================
            // BATTLE TRIGGERS
            // ========================================
            if (trigger.type === 'battle') {
                const encounterId = trigger.data.encounterId;
                if (!encounterId) {
                    console.error('Battle trigger missing encounterId');
                    return;
                }
                const encounter = encounters_1.ENCOUNTERS[encounterId];
                if (!encounter) {
                    console.error(`Encounter ${encounterId} not found in ENCOUNTERS`);
                    return;
                }
                // Check for pre-battle dialogue (unless skipped - e.g., when triggered from dialogue)
                if (!skipPreBattleDialogue) {
                    const preBattleDialogue = (0, preBattleDialogues_1.getPreBattleDialogue)(encounterId);
                    if (preBattleDialogue) {
                        // Show pre-battle dialogue first
                        // The dialogue will trigger the battle via effects.startBattle
                        get().startDialogueTree(preBattleDialogue);
                        set({ lastTrigger: trigger });
                        return;
                    }
                }
                // No pre-battle dialogue (or skipped): go straight to team-select
                set({
                    mode: 'team-select',
                    pendingBattleEncounterId: encounterId,
                    lastTrigger: trigger,
                    currentBattleConfig: initializeBattleConfig(),
                });
                return;
            }
            // ========================================
            // NPC TRIGGERS
            // ========================================
            if (trigger.type === 'npc') {
                const npcId = trigger.data.npcId;
                if (npcId && dialogues_1.DIALOGUES[npcId]) {
                    get().startDialogueTree(dialogues_1.DIALOGUES[npcId]);
                }
                else if (npcId) {
                    // [REMOVED] console.warn(`Dialogue ${npcId} not found`);
                }
                set({ lastTrigger: trigger });
                return;
            }
            // ========================================
            // STORY TRIGGERS
            // ========================================
            if (trigger.type === 'story') {
                const storyId = trigger.data.storyId;
                if (storyId && dialogues_1.DIALOGUES[storyId]) {
                    get().startDialogueTree(dialogues_1.DIALOGUES[storyId]);
                }
                else if (storyId) {
                    // [REMOVED] console.warn(`Story dialogue ${storyId} not found`);
                }
                set({ lastTrigger: trigger });
                return;
            }
            // ========================================
            // SHOP TRIGGERS
            // ========================================
            if (trigger.type === 'shop') {
                const shopId = trigger.data.shopId;
                if (!shopId) {
                    console.error('Shop trigger missing shopId');
                    return;
                }
                set({
                    lastTrigger: trigger,
                    currentShopId: shopId,
                    shopEntryContext: 'overworld',
                    mode: 'shop',
                });
                return;
            }
            // ========================================
            // TOWER TRIGGERS
            // ========================================
            if (trigger.type === 'tower') {
                const { enterTowerFromOverworld } = get();
                const mapId = get().currentMapId;
                if (mapId) {
                    enterTowerFromOverworld({ mapId, position: trigger.position });
                }
                return;
            }
            // ========================================
            // TRANSITION TRIGGERS
            // ========================================
            if (trigger.type === 'transition') {
                const data = trigger.data;
                // Note: requiredFlags checking should be done in overworldSlice.handleTriggerStep
                // which has access to StorySlice. For now, teleport if target is valid.
                // Teleport to target map
                if (data.targetMap && data.targetPos) {
                    const { teleportPlayer } = get();
                    teleportPlayer(data.targetMap, data.targetPos);
                }
                set({ lastTrigger: trigger });
                return;
            }
            // Default: just track trigger
            set({ lastTrigger: trigger });
        },
        openShopFromMainMenu: () => {
            const shopId = 'vale-armory';
            set({
                shopEntryContext: 'menu',
                currentShopId: shopId,
                lastTrigger: {
                    id: 'main-menu-shop',
                    type: 'shop',
                    position: { x: 0, y: 0 },
                    data: { shopId },
                },
                mode: 'shop',
            });
        },
        exitShop: () => {
            const entryContext = get().shopEntryContext;
            set({
                shopEntryContext: null,
                currentShopId: null,
                lastTrigger: null,
                mode: entryContext === 'menu' ? 'main-menu' : 'overworld',
            });
        },
        openCompendium: () => {
            const mode = get().mode;
            const existingReturnMode = get().compendiumReturnMode;
            const returnMode = mode === 'compendium' ? existingReturnMode ?? 'main-menu' : mode;
            set({
                compendiumReturnMode: returnMode,
                mode: 'compendium',
            });
        },
        closeCompendium: () => {
            const returnMode = get().compendiumReturnMode ?? 'main-menu';
            set({
                compendiumReturnMode: null,
                mode: returnMode,
            });
        },
        resetLastTrigger: () => set({ lastTrigger: null }),
        confirmBattleTeam: () => {
            const store = get();
            const { pendingBattleEncounterId, currentBattleConfig, equipment, roster, team, currentMapId, playerPosition, } = store;
            if (!pendingBattleEncounterId) {
                console.error('No pending battle encounter');
                return;
            }
            if (!currentBattleConfig) {
                console.error('Missing battle configuration when confirming battle');
                return;
            }
            const validation = (0, battleConfig_1.validateBattleConfig)(currentBattleConfig, equipment, roster, team);
            if (!validation.valid) {
                console.error('Battle configuration validation failed', validation.message);
                return;
            }
            const encounter = encounters_1.ENCOUNTERS[pendingBattleEncounterId];
            if (!encounter) {
                console.error(`Encounter ${pendingBattleEncounterId} not found`);
                return;
            }
            const selectedTeam = buildTeamFromBattleConfig();
            if (!selectedTeam) {
                console.error('Could not resolve team for battle');
                return;
            }
            let finalTeam = selectedTeam;
            // TOWER NORMALIZATION
            const towerRun = get().towerRun;
            if (get().towerStatus === 'in-run' && towerRun) {
                try {
                    const { normalizedParty } = (0, TowerService_1.prepareFloorBattle)(towerRun, towerFloors_1.TOWER_FLOORS, selectedTeam.units);
                    finalTeam = (0, Team_1.updateTeam)(selectedTeam, { units: normalizedParty });
                }
                catch (e) {
                    console.error('Failed to normalize tower team', e);
                }
            }
            const preBattlePosition = {
                mapId: currentMapId,
                position: { x: playerPosition.x, y: playerPosition.y },
            };
            // Create battle with selected team
            const seed = Date.now();
            const rng = (0, prng_1.makePRNG)(seed);
            try {
                const result = (0, EncounterService_1.createBattleFromEncounter)(pendingBattleEncounterId, finalTeam, rng);
                if (!result || !result.battle) {
                    console.error(`Failed to create battle from encounter ${pendingBattleEncounterId}`);
                    return;
                }
                get().setBattle(result.battle, seed);
                get().setTeam(finalTeam);
                set({
                    currentEncounter: encounter,
                    mode: 'battle',
                    preBattlePosition,
                    pendingBattleEncounterId: null,
                    currentBattleConfig: null,
                });
            }
            catch (error) {
                console.error('Error creating battle:', error);
            }
        },
        updateBattleConfigSlot: (slotIndex, unitId) => set((state) => {
            const { currentBattleConfig } = state;
            if (!currentBattleConfig)
                return state;
            const slots = currentBattleConfig.slots.map((slot) => slot.slotIndex === slotIndex ? { ...slot, unitId } : slot);
            return {
                currentBattleConfig: { ...currentBattleConfig, slots },
            };
        }),
        updateBattleSlotEquipment: (slotIndex, equipmentSlot, equipment) => set((state) => {
            const { currentBattleConfig } = state;
            if (!currentBattleConfig)
                return state;
            const slots = currentBattleConfig.slots.map((slot) => slot.slotIndex === slotIndex
                ? {
                    ...slot,
                    equipmentLoadout: {
                        ...slot.equipmentLoadout,
                        [equipmentSlot]: equipment,
                    },
                }
                : slot);
            return {
                currentBattleConfig: { ...currentBattleConfig, slots },
            };
        }),
        setBattleConfigDjinnSlot: (slotIndex, djinnId) => set((state) => {
            const { currentBattleConfig } = state;
            if (!currentBattleConfig)
                return state;
            const normalizedDjinnId = djinnId ?? null;
            if (normalizedDjinnId &&
                currentBattleConfig.djinnSlots.some((existingId, index) => index !== slotIndex && existingId === normalizedDjinnId)) {
                // [REMOVED] console.warn('Cannot equip the same Djinn more than once', normalizedDjinnId);
                return state;
            }
            const djinnSlots = (0, battleConfig_1.updateDjinnSlots)(currentBattleConfig.djinnSlots, slotIndex, normalizedDjinnId);
            return {
                currentBattleConfig: { ...currentBattleConfig, djinnSlots },
            };
        }),
        clearBattleConfig: () => {
            set({ currentBattleConfig: null });
        },
        returnToOverworld: () => {
            const { preBattlePosition, teleportPlayer } = get();
            // Restore to pre-battle position if available
            if (preBattlePosition) {
                teleportPlayer(preBattlePosition.mapId, preBattlePosition.position);
            }
            // Clear battle state and return to overworld
            set({
                mode: 'overworld',
                preBattlePosition: null,
                currentEncounter: null,
                lastTrigger: null,
                currentBattleConfig: null,
            });
        },
    };
};
exports.createGameFlowSlice = createGameFlowSlice;
