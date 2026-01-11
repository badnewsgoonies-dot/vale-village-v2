"use strict";
/**
 * Save Service (Enhanced)
 * Handles save/load with checksums, backups, and validation
 *
 * Features:
 * - Checksum validation (detect corruption)
 * - Auto-backup on save
 * - Backup restoration on corruption
 * - Battle state save/load
 * - Progress save/load (full game state)
 * - Auto-save functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProgress = saveProgress;
exports.loadProgress = loadProgress;
exports.saveBattle = saveBattle;
exports.loadBattle = loadBattle;
exports.deleteBattleSave = deleteBattleSave;
exports.autoSave = autoSave;
exports.loadAutoSave = loadAutoSave;
exports.hasAutoSave = hasAutoSave;
exports.hasSaveSlot = hasSaveSlot;
exports.deleteSaveSlot = deleteSaveSlot;
exports.getSaveSlotMetadata = getSaveSlotMetadata;
exports.listSaveSlots = listSaveSlots;
exports.saveGame = saveGame;
exports.loadGame = loadGame;
exports.hasSave = hasSave;
exports.deleteSave = deleteSave;
exports.saveGameSlot = saveGameSlot;
exports.loadGameSlot = loadGameSlot;
const result_1 = require("../utils/result");
const SaveV1Schema_1 = require("../../data/schemas/SaveV1Schema");
const BattleStateSchema_1 = require("../../data/schemas/BattleStateSchema");
const BattleState_1 = require("../models/BattleState");
const migrations_1 = require("../migrations");
const saveFileValidation_1 = require("../validation/saveFileValidation");
const SAVE_SLOT_PREFIX = 'vale_chronicles_v2_save_slot_';
const BACKUP_SUFFIX = '_backup';
const BATTLE_SAVE_KEY = 'vale_chronicles_v2_battle';
const AUTO_SAVE_SLOT = 0;
/**
 * Get localStorage key for a specific save slot
 */
function getSaveSlotKey(slot) {
    if (slot < 0 || slot >= 3) {
        throw new Error(`Invalid save slot: ${slot}. Must be 0-2.`);
    }
    return `${SAVE_SLOT_PREFIX}${slot}`;
}
/**
 * Get backup key for a save slot
 */
function getBackupKey(key) {
    return `${key}${BACKUP_SUFFIX}`;
}
/**
 * Create backup of existing save before overwriting
 *
 * @param key - localStorage key for the save file
 * @returns Ok if backup created or no existing save, Err if backup fails
 */
function createBackup(key) {
    try {
        const existing = localStorage.getItem(key);
        if (existing) {
            localStorage.setItem(getBackupKey(key), existing);
        }
        return (0, result_1.Ok)(undefined);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return (0, result_1.Err)(`Failed to create backup: ${message}`);
    }
}
/**
 * Wrap data with checksum for integrity validation
 */
function wrapWithChecksum(data, version) {
    const checksum = (0, saveFileValidation_1.calculateChecksum)(data);
    return {
        version,
        timestamp: Date.now(),
        checksum,
        data,
    };
}
/**
 * Check if migration is supported between versions
 *
 * @param from - Source version
 * @param to - Target version
 * @returns True if migration path exists
 */
function isMigrationSupported(from, to) {
    // Currently only support forward migration within v1.x.x
    const fromParts = from.split('.');
    const toParts = to.split('.');
    // Only support v1.x.x migrations for now
    if (fromParts[0] !== '1' || toParts[0] !== '1') {
        return false;
    }
    // Can migrate from older to newer within same major version
    return true;
}
/**
 * Validate and unwrap save file
 */
