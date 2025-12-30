import { describe, it, expect } from 'vitest';
import { MAPS } from '@/data/definitions/maps';
import { ENCOUNTERS } from '@/data/definitions/encounters';
import { LIBERATION_DIALOGUES } from '@/data/definitions/liberationDialogues';
import { getAllRecruitmentEncounters } from '@/data/definitions/recruitmentData';

// Representative sample of houses to validate wiring
const SAMPLE_HOUSES = ['07', '10', '20', '30'];

describe('Vale Village house wiring (sample)', () => {
  it('interiors exist and have battle triggers wired to encounters', () => {
    for (const num of SAMPLE_HOUSES) {
      const interiorId = `house-${num}-interior`;
      expect(MAPS[interiorId]).toBeDefined();

      const map = MAPS[interiorId];
      const battleTrigger = map.triggers.find((t) => t.type === 'battle');
      expect(battleTrigger, `house ${num} should have a battle trigger`).toBeDefined();

      const encounterId = (battleTrigger!.data as any).encounterId as string;
      expect(ENCOUNTERS[encounterId], `encounter ${encounterId} must exist`).toBeDefined();

      // If a liberation/dialogue exists for this encounter, it should be present
      if (LIBERATION_DIALOGUES[encounterId]) {
        expect(typeof LIBERATION_DIALOGUES[encounterId]).toBe('object');
      }
    }
  });

  it('rewards and recruitment markers are present for known houses', () => {
    // house-17 should unlock Felix per encounter definitions
    const h17 = ENCOUNTERS['house-17'];
    expect(h17).toBeDefined();
    expect(h17.reward?.unlockUnit).toBe('felix');

    // house-20 should grant the Storm djinn as finale
    const h20 = ENCOUNTERS['house-20'];
    expect(h20).toBeDefined();
    expect(h20.reward?.djinn).toBe('storm');

    // Recruitment mapping should include battle-based recruitment encounters
    const recruitmentEncounters = getAllRecruitmentEncounters();
    expect(recruitmentEncounters).toContain('house-17');
  });
});
