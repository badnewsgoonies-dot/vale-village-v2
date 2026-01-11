"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueTreeSchema = exports.DialogueNodeSchema = exports.DialogueChoiceSchema = exports.DialogueEffectsSchema = exports.DialogueConditionSchema = void 0;
const zod_1 = require("zod");
exports.DialogueConditionSchema = zod_1.z.object({
    type: zod_1.z.enum(['flag', 'item', 'level', 'gold']),
    key: zod_1.z.string(),
    operator: zod_1.z.enum(['equals', 'greaterThan', 'lessThan']).optional(),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()]),
});
// Typed dialogue effects
// - Known keys are explicitly modeled (startBattle, recruitUnit, grantDjinn, etc.)
// - Additional boolean keys are allowed for story flags (e.g. first_djinn_intro_completed)
exports.DialogueEffectsSchema = zod_1.z
    .object({
    startBattle: zod_1.z.string().optional(),
    recruitUnit: zod_1.z.string().optional(),
    grantDjinn: zod_1.z.string().optional(),
    questAccepted: zod_1.z.boolean().optional(),
    openShop: zod_1.z.boolean().optional(),
})
    .passthrough();
exports.DialogueChoiceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    text: zod_1.z.string(),
    nextNodeId: zod_1.z.string(),
    condition: exports.DialogueConditionSchema.optional(),
    effects: exports.DialogueEffectsSchema.optional(),
});
exports.DialogueNodeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    speaker: zod_1.z.string().optional(),
    text: zod_1.z.string(),
    portrait: zod_1.z.string().optional(),
    choices: zod_1.z.array(exports.DialogueChoiceSchema).optional(),
    nextNodeId: zod_1.z.string().optional(),
    condition: exports.DialogueConditionSchema.optional(),
    effects: exports.DialogueEffectsSchema.optional(),
});
exports.DialogueTreeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    startNodeId: zod_1.z.string(),
    nodes: zod_1.z.array(exports.DialogueNodeSchema),
});
