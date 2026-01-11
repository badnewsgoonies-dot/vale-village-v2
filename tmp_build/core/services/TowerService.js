"use strict";
// [BT-CORE][BT-01] Battle Tower core service
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTowerRun = createTowerRun;
exports.getCurrentFloor = getCurrentFloor;
exports.isRestFloor = isRestFloor;
exports.advanceToNextFloor = advanceToNextFloor;
exports.recordBattleResult = recordBattleResult;
exports.completeRestFloor = completeRestFloor;
exports.clearPendingRewards = clearPendingRewards;
exports.calculateEnemyScaling = calculateEnemyScaling;
exports.prepareFloorBattle = prepareFloorBattle;
const towerConfig_1 = require("../config/towerConfig");
const LevelNormalizationService_1 = require("./LevelNormalizationService");
function createTowerRun(seed, difficulty, floors, options = {}) {
    if (!floors.length) {
        throw new Error('TOWER_FLOORS must contain at least one entry');
    }
    const sortedFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);
    const floorIds = sortedFloors.map(floor => floor.id);
    return {
        seed,
        difficulty,
        floorIndex: 0,
        floorIds,
        isCompleted: false,
        isFailed: false,
        stats: {
            highestFloor: 0,
            totalBattles: 0,
            victories: 0,
            defeats: 0,
            retreats: 0,
            turnsTaken: 0,
            totalDamageDealt: 0,
            totalDamageTaken: 0,
        },
        history: sortedFloors.map(floor => ({
            floorId: floor.id,
            floorNumber: floor.floorNumber,
            type: floor.type,
            outcome: 'pending',
            rewardsGranted: [],
        })),
        pendingRewards: [],
        config: options.config ?? towerConfig_1.DEFAULT_TOWER_CONFIG,
        rentalTeamId: options.rentalTeamId,
    };
}
function getCurrentFloor(run, floors) {
    if (run.floorIndex >= run.floorIds.length) {
        return null;
    }
    const currentId = run.floorIds[run.floorIndex];
    return getFloorById(floors, currentId);
}
function isRestFloor(floor) {
    return Boolean(floor && floor.type === 'rest');
}
function advanceToNextFloor(run) {
    if (run.isCompleted) {
        return run;
    }
    const nextIndex = Math.min(run.floorIndex + 1, run.floorIds.length);
    const completed = nextIndex >= run.floorIds.length;
    return {
        ...run,
        floorIndex: nextIndex,
        isCompleted: completed,
        isFailed: run.isFailed,
    };
}
function recordBattleResult({ run, floors, outcome, summary, rewards = [], }) {
    const currentFloor = getCurrentFloor(run, floors);
    if (!currentFloor) {
        return run;
    }
    if (currentFloor.type === 'rest') {
        throw new Error(`Cannot record battle result for rest floor ${currentFloor.id}`);
    }
    const nextStats = updateStatsForBattle(run.stats, currentFloor.floorNumber, outcome, summary);
    const nextHistory = run.history.map(entry => {
        if (entry.floorId !== currentFloor.id) {
            return entry;
        }
        return {
            ...entry,
            outcome,
            rewardsGranted: rewards,
        };
    });
    const didWin = outcome === 'victory';
    const didRetreat = outcome === 'retreat';
    const nextFloorIndex = didWin ? Math.min(run.floorIndex + 1, run.floorIds.length) : run.floorIndex;
    const hasClearedAllFloors = nextFloorIndex >= run.floorIds.length;
    const isFailed = outcome === 'defeat';
    const isCompleted = hasClearedAllFloors || didRetreat || isFailed;
    return {
        ...run,
        stats: nextStats,
        history: nextHistory,
        floorIndex: nextFloorIndex,
        isCompleted,
        isFailed,
        pendingRewards: rewards.length ? [...run.pendingRewards, ...rewards] : run.pendingRewards,
        // Retreating ends the run but is not a failure
    };
}
function completeRestFloor(run, floors, summary) {
    const currentFloor = getCurrentFloor(run, floors);
    if (!currentFloor) {
        return run;
    }
    if (currentFloor.type !== 'rest') {
        throw new Error(`completeRestFloor called for non-rest floor ${currentFloor.id}`);
    }
    const nextHistory = run.history.map(entry => {
        if (entry.floorId !== currentFloor.id) {
            return entry;
        }
        const updated = {
            ...entry,
            outcome: 'rested',
            rewardsGranted: [],
            restSummary: summary,
        };
        return updated;
    });
    return {
        ...run,
        history: nextHistory,
        floorIndex: Math.min(run.floorIndex + 1, run.floorIds.length),
        stats: {
            ...run.stats,
            highestFloor: Math.max(run.stats.highestFloor, currentFloor.floorNumber),
        },
    };
}
function clearPendingRewards(run) {
    if (!run.pendingRewards.length) {
        return run;
    }
    return {
        ...run,
        pendingRewards: [],
    };
}
function calculateEnemyScaling(floorNumber, difficulty, config = towerConfig_1.DEFAULT_TOWER_CONFIG) {
    const baseMultiplier = 1 + (floorNumber - 1) * (config.enemyScalingPerFloor ?? towerConfig_1.TOWER_ENEMY_SCALING_PER_FLOOR);
    const difficultyBonus = difficulty === 'hard' ? 0.25 : 0;
    const statMultiplier = baseMultiplier + difficultyBonus;
    const levelDelta = Math.max(0, Math.floor((floorNumber - 1) * (difficulty === 'hard' ? 1.5 : 1)));
    return {
        statMultiplier,
        levelDelta,
    };
}
function getFloorById(floors, id) {
    const floor = floors.find(entry => entry.id === id);
    if (!floor) {
        throw new Error(`Tower floor ${id} not found`);
    }
    return floor;
}
function updateStatsForBattle(stats, floorNumber, outcome, summary) {
    return {
        highestFloor: outcome === 'victory' ? Math.max(stats.highestFloor, floorNumber) : stats.highestFloor,
        totalBattles: stats.totalBattles + 1,
        victories: stats.victories + (outcome === 'victory' ? 1 : 0),
        defeats: stats.defeats + (outcome === 'defeat' ? 1 : 0),
        retreats: stats.retreats + (outcome === 'retreat' ? 1 : 0),
        turnsTaken: stats.turnsTaken + summary.turnsTaken,
        totalDamageDealt: stats.totalDamageDealt + summary.damageDealt,
        totalDamageTaken: stats.totalDamageTaken + summary.damageTaken,
    };
}
/**
 * Prepare a floor battle by normalizing the party to the floor's level
 *
 * @param run - Current tower run state
 * @param floors - All tower floors
 * @param playerParty - Player's party units
 * @param curve - Normalization curve to use (default: 'stepped')
 * @returns Normalized party and current floor
 *
 * @throws Error if current floor is not found or is a rest floor
 *
 * @example
 * const { normalizedParty, floor } = prepareFloorBattle(
 *   run,
 *   TOWER_FLOORS,
 *   playerParty,
 *   'stepped'
 * );
 * // Use normalizedParty for battle
 */
function prepareFloorBattle(run, floors, playerParty, curve = 'stepped') {
    const floor = getCurrentFloor(run, floors);
    if (!floor) {
        throw new Error('No current floor found');
    }
    if (floor.type === 'rest') {
        throw new Error('Cannot prepare battle for rest floor');
    }
    const normalizedParty = (0, LevelNormalizationService_1.normalizePartyForFloor)(playerParty, floor, curve);
    return { normalizedParty, floor };
}
