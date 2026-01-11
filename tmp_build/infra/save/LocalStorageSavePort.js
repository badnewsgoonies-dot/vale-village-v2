"use strict";
/**
 * LocalStorage Save Port Implementation
 * Simple browser-based save/load
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocalStorageSavePort = createLocalStorageSavePort;
exports.createLocalStorageReplayPort = createLocalStorageReplayPort;
const zod_1 = require("zod");
/**
 * Zod schema for SaveEnvelope validation
 * Ensures data integrity when reading from localStorage
 */
const SaveVersionSchema = zod_1.z.object({
    major: zod_1.z.number().int().min(0),
    minor: zod_1.z.number().int().min(0),
});
const SaveEnvelopeSchema = zod_1.z.object({
    version: SaveVersionSchema,
    seed: zod_1.z.number().int(),
    timestamp: zod_1.z.number().int().positive(),
    state: zod_1.z.any(), // GameStateSnapshot - validated elsewhere
    notes: zod_1.z.string().optional(),
});
/**
 * Create a LocalStorage-based save port
 */
function createLocalStorageSavePort(key = 'vale:save') {
    return {
        async read() {
            try {
                const raw = localStorage.getItem(key);
                if (!raw)
                    return null;
                // Parse JSON
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                }
                catch (parseError) {
                    console.error('Failed to parse save JSON:', parseError);
                    return null;
                }
                // Validate with Zod
                const result = SaveEnvelopeSchema.safeParse(parsed);
                if (!result.success) {
                    console.error('Invalid save envelope:', result.error);
                    return null;
                }
                // Safe cast - schema validates structure matches SaveEnvelope
                return result.data;
            }
            catch (error) {
                console.error('Failed to read save:', error);
                return null;
            }
        },
        async write(data) {
            try {
                const serialized = JSON.stringify(data);
                localStorage.setItem(key, serialized);
            }
            catch (error) {
                console.error('Failed to write save:', error);
                throw new Error('Save failed: ' + (error instanceof Error ? error.message : String(error)));
            }
        },
        async delete() {
            try {
                localStorage.removeItem(key);
            }
            catch (error) {
                console.error('Failed to delete save:', error);
                throw new Error('Delete failed: ' + (error instanceof Error ? error.message : String(error)));
            }
        },
    };
}
/**
 * Create a LocalStorage-based replay port (separate key)
 */
function createLocalStorageReplayPort(key = 'vale:replay') {
    return createLocalStorageSavePort(key);
}
