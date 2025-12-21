import { describe, it, expect } from 'vitest';
import { formatSaveFileError } from '../../../src/core/validation/saveFileValidation';
import type { SaveFileValidationError } from '../../../src/core/validation/saveFileValidation';

describe('formatSaveFileError', () => {
  it('formats corrupted saves with recovery guidance', () => {
    const error: SaveFileValidationError = {
      type: 'CORRUPTED',
      reason: 'invalid JSON',
      recoverable: true,
    };

    const message = formatSaveFileError(error);
    expect(message).toContain('corrupted');
    expect(message).toContain('Try loading a backup');
  });

  it('formats unrecoverable corruption clearly', () => {
    const error: SaveFileValidationError = {
      type: 'CORRUPTED',
      reason: 'storage failure',
      recoverable: false,
    };

    const message = formatSaveFileError(error);
    expect(message).toContain("can't be recovered");
    expect(message).toContain('start a new game');
  });

  it('formats version mismatch with update guidance', () => {
    const error: SaveFileValidationError = {
      type: 'VERSION_MISMATCH',
      saveVersion: '0.9.0',
      currentVersion: '1.0.0',
      canMigrate: false,
    };

    const message = formatSaveFileError(error);
    expect(message).toContain('isn\'t compatible');
    expect(message).toContain('Update the game');
  });

  it('formats checksum failures with actionable advice', () => {
    const error: SaveFileValidationError = {
      type: 'CHECKSUM_FAILED',
      expected: 'abc',
      actual: 'def',
    };

    const message = formatSaveFileError(error);
    expect(message).toContain('integrity check');
    expect(message).toContain('another slot');
  });

  it('formats missing data with field list', () => {
    const error: SaveFileValidationError = {
      type: 'MISSING_DATA',
      missingFields: ['metadata.version', 'data.playerData'],
    };

    const message = formatSaveFileError(error);
    expect(message).toContain('missing required data');
    expect(message).toContain('metadata.version');
  });

  it('formats invalid format with guidance', () => {
    const error: SaveFileValidationError = {
      type: 'INVALID_FORMAT',
      message: 'Save file must be an object',
    };

    const message = formatSaveFileError(error);
    expect(message).toContain("format isn't recognized");
    expect(message).toContain('delete this save');
  });

  it('formats schema validation failures with issues', () => {
    const error: SaveFileValidationError = {
      type: 'SCHEMA_VALIDATION_FAILED',
      issues: ['playerData.gold: Required', 'stats.playtime: Required'],
    };

    const message = formatSaveFileError(error);
    expect(message).toContain('contains invalid data');
    expect(message).toContain('playerData.gold');
  });
});
