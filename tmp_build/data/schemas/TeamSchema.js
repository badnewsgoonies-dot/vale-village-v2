"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSchema = exports.DjinnTrackerSchema = void 0;
const zod_1 = require("zod");
const UnitSchema_1 = require("./UnitSchema");
const constants_1 = require("../../core/constants");
/**
 * Zod schema for DjinnTracker
 */
exports.DjinnTrackerSchema = zod_1.z.object({
    djinnId: zod_1.z.string().min(1),
    state: UnitSchema_1.DjinnStateSchema,
    lastActivatedTurn: zod_1.z.number().int().min(0),
});
/**
 * Zod schema for Team
 */
exports.TeamSchema = zod_1.z.object({
    equippedDjinn: zod_1.z.array(zod_1.z.string().min(1)).max(3), // Up to 3 Djinn slots (can be empty initially)
    djinnTrackers: zod_1.z.record(zod_1.z.string(), exports.DjinnTrackerSchema),
    units: zod_1.z.array(UnitSchema_1.UnitSchema).min(constants_1.MIN_PARTY_SIZE).max(constants_1.MAX_PARTY_SIZE), // 1-4 units
    collectedDjinn: zod_1.z.array(zod_1.z.string().min(1)).max(12), // Up to 12 Djinn
    currentTurn: zod_1.z.number().int().min(0),
    activationsThisTurn: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0)),
    djinnStates: zod_1.z.record(zod_1.z.string(), UnitSchema_1.DjinnStateSchema),
}).superRefine((t, ctx) => {
    // Team djinn sanity check
    if (t.equippedDjinn.length > 3) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.too_big,
            maximum: 3,
            type: 'array',
            inclusive: true,
            path: ['equippedDjinn'],
        });
    }
});
