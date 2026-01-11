"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterSchema = exports.EncounterRewardsSchema = exports.EquipmentRewardSchema = exports.EncounterRulesSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Encounter rules
 * Encounters can have special rules like phase changes, etc.
 */
exports.EncounterRulesSchema = zod_1.z.object({
    phaseChange: zod_1.z
        .object({
        hpPct: zod_1.z.number().min(0).max(1), // HP percentage threshold (0.0 to 1.0)
        addAbility: zod_1.z.string().min(1), // Ability ID to add at phase change
    })
        .optional(),
});
const equipmentOptionsUnique = (options) => new Set(options).size === options.length;
exports.EquipmentRewardSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal('none'),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('fixed'),
        itemId: zod_1.z.string().min(1),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('choice'),
        options: zod_1.z
            .array(zod_1.z.string().min(1))
            .min(2)
            .max(4)
            .refine(equipmentOptionsUnique, {
            message: 'Choice options must be unique',
        }),
    }),
]);
exports.EncounterRewardsSchema = zod_1.z.object({
    xp: zod_1.z.number().int().min(0),
    gold: zod_1.z.number().int().min(0),
    equipment: exports.EquipmentRewardSchema,
    djinn: zod_1.z.string().min(1).optional(), // Djinn ID to award
    unlockUnit: zod_1.z.string().min(1).optional(),
    unlockAbility: zod_1.z.string().min(1).optional(), // Future: apply unlocks in RewardsService/Store
});
exports.EncounterSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    enemies: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    difficulty: zod_1.z.enum(['easy', 'medium', 'hard', 'boss']).optional(),
    rules: exports.EncounterRulesSchema.optional(),
    reward: exports.EncounterRewardsSchema,
    /** NPC sprite ID to use for the first enemy (leader) in battle */
    leaderSpriteId: zod_1.z.string().min(1).optional(),
    /** Background ID for battle scene (e.g., 'gs1/Vale', 'gs2/Mars_Lighthouse') */
    backgroundId: zod_1.z.string().min(1).optional(),
});
