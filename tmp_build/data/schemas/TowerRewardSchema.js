"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerRewardSchema = exports.TowerRewardEntrySchema = void 0;
const zod_1 = require("zod");
const TowerRewardTypeSchema = zod_1.z.enum(['equipment', 'djinn', 'recruit']);
exports.TowerRewardEntrySchema = zod_1.z.object({
    type: TowerRewardTypeSchema,
    ids: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    notes: zod_1.z.string().optional(),
});
exports.TowerRewardSchema = zod_1.z.object({
    floorNumber: zod_1.z.number().int().min(1),
    rewards: zod_1.z.array(exports.TowerRewardEntrySchema).min(1),
});
