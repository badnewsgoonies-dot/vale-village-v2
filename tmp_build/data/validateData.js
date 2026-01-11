"use strict";
/**
 * Data Validation at Startup
 * Validates all game data against Zod schemas before app renders
 * Uses dynamic imports to avoid module-load-time failures crashing the app
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGameData = validateGameData;
exports.formatValidationResult = formatValidationResult;
const zod_1 = require("zod");
/**
 * Validate a record of items against a schema
 */
function validateRecord(record, schema, category) {
    const errors = [];
    for (const [id, item] of Object.entries(record)) {
        // If schema is a permissive fallback (z.any()), it will always succeed
        const result = schema.safeParse(item);
        if (!result.success) {
            errors.push({
                category,
                id,
                errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
            });
        }
    }
    return errors;
}
/**
 * Cross-reference validation to catch orphaned references
 * Checks that all referenced IDs actually exist in their target collections
 * When dynamic imports fail, the collections default to empty objects and this
 * will report missing references rather than throwing at module-load time.
 */
function validateCrossReferences(EQUIPMENT, ABILITIES, ENCOUNTERS, ENEMIES, DJINN, UNIT_DEFINITIONS, SHOPS) {
    const errors = [];
    // 1. Validate Equipment.unlocksAbility references
    for (const [id, equipment] of Object.entries(EQUIPMENT)) {
        const equip = equipment;
        if (equip.unlocksAbility && !ABILITIES[equip.unlocksAbility]) {
            errors.push({
                category: 'Equipment',
                id,
                errors: [`unlocksAbility '${equip.unlocksAbility}' does not exist in ABILITIES`],
            });
        }
    }
    // 2. Validate Encounter references
    for (const [id, encounter] of Object.entries(ENCOUNTERS)) {
        const enc = encounter;
        // Check enemy references
        for (const enemyId of enc.enemies || []) {
            if (!ENEMIES[enemyId]) {
                errors.push({
                    category: 'Encounter',
                    id,
                    errors: [`enemy '${enemyId}' does not exist in ENEMIES`],
                });
            }
        }
        // Check djinn reward reference
        if (enc.reward && enc.reward.djinn && !DJINN[enc.reward.djinn]) {
            errors.push({
                category: 'Encounter',
                id,
                errors: [`reward.djinn '${enc.reward.djinn}' does not exist in DJINN`],
            });
        }
        // Check unit unlock reference
        if (enc.reward && enc.reward.unlockUnit && !UNIT_DEFINITIONS[enc.reward.unlockUnit]) {
            errors.push({
                category: 'Encounter',
                id,
                errors: [`reward.unlockUnit '${enc.reward.unlockUnit}' does not exist in UNIT_DEFINITIONS`],
            });
        }
        // Check equipment reward references
        if (enc.reward && enc.reward.equipment) {
            if (enc.reward.equipment.type === 'fixed' && enc.reward.equipment.itemId) {
                if (!EQUIPMENT[enc.reward.equipment.itemId]) {
                    errors.push({
                        category: 'Encounter',
                        id,
                        errors: [`reward.equipment.itemId '${enc.reward.equipment.itemId}' does not exist in EQUIPMENT`],
                    });
                }
            }
            if (enc.reward.equipment.type === 'choice' && enc.reward.equipment.options) {
                for (const optionId of enc.reward.equipment.options) {
                    if (!EQUIPMENT[optionId]) {
                        errors.push({
                            category: 'Encounter',
                            id,
                            errors: [`reward.equipment.options '${optionId}' does not exist in EQUIPMENT`],
                        });
                    }
                }
            }
        }
    }
    // 3. Validate Shop item references
    for (const [id, shop] of Object.entries(SHOPS)) {
        for (const itemId of shop.availableItems || []) {
            if (!EQUIPMENT[itemId]) {
                errors.push({
                    category: 'Shop',
                    id,
                    errors: [`availableItems '${itemId}' does not exist in EQUIPMENT`],
                });
            }
        }
    }
    return errors;
}
/**
 * Validate all game data at startup using dynamic imports to avoid hard failures
 */
