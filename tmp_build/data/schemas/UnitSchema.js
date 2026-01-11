"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitSchema = exports.UnitDefinitionSchema = exports.StatusEffectSchema = exports.DjinnStateSchema = exports.UnitRoleSchema = exports.ElementSchema = void 0;
const zod_1 = require("zod");
const StatsSchema_1 = require("./StatsSchema");
const EquipmentSchema_1 = require("./EquipmentSchema");
const AbilitySchema_1 = require("./AbilitySchema");
const ContentAvailabilitySchema_1 = require("./ContentAvailabilitySchema");
/**
 * Zod schema for Element
 */
exports.ElementSchema = zod_1.z.enum(['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral']);
/**
 * Zod schema for UnitRole
 */
exports.UnitRoleSchema = zod_1.z.enum([
    'Balanced Warrior',
    'Pure DPS',
    'Elemental Mage',
    'Healer',
    'Rogue Assassin',
    'AoE Fire Mage',
    'Support Buffer',
    'Defensive Tank',
    'Versatile Scholar',
    'Master Warrior',
]);
/**
 * Zod schema for DjinnState
 */
exports.DjinnStateSchema = zod_1.z.enum(['Set', 'Standby', 'Recovery']);
/**
 * Zod schema for StatKey
 */
const StatKeySchema = zod_1.z.enum(['hp', 'pp', 'atk', 'def', 'mag', 'spd']);
/**
 * Zod schema for StatusEffect (discriminated union)
 */
exports.StatusEffectSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal('buff'),
        stat: StatKeySchema,
        modifier: zod_1.z.number().positive(),
        duration: zod_1.z.number().int().positive(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('debuff'),
        stat: StatKeySchema,
        modifier: zod_1.z.number().negative(),
        duration: zod_1.z.number().int().positive(),
    }),
    zod_1.z.object({
        type: zod_1.z.enum(['poison', 'burn']),
        damagePerTurn: zod_1.z.number().int().positive(),
        duration: zod_1.z.number().int().positive(),
    }),
    zod_1.z.object({
        type: zod_1.z.enum(['freeze', 'paralyze', 'stun']),
        duration: zod_1.z.number().int().positive(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('healOverTime'),
        healPerTurn: zod_1.z.number().int().positive(),
        duration: zod_1.z.number().int().positive(),
    }),
    // Phase 2: Global damage reduction
    zod_1.z.object({
        type: zod_1.z.literal('damageReduction'),
        percent: zod_1.z.number().min(0).max(1), // 0-1, e.g. 0.3 = 30% reduction
        duration: zod_1.z.number().int().positive(),
    }),
    // Phase 2: Hit-based shield
    zod_1.z.object({
        type: zod_1.z.literal('shield'),
        remainingCharges: zod_1.z.number().int().min(0), // Consumed per hit
        duration: zod_1.z.number().int().positive(),
    }),
    // Phase 2: Invulnerability (blocks damage only, NOT statuses)
    zod_1.z.object({
        type: zod_1.z.literal('invulnerable'),
        duration: zod_1.z.number().int().positive(),
    }),
    // Phase 2: Status immunity
    zod_1.z.object({
        type: zod_1.z.literal('immunity'),
        all: zod_1.z.boolean(), // If true, immune to all negative statuses
        types: zod_1.z.array(zod_1.z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'])).optional(), // Specific immunities
        duration: zod_1.z.number().int().positive(),
    }),
    // Phase 2: Auto-revive (uses-based, not time-based)
    zod_1.z.object({
        type: zod_1.z.literal('autoRevive'),
        hpPercent: zod_1.z.number().min(0).max(1), // HP% restored when triggered
        usesRemaining: zod_1.z.number().int().min(1), // Usually 1
    }),
]);
/**
 * Zod schema for UnitDefinition
 */
exports.UnitDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    element: exports.ElementSchema,
    role: exports.UnitRoleSchema,
    baseStats: StatsSchema_1.StatsSchema,
    growthRates: StatsSchema_1.StatsSchema,
    abilities: zod_1.z.array(AbilitySchema_1.AbilitySchema),
    manaContribution: zod_1.z.number().int().min(0),
    description: zod_1.z.string(),
    autoAttackTiming: zod_1.z.enum(['same-turn', 'next-turn']).optional(),
    availableIn: ContentAvailabilitySchema_1.ContentAvailabilitySchema.optional().readonly(),
});
/**
 * Zod schema for Unit
 */
exports.UnitSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    element: exports.ElementSchema,
    role: exports.UnitRoleSchema,
    baseStats: StatsSchema_1.StatsSchema,
    growthRates: StatsSchema_1.StatsSchema,
    description: zod_1.z.string(),
    manaContribution: zod_1.z.number().int().min(0),
    level: zod_1.z.number().int().min(1).max(20),
    xp: zod_1.z.number().int().min(0),
    currentHp: zod_1.z.number().int().min(0),
    autoAttackTiming: zod_1.z.enum(['same-turn', 'next-turn']).optional(),
    equipment: EquipmentSchema_1.EquipmentLoadoutSchema,
    storeUnlocked: zod_1.z.boolean(),
    djinn: zod_1.z.array(zod_1.z.string().min(1)),
    djinnStates: zod_1.z.record(zod_1.z.string(), exports.DjinnStateSchema),
    abilities: zod_1.z.array(AbilitySchema_1.AbilitySchema),
    unlockedAbilityIds: zod_1.z.array(zod_1.z.string().min(1)),
    statusEffects: zod_1.z.array(exports.StatusEffectSchema),
    actionsTaken: zod_1.z.number().int().min(0),
    battleStats: zod_1.z.object({
        damageDealt: zod_1.z.number().int().min(0),
        damageTaken: zod_1.z.number().int().min(0),
    }),
}).superRefine((u, ctx) => {
    // Unit HP cannot exceed max HP
    const maxHp = u.baseStats.hp + (u.level - 1) * u.growthRates.hp;
    if (u.currentHp > maxHp) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `currentHp (${u.currentHp}) exceeds maxHp (${maxHp})`,
            path: ['currentHp'],
        });
    }
});
