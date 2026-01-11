"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilitySchema = exports.abilityIdRegex = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Ability validation
 * Single source of truth for ability data structure
 */
/**
 * Regex pattern for kebab-case ability IDs
 * Enforces: lowercase alphanumerics and hyphens only
 */
exports.abilityIdRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
exports.AbilitySchema = zod_1.z.object({
    id: zod_1.z.string().regex(exports.abilityIdRegex, {
        message: "Ability ID must be kebab-case (lowercase alphanumerics and hyphens only)",
    }),
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(['physical', 'psynergy', 'healing', 'buff', 'debuff', 'summon']),
    element: zod_1.z.enum(['Venus', 'Mars', 'Jupiter', 'Mercury', 'Neutral']).optional(),
    manaCost: zod_1.z.number().int().min(0).max(5), // Cannot be negative! Max 5 for mana pool system
    basePower: zod_1.z.number().int().min(0), // Cannot be negative!
    targets: zod_1.z.enum(['single-enemy', 'all-enemies', 'single-ally', 'all-allies', 'self']),
    unlockLevel: zod_1.z.number().int().min(1).max(20),
    kind: zod_1.z.enum(['attack', 'psynergy']).optional(),
    description: zod_1.z.string(),
    // Optional properties
    chainDamage: zod_1.z.boolean().optional(),
    revivesFallen: zod_1.z.boolean().optional(),
    buffEffect: zod_1.z.object({
        atk: zod_1.z.number().optional(),
        def: zod_1.z.number().optional(),
        mag: zod_1.z.number().optional(),
        spd: zod_1.z.number().optional(),
        hp: zod_1.z.number().optional(), // Max HP increase
    }).optional(),
    duration: zod_1.z.number().int().min(1).optional(),
    // Status effect applied on hit (for physical/psynergy abilities)
    statusEffect: zod_1.z.object({
        type: zod_1.z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun']),
        duration: zod_1.z.number().int().min(1),
        chance: zod_1.z.number().min(0).max(1).optional(), // Probability of applying (0-1), defaults to 1.0
    }).optional(),
    // Debuff effects (stat reductions applied to targets)
    debuffEffect: zod_1.z.object({
        atk: zod_1.z.number().optional(),
        def: zod_1.z.number().optional(),
        mag: zod_1.z.number().optional(),
        spd: zod_1.z.number().optional(),
        hp: zod_1.z.number().optional(), // Max HP reduction
    }).optional(),
    // Heal over time effect
    healOverTime: zod_1.z.object({
        amount: zod_1.z.number().int().min(1), // HP restored per turn
        duration: zod_1.z.number().int().min(1), // Number of turns
    }).optional(),
    // Multi-hit attacks
    hitCount: zod_1.z.number().int().min(1).max(10).optional(), // Number of hits (2-4 typical)
    // Revive mechanics
    revive: zod_1.z.boolean().optional(), // Can revive KO'd units
    reviveHPPercent: zod_1.z.number().min(0).max(1).optional(), // HP% restored when reviving (0-1)
    // Phase 2: Advanced offense mechanics
    ignoreDefensePercent: zod_1.z.number().min(0).max(1).optional(), // % of target DEF to ignore (default 0)
    splashDamagePercent: zod_1.z.number().min(0).max(1).optional(), // % damage dealt to non-primary targets (default 0)
    // Phase 2: Shield granting
    shieldCharges: zod_1.z.number().int().min(1).max(99).optional(), // Number of hit charges granted when cast
    // Phase 2: Status cleanse
    removeStatusEffects: zod_1.z.union([
        zod_1.z.object({ type: zod_1.z.literal('all') }),
        zod_1.z.object({ type: zod_1.z.literal('negative') }),
        zod_1.z.object({
            type: zod_1.z.literal('byType'),
            statuses: zod_1.z.array(zod_1.z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'])),
        }),
    ]).optional(),
    // Phase 2: Damage reduction granting
    damageReductionPercent: zod_1.z.number().min(0).max(1).optional(), // % damage reduction granted to target(s)
    // Phase 2: Immunity granting
    grantImmunity: zod_1.z.object({
        all: zod_1.z.boolean(), // If true, immune to all negative statuses
        types: zod_1.z.array(zod_1.z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun', 'debuff'])).optional(), // Specific immunities
        duration: zod_1.z.number().int().min(1), // Duration in turns
    }).optional(),
    // AI hints (optional metadata for AI decision-making)
    aiHints: zod_1.z.object({
        priority: zod_1.z.number().min(0).max(3).optional(),
        target: zod_1.z.enum(['weakest', 'random', 'lowestRes', 'healerFirst', 'highestDef']).optional(),
        avoidOverkill: zod_1.z.boolean().optional(),
        opener: zod_1.z.boolean().optional(),
    }).optional(),
});
