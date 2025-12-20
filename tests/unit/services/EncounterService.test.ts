import { describe, it, expect } from 'vitest';
import { isBossEncounter } from '../../../src/core/services/EncounterService';

describe('EncounterService', () => {
  describe('isBossEncounter', () => {
    it('returns true for encounters marked difficulty=boss', () => {
      expect(isBossEncounter('house-26')).toBe(true);
    });

    it('returns false for non-boss encounters', () => {
      expect(isBossEncounter('house-02')).toBe(false);
    });

    it('does not misclassify miniboss IDs as boss (fallback)', () => {
      expect(isBossEncounter('c1_mini_boss')).toBe(false);
      expect(isBossEncounter('c1_miniboss')).toBe(false);
    });

    it('classifies boss IDs as boss (fallback)', () => {
      expect(isBossEncounter('c1_boss')).toBe(true);
      expect(isBossEncounter('boss:ch1')).toBe(true);
    });
  });
});
