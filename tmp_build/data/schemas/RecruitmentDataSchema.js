"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncounterToRecruitmentDialogueSchema = void 0;
const zod_1 = require("zod");
/**
 * Recruitment Data Schema
 * Validates encounter to recruitment dialogue mappings
 */
// Schema for encounter ID to recruitment dialogue ID mapping
exports.EncounterToRecruitmentDialogueSchema = zod_1.z.record(zod_1.z.string().min(1).regex(/^[a-z0-9-]+$/, 'Encounter ID must be kebab-case'), zod_1.z.string().min(1).regex(/^[a-z0-9-]+$/, 'Dialogue ID must be kebab-case'));
