"use strict";
/**
 * Rewards state slice for Zustand
 * Manages post-battle rewards and reward screen visibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRewardsSlice = void 0;
const RewardsService_1 = require("../../core/services/RewardsService");
const createRewardsSlice = (set, get) => ({
    lastBattleRewards: null,
    showRewards: false,
    lastBattleEncounterId: null,
    lastBattleNewDjinnIds: [],
    lastBattleBonusEquipment: [],
    lastBattleBonusRecruits: [],
    processVictory: (battle, options) => {
        const result = (0, RewardsService_1.processVictory)(battle, {
            includeEquipment: options?.includeEquipment,
            resetDjinn: options?.resetDjinn,
        });
        // Capture encounterId before clearing battle state
        const encounterId = battle.encounterId || battle.meta?.encounterId || null;
        const preserveBonusRewards = options?.preserveBonusRewards ?? false;
        const { team, setTeam, updateTeam, updateTeamUnits } = get();
        const newDjinnIds = result.updatedTeam.collectedDjinn.filter((djinnId) => !battle.playerTeam.collectedDjinn.includes(djinnId)) ?? [];
        // IMPORTANT: Do not overwrite the whole team object here.
        // Story progression may have granted Djinn / recruits on encounter completion,
        // and `result.updatedTeam` is derived from the battle snapshot.
        if (team) {
            updateTeamUnits(result.updatedTeam.units);
            updateTeam({
                djinnTrackers: result.updatedTeam.djinnTrackers,
                currentTurn: result.updatedTeam.currentTurn,
                activationsThisTurn: result.updatedTeam.activationsThisTurn,
                djinnStates: result.updatedTeam.djinnStates,
            });
        }
        else {
            setTeam(result.updatedTeam);
        }
        // NOTE: Unit recruitment is now handled via post-battle recruitment dialogues
        // All recruitment is narrative-driven via dialogue effects (recruitUnit)
        set({
            lastBattleRewards: result.distribution,
            lastBattleEncounterId: encounterId, // Store for post-battle dialogue
            lastBattleNewDjinnIds: newDjinnIds,
            ...(preserveBonusRewards
                ? {}
                : {
                    lastBattleBonusEquipment: [],
                    lastBattleBonusRecruits: [],
                }),
            mode: 'rewards', // Set mode instead of showRewards
            showRewards: true,
        });
    },
    claimRewards: () => {
        const { lastBattleRewards } = get();
        if (!lastBattleRewards)
            return;
        const { addGold, addEquipment } = get();
        addGold(lastBattleRewards.goldEarned);
        const equipmentToAdd = [];
        if (lastBattleRewards.fixedEquipment) {
            equipmentToAdd.push(lastBattleRewards.fixedEquipment);
        }
        if (lastBattleRewards.choiceSelected) {
            equipmentToAdd.push(lastBattleRewards.choiceSelected);
        }
        if (equipmentToAdd.length > 0) {
            addEquipment(equipmentToAdd);
        }
        // Clear rewards but keep encounterId until handleRewardsContinue uses it
        // Don't clear lastBattleEncounterId here - handleRewardsContinue needs it
        set({
            lastBattleRewards: null,
            showRewards: false,
            lastBattleNewDjinnIds: [],
            lastBattleBonusEquipment: [],
            lastBattleBonusRecruits: [],
        });
        // Don't set mode here - let handleRewardsContinue handle mode transition
        // (it needs to check for recruitment dialogue first)
    },
    setShowRewards: (visible) => {
        set({ showRewards: visible });
    },
    selectEquipmentChoice: (equipment) => {
        set((state) => {
            if (!state.lastBattleRewards?.equipmentChoice)
                return state;
            return {
                lastBattleRewards: {
                    ...state.lastBattleRewards,
                    choiceSelected: equipment,
                    equipmentChoice: undefined,
                },
            };
        });
    },
});
exports.createRewardsSlice = createRewardsSlice;
