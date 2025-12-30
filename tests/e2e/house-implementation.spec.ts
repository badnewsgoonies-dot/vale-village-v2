import { test, expect } from 'vitest';

// Quick wiring tests to verify House 3 and House 6 definitions are present
// and that recruitment/dialogue wiring follows the expected pattern.

import { ENCOUNTERS } from '../../src/data/definitions/encounters';
import { getRecruitmentInfo } from '../../src/data/definitions/recruitmentData';
import { DIALOGUES } from '../../src/data/definitions/dialogues';
import { HOUSES_STATUS } from '../../src/data/definitions/houses';

test.describe('House definitions wiring', () => {
  test('House 3: encounter + recruitment dialogue present and grants Ranger', () => {
    const status = HOUSES_STATUS.find(h => h.houseNumber === 3)!;
    expect(status).toBeTruthy();

    const encounter = ENCOUNTERS[status.encounterId];
    expect(encounter).toBeTruthy();
    // Equipment reward exists as defined in encounters.ts
    expect(encounter.reward).toBeTruthy();

    const recruitInfo = getRecruitmentInfo(status.encounterId);
    expect(recruitInfo).not.toBeNull();
    expect(recruitInfo?.recruitsUnit).toBe('ranger');
  });

  test('House 6: contains stone-guardian enemy and post-battle dialogue exists', () => {
    const status = HOUSES_STATUS.find(h => h.houseNumber === 6)!;
    expect(status).toBeTruthy();

    const encounter = ENCOUNTERS[status.encounterId];
    expect(encounter).toBeTruthy();

    // Stone Guardian must be part of the encounter enemies
    expect(Array.isArray(encounter.enemies)).toBe(true);
    expect(encounter.enemies).toContain('stone-guardian');

    // Dialogue after battle exists in global dialogues
    const dialogue = DIALOGUES[status.dialogueId as string];
    expect(dialogue).toBeTruthy();
    expect(dialogue.startNodeId).toBeDefined();
  });
});
