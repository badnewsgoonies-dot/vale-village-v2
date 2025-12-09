/**
 * Save File Validation (PLACEHOLDER - Issue #20)
 * To be implemented when building save system
 *
 * This file provides the infrastructure for save file validation.
 * Implementation will be completed as part of the save/load system.
 *
 * Planned Features:
 * - Checksum validation (detect tampering/corruption)
 * - Version migration support
 * - Schema validation using Zod
 * - Graceful degradation on corruption
 * - Recovery suggestions for corrupted saves
 */

import type { ZodSchema } from 'zod';
import { Result, Err, Ok } from '../utils/result';
import { SaveV1Schema, type SaveV1 } from '../../data/schemas/SaveV1Schema';
import { CURRENT_SAVE_VERSION, migrateSaveData } from '../migrations';

/**
 * Save file metadata
 */
export interface SaveFileMetadata {
  version: string;
  timestamp: number;
  checksum: string;
}

/**
 * Save file validation error types
 */
export type SaveFileValidationError =
  | { type: 'CORRUPTED'; reason: string; recoverable: boolean }
  | { type: 'VERSION_MISMATCH'; saveVersion: string; currentVersion: string; canMigrate: boolean }
  | { type: 'CHECKSUM_FAILED'; expected: string; actual: string }
  | { type: 'MISSING_DATA'; missingFields: string[] }
  | { type: 'INVALID_FORMAT'; message: string };

/**
 * TODO (Issue #20): Implement save file validation
 *
 * @param data - Unknown data from storage (localStorage, file, etc.)
 * @returns Validated save file or validation error
 *
 * Implementation checklist:
 * 1. Parse JSON safely (try/catch)
 * 2. Validate save file structure (has version, timestamp, checksum, data)
 * 3. Validate checksum (calculateChecksum(data) === stored checksum)
 * 4. Validate version (compare with CURRENT_VERSION)
 * 5. Migrate if needed (runMigrations(data, saveVersion, currentVersion))
 * 6. Validate game state using Zod schemas
 * 7. Return validated data or detailed error
 */
export function validateSaveFile<T>(
  wrapper: unknown,
  schema: ZodSchema<unknown>,
  currentVersion: string = CURRENT_SAVE_VERSION,
  migrate?: (data: unknown) => Result<unknown, string>
): Result<T, SaveFileValidationError> {
  if (!wrapper || typeof wrapper !== 'object') {
    return Err({
      type: 'INVALID_FORMAT',
      message: 'Save file is not an object',
    });
  }

  const file = wrapper as Partial<{
    version: string;
    timestamp: number;
    checksum: string;
    data: unknown;
  }>;

  const missingFields = [
    !file.version ? 'version' : null,
    !file.timestamp ? 'timestamp' : null,
    !file.checksum ? 'checksum' : null,
    typeof file.data === 'undefined' ? 'data' : null,
  ].filter((f): f is string => f !== null);

  if (missingFields.length > 0) {
    return Err({
      type: 'MISSING_DATA',
      missingFields,
    });
  }

  let data = file.data;
  const saveVersion = file.version!;

  if (saveVersion !== currentVersion) {
    if (migrate) {
      const migrated = migrate(data);
      if (!migrated.ok) {
        return Err({
          type: 'VERSION_MISMATCH',
          saveVersion,
          currentVersion,
          canMigrate: true,
        });
      }
      data = migrated.value;
    } else {
      return Err({
        type: 'VERSION_MISMATCH',
        saveVersion,
        currentVersion,
        canMigrate: false,
      });
    }
  }

  if (!verifyChecksum(data, file.checksum!)) {
    return Err({
      type: 'CHECKSUM_FAILED',
      expected: file.checksum!,
      actual: calculateChecksum(data),
    });
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    return Err({
      type: 'INVALID_FORMAT',
      message: result.error.message,
    });
  }

  return Ok(result.data as T);
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

/**
 * TODO (Issue #20): Load save file with validation and recovery
 *
 * @param slot - Save slot number (1-3)
 * @returns Validated game state or error with recovery options
 *
 * Recovery strategy:
 * 1. Try to load save
 * 2. If corrupted, check for backup save
 * 3. If backup corrupted, offer to start new game
 * 4. Never crash - always provide graceful fallback
 */
export function loadSaveFileSafe(slot: number): Result<SaveV1, SaveFileValidationError> {
  if (slot < 0 || slot >= 3) {
    return Err({
      type: 'INVALID_FORMAT',
      message: `Invalid slot: ${slot}`,
    });
  }

  const key = `vale_chronicles_v2_save_slot_${slot}`;
  const backupKey = `${key}_backup`;

  const tryLoad = (storageKey: string): Result<SaveV1, SaveFileValidationError> => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return Err({
        type: 'MISSING_DATA',
        missingFields: ['data'],
      });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return Err({
        type: 'INVALID_FORMAT',
        message: error instanceof Error ? error.message : 'Invalid JSON',
      });
    }

    return validateSaveFile(parsed, SaveV1Schema, CURRENT_SAVE_VERSION, migrateSaveData);
  };

  const primaryResult = tryLoad(key);
  if (primaryResult.ok) {
    return primaryResult;
  }

  // Attempt backup if primary fails
  const backupResult = tryLoad(backupKey);
  if (backupResult.ok) {
    // Restore backup to primary key for future loads
    localStorage.setItem(key, JSON.stringify({
      version: CURRENT_SAVE_VERSION,
      timestamp: Date.now(),
      checksum: calculateChecksum(backupResult.value),
      data: backupResult.value,
    }));
    return backupResult;
  }

  return primaryResult;
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
  }
}

/**
 * NOTE: This file is a placeholder for the save system (Issue #20)
 *
 * When implementing the save system, refer to:
 * - docs/architect/save-system-spec.md (if exists)
 * - src/data/schemas/SaveV1Schema.ts (for schema)
 * - src/core/services/SaveService.ts (for implementation)
 *
 * Key requirements:
 * - Versioned save format (support migration)
 * - Checksum validation (detect corruption)
 * - Graceful error handling (never crash)
 * - Backup saves (auto-create on save)
 * - User-friendly error messages
 */