function unwrapAndValidate(wrapper, expectedVersion) {
    // Basic structure validation
    if (!wrapper || typeof wrapper !== 'object') {
        return (0, result_1.Err)({
            type: 'INVALID_FORMAT',
            message: 'Save file is not a valid object',
        });
    }
    let file = wrapper;
    // Check required fields
    if (!file.version || !file.timestamp || !file.checksum || !file.data) {
        return (0, result_1.Err)({
            type: 'MISSING_DATA',
            missingFields: [
                !file.version ? 'version' : null,
                !file.timestamp ? 'timestamp' : null,
                !file.checksum ? 'checksum' : null,
                !file.data ? 'data' : null,
            ].filter((f) => f !== null),
        });
    }
    // Version check with migration support
    if (file.version !== expectedVersion) {
        // Check if migration is possible
        const canMigrate = isMigrationSupported(file.version, expectedVersion);
        if (!canMigrate) {
            return (0, result_1.Err)({
                type: 'VERSION_MISMATCH',
                saveVersion: file.version,
                currentVersion: expectedVersion,
                canMigrate: false,
            });
        }
        // Attempt migration
        const migrateResult = (0, migrations_1.migrateSaveData)(file.data);
        if (!migrateResult.ok) {
            return (0, result_1.Err)({
                type: 'VERSION_MISMATCH',
                saveVersion: file.version,
                currentVersion: expectedVersion,
                canMigrate: true,
            });
        }
        // Create new file object with migrated data
        const migratedFile = {
            ...file,
            version: expectedVersion,
            data: migrateResult.value,
            checksum: (0, saveFileValidation_1.calculateChecksum)(migrateResult.value), // Recalculate checksum after migration
        };
        // Continue with migrated file
        file = migratedFile;
    }
    // Checksum verification
    if (!(0, saveFileValidation_1.verifyChecksum)(file.data, file.checksum)) {
        return (0, result_1.Err)({
            type: 'CHECKSUM_FAILED',
            expected: file.checksum,
            actual: (0, saveFileValidation_1.calculateChecksum)(file.data),
        });
    }
    return (0, result_1.Ok)(file.data);
}
// ============================================================================
// Progress Save/Load (Full Game State)
// ============================================================================
/**
 * Save full game progress to slot with checksum and backup
 */
