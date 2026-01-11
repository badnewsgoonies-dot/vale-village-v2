"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemySchema = exports.PhaseConfigSchema = exports.EquipmentDropSchema = void 0;
const zod_1 = require("zod");
const StatsSchema_1 = require("./StatsSchema");
const UnitSchema_1 = require("./UnitSchema");
const AbilitySchema_1 = require("./AbilitySchema");
const EquipmentSchema_1 = require("./EquipmentSchema");
/**
 * Zod schema for Equipment drop
 */
exports.EquipmentDropSchema = zod_1.z.object({
    equipment: EquipmentSchema_1.EquipmentSchema,
    chance: zod_1.z.number().min(0).max(1), // 0.0 to 1.0 (0% to 100%)
});
/**
 * Phase configuration for bosses with HP-triggered behavior changes
 * Example: Phoenix enters "rebirth mode" at 50% HP, prioritizing healing
 */
exports.PhaseConfigSchema = zod_1.z.object({
    // HP threshold (0.0-1.0) below which this phase activates
    threshold: zod_1.z.number().min(0).max(1),
    // Ability IDs that become prioritized in this phase (subset of main abilities)
    priorityAbilities: zod_1.z.array(zod_1.z.string()).min(1),
    // Optional stat multiplier applied during this phase
    statMultiplier: zod_1.z.object({
        atk: zod_1.z.number().optional(),
        def: zod_1.z.number().optional(),
        mag: zod_1.z.number().optional(),
        spd: zod_1.z.number().optional(),
    }).optional(),
});
/**
 * Zod schema for Enemy
 * Enemies are similar to Units but simpler:
 * - No equipment or Djinn
 * - Fixed stats (no growth rates)
 * - Reward data for XP and Gold
 * - Optional equipment drops with chances
 * - Optional phase configuration for bosses with HP-triggered behavior
 */
exports.EnemySchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    level: zod_1.z.number().int().min(1).max(20), // Levels 1-20
    stats: StatsSchema_1.StatsSchema,
    abilities: zod_1.z.array(AbilitySchema_1.AbilitySchema).min(1), // At least 1 ability
    element: UnitSchema_1.ElementSchema,
    baseXp: zod_1.z.number().int().min(0),
    baseGold: zod_1.z.number().int().min(0),
    drops: zod_1.z.array(exports.EquipmentDropSchema).optional(),
    // Phase configuration for bosses - sorted by threshold ascending
    phases: zod_1.z.array(exports.PhaseConfigSchema).optional(),
});
