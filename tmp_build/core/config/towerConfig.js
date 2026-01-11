"use strict";
// [BT-CONFIG][BT-01] Battle Tower configuration
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOWER_MAX_TEAM_SIZE = exports.TOWER_BOSS_FLOOR_INTERVAL = exports.TOWER_ENEMY_SCALING_PER_FLOOR = exports.TOWER_HP_RESTORE_FRACTION_AT_REST = exports.TOWER_TARGET_MAX_FLOOR = exports.TOWER_REST_FLOOR_INTERVAL = exports.DEFAULT_TOWER_CONFIG = void 0;
exports.DEFAULT_TOWER_CONFIG = {
    restFloorInterval: 4,
    targetMaxFloor: 100,
    healFractionAtRest: 0.5,
    enemyScalingPerFloor: 0.04,
    bossFloorInterval: 5,
    maxTeamSize: 4,
};
exports.TOWER_REST_FLOOR_INTERVAL = exports.DEFAULT_TOWER_CONFIG.restFloorInterval;
exports.TOWER_TARGET_MAX_FLOOR = exports.DEFAULT_TOWER_CONFIG.targetMaxFloor;
exports.TOWER_HP_RESTORE_FRACTION_AT_REST = exports.DEFAULT_TOWER_CONFIG.healFractionAtRest;
exports.TOWER_ENEMY_SCALING_PER_FLOOR = exports.DEFAULT_TOWER_CONFIG.enemyScalingPerFloor;
exports.TOWER_BOSS_FLOOR_INTERVAL = exports.DEFAULT_TOWER_CONFIG.bossFloorInterval;
exports.TOWER_MAX_TEAM_SIZE = exports.DEFAULT_TOWER_CONFIG.maxTeamSize;