function saveProgress(slot, data) {
    try {
        if (slot < 0 || slot >= 3) {
            return (0, result_1.Err)(`Invalid save slot: ${slot}. Must be 0-2.`);
        }
        // Validate data matches SaveV1 schema
        const validationResult = SaveV1Schema_1.SaveV1Schema.safeParse(data);
        if (!validationResult.success) {
            return (0, result_1.Err)(`Invalid save data: ${validationResult.error.message}`);
        }
        const key = getSaveSlotKey(slot);
        // Create backup of existing save (mandatory for data safety)
        const backupResult = createBackup(key);
        if (!backupResult.ok) {
            return backupResult; // Forward the error
        }
        // Wrap with checksum
        const wrapped = wrapWithChecksum(validationResult.data, '1.0.0');
        const serialized = JSON.stringify(wrapped);
        // Save to localStorage
        localStorage.setItem(key, serialized);
        return (0, result_1.Ok)(undefined);
    }
    catch (error) {
        return (0, result_1.Err)(`Failed to save progress: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Load game progress from slot with validation and backup fallback
 */
function loadProgress(slot) {
    try {
        if (slot < 0 || slot >= 3) {
            return (0, result_1.Err)(`Invalid save slot: ${slot}. Must be 0-2.`);
        }
        const key = getSaveSlotKey(slot);
        const serialized = localStorage.getItem(key);
        if (!serialized) {
            return (0, result_1.Err)('No save file found in this slot');
        }
        // Parse JSON
        let wrapper;
        try {
            wrapper = JSON.parse(serialized);
        }
        catch (parseError) {
            // Try backup with error context
            const errorMsg = parseError instanceof Error ? parseError.message : 'Invalid JSON';
            return loadProgressFromBackup(slot, `JSON parse failed: ${errorMsg}`);
        }
        // Validate and unwrap
        const unwrapResult = unwrapAndValidate(wrapper, '1.0.0');
        if (!unwrapResult.ok) {
            // Try backup with error context
            const errorMsg = unwrapResult.error.type;
            return loadProgressFromBackup(slot, `Validation failed: ${errorMsg}`);
        }
        // Final schema validation
        const schemaResult = SaveV1Schema_1.SaveV1Schema.safeParse(unwrapResult.value);
        if (!schemaResult.success) {
            return (0, result_1.Err)(`Save file validation failed: ${schemaResult.error.message}`);
        }
        return (0, result_1.Ok)(schemaResult.data);
    }
    catch (error) {
        return (0, result_1.Err)(`Failed to load progress: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Load progress from backup (fallback)
 *
 * @param slot - Save slot number
 * @param mainError - Error from main save (for debugging context)
 */
function loadProgressFromBackup(slot, mainError) {
    try {
        const key = getSaveSlotKey(slot);
        const backupKey = getBackupKey(key);
        const serialized = localStorage.getItem(backupKey);
        if (!serialized) {
            const context = mainError ? ` Main save error: ${mainError}` : '';
            return (0, result_1.Err)(`Save file corrupted and no backup found.${context}`);
        }
        const wrapper = JSON.parse(serialized);
        const unwrapResult = unwrapAndValidate(wrapper, '1.0.0');
        if (!unwrapResult.ok) {
            const context = mainError ? ` Main save error: ${mainError}` : '';
            return (0, result_1.Err)(`Both main save and backup are corrupted.${context}`);
        }
        const schemaResult = SaveV1Schema_1.SaveV1Schema.safeParse(unwrapResult.value);
        if (!schemaResult.success) {
            const context = mainError ? ` Main save error: ${mainError}` : '';
            return (0, result_1.Err)(`Backup validation failed.${context}`);
        }
        // Restore backup to main slot
        localStorage.setItem(key, serialized);
        return (0, result_1.Ok)(schemaResult.data);
    }
    catch (error) {
        const context = mainError ? ` Main save error: ${mainError}` : '';
        return (0, result_1.Err)(`Failed to load backup: ${error instanceof Error ? error.message : String(error)}.${context}`);
    }
}
// ============================================================================
// Battle State Save/Load (Quick Save)
// ============================================================================
/**
 * Save battle state (quick save during battle)
 */
function saveBattle(state) {
    try {
        // Validate battle state
        const validationResult = BattleStateSchema_1.BattleStateSchema.safeParse(state);
        if (!validationResult.success) {
            return (0, result_1.Err)(`Invalid battle state: ${validationResult.error.message}`);
        }
        // Create backup (mandatory for data safety)
        const backupResult = createBackup(BATTLE_SAVE_KEY);
        if (!backupResult.ok) {
            return backupResult; // Forward the error
        }
        // Wrap with checksum
        const wrapped = wrapWithChecksum(validationResult.data, '1.0.0');
        const serialized = JSON.stringify(wrapped);
        localStorage.setItem(BATTLE_SAVE_KEY, serialized);
        return (0, result_1.Ok)(undefined);
    }
    catch (error) {
        return (0, result_1.Err)(`Failed to save battle: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Load battle state with validation
 */
function loadBattle() {
    try {
        const serialized = localStorage.getItem(BATTLE_SAVE_KEY);
        if (!serialized) {
            return (0, result_1.Err)('No battle save found');
        }
        // Parse JSON
        let wrapper;
        try {
            wrapper = JSON.parse(serialized);
        }
        catch {
            return (0, result_1.Err)('Battle save corrupted (invalid JSON)');
        }
        // Validate and unwrap (loads BattleStateSerializable without unitById)
        const unwrapResult = unwrapAndValidate(wrapper, '1.0.0');
        if (!unwrapResult.ok) {
            return (0, result_1.Err)('Battle save validation failed');
        }
        // Final schema validation
        const schemaResult = BattleStateSchema_1.BattleStateSchema.safeParse(unwrapResult.value);
        if (!schemaResult.success) {
            return (0, result_1.Err)(`Battle state validation failed: ${schemaResult.error.message}`);
        }
        const serializable = schemaResult.data;
        // Rebuild unitById index from player and enemy units
        const unitById = (0, BattleState_1.buildUnitIndex)(serializable.playerTeam?.units ?? [], serializable.enemies ?? []);
        // Reconstruct full BattleState with unitById
        const battleState = {
            ...serializable,
            unitById,
        };
        return (0, result_1.Ok)(battleState);
    }
    catch (error) {
        return (0, result_1.Err)(`Failed to load battle: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Delete battle save
 */
function deleteBattleSave() {
    try {
        localStorage.removeItem(BATTLE_SAVE_KEY);
        localStorage.removeItem(getBackupKey(BATTLE_SAVE_KEY));
        return (0, result_1.Ok)(undefined);
    }
    catch (error) {
        return (0, result_1.Err)(`Failed to delete battle save: ${error instanceof Error ? error.message : String(error)}`);
    }
}
// ============================================================================
// Auto-Save
// ============================================================================
/**
 * Auto-save to slot 0
 */
function autoSave(data) {
    return saveProgress(AUTO_SAVE_SLOT, data);
}
/**
 * Load auto-save from slot 0
 */
function loadAutoSave() {
    return loadProgress(AUTO_SAVE_SLOT);
}
/**
 * Check if auto-save exists
 */
function hasAutoSave() {
    return hasSaveSlot(AUTO_SAVE_SLOT);
}
// ============================================================================
// Slot Management
// ============================================================================
/**
 * Check if save file exists in a specific slot
 */
function hasSaveSlot(slot) {
    if (slot < 0 || slot >= 3) {
        return false;
    }
    return localStorage.getItem(getSaveSlotKey(slot)) !== null;
}
/**
 * Delete save file from a specific slot
 */
function deleteSaveSlot(slot) {
    try {
        if (slot < 0 || slot >= 3) {
            return (0, result_1.Err)(`Invalid save slot: ${slot}. Must be 0-2.`);
        }
        const key = getSaveSlotKey(slot);
        localStorage.removeItem(key);
        localStorage.removeItem(getBackupKey(key));
        return (0, result_1.Ok)(undefined);
    }
    catch (error) {
        return (0, result_1.Err)(`Failed to delete save: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Get metadata for a save slot (without loading full save)
 */
function getSaveSlotMetadata(slot) {
    if (slot < 0 || slot >= 3) {
        return { exists: false };
    }
    const serialized = localStorage.getItem(getSaveSlotKey(slot));
    if (!serialized) {
        return { exists: false };
    }
    try {
        const wrapper = JSON.parse(serialized);
        // Quick validation
        if (!wrapper.data || !wrapper.checksum) {
            return { exists: true, corrupted: true };
        }
        const data = wrapper.data;
        // Defensive checks for corrupted metadata
        if (!data.playerData || !data.stats || !Array.isArray(data.playerData.unitsCollected)) {
            return { exists: true, corrupted: true };
        }
        // Calculate average level with defensive checks
        const avgLevel = data.playerData.unitsCollected.length > 0
            ? Math.round(data.playerData.unitsCollected.reduce((sum, u) => {
                const level = typeof u?.level === 'number' ? u.level : 1;
                return sum + level;
            }, 0) / data.playerData.unitsCollected.length)
            : 1;
        return {
            exists: true,
            timestamp: typeof wrapper.timestamp === 'number' ? wrapper.timestamp : Date.now(),
            playtime: typeof data.stats.playtime === 'number' ? data.stats.playtime : 0,
            teamLevel: avgLevel,
            gold: typeof data.playerData.gold === 'number' ? data.playerData.gold : 0,
            chapter: 1, // TODO: Add chapter to SaveV1Schema
            corrupted: false,
        };
    }
    catch {
        return { exists: true, corrupted: true };
    }
}
/**
 * Get metadata for all save slots
 */
function listSaveSlots() {
    return [0, 1, 2].map(slot => getSaveSlotMetadata(slot));
}
// ============================================================================
// Legacy Compatibility (keep existing functions working)
// ============================================================================
/**
 * @deprecated Use saveProgress(0, data) instead
 */
function saveGame(data) {
    return saveProgress(0, data);
}
/**
 * @deprecated Use loadProgress(0) instead
 */
function loadGame() {
    return loadProgress(0);
}
/**
 * @deprecated Use hasSaveSlot(0) instead
 */
function hasSave() {
    return hasSaveSlot(0);
}
/**
 * @deprecated Use deleteSaveSlot(0) instead
 */
function deleteSave() {
    return deleteSaveSlot(0);
}
/**
 * @deprecated Use saveProgress(slot, data) instead
 */
function saveGameSlot(slot, data) {
    return saveProgress(slot, data);
}
/**
 * @deprecated Use loadProgress(slot) instead
 */
function loadGameSlot(slot) {
    return loadProgress(slot);
}
