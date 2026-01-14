// @ts-nocheck
// [BT-STATE][BT-01] Battle Tower UI state slice
import type { StateCreator } from 'zustand';
import type { TowerFloor } from '@/data/schemas/TowerFloorSchema';
import type { TowerRewardEntry } from '@/data/schemas/TowerRewardSchema';
import type { TowerRunState, TowerBattleOutcome, TowerBattleSummary } from '@/core/services/TowerService';
import type { TowerConfig, TowerDifficulty } from '@/core/config/towerConfig';
import type { BattleState } from '@/core/models/BattleState';
import type { Position } from '@/core/models/overworld';
import type { Equipment } from '@/data/schemas/EquipmentSchema';
import type { Unit } from '@/core/models/Unit';
import type { Team } from '@/core/models/Team';
import type { QueueBattleSlice } from './queueBattleSlice';
import type { GameFlowSlice } from './gameFlowSlice';
import type { TeamSlice } from './teamSlice';
import type { InventorySlice } from './inventorySlice';
import type { OverworldStore } from './overworldSlice';
import type { RewardsSlice } from './rewardsSlice';
import { DEFAULT_TOWER_CONFIG } from '@/core/config/towerConfig';
import { TOWER_FLOORS } from '@/data/definitions/towerFloors';
import { TOWER_REWARDS } from '@/data/definitions/towerRewards';
import {
  createTowerRun,
  getCurrentFloor as towerGetCurrentFloor,
  recordBattleResult,
  completeRestFloor,
  clearPendingRewards,
} from '@/core/services/TowerService';
import { UNIT_DEFINITIONS } from '@/data/definitions/units';
import { EQUIPMENT } from '@/data/definitions/equipment';
import { createUnit, updateUnit } from '@/core/models/Unit';
import { updateTeam } from '@/core/models/Team';
import { collectDjinn } from '@/core/services/DjinnService';
import { calculateEffectiveStats } from '@/core/algorithms/stats';
import type { BattleEvent } from '@/core/services/types';
import { getXpForLevel } from '@/core/algorithms/xp';

const DEFAULT_DIFFICULTY: TowerDifficulty = 'normal';

export interface TowerRecord {
  readonly highestFloorEver: number;
  readonly totalRuns: number;
  readonly bestRunTurns: number | null;
  readonly bestRunDamageDealt: number | null;
}

export const DEFAULT_TOWER_RECORD: TowerRecord = Object.freeze({
  highestFloorEver: 0,
  totalRuns: 0,
  bestRunTurns: null,
  bestRunDamageDealt: null,
});

type TowerEntryContext =
  | { type: 'main-menu' }
  | { type: 'overworld'; mapId: string; position: Position };

interface TowerBattlePayload {
  battle: BattleState;
  events: readonly BattleEvent[];
}

export interface TowerSlice {
  towerRun: TowerRunState | null;
  towerStatus: 'idle' | 'in-run' | 'completed';
  towerRecord: TowerRecord;
  towerEntryContext: TowerEntryContext | null;
  activeTowerEncounterId: string | null;

  getCurrentTowerFloor: () => TowerFloor | null;
  startTowerRun: (opts?: { difficulty?: TowerDifficulty; seed?: number }) => void;
  beginTowerFloorBattle: () => void;
  handleTowerBattleCompleted: (payload: TowerBattlePayload) => void;
  applyTowerRest: () => void;
  quitTowerRun: () => void;
  enterTowerFromOverworld: (context: { mapId: string; position: Position }) => void;
  openTowerFromMainMenu: () => void;
  exitTowerMode: () => void;
  setTowerRecord: (record: TowerRecord) => void;
}

type TowerSliceDeps = TowerSlice &
  QueueBattleSlice &
  GameFlowSlice &
  TeamSlice &
  RewardsSlice &
  InventorySlice &
  OverworldStore;

export const createTowerSlice: StateCreator<
  TowerSliceDeps,
  [['zustand/devtools', never]],
  [],
  TowerSlice
