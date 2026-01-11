"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTowerSlice = exports.DEFAULT_TOWER_RECORD = void 0;
const towerConfig_1 = require("@/core/config/towerConfig");
const towerFloors_1 = require("@/data/definitions/towerFloors");
const towerRewards_1 = require("@/data/definitions/towerRewards");
const TowerService_1 = require("@/core/services/TowerService");
const units_1 = require("@/data/definitions/units");
const equipment_1 = require("@/data/definitions/equipment");
const Unit_1 = require("@/core/models/Unit");
const Team_1 = require("@/core/models/Team");
const DjinnService_1 = require("@/core/services/DjinnService");
const stats_1 = require("@/core/algorithms/stats");
const xp_1 = require("@/core/algorithms/xp");
const DEFAULT_DIFFICULTY = 'normal';
exports.DEFAULT_TOWER_RECORD = Object.freeze({
    highestFloorEver: 0,
    totalRuns: 0,
    bestRunTurns: null,
    bestRunDamageDealt: null,
});
const createTowerSlice = (set, get) => ({
    towerRun: null,
    towerStatus: 'idle',
    towerRecord: { ...exports.DEFAULT_TOWER_RECORD },
    towerEntryContext: null,
    activeTowerEncounterId: null,
    getCurrentTowerFloor: () => {
        const run = get().towerRun;
        if (!run) {
            return null;
        }
        return (0, TowerService_1.getCurrentFloor)(run, towerFloors_1.TOWER_FLOORS);
    },
    startTowerRun: (opts) => {
        if (get().towerStatus === 'in-run') {
            return;
        }
        const difficulty = opts?.difficulty ?? DEFAULT_DIFFICULTY;
        const seed = opts?.seed ?? Date.now();
        const run = (0, TowerService_1.createTowerRun)(seed, difficulty, towerFloors_1.TOWER_FLOORS, { config: towerConfig_1.DEFAULT_TOWER_CONFIG });
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
        const floor = (0, TowerService_1.getCurrentFloor)(run, towerFloors_1.TOWER_FLOORS);
        if (!floor || floor.type === 'rest') {
            return;
        }
        set({ activeTowerEncounterId: floor.encounterId });
        get().setPendingBattle(floor.encounterId);
    },
    handleTowerBattleCompleted: ({ battle }) => {
        const run = get().towerRun;
        if (!run || !run.floorIds.length) {
            return;
        }
        const encounterId = battle.encounterId || battle.meta?.encounterId || null;
        const wasTowerBattle = get().activeTowerEncounterId && encounterId === get().activeTowerEncounterId;
        if (!wasTowerBattle) {
            return;
        }
        const currentFloor = (0, TowerService_1.getCurrentFloor)(run, towerFloors_1.TOWER_FLOORS);
        if (!currentFloor) {
            return;
        }
        const outcome = battle.status === 'PLAYER_DEFEAT' ? 'defeat' : 'victory';
        const summary = {
            turnsTaken: battle.roundNumber,
            damageDealt: sumUnitStat(battle.playerTeam.units, 'damageDealt'),
            damageTaken: sumUnitStat(battle.playerTeam.units, 'damageTaken'),
            manaSpent: 0,
        };
        const previousHighestFloorEver = get().towerRecord.highestFloorEver;
        const isNewPersonalBestFloor = currentFloor.floorNumber > previousHighestFloorEver;
        const rewardEntries = isNewPersonalBestFloor ? getRewardsForFloor(currentFloor.floorNumber) : [];
        const recordedRun = (0, TowerService_1.recordBattleResult)({
            run,
            floors: towerFloors_1.TOWER_FLOORS,
            outcome,
            summary,
            rewards: rewardEntries,
        });
        const clearedRun = (0, TowerService_1.clearPendingRewards)(recordedRun);
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
        }
        else {
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
        }
        else {
            get().setMode('tower');
        }
    },
    applyTowerRest: () => {
        const run = get().towerRun;
        if (!run || get().towerStatus !== 'in-run') {
            return;
        }
        const floor = (0, TowerService_1.getCurrentFloor)(run, towerFloors_1.TOWER_FLOORS);
        if (!floor || floor.type !== 'rest') {
            return;
        }
        const config = run.config ?? towerConfig_1.DEFAULT_TOWER_CONFIG;
        const healedTeam = healTeamAtRest(get().team, config);
        if (healedTeam) {
            get().updateTeam(healedTeam);
            get().updateTeamUnits(healedTeam.units);
        }
        const restedRun = (0, TowerService_1.completeRestFloor)(run, towerFloors_1.TOWER_FLOORS, {
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
        }
        else {
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
exports.createTowerSlice = createTowerSlice;
function getRewardsForFloor(floorNumber) {
    const entry = towerRewards_1.TOWER_REWARDS.find((reward) => reward.floorNumber === floorNumber);
    return entry ? entry.rewards : [];
}
function sumUnitStat(units, key) {
    return units.reduce((sum, unit) => sum + (unit.battleStats?.[key] ?? 0), 0);
}
function grantTowerMilestoneRewards(entries, state) {
    const bonusEquipment = [];
    const bonusRecruits = [];
    const team = state.team;
    const avgLevel = team && team.units.length > 0
        ? Math.max(1, Math.floor(team.units.reduce((sum, unit) => sum + unit.level, 0) / team.units.length))
        : 1;
    const rosterIds = new Set(state.roster?.map((unit) => unit.id) ?? []);
    for (const reward of entries) {
        switch (reward.type) {
            case 'equipment': {
                const items = reward.ids
                    .map((id) => equipment_1.EQUIPMENT[id])
                    .filter((item) => Boolean(item));
                if (items.length > 0) {
                    state.addEquipment(items);
                    bonusEquipment.push(...items);
                }
                break;
            }
            case 'djinn': {
                if (!team)
                    break;
                for (const djinnId of reward.ids) {
                    const result = (0, DjinnService_1.collectDjinn)(team, djinnId);
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
                    if (rosterIds.has(unitId))
                        continue;
                    const def = units_1.UNIT_DEFINITIONS[unitId];
                    if (!def)
                        continue;
                    if (state.roster.length >= 10) {
                        // [REMOVED] console.warn('Roster full (10 units max), cannot add unit');
                        break;
                    }
                    const xp = (0, xp_1.getXpForLevel)(avgLevel);
                    const newUnit = (0, Unit_1.createUnit)(def, avgLevel, xp);
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
function healTeamAtRest(team, config) {
    if (!team)
        return null;
    const fraction = config.healFractionAtRest;
    const healedUnits = team.units.map((unit) => {
        const stats = (0, stats_1.calculateEffectiveStats)(unit, team);
        const healAmount = Math.floor(stats.hp * fraction);
        const nextHp = Math.min(stats.hp, unit.currentHp + healAmount);
        return (0, Unit_1.updateUnit)(unit, { currentHp: nextHp });
    });
    const resetTrackers = Object.fromEntries(Object.entries(team.djinnTrackers).map(([djinnId, tracker]) => [
        djinnId,
        { ...tracker, state: 'Set' },
    ]));
    return (0, Team_1.updateTeam)(team, {
        units: healedUnits,
        djinnTrackers: resetTrackers,
    });
}
function updateTowerRecordFromRun(current, run) {
    const nextHighest = Math.max(current.highestFloorEver, run.stats.highestFloor);
    const nextTotalRuns = current.totalRuns + 1;
    const turnsThisRun = run.stats.turnsTaken;
    const damageThisRun = run.stats.totalDamageDealt;
    const nextBestTurns = turnsThisRun > 0
        ? current.bestRunTurns === null
            ? turnsThisRun
            : Math.min(current.bestRunTurns, turnsThisRun)
        : current.bestRunTurns;
    const nextBestDamage = current.bestRunDamageDealt === null
        ? damageThisRun
        : Math.max(current.bestRunDamageDealt, damageThisRun);
    return {
        highestFloorEver: nextHighest,
        totalRuns: nextTotalRuns,
        bestRunTurns: nextBestTurns,
        bestRunDamageDealt: nextBestDamage,
    };
}
