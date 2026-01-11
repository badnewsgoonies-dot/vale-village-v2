/**
 * Data Validation at Startup
 * Validates all game data against Zod schemas before app renders
 * Includes cross-reference validation to catch orphaned references
 */

import { z } from 'zod';

// Import schemas
import { DjinnSchema } from './schemas/DjinnSchema';
import { UnitDefinitionSchema } from './schemas/UnitSchema';
import { EquipmentSchema } from './schemas/EquipmentSchema';
import { EnemySchema } from './schemas/EnemySchema';
import { EncounterSchema } from './schemas/EncounterSchema';
import { ShopSchema } from './schemas/ShopSchema';

// Import data
import { DJINN } from './definitions/djinn';
import { UNIT_DEFINITIONS } from './definitions/units';
import { EQUIPMENT } from './definitions/equipment';
import { ENEMIES } from './definitions/enemies';
import { ENCOUNTERS } from './definitions/encounters';
import { SHOPS } from './definitions/shops';
import { ABILITIES } from './definitions/abilities';

export interface ValidationError {
  category: string;
  id: string;
  errors: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Validate a record of items against a schema
 */
function validateRecord<T>(
  record: Record<string, unknown>,
  schema: z.ZodType<T>,
  category: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [id, item] of Object.entries(record)) {
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
 */
function validateCrossReferences(): ValidationError[] {
  const errors: ValidationError[] = [];

  // 1. Validate Equipment.unlocksAbility references
  for (const [id, equipment] of Object.entries(EQUIPMENT)) {
    const equip = equipment as { unlocksAbility?: string };
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
    const enc = encounter as {
      enemies: string[];
      reward: {
        djinn?: string;
        unlockUnit?: string;
        equipment: { type: string; itemId?: string; options?: string[] };
      };
    };

    // Check enemy references
    for (const enemyId of enc.enemies) {
      if (!ENEMIES[enemyId]) {
        errors.push({
          category: 'Encounter',
          id,
          errors: [`enemy '${enemyId}' does not exist in ENEMIES`],
        });
      }
    }

    // Check djinn reward reference
    if (enc.reward.djinn && !DJINN[enc.reward.djinn]) {
      errors.push({
        category: 'Encounter',
        id,
        errors: [`reward.djinn '${enc.reward.djinn}' does not exist in DJINN`],
      });
    }

    // Check unit unlock reference
    if (enc.reward.unlockUnit && !UNIT_DEFINITIONS[enc.reward.unlockUnit]) {
      errors.push({
        category: 'Encounter',
        id,
        errors: [`reward.unlockUnit '${enc.reward.unlockUnit}' does not exist in UNIT_DEFINITIONS`],
      });
    }

    // Check equipment reward references
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

  // 3. Validate Shop item references
  for (const [id, shop] of Object.entries(SHOPS)) {
    for (const itemId of shop.availableItems) {
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
 * Validate all game data at startup
 */
export function validateGameData(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

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
  errors.push(...validateCrossReferences());

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

/**
 * Format validation result for display
 */
export function formatValidationResult(result: ValidationResult): string {
  if (result.valid && result.warnings.length === 0) {
    return 'All game data validated successfully.';
  }

  const lines: string[] = [];

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
    if (lines.length > 0) lines.push('');
    lines.push('Warnings:');
    for (const warning of result.warnings) {
      lines.push(`  - ${warning}`);
    }
  }

  return lines.join('\n');
}
