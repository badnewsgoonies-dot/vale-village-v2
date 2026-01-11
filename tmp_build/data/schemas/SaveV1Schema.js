"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveV1Schema = void 0;
const zod_1 = require("zod");
const UnitSchema_1 = require("./UnitSchema");
const EquipmentSchema_1 = require("./EquipmentSchema");
const constants_1 = require("../../core/constants");
/**
 * Djinn Tracker schema for team-wide Djinn state
 */
const DjinnTrackerSchema = zod_1.z.object({
    djinnId: zod_1.z.string().min(1),
    state: UnitSchema_1.DjinnStateSchema,
    lastActivatedTurn: zod_1.z.number().int(),
});
/**
 * NPC State schema
 * Defines valid states for NPCs in the overworld
 */
const NPCStateSchema = zod_1.z.object({
    defeated: zod_1.z.boolean().optional(),
    dialogueSeen: zod_1.z.boolean().optional(),
    questProgress: zod_1.z.number().int().min(0).optional(),
    lastInteraction: zod_1.z.number().int().optional(),
    customData: zod_1.z.record(zod_1.z.string(), zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()])).optional(),
});
const TowerRecordSchema = zod_1.z.object({
    highestFloorEver: zod_1.z.number().int().min(0).default(0),
    totalRuns: zod_1.z.number().int().min(0).default(0),
    bestRunTurns: zod_1.z.number().int().min(0).nullable().default(null),
    bestRunDamageDealt: zod_1.z.number().int().min(0).nullable().default(null),
});
/**
 * Save file version 1 schema
 * This is the initial save format for the v2 app
 */
exports.SaveV1Schema = zod_1.z.object({
    version: zod_1.z.literal('1.0.0'),
    timestamp: zod_1.z.number().int().positive(),
    chapter: zod_1.z.number().int().min(1).default(1), // Story chapter (defaults to 1 for backward compatibility)
    // Player progress
    playerData: zod_1.z.object({
        unitsCollected: zod_1.z.array(UnitSchema_1.UnitSchema).max(10), // Up to 10 units
        activeParty: zod_1.z.array(zod_1.z.string().min(1)).min(constants_1.MIN_PARTY_SIZE).max(constants_1.MAX_PARTY_SIZE), // 1-4 unit IDs
        inventory: zod_1.z.array(EquipmentSchema_1.EquipmentSchema), // Equipment inventory
        gold: zod_1.z.number().int().min(0),
        djinnCollected: zod_1.z.array(zod_1.z.string().min(1)).max(12), // Up to 12 Djinn IDs
        equippedDjinn: zod_1.z.array(zod_1.z.string().min(1)).max(3).optional(), // Up to 3 equipped Djinn IDs
        djinnTrackers: zod_1.z.record(zod_1.z.string(), DjinnTrackerSchema).optional(), // Djinn state tracking
        recruitmentFlags: zod_1.z.record(zod_1.z.string(), zod_1.z.boolean()),
        storyFlags: zod_1.z.record(zod_1.z.string(), zod_1.z.boolean()),
    }),
    // Overworld state
    overworldState: zod_1.z.object({
        playerPosition: zod_1.z.object({
            x: zod_1.z.number(),
            y: zod_1.z.number(),
        }),
        currentScene: zod_1.z.string().min(1),
        npcStates: zod_1.z.record(zod_1.z.string(), NPCStateSchema), // Properly typed NPC states
    }),
    // Statistics
    stats: zod_1.z.object({
        battlesWon: zod_1.z.number().int().min(0),
        battlesLost: zod_1.z.number().int().min(0),
        totalDamageDealt: zod_1.z.number().int().min(0),
        totalHealingDone: zod_1.z.number().int().min(0),
        playtime: zod_1.z.number().int().min(0), // Seconds
    }),
    towerStats: TowerRecordSchema.optional(),
});
