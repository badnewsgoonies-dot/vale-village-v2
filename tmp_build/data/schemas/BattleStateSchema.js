"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleStateSchema = exports.BattlePhaseSchema = exports.QueuedActionSchema = exports.BattleStatusSchema = exports.BattleResultSchema = void 0;
const zod_1 = require("zod");
const TeamSchema_1 = require("./TeamSchema");
const UnitSchema_1 = require("./UnitSchema");
const constants_1 = require("../../core/constants");
/**
 * Zod schema for BattleResult
 */
exports.BattleResultSchema = zod_1.z.enum(['PLAYER_VICTORY', 'PLAYER_DEFEAT']);
/**
 * Zod schema for BattleStatus
 */
exports.BattleStatusSchema = zod_1.z.union([
    zod_1.z.literal('ongoing'),
    exports.BattleResultSchema,
]);
/**
 * Zod schema for QueuedAction
 */
exports.QueuedActionSchema = zod_1.z.object({
    unitId: zod_1.z.string().min(1),
    abilityId: zod_1.z.string().nullable(),
    targetIds: zod_1.z.array(zod_1.z.string().min(1)),
    manaCost: zod_1.z.number().int().min(0).max(10),
});
/**
 * Zod schema for BattlePhase
 */
exports.BattlePhaseSchema = zod_1.z.enum(['planning', 'executing', 'victory', 'defeat']);
/**
 * Zod schema for BattleState
 * PR-QUEUE-BATTLE: Extended with queue-based battle system fields
 */
exports.BattleStateSchema = zod_1.z.object({
    playerTeam: TeamSchema_1.TeamSchema,
    enemies: zod_1.z.array(UnitSchema_1.UnitSchema).min(1), // At least 1 enemy
    currentTurn: zod_1.z.number().int().min(0),
    roundNumber: zod_1.z.number().int().min(1),
    phase: exports.BattlePhaseSchema,
    turnOrder: zod_1.z.array(zod_1.z.string().min(1)), // Array of unit IDs
    currentActorIndex: zod_1.z.number().int().min(0),
    status: exports.BattleStatusSchema,
    log: zod_1.z.array(zod_1.z.string()),
    // Queue-based battle system fields
    currentQueueIndex: zod_1.z.number().int().min(0), // Max validated in superRefine
    queuedActions: zod_1.z.array(exports.QueuedActionSchema.nullable()).min(constants_1.MIN_PARTY_SIZE).max(constants_1.MAX_PARTY_SIZE), // 1-4 actions
    queuedDjinn: zod_1.z.array(zod_1.z.string().min(1)),
    remainingMana: zod_1.z.number().int().min(0),
    maxMana: zod_1.z.number().int().min(0),
    executionIndex: zod_1.z.number().int().min(0),
    djinnRecoveryTimers: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    // Legacy fields
    isBossBattle: zod_1.z.boolean().optional(),
    npcId: zod_1.z.string().optional(),
    encounterId: zod_1.z.string().optional(),
    meta: zod_1.z.object({
        encounterId: zod_1.z.string(),
        difficulty: zod_1.z.enum(['normal', 'elite', 'boss']).optional(),
    }).optional(),
}).superRefine((b, ctx) => {
    // BattleState turn order IDs must exist
    const teamIds = b.playerTeam.units.map(u => u.id);
    const enemyIds = b.enemies.map(u => u.id);
    const known = new Set([...teamIds, ...enemyIds]);
    for (const [i, id] of b.turnOrder.entries()) {
        if (!known.has(id)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['turnOrder', i],
                message: `Unknown actor id: ${id}`,
            });
        }
    }
    const teamSize = b.playerTeam.units.length;
    // Validate currentQueueIndex doesn't exceed team size
    if (b.currentQueueIndex >= teamSize) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.too_big,
            maximum: teamSize - 1,
            type: 'number',
            inclusive: true,
            path: ['currentQueueIndex'],
            message: `currentQueueIndex (${b.currentQueueIndex}) exceeds team size (${teamSize})`,
        });
    }
    // Validate queuedActions length matches team size
    if (b.queuedActions.length !== teamSize) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['queuedActions'],
            message: `queuedActions length (${b.queuedActions.length}) must match team size (${teamSize})`,
        });
    }
    // Validate queued actions reference valid unit IDs
    for (const [i, action] of b.queuedActions.entries()) {
        if (action && !teamIds.includes(action.unitId)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['queuedActions', i, 'unitId'],
                message: `Queued action references unknown unit: ${action.unitId}`,
            });
        }
        // Validate queuedActions reference valid unit indices
        if (action && i >= teamSize) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['queuedActions', i],
                message: `Queued action at index ${i} exceeds team size (${teamSize})`,
            });
        }
    }
    // Validate remainingMana doesn't exceed maxMana
    if (b.remainingMana > b.maxMana) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['remainingMana'],
            message: `remainingMana (${b.remainingMana}) exceeds maxMana (${b.maxMana})`,
        });
    }
});
