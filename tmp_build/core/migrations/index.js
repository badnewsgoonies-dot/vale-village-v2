"use strict";
/**
 * Migration system scaffold
 * Ready for future migrations when save format changes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationRegistry = exports.CURRENT_SAVE_VERSION = void 0;
exports.migrateSaveData = migrateSaveData;
exports.getMigrationPath = getMigrationPath;
const result_1 = require("../utils/result");
const SaveV1Schema_1 = require("../../data/schemas/SaveV1Schema");
/**
 * Current save version
 */
exports.CURRENT_SAVE_VERSION = '1.0.0';
/**
 * Migration registry
 * Add migrations here as new versions are introduced
 */
const migrations = [
// Future migrations will go here
// Example:
// {
//   fromVersion: '1.0.0',
//   toVersion: '1.1.0',
//   migrate: (data) => {
//     // Transform data from 1.0.0 to 1.1.0
//     return Ok(transformedData);
//   },
// },
];
exports.migrationRegistry = {
    migrations,
    currentVersion: exports.CURRENT_SAVE_VERSION,
};
/**
 * Migrate save data to current version
 * Applies all necessary migrations in sequence
 */
function migrateSaveData(data) {
    // For now, just validate as SaveV1
    // In the future, this will check version and apply migrations
    const result = SaveV1Schema_1.SaveV1Schema.safeParse(data);
    if (!result.success) {
        return (0, result_1.Err)(`Invalid save data: ${result.error.message}`);
    }
    return (0, result_1.Ok)(result.data);
}
/**
 * Get migration path from version to target version
 */
function getMigrationPath(fromVersion, toVersion, registry) {
    if (fromVersion === toVersion) {
        return [];
    }
    // Simple linear migration path (for now)
    // In the future, this could handle branching migration paths
    return registry.migrations.filter((m) => m.fromVersion === fromVersion && m.toVersion === toVersion);
}
