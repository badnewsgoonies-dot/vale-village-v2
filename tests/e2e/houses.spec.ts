import { describe, it, expect } from 'vitest';
import { ENCOUNTERS } from '../../src/data/definitions/encounters';
import { HOUSES_STATUS } from '../../src/data/definitions/houses';
import { RECRUITMENT } from '../../src/data/definitions/recruitment';

// Basic wiring smoke tests to ensure Houses 1-6 are wired to encounters,
// have dialogue/recruitment entries, and that recruitment records include House 6.

describe('Houses wiring (1-6)', () => {
  it('ensures encounters for houses 1-6 exist', () => {
    for (let i = 1; i <= 6; i++) {
      const id = `house-0${i}`;
      expect(ENCOUNTERS[id]).toBeDefined();
    }
  });

  it('ensures HOUSES_STATUS contains entries for houses 1-6', () => {
    for (let i = 1; i <= 6; i++) {
      const status = HOUSES_STATUS.find(h => h.houseNumber === i);
      expect(status).toBeDefined();
      // Must have at least dialogueId or recruitUnit defined to follow pattern
      expect(status && (status.dialogueId !== null || status.recruitUnit !== null)).toBeTruthy();
    }
  });

  it('verifies House 3 grants the ranger unit (story join)', () => {
    const rec = RECRUITMENT.find(r => r.houseId === 'house-03');
    expect(rec).toBeDefined();
    expect(rec?.unitId).toBe('ranger');
  });

  it('verifies House 6 has a recruitment record (stone-guardian)', () => {
    const rec = RECRUITMENT.find(r => r.houseId === 'house-06');
    expect(rec).toBeDefined();
    expect(rec?.unitId).toBe('stone-guardian');
  });
});

// Also provide a simple CLI-friendly validator so this file can be executed
// directly (ts-node) in CI when vitest excludes e2e tests by default.
if (require.main === module) {
  const errors: string[] = [];

  for (let i = 1; i <= 6; i++) {
    const id = `house-0${i}`;
    if (!ENCOUNTERS[id]) errors.push(`Missing encounter: ${id}`);
  }

  for (let i = 1; i <= 6; i++) {
    const status = HOUSES_STATUS.find(h => h.houseNumber === i);
    if (!status) errors.push(`Missing HOUSES_STATUS for house ${i}`);
    else if (status.dialogueId === null && status.recruitUnit === null)
      errors.push(`House ${i} lacks dialogueId and recruitUnit in HOUSES_STATUS`);
  }

  const rec3 = RECRUITMENT.find(r => r.houseId === 'house-03');
  if (!rec3 || rec3.unitId !== 'ranger') errors.push('House 3 recruitment missing or incorrect');

  const rec6 = RECRUITMENT.find(r => r.houseId === 'house-06');
  if (!rec6 || rec6.unitId !== 'stone-guardian') errors.push('House 6 recruitment missing or incorrect');

  if (errors.length > 0) {
    console.error('Validation FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }

  console.log('Validation PASSED: Houses 1-6 wired correctly');
  process.exit(0);
}
