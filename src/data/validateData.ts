/**
 * Data Validation at Startup
 * Validates all game data against Zod schemas before app renders
 */

import { z } from 'zod';

// Import schemas
import { DjinnSchema } from './schemas/DjinnSchema';
import { UnitDefinitionSchema } from './schemas/UnitSchema';
import { EquipmentSchema } from './schemas/EquipmentSchema';
import { EnemySchema } from './schemas/EnemySchema';
import { EncounterSchema } from './schemas/EncounterSchema';

// Import data
import { DJINN } from './definitions/djinn';
import { UNIT_DEFINITIONS } from './definitions/units';
import { EQUIPMENT } from './definitions/equipment';
import { ENEMIES } from './definitions/enemies';
import { ENCOUNTERS } from './definitions/encounters';

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
