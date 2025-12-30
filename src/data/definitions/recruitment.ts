/**
 * Recruitment records for houses and story events.
 * This file centralizes which unit IDs should be granted or auto-recruited
 * after completing specific houses. Keep in sync with encounters.ts and
 * HOUSES_STATUS in houses.ts.
 */

export type RecruitmentRecord = {
  houseId: string; // encounter id (e.g., 'house-03')
  unitId: string; // unit to unlock or auto-recruit
  method: 'battleReward' | 'storyJoin' | 'dialogueEffect';
};

export const RECRUITMENT: RecruitmentRecord[] = [
  { houseId: 'house-01', unitId: 'war-mage', method: 'battleReward' },
  { houseId: 'house-02', unitId: 'mystic', method: 'storyJoin' },
  { houseId: 'house-03', unitId: 'ranger', method: 'storyJoin' },
  { houseId: 'house-05', unitId: 'blaze', method: 'battleReward' },
  { houseId: 'house-08', unitId: 'sentinel', method: 'battleReward' },
  { houseId: 'house-11', unitId: 'karis', method: 'battleReward' },
  { houseId: 'house-14', unitId: 'tyrell', method: 'battleReward' },
  { houseId: 'house-15', unitId: 'stormcaller', method: 'battleReward' },
  { houseId: 'house-17', unitId: 'felix', method: 'battleReward' },
  // Newly verified: House 6 now grants a recruitable unit upon completion
  { houseId: 'house-06', unitId: 'stone-guardian', method: 'battleReward' },
];
