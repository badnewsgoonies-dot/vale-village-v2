"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayTapeSchema = exports.SaveEnvelopeSchema = exports.SaveVersionSchema = void 0;
const zod_1 = require("zod");
const BattleStateSchema_1 = require("./BattleStateSchema");
const TeamSchema_1 = require("./TeamSchema");
/**
 * Save Version Schema
 */
exports.SaveVersionSchema = zod_1.z.object({
    major: zod_1.z.number().int().min(0),
    minor: zod_1.z.number().int().min(0),
});
/**
 * Story State Schema
 * Matches StoryState interface from core/models/story.ts
 */
const StoryStateSchema = zod_1.z.object({
    chapter: zod_1.z.number().int().min(1),
    flags: zod_1.z.record(zod_1.z.string(), zod_1.z.union([zod_1.z.boolean(), zod_1.z.number()])),
});
/**
 * Game State Snapshot Schema
 */
const GameStateSnapshotSchema = zod_1.z.object({
    battle: BattleStateSchema_1.BattleStateSchema.nullable(),
    team: TeamSchema_1.TeamSchema,
    story: StoryStateSchema,
    gold: zod_1.z.number().int().min(0),
    unitsCollected: zod_1.z.array(zod_1.z.string()),
});
/**
 * Save Envelope Schema
 */
exports.SaveEnvelopeSchema = zod_1.z.object({
    version: exports.SaveVersionSchema,
    seed: zod_1.z.number().int(),
    timestamp: zod_1.z.number().int().positive(),
    state: GameStateSnapshotSchema,
    notes: zod_1.z.string().optional(),
});
/**
 * Player Command Schema
 */
const PlayerCommandSchema = zod_1.z.object({
    type: zod_1.z.enum(['ability', 'end-turn', 'flee']),
    turn: zod_1.z.number().int().min(0),
    actorId: zod_1.z.string().min(1),
    abilityId: zod_1.z.string().optional(),
    targetIds: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * System Tick Schema
 */
const SystemTickSchema = zod_1.z.object({
    type: zod_1.z.enum(['status-tick', 'ai-action']),
    turn: zod_1.z.number().int().min(0),
    actorId: zod_1.z.string().min(1),
    abilityId: zod_1.z.string().optional(),
    targetIds: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Replay Tape Schema
 */
exports.ReplayTapeSchema = zod_1.z.object({
    seed: zod_1.z.number().int(),
    initial: GameStateSnapshotSchema,
    inputs: zod_1.z.array(zod_1.z.union([PlayerCommandSchema, SystemTickSchema])),
    engineVersion: exports.SaveVersionSchema,
    dataVersion: exports.SaveVersionSchema,
});