> = (set, get) => ({
  towerRun: null,
  towerStatus: 'idle',
  towerRecord: { ...DEFAULT_TOWER_RECORD },
  towerEntryContext: null,
  activeTowerEncounterId: null,

  getCurrentTowerFloor: () => {
    const run = get().towerRun;
    if (!run) {
      return null;
    }
    return towerGetCurrentFloor(run, TOWER_FLOORS);
  },

  startTowerRun: (opts) => {
    if (get().towerStatus === 'in-run') {
      return;
    }

    const difficulty = opts?.difficulty ?? DEFAULT_DIFFICULTY;
    const seed = opts?.seed ?? Date.now();

    const run = createTowerRun(seed, difficulty, TOWER_FLOORS, { config: DEFAULT_TOWER_CONFIG });

    if (!get().towerEntryContext) {
      set({ towerEntryContext: { type: 'main-menu' } });
    }

    set({
      towerRun: run,
      towerStatus: 'in-run',
      activeTowerEncounterId: null,
    });

    get().setMode('tower');
  },

  beginTowerFloorBattle: () => {
    const run = get().towerRun;
    if (!run || get().towerStatus !== 'in-run') {
      return;
    }

    const floor = towerGetCurrentFloor(run, TOWER_FLOORS);
    if (!floor || floor.type === 'rest') {
      return;
    }

    set({ activeTowerEncounterId: floor.encounterId });
    get().setPendingBattle(floor.encounterId);
  },

  handleTowerBattleCompleted: ({ battle }: TowerBattlePayload) => {
    const run = get().towerRun;
    if (!run || !run.floorIds.length) {
      return;
    }

    const encounterId = battle.encounterId || battle.meta?.encounterId || null;
    const wasTowerBattle =
      get().activeTowerEncounterId && encounterId === get().activeTowerEncounterId;

    if (!wasTowerBattle) {
      return;
    }

    const currentFloor = towerGetCurrentFloor(run, TOWER_FLOORS);
    if (!currentFloor) {
      return;
    }

    const outcome: TowerBattleOutcome =
      battle.status === 'PLAYER_DEFEAT' ? 'defeat' : 'victory';

    const summary: TowerBattleSummary = {
      turnsTaken: battle.roundNumber,
      damageDealt: sumUnitStat(battle.playerTeam.units, 'damageDealt'),
      damageTaken: sumUnitStat(battle.playerTeam.units, 'damageTaken'),
      manaSpent: 0,
    };

    const previousHighestFloorEver = get().towerRecord.highestFloorEver;
    const isNewPersonalBestFloor = currentFloor.floorNumber > previousHighestFloorEver;
    const rewardEntries = isNewPersonalBestFloor ? getRewardsForFloor(currentFloor.floorNumber, previousHighestFloorEver) : [];
    const recordedRun = recordBattleResult({
      run,
      floors: TOWER_FLOORS,
      outcome,
      summary,
      rewards: rewardEntries,
    });
    const clearedRun = clearPendingRewards(recordedRun);

    set({
      activeTowerEncounterId: null,
      towerRun: clearedRun,
      towerStatus: clearedRun.isCompleted ? 'completed' : 'in-run',
    });

    if (isNewPersonalBestFloor) {
      set((state) => ({
        towerRecord: {
          ...state.towerRecord,
          highestFloorEver: currentFloor.floorNumber,
        },
      }));
    }

    if (rewardEntries.length > 0) {
      const milestoneRewards = grantTowerMilestoneRewards(rewardEntries, get());
      set({
        lastBattleBonusEquipment: milestoneRewards.bonusEquipment,
        lastBattleBonusRecruits: milestoneRewards.bonusRecruits,
      });
    } else {
      set({ lastBattleBonusEquipment: [], lastBattleBonusRecruits: [] });
    }

    // Persist battle results to the campaign team (Tower keeps HP between fights).
    get().updateTeamUnits(battle.playerTeam.units);

    if (clearedRun.isCompleted || outcome === 'defeat') {
      set((state) => ({
        towerRun: {
          ...clearedRun,
          isCompleted: true,
          isFailed: outcome === 'defeat',
        },
        towerStatus: 'completed',
        towerRecord: updateTowerRecordFromRun(state.towerRecord, clearedRun),
      }));
    }

    if (outcome === 'victory') {
      // Tower is a campaign catch-up path: grant XP + Gold, but avoid encounter equipment rewards.
      get().processVictory(battle, { includeEquipment: false, resetDjinn: false, preserveBonusRewards: true });
    } else {
      get().setMode('tower');
    }
  },

  applyTowerRest: () => {
    const run = get().towerRun;
    if (!run || get().towerStatus !== 'in-run') {
      return;
    }

    const floor = towerGetCurrentFloor(run, TOWER_FLOORS);
    if (!floor || floor.type !== 'rest') {
      return;
    }

    const config = run.config ?? DEFAULT_TOWER_CONFIG;
    const healedTeam = healTeamAtRest(get().team, config);
    if (healedTeam) {
      get().updateTeam(healedTeam);
      get().updateTeamUnits(healedTeam.units);
    }

    const restedRun = completeRestFloor(run, TOWER_FLOORS, {
      healedFraction: config.healFractionAtRest,
      loadoutAdjusted: true,
    });

    set({ towerRun: restedRun });
  },

  quitTowerRun: () => {
    const run = get().towerRun;
    if (!run) {
      get().exitTowerMode();
      return;
    }

    set((state) => ({
      towerRun: {
        ...run,
        isCompleted: true,
      },
      towerStatus: 'completed',
      towerRecord: updateTowerRecordFromRun(state.towerRecord, run),
    }));
  },

  enterTowerFromOverworld: ({ mapId, position }) => {
    set({
      towerEntryContext: { type: 'overworld', mapId, position },
    });
    get().setMode('tower');
  },

  openTowerFromMainMenu: () => {
    set({
      towerEntryContext: { type: 'main-menu' },
    });
    get().setMode('tower');
  },

  exitTowerMode: () => {
    const context = get().towerEntryContext;

    set({
      towerRun: null,
      towerStatus: 'idle',
      towerEntryContext: null,
      activeTowerEncounterId: null,
    });

    if (context?.type === 'overworld') {
      get().teleportPlayer(context.mapId, context.position);
      get().setMode('overworld');
    } else {
      get().setMode('main-menu');
    }
  },

  setTowerRecord: (record) => {
    set({
      towerRecord: {
        highestFloorEver: record.highestFloorEver ?? 0,
        totalRuns: record.totalRuns ?? 0,
        bestRunTurns: record.bestRunTurns ?? null,
        bestRunDamageDealt: record.bestRunDamageDealt ?? null,
      },
    });
  },
});