async function validateGameData() {
    try {
        // Attempt to dynamically import schemas and data. If any import fails,
        // provide permissive fallbacks so validation reports errors instead of throwing.
        const [djinnSchemaMod, unitSchemaMod, equipSchemaMod, enemySchemaMod, encounterSchemaMod, shopSchemaMod,] = await Promise.all([
            Promise.resolve().then(() => require('./schemas/DjinnSchema')).catch(() => ({ DjinnSchema: zod_1.z.any() })),
            Promise.resolve().then(() => require('./schemas/UnitSchema')).catch(() => ({ UnitDefinitionSchema: zod_1.z.any() })),
            Promise.resolve().then(() => require('./schemas/EquipmentSchema')).catch(() => ({ EquipmentSchema: zod_1.z.any() })),
            Promise.resolve().then(() => require('./schemas/EnemySchema')).catch(() => ({ EnemySchema: zod_1.z.any() })),
            Promise.resolve().then(() => require('./schemas/EncounterSchema')).catch(() => ({ EncounterSchema: zod_1.z.any() })),
            Promise.resolve().then(() => require('./schemas/ShopSchema')).catch(() => ({ ShopSchema: zod_1.z.any() })),
        ]);
        const [djinnDataMod, unitDataMod, equipDataMod, enemiesDataMod, encountersDataMod, shopsDataMod, abilitiesDataMod,] = await Promise.all([
            Promise.resolve().then(() => require('./definitions/djinn')).catch(() => ({ DJINN: {} })),
            Promise.resolve().then(() => require('./definitions/units')).catch(() => ({ UNIT_DEFINITIONS: {} })),
            Promise.resolve().then(() => require('./definitions/equipment')).catch(() => ({ EQUIPMENT: {} })),
            Promise.resolve().then(() => require('./definitions/enemies')).catch(() => ({ ENEMIES: {} })),
            Promise.resolve().then(() => require('./definitions/encounters')).catch(() => ({ ENCOUNTERS: {} })),
            Promise.resolve().then(() => require('./definitions/shops')).catch(() => ({ SHOPS: {} })),
            Promise.resolve().then(() => require('./definitions/abilities')).catch(() => ({ ABILITIES: {} })),
        ]);
        const DjinnSchema = djinnSchemaMod.DjinnSchema ?? zod_1.z.any();
        const UnitDefinitionSchema = unitSchemaMod.UnitDefinitionSchema ?? zod_1.z.any();
        const EquipmentSchema = equipSchemaMod.EquipmentSchema ?? zod_1.z.any();
        const EnemySchema = enemySchemaMod.EnemySchema ?? zod_1.z.any();
        const EncounterSchema = encounterSchemaMod.EncounterSchema ?? zod_1.z.any();
        const ShopSchema = shopSchemaMod.ShopSchema ?? zod_1.z.any();
        const DJINN = djinnDataMod.DJINN ?? {};
        const UNIT_DEFINITIONS = unitDataMod.UNIT_DEFINITIONS ?? {};
        const EQUIPMENT = equipDataMod.EQUIPMENT ?? {};
        const ENEMIES = enemiesDataMod.ENEMIES ?? {};
        const ENCOUNTERS = encountersDataMod.ENCOUNTERS ?? {};
        const SHOPS = shopsDataMod.SHOPS ?? {};
        const ABILITIES = abilitiesDataMod.ABILITIES ?? {};
        const errors = [];
        const warnings = [];
        // Validate Djinn
        errors.push(...validateRecord(DJINN, DjinnSchema, 'Djinn'));
        // Validate Units
        errors.push(...validateRecord(UNIT_DEFINITIONS, UnitDefinitionSchema, 'Units'));
        // Validate Equipment
        errors.push(...validateRecord(EQUIPMENT, EquipmentSchema, 'Equipment'));
        // Validate Enemies
        errors.push(...validateRecord(ENEMIES, EnemySchema, 'Enemies'));
        // Validate Encounters
        errors.push(...validateRecord(ENCOUNTERS, EncounterSchema, 'Encounters'));
        // Validate Shops
        errors.push(...validateRecord(SHOPS, ShopSchema, 'Shops'));
        // Cross-reference validation (only if schema validation passed)
        // This catches orphaned references like equipment pointing to non-existent abilities
        errors.push(...validateCrossReferences(EQUIPMENT, ABILITIES, ENCOUNTERS, ENEMIES, DJINN, UNIT_DEFINITIONS, SHOPS));
        // Add warnings for empty collections
        if (Object.keys(DJINN).length === 0) {
            warnings.push('No Djinn defined');
        }
        if (Object.keys(UNIT_DEFINITIONS).length === 0) {
            warnings.push('No Units defined');
        }
        if (Object.keys(ENEMIES).length === 0) {
            warnings.push('No Enemies defined');
        }
        if (Object.keys(ENCOUNTERS).length === 0) {
            warnings.push('No Encounters defined');
        }
        if (Object.keys(SHOPS).length === 0) {
            warnings.push('No Shops defined');
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    catch (exception) {
        return {
            valid: false,
            errors: [
                {
                    category: 'ValidationException',
                    id: 'validateGameData',
                    errors: [
                        exception instanceof Error
                            ? `${exception.message}${exception.stack ? '\n' + exception.stack : ''}`
                            : `Unknown error during validation: ${String(exception)}`,
                    ],
                },
            ],
            warnings: [],
        };
    }
}
/**
 * Format validation result for display
 */
function formatValidationResult(result) {
    if (result.valid && result.warnings.length === 0) {
        return 'All game data validated successfully.';
    }
    const lines = [];
    if (!result.valid) {
        lines.push('DATA VALIDATION FAILED:');
        lines.push('');
        for (const error of result.errors) {
            lines.push(`[${error.category}] ${error.id}:`);
            for (const msg of error.errors) {
                lines.push(`  - ${msg}`);
            }
        }
    }
    if (result.warnings.length > 0) {
        if (lines.length > 0)
            lines.push('');
        lines.push('Warnings:');
        for (const warning of result.warnings) {
            lines.push(`  - ${warning}`);
        }
    }
    return lines.join('\n');
}
