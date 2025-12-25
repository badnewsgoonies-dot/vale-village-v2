/**
 * Save File Validation
 *
 * Provides infrastructure for save file validation:
 * - Checksum validation (detect tampering/corruption)
 * - Version migration support
 * - Schema validation using Zod
 * - Graceful degradation on corruption
 * - Recovery suggestions for corrupted saves
 */

import { Result, Ok, Err } from '../utils/result';
import { SaveV1Schema, type SaveV1 } from '../../data/schemas/SaveV1Schema';
import { ZodError } from 'zod';

/** Current save file version */
export const CURRENT_SAVE_VERSION = '1.0.0';

/** Supported versions that can be migrated */
const MIGRATABLE_VERSIONS = ['1.0.0'];

/**
 * Save file metadata
 */
export interface SaveFileMetadata {
  version: string;
  timestamp: number;
  checksum: string;
}

/**
 * Wrapper structure for save files with metadata
 */
export interface SaveFileWrapper {
  metadata: SaveFileMetadata;
  data: SaveV1;
}

/**
 * Save file validation error types
 */
export type SaveFileValidationError =
  | { type: 'CORRUPTED'; reason: string; recoverable: boolean }
  | { type: 'VERSION_MISMATCH'; saveVersion: string; currentVersion: string; canMigrate: boolean }
  | { type: 'CHECKSUM_FAILED'; expected: string; actual: string }
  | { type: 'MISSING_DATA'; missingFields: string[] }
  | { type: 'INVALID_FORMAT'; message: string }
  | { type: 'SCHEMA_VALIDATION_FAILED'; issues: string[] };

/**
 * Type guard to check if value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validate save file structure, checksum, version, and schema
 *
 * @param data - Unknown data from storage (localStorage, file, etc.)
 * @returns Validated save file or validation error
 */
export function validateSaveFile(data: unknown): Result<SaveV1, SaveFileValidationError> {
  // Step 1: Check basic structure
  if (!isPlainObject(data)) {
    return Err({
      type: 'INVALID_FORMAT',
      message: 'Save file must be an object',
    });
  }

  // Step 2: Check for wrapped format (metadata + data) vs raw format
  const hasWrapper = 'metadata' in data && 'data' in data;

  let saveData: unknown;
  let storedChecksum: string | null = null;
  let saveVersion: string | null = null;

  if (hasWrapper) {
    // Wrapped format with metadata
    const wrapper = data as { metadata: unknown; data: unknown };

    if (!isPlainObject(wrapper.metadata)) {
      return Err({
        type: 'MISSING_DATA',
        missingFields: ['metadata'],
      });
    }

    const metadata = wrapper.metadata as Record<string, unknown>;

    // Extract metadata fields
    if (typeof metadata.checksum !== 'string') {
      return Err({
        type: 'MISSING_DATA',
        missingFields: ['metadata.checksum'],
      });
    }

    if (typeof metadata.version !== 'string') {
      return Err({
        type: 'MISSING_DATA',
        missingFields: ['metadata.version'],
      });
    }

    storedChecksum = metadata.checksum;
    saveVersion = metadata.version;
    saveData = wrapper.data;

    // Step 3: Validate checksum
    const actualChecksum = calculateChecksum(saveData);
    if (actualChecksum !== storedChecksum) {
      return Err({
        type: 'CHECKSUM_FAILED',
        expected: storedChecksum,
        actual: actualChecksum,
      });
    }
  } else {
    // Raw format - extract version directly from data
    saveData = data;
    if ('version' in data && typeof data.version === 'string') {
      saveVersion = data.version;
    }
  }

  // Step 4: Validate version
  if (saveVersion && saveVersion !== CURRENT_SAVE_VERSION) {
    const canMigrate = MIGRATABLE_VERSIONS.includes(saveVersion);
    if (!canMigrate) {
      return Err({
        type: 'VERSION_MISMATCH',
        saveVersion,
        currentVersion: CURRENT_SAVE_VERSION,
        canMigrate: false,
      });
    }
    // If we can migrate, we'd run migrations here
    // For now, 1.0.0 is the only version so no migration needed
  }

  // Step 5: Validate schema using Zod
  const parseResult = SaveV1Schema.safeParse(saveData);

  if (!parseResult.success) {
    const zodError = parseResult.error as ZodError;
    const issues = zodError.issues.map(issue => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    });

    return Err({
      type: 'SCHEMA_VALIDATION_FAILED',
      issues,
    });
  }

  // Step 6: Return validated data
  return Ok(parseResult.data);
}

/**
 * Calculate checksum for save data (synchronous hash)
 *
 * Uses a simple but deterministic hash function for save file integrity.
 * For full cryptographic security, use crypto.subtle.digest (async).
 *
 * @param data - Save data to checksum
 * @returns Checksum string (hex hash)
 */
export function calculateChecksum(data: unknown): string {
  // Serialize with sorted keys at all levels for deterministic output
  const serialized = JSON.stringify(data, (_key, value) => {
    // Sort object keys recursively
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((sorted: Record<string, unknown>, k) => {
          sorted[k] = value[k];
          return sorted;
        }, {});
    }
    return value;
  });

  // Simple hash function (FNV-1a 32-bit)
  let hash = 2166136261;
  for (let i = 0; i < serialized.length; i++) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // Convert to unsigned 32-bit and hex
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Verify save file checksum
 *
 * @param data - Save data
 * @param expectedChecksum - Stored checksum
 * @returns True if checksum matches
 */