function getRewardsForFloor(floorNumber: number, previousHighestFloorEver: number = 0): TowerRewardEntry[] {
  // Return all milestone rewards with floorNumber in (previousHighestFloorEver, floorNumber]
  return TOWER_REWARDS
    .filter((reward) => reward.floorNumber > previousHighestFloorEver && reward.floorNumber <= floorNumber)
    .flatMap((reward) => reward.rewards);
}

function sumUnitStat(units: readonly Unit[], key: 'damageDealt' | 'damageTaken'): number {
  return units.reduce((sum, unit) => sum + (unit.battleStats?.[key] ?? 0), 0);
}

function grantTowerMilestoneRewards(
  entries: TowerRewardEntry[],
  state: TowerSliceDeps
): { bonusEquipment: Equipment[]; bonusRecruits: Unit[] } {
  const bonusEquipment: Equipment[] = [];
  const bonusRecruits: Unit[] = [];

  const team = state.team;
  const avgLevel =
    team && team.units.length > 0
      ? Math.max(1, Math.floor(team.units.reduce((sum, unit) => sum + unit.level, 0) / team.units.length))
      : 1;

  const rosterIds = new Set(state.roster?.map((unit) => unit.id) ?? []);

  for (const reward of entries) {
    switch (reward.type) {
      case 'equipment': {
        const items = reward.ids
          .map((id: string) => EQUIPMENT[id])
          .filter((item: any): item is Equipment => Boolean(item));
        if (items.length > 0) {
          state.addEquipment(items);
          bonusEquipment.push(...items);
        }
        break;
      }
      case 'djinn': {
        if (!team) break;
        for (const djinnId of reward.ids) {
          const result = collectDjinn(team, djinnId);
          if (result.ok) {
            state.updateTeam({ collectedDjinn: result.value.collectedDjinn });
            continue;
          }

          // Tower can exceed the campaign Djinn cap if it must (future-proofing).
          if (result.error.includes('Cannot collect more than 12 Djinn') && !team.collectedDjinn.includes(djinnId)) {
            state.updateTeam({ collectedDjinn: [...team.collectedDjinn, djinnId] });
          }
        }
        break;
      }
      case 'recruit': {
        for (const unitId of reward.ids) {
          if (rosterIds.has(unitId)) continue;
          const def = UNIT_DEFINITIONS[unitId];
          if (!def) continue;

          if (state.roster.length >= 10) {
            // [REMOVED] console.warn('Roster full (10 units max), cannot add unit');
            break;
          }

          const xp = getXpForLevel(avgLevel);
          const newUnit = createUnit(def, avgLevel, xp);
          state.addUnitToRoster(newUnit);
          rosterIds.add(unitId);
          bonusRecruits.push(newUnit);
        }
        break;
      }
    }
  }

  return { bonusEquipment, bonusRecruits };
}

function healTeamAtRest(team: Team | null, config: TowerConfig): Team | null {
  if (!team) return null;
  const fraction = config.healFractionAtRest;
  const healedUnits = team.units.map((unit) => {
    const stats = calculateEffectiveStats(unit, team);
    const healAmount = Math.floor(stats.hp * fraction);
    const nextHp = Math.min(stats.hp, unit.currentHp + healAmount);
    return updateUnit(unit, { currentHp: nextHp });
  });

  const resetTrackers = Object.fromEntries(
    Object.entries(team.djinnTrackers).map(([djinnId, tracker]) => [
      djinnId,
      { ...tracker, state: 'Set' as const },
    ])
  );

  return updateTeam(team, {
    units: healedUnits,
    djinnTrackers: resetTrackers,
  });
}

function updateTowerRecordFromRun(current: TowerRecord, run: TowerRunState): TowerRecord {
  const nextHighest = Math.max(current.highestFloorEver, run.stats.highestFloor);
  const nextTotalRuns = current.totalRuns + 1;
  const turnsThisRun = run.stats.turnsTaken;
  const damageThisRun = run.stats.totalDamageDealt;

  const nextBestTurns =
    turnsThisRun > 0
      ? current.bestRunTurns === null
        ? turnsThisRun
        : Math.min(current.bestRunTurns, turnsThisRun)
      : current.bestRunTurns;

  const nextBestDamage =
    current.bestRunDamageDealt === null
      ? damageThisRun
      : Math.max(current.bestRunDamageDealt, damageThisRun);

  return {
    highestFloorEver: nextHighest,
    totalRuns: nextTotalRuns,
    bestRunTurns: nextBestTurns,
    bestRunDamageDealt: nextBestDamage,
  };
}
