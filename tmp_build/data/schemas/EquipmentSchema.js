"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentLoadoutSchema = exports.EquipmentSchema = exports.EquipmentTierSchema = exports.EquipmentSlotSchema = exports.EquipmentStatBonusSchema = void 0;
const zod_1 = require("zod");
const ContentAvailabilitySchema_1 = require("./ContentAvailabilitySchema");
/**
 * Element type for equipment restrictions
 * Defined here to avoid circular dependency with UnitSchema
 */
const ElementSchema = zod_1.z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral']);
/**
 * Stat bonus schema for equipment (allows negative values for penalties)
 * Unlike StatsSchema, this allows negative values since equipment can have penalties
 */
exports.EquipmentStatBonusSchema = zod_1.z.object({
    hp: zod_1.z.number().int(),
    pp: zod_1.z.number().int(),
    atk: zod_1.z.number().int(),
    def: zod_1.z.number().int(),
    mag: zod_1.z.number().int(),
    spd: zod_1.z.number().int(),
}).partial();
/**
 * Zod schema for EquipmentSlot
 */
exports.EquipmentSlotSchema = zod_1.z.enum(['weapon', 'armor', 'helm', 'boots', 'accessory']);
/**
 * Zod schema for EquipmentTier
 */
exports.EquipmentTierSchema = zod_1.z.enum([
    'basic',
    'bronze',
    'iron',
    'steel',
    'silver',
    'mythril',
    'legendary',
    'artifact',
]);
/**
 * Zod schema for Equipment validation
 * CHANGED: allowedUnits → allowedElements for element-based equipment restrictions
 */
exports.EquipmentSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    slot: exports.EquipmentSlotSchema,
    tier: exports.EquipmentTierSchema,
    cost: zod_1.z.number().int().min(0),
    statBonus: exports.EquipmentStatBonusSchema.default({}), // Default to empty object if missing
    allowedElements: zod_1.z.array(ElementSchema).min(1).readonly(), // CHANGED: Make readonly for compatibility with Equipment type
    unlocksAbility: zod_1.z.string().optional(),
    equipmentUnlocksPermanent: zod_1.z.boolean().optional(),
    alwaysFirstTurn: zod_1.z.boolean().optional(),
    availableIn: ContentAvailabilitySchema_1.ContentAvailabilitySchema.optional().readonly(),
});
/**
 * Zod schema for EquipmentLoadout
 */
exports.EquipmentLoadoutSchema = zod_1.z.object({
    weapon: exports.EquipmentSchema.nullable(),
    armor: exports.EquipmentSchema.nullable(),
    helm: exports.EquipmentSchema.nullable(),
    boots: exports.EquipmentSchema.nullable(),
    accessory: exports.EquipmentSchema.nullable(),
});
