"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryFlagToDjinnSchema = exports.StoryFlagToUnitSchema = void 0;
const zod_1 = require("zod");
/**
 * Story Flags Schema
 * Validates story flag mappings to units and Djinn
 */
// Schema for story flag to unit mapping
exports.StoryFlagToUnitSchema = zod_1.z.record(zod_1.z.string().min(1), zod_1.z.string().min(1).regex(/^[a-z-]+$/, 'Unit ID must be kebab-case'));
// Schema for story flag to Djinn mapping
exports.StoryFlagToDjinnSchema = zod_1.z.record(zod_1.z.string().min(1), zod_1.z.string().min(1).regex(/^[a-z-]+$/, 'Djinn ID must be kebab-case'));
