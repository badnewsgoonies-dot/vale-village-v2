import { test, expect } from '@playwright/test';
import { ENCOUNTERS } from '../../src/data/definitions/encounters';
import { MAPS } from '../../src/data/definitions/maps';
import { ENCOUNTER_TO_PRE_BATTLE_DIALOGUE } from '../../src/data/definitions/preBattleDialogues';
import { ENCOUNTER_TO_POST_BATTLE_DIALOGUE } from '../../src/data/definitions/postBattleDialogues';
import { getRecruitmentInfo } from '../../src/data/definitions/recruitmentData';
import { DIALOGUES } from '../../src/data/definitions/dialogues';

// Validate wiring for Houses 1-6: teleport (map interior), pre-battle dialogue, encounter, and reward/recruitment
test('Houses 1-6 are wired correctly', async () => {
  const houseNums = ['01','02','03','04','05','06'];

  for (const num of houseNums) {
    const houseId = `house-${num}`;
    const interiorId = `${houseId}-interior`;

    // Encounter exists
    expect(ENCOUNTERS[houseId], `Encounter missing: ${houseId}`).toBeDefined();

    // Map interior/teleport exists and contains a battle trigger for the encounter
    const map = MAPS[interiorId];
    expect(map, `Map interior missing: ${interiorId}`).toBeDefined();
    const battleTrigger = map?.triggers?.find(t => t.type === 'battle' && t.data?.encounterId === houseId);
    expect(battleTrigger, `Battle trigger missing in interior ${interiorId} for ${houseId}`).toBeDefined();

    // Pre-battle dialogue: either explicit pre-battle mapping exists or a liberation dialogue exists
    const preMapped = Boolean(ENCOUNTER_TO_PRE_BATTLE_DIALOGUE[houseId]);
    const hasLiberationDialogue = Boolean(DIALOGUES[houseId]);
    expect(preMapped || hasLiberationDialogue, `Pre-battle dialogue missing for ${houseId}`).toBeTruthy();

    // Post-battle dialogue existence (permitted to be named either 'house-XX-post' or 'house-XX-post-battle')
    const postMapped = Boolean(ENCOUNTER_TO_POST_BATTLE_DIALOGUE[houseId]);
    const postVariantA = Boolean(DIALOGUES[`${houseId}-post`]);
    const postVariantB = Boolean(DIALOGUES[`${houseId}-post-battle`]);
    expect(postMapped || postVariantA || postVariantB, `Post-battle dialogue missing for ${houseId}`).toBeTruthy();

    // Reward or recruitment: either encounter has an unlockUnit reward or recruitment data indicates a recruited unit
    const encounter = ENCOUNTERS[houseId];
    const recInfo = getRecruitmentInfo(houseId);
    const hasUnlockUnit = Boolean(encounter?.reward?.unlockUnit);
    const hasRecruitDialogue = Boolean(recInfo && (recInfo.recruitsUnit || recInfo.grantsDjinn));
    expect(hasUnlockUnit || hasRecruitDialogue, `No reward or recruitment wired for ${houseId}`).toBeTruthy();

    // Specific check for House 06 recruitment configured as requested
    if (houseId === 'house-06') {
      expect(encounter.reward.unlockUnit, 'house-06 unlockUnit should be stone-guardian').toBe('stone-guardian');
    }
  }
});
