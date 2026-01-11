"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapSchema = exports.MapTriggerSchema = exports.NPCSchema = exports.TileSchema = exports.PositionSchema = void 0;
const zod_1 = require("zod");
exports.PositionSchema = zod_1.z.object({
    x: zod_1.z.number().int().nonnegative(),
    y: zod_1.z.number().int().nonnegative(),
});
exports.TileSchema = zod_1.z.object({
    type: zod_1.z.enum(['grass', 'path', 'water', 'wall', 'door', 'npc', 'trigger']),
    walkable: zod_1.z.boolean(),
    spriteId: zod_1.z.string().optional(),
    triggerId: zod_1.z.string().optional(),
});
exports.NPCSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    position: exports.PositionSchema,
    spriteId: zod_1.z.string(),
});
exports.MapTriggerSchema = zod_1.z.object({
    id: zod_1.z.string(),
    position: exports.PositionSchema,
    type: zod_1.z.enum(['battle', 'npc', 'transition', 'story', 'shop', 'tower']),
    data: zod_1.z.record(zod_1.z.unknown()),
});
exports.MapSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    width: zod_1.z.number().int().positive(),
    height: zod_1.z.number().int().positive(),
    tiles: zod_1.z.array(zod_1.z.array(exports.TileSchema)).refine((rows) => rows.length > 0, { message: 'Map must have at least one row' }),
    npcs: zod_1.z.array(exports.NPCSchema),
    triggers: zod_1.z.array(exports.MapTriggerSchema),
    spawnPoint: exports.PositionSchema,
    encounterRate: zod_1.z.number().min(0).max(1).optional(), // 0-1 probability per step
    encounterPool: zod_1.z.array(zod_1.z.string()).optional(), // Array of encounter IDs
});
