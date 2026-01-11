"use strict";
/**
 * Save Service
 * High-level save/load operations using SavePort
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSaveEnvelope = createSaveEnvelope;
exports.saveGame = saveGame;
exports.loadGame = loadGame;
exports.saveReplay = saveReplay;
exports.loadReplay = loadReplay;
const migrations_1 = require("./migrations");
const ReplaySchema_1 = require("../../data/schemas/ReplaySchema");
/**
 * Create a save envelope from current game state
 */
function createSaveEnvelope(state, seed, notes) {
    return {
        version: migrations_1.CURRENT_SAVE_VERSION,
        seed,
        timestamp: Date.now(), // Written by adapter
        state,
        notes,
    };
}
/**
 * Save game state
 */
async function saveGame(port, state, seed, notes) {
    try {
        const envelope = createSaveEnvelope(state, seed, notes);
        await port.write(envelope);
        return { ok: true, value: undefined };
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Load game state
 */
async function loadGame(port) {
    try {
        const envelope = await port.read();
        if (!envelope) {
            return { ok: false, error: 'No save data found' };
        }
        // Migrate if needed
        const migrated = (0, migrations_1.migrateSave)(envelope);
        // Validate migrated save envelope
        const validationResult = ReplaySchema_1.SaveEnvelopeSchema.safeParse(migrated);
        if (!validationResult.success) {
            return {
                ok: false,
                error: `Save file validation failed: ${validationResult.error.message}`,
            };
        }
        return { ok: true, value: validationResult.data };
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Save replay tape
 */
async function saveReplay(port, tape) {
    try {
        // Wrap replay tape in save envelope format
        const envelope = {
            version: migrations_1.CURRENT_SAVE_VERSION,
            seed: tape.seed,
            timestamp: Date.now(),
            state: tape.initial, // Store initial state
            notes: `Replay: ${tape.inputs.length} inputs`,
        };
        // Store tape separately (could use a different key or structure)
        // For now, we'll store it as JSON in notes or a separate field
        // In a real implementation, you might want a separate ReplayPort
        await port.write(envelope);
        // Also store tape data in a separate key (hack for now)
        // TODO: Create separate ReplayPort interface
        const tapeJson = JSON.stringify(tape);
        try {
            localStorage.setItem('vale:replay:tape', tapeJson);
        }
        catch (storageError) {
            // Storage quota exceeded or other localStorage error
            // [REMOVED] console.warn('Failed to store replay tape:', storageError);
        }
        return { ok: true, value: undefined };
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Load replay tape
 */
async function loadReplay(_port) {
    void _port;
    try {
        // Load tape from separate storage
        const tapeJson = localStorage.getItem('vale:replay:tape');
        if (!tapeJson) {
            return { ok: false, error: 'No replay data found' };
        }
        const tapeData = JSON.parse(tapeJson);
        // Validate replay tape
        const validationResult = ReplaySchema_1.ReplayTapeSchema.safeParse(tapeData);
        if (!validationResult.success) {
            return {
                ok: false,
                error: `Replay tape validation failed: ${validationResult.error.message}`,
            };
        }
        return { ok: true, value: validationResult.data };
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
