"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerFloorSchema = exports.TowerFloorTypeSchema = void 0;
const zod_1 = require("zod");
/**
 * Tower floor types
 */
exports.TowerFloorTypeSchema = zod_1.z.enum(['normal', 'rest', 'boss']);
/**
 * Base metadata shared by every tower floor entry
 */
const TowerFloorBaseSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    floorNumber: zod_1.z.number().int().min(1),
    difficultyTier: zod_1.z.number().int().min(1).optional(),
    normalizedLevel: zod_1.z.number().int().min(1).optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1)).default([]).readonly(),
});
const BattleFloorSchema = TowerFloorBaseSchema.extend({
    type: zod_1.z.union([zod_1.z.literal('normal'), zod_1.z.literal('boss')]),
    encounterId: zod_1.z.string().min(1),
});
const RestFloorSchema = TowerFloorBaseSchema.extend({
    type: zod_1.z.literal('rest'),
    encounterId: zod_1.z.null().optional(),
    rest: zod_1.z
        .object({
        allowLoadoutChange: zod_1.z.boolean().default(true),
        healFractionOverride: zod_1.z.number().min(0).max(1).optional(),
    })
        .default({ allowLoadoutChange: true })
        .readonly(),
});
exports.TowerFloorSchema = zod_1.z.discriminatedUnion('type', [BattleFloorSchema, RestFloorSchema]);