export function verifyChecksum(data: unknown, expectedChecksum: string): boolean {
  const actualChecksum = calculateChecksum(data);
  return actualChecksum === expectedChecksum;
}

/** Storage key prefix for save slots */
const SAVE_SLOT_KEY_PREFIX = 'vale-village-save-slot-';

/** Storage key for backup saves */
const BACKUP_KEY_PREFIX = 'vale-village-backup-';

/**
 * Load save file with validation and recovery
 *
 * @param slot - Save slot number (0-2)
 * @returns Validated game state or error with recovery options
 *
 * Recovery strategy:
 * 1. Try to load save
 * 2. If corrupted, check for backup save
 * 3. If backup corrupted, return error with recovery info
 * 4. Never crash - always provide graceful fallback
 */
export function loadSaveFileSafe(slot: number): Result<SaveV1, SaveFileValidationError> {
  // Step 1: Try to load primary save
  const key = `${SAVE_SLOT_KEY_PREFIX}${slot}`;
  const rawData = localStorage.getItem(key);

  if (rawData === null) {
    return Err({
      type: 'MISSING_DATA',
      missingFields: [`Save slot ${slot}`],
    });
  }

  // Step 2: Parse JSON safely
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawData);
  } catch {
    // Step 3: Try backup if primary is corrupted JSON
    const backupKey = `${BACKUP_KEY_PREFIX}${slot}`;
    const backupData = localStorage.getItem(backupKey);

    if (backupData) {
      try {
        const backupParsed = JSON.parse(backupData);
        const backupResult = validateSaveFile(backupParsed);
        if (backupResult.ok) {
          // Restore from backup
          localStorage.setItem(key, backupData);
          return backupResult;
        }
      } catch {
        // Backup also corrupted
      }
    }

    return Err({
      type: 'CORRUPTED',
      reason: 'Save file contains invalid JSON',
      recoverable: false,
    });
  }

  // Step 4: Validate the parsed data
  const validationResult = validateSaveFile(parsed);

  if (!validationResult.ok) {
    // Step 5: Try backup if validation fails
    const backupKey = `${BACKUP_KEY_PREFIX}${slot}`;
    const backupData = localStorage.getItem(backupKey);

    if (backupData) {
      try {
        const backupParsed = JSON.parse(backupData);
        const backupResult = validateSaveFile(backupParsed);
        if (backupResult.ok) {
          // Restore from backup
          localStorage.setItem(key, backupData);
          return backupResult;
        }
      } catch {
        // Backup also corrupted
      }
    }

    // Return original error, but mark as potentially recoverable if backup exists
    return validationResult;
  }

  return validationResult;
}

/**
 * Save game state with checksum and backup
 *
 * @param slot - Save slot number (0-2)
 * @param data - Game state to save
 * @returns Success or error
 */
export function saveGameSafe(slot: number, data: SaveV1): Result<void, SaveFileValidationError> {
  const key = `${SAVE_SLOT_KEY_PREFIX}${slot}`;
  const backupKey = `${BACKUP_KEY_PREFIX}${slot}`;

  // Create backup of existing save first
  const existingSave = localStorage.getItem(key);
  if (existingSave) {
    localStorage.setItem(backupKey, existingSave);
  }

  // Calculate checksum and wrap with metadata
  const checksum = calculateChecksum(data);
  const wrapper: SaveFileWrapper = {
    metadata: {
      version: CURRENT_SAVE_VERSION,
      timestamp: Date.now(),
      checksum,
    },
    data,
  };

  try {
    localStorage.setItem(key, JSON.stringify(wrapper));
    return Ok(undefined);
  } catch {
    return Err({
      type: 'CORRUPTED',
      reason: 'Failed to save game - storage may be full',
      recoverable: true,
    });
  }
}

/**
 * TODO (Issue #20): Format validation error for user display
 *
 * @param error - Validation error
 * @returns User-friendly error message with recovery suggestions
 *
 * Example output:
 * "Your save file is corrupted. Would you like to:
 *  1. Load backup save (from 2 hours ago)
 *  2. Start new game
 *  3. Report issue to developers"
 */
export function formatSaveFileError(error: SaveFileValidationError): string {
  switch (error.type) {
    case 'CORRUPTED':
      return `Save file is corrupted: ${error.reason}. ${
        error.recoverable ? 'Recovery may be possible.' : 'Cannot recover.'
      }`;
    case 'VERSION_MISMATCH':
      return `Save file is from version ${error.saveVersion}, current version is ${error.currentVersion}. ${
        error.canMigrate ? 'Migration available.' : 'Migration not available.'
      }`;
    case 'CHECKSUM_FAILED':
      return 'Save file integrity check failed. File may be corrupted or tampered with.';
    case 'MISSING_DATA':
      return `Save file is incomplete. Missing: ${error.missingFields.join(', ')}`;
    case 'INVALID_FORMAT':
      return `Invalid save file format: ${error.message}`;
    case 'SCHEMA_VALIDATION_FAILED':
      return `Save file data is invalid: ${error.issues.slice(0, 3).join('; ')}${error.issues.length > 3 ? ` (+${error.issues.length - 3} more issues)` : ''}`;
  }
}
