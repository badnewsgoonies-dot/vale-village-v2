"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DjinnSchema = exports.DjinnGrantedAbilitiesSchema = exports.DjinnSummonEffectSchema = void 0;
const zod_1 = require("zod");
const UnitSchema_1 = require("./UnitSchema");
const ContentAvailabilitySchema_1 = require("./ContentAvailabilitySchema");
exports.DjinnSummonEffectSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal('damage'),
        description: zod_1.z.string(),
        damage: zod_1.z.number().int().min(0),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('heal'),
        description: zod_1.z.string(),
        healAmount: zod_1.z.number().int().min(0),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('buff'),
        description: zod_1.z.string(),
        statBonus: zod_1.z.object({
            atk: zod_1.z.number().optional(),
            def: zod_1.z.number().optional(),
            mag: zod_1.z.number().optional(),
            spd: zod_1.z.number().optional(),
        }),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('special'),
        description: zod_1.z.string(),
    }),
]);
exports.DjinnGrantedAbilitiesSchema = zod_1.z.object({
    same: zod_1.z.array(zod_1.z.string()).min(0).max(6),
    counter: zod_1.z.array(zod_1.z.string()).min(0).max(6),
    neutral: zod_1.z.array(zod_1.z.string()).min(0).max(6),
});
exports.DjinnSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    element: UnitSchema_1.ElementSchema,
    tier: zod_1.z.enum(['1', '2', '3']),
    summonEffect: exports.DjinnSummonEffectSchema,
    grantedAbilities: zod_1.z.record(zod_1.z.string().min(1), exports.DjinnGrantedAbilitiesSchema),
    availableIn: ContentAvailabilitySchema_1.ContentAvailabilitySchema.optional().readonly(),
});
