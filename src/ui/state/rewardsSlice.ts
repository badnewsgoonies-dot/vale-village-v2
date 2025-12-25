/**
 * Rewards state slice for Zustand
 * Manages post-battle rewards and reward screen visibility
 */

import type { StateCreator } from 'zustand';
import type { BattleState } from '../../core/models/BattleState';
import type { RewardDistribution } from '../../core/models/Rewards';
import { processVictory as rewardsServiceProcessVictory } from '../../core/services/RewardsService';
import type { VictoryOptions } from '../../core/services/RewardsService';
import type { InventorySlice } from './inventorySlice';
import type { QueueBattleSlice } from './queueBattleSlice';
import type { TeamSlice } from './teamSlice';
import type { GameFlowSlice } from './gameFlowSlice';
import type { Equipment } from '../../data/schemas/EquipmentSchema';
import type { Unit } from '../../core/models/Unit';

export interface RewardsSlice {
  lastBattleRewards: RewardDistribution | null;
  showRewards: boolean;
  lastBattleEncounterId: string | null; // Store encounterId for post-battle dialogue
  lastBattleNewDjinnIds: readonly string[];
  lastBattleBonusEquipment: readonly Equipment[];
  lastBattleBonusRecruits: readonly Unit[];

  processVictory: (battle: BattleState, options?: VictoryOptions & { preserveBonusRewards?: boolean }) => void;
  claimRewards: () => void;
  setShowRewards: (visible: boolean) => void;
  selectEquipmentChoice: (equipment: Equipment) => void;
}

export const createRewardsSlice: StateCreator<
  RewardsSlice & InventorySlice & QueueBattleSlice & TeamSlice & GameFlowSlice,
  [['zustand/devtools', never]],
  [],
  RewardsSlice
> = (set, get) => ({
  lastBattleRewards: null,
  showRewards: false,
  lastBattleEncounterId: null,
  lastBattleNewDjinnIds: [],
  lastBattleBonusEquipment: [],
  lastBattleBonusRecruits: [],

  processVictory: (battle, options) => {
    const result = rewardsServiceProcessVictory(battle, {
      includeEquipment: options?.includeEquipment,
      resetDjinn: options?.resetDjinn,
    });
    
    // Capture encounterId before clearing battle state
    const encounterId = battle.encounterId || battle.meta?.encounterId || null;
    const preserveBonusRewards = options?.preserveBonusRewards ?? false;

    const { team, setTeam, updateTeam, updateTeamUnits } = get();
    const newDjinnIds =
      team?.collectedDjinn.filter(
        (djinnId) => !battle.playerTeam.collectedDjinn.includes(djinnId)
      ) ?? [];
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
    } else {
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
    if (!lastBattleRewards) return;

    const { addGold, addEquipment } = get();
    addGold(lastBattleRewards.goldEarned);

    const equipmentToAdd: Equipment[] = [];
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
      if (!state.lastBattleRewards?.equipmentChoice) return state;
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
