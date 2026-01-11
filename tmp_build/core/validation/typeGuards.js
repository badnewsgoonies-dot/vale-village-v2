"use strict";
/**
 * Runtime Type Guards
 * Validates data at system boundaries (save files, external data, etc.)
 *
 * Uses existing Zod schemas to provide runtime validation where TypeScript can't help.
 *
 * Usage:
 * - Validate save files before loading
 * - Validate external data (network, localStorage, etc.)
 * - Protect against data corruption
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBattleStateData = validateBattleStateData;
exports.validateTeam = validateTeam;
exports.validateUnit = validateUnit;
exports.isString = isString;
exports.isNonEmptyString = isNonEmptyString;
exports.isNumber = isNumber;
exports.isPositiveInteger = isPositiveInteger;
exports.isNonNegativeInteger = isNonNegativeInteger;
exports.isArray = isArray;
exports.isNonEmptyArray = isNonEmptyArray;
exports.isObject = isObject;
exports.hasProperty = hasProperty;
exports.hasProperties = hasProperties;
exports.getProperty = getProperty;
exports.validateLocalStorageData = validateLocalStorageData;
exports.formatValidationErrors = formatValidationErrors;
const BattleStateSchema_1 = require("../../data/schemas/BattleStateSchema");
const TeamSchema_1 = require("../../data/schemas/TeamSchema");
const UnitSchema_1 = require("../../data/schemas/UnitSchema");
const result_1 = require("../utils/result");
/**
 * Validate unknown data against BattleState schema
 * Returns validated BattleState or array of validation errors
 */
function validateBattleStateData(data) {
    const result = BattleStateSchema_1.BattleStateSchema.safeParse(data);
    if (result.success) {
        // Zod schema doesn't include unitById index, so we need to reconstruct it
        const validatedData = result.data;
        // Build unitById index
        const unitById = new Map();
        for (const unit of validatedData.playerTeam.units) {
            unitById.set(unit.id, { unit, isPlayer: true });
        }
        for (const unit of validatedData.enemies) {
            unitById.set(unit.id, { unit, isPlayer: false });
        }
        return (0, result_1.Ok)({
            ...validatedData,
            unitById,
        });
    }
    const errors = result.error.errors.map(err => ({
        path: err.path,
        message: err.message,
    }));
    return (0, result_1.Err)(errors);
}
/**
 * Validate unknown data against Team schema
 */
function validateTeam(data) {
    const result = TeamSchema_1.TeamSchema.safeParse(data);
    if (result.success) {
        return (0, result_1.Ok)(result.data);
    }
    const errors = result.error.errors.map(err => ({
        path: err.path,
        message: err.message,
    }));
    return (0, result_1.Err)(errors);
}
/**
 * Validate unknown data against Unit schema
 */
function validateUnit(data) {
    const result = UnitSchema_1.UnitSchema.safeParse(data);
    if (result.success) {
        return (0, result_1.Ok)(result.data);
    }
    const errors = result.error.errors.map(err => ({
        path: err.path,
        message: err.message,
    }));
    return (0, result_1.Err)(errors);
}
/**
 * Type guard: Check if value is a string
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * Type guard: Check if value is a non-empty string
 */
function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}
/**
 * Type guard: Check if value is a number
 */
function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
/**
 * Type guard: Check if value is a positive integer
 */
function isPositiveInteger(value) {
    return isNumber(value) && Number.isInteger(value) && value > 0;
}
/**
 * Type guard: Check if value is a non-negative integer
 */
function isNonNegativeInteger(value) {
    return isNumber(value) && Number.isInteger(value) && value >= 0;
}
/**
 * Type guard: Check if value is an array
 */
function isArray(value) {
    return Array.isArray(value);
}
/**
 * Type guard: Check if value is a non-empty array
 */
function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * Type guard: Check if value is an object
 */
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Type guard: Check if object has a specific property
 */
function hasProperty(value, property) {
    return isObject(value) && property in value;
}
/**
 * Type guard: Check if object has required properties
 */
function hasProperties(value, properties) {
    if (!isObject(value))
        return false;
    return properties.every(prop => prop in value);
}
/**
 * Validate and extract property from object
 * Useful for safely accessing nested data
 */
function getProperty(obj, path, validator) {
    let current = obj;
    for (const key of path) {
        if (!isObject(current) || !(key in current)) {
            return (0, result_1.Err)(`Property ${path.join('.')} not found`);
        }
        current = current[key];
    }
    if (!validator(current)) {
        return (0, result_1.Err)(`Property ${path.join('.')} has invalid type`);
    }
    return (0, result_1.Ok)(current);
}
/**
 * Validate localStorage data
 * Returns parsed data or null if invalid/missing
 */
function validateLocalStorageData(key, validator) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        const result = validator(parsed);
        if (result.ok) {
            return result.value;
        }
        // [REMOVED] console.warn(`Invalid localStorage data for key "${key}":`, result.error);
        return null;
    }
    catch (error) {
        // [REMOVED] console.warn(`Failed to load localStorage data for key "${key}":`, error);
        return null;
    }
}
/**
 * Format validation errors for display
 */
function formatValidationErrors(errors) {
    return errors
        .map(err => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `  - ${path}${err.message}`;
    })
        .join('\n');
}
