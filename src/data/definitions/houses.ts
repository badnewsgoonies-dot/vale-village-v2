/**
 * HOUSES_STATUS (auto-generated summary for Round work)
 *
 * This file documents the status of Houses 1-6 with respect to:
 *  - Dialogue: which dialogue ID plays after battle
 *  - Encounter: encounter ID defined in encounters.ts
 *  - Recruit: which unit (if any) is granted by this house
 *
 * NOTE: This summary is stored as a TypeScript export so downstream
 * tools/tests can import it. Treat this as a living document; keep it
 * synchronized with recruitmentDialogues.ts, encounters.ts and dialogues.ts.
 */

export type HouseStatus = {
  houseNumber: number;
  encounterId: string;
  dialogueId: string | null;
  recruitUnit: string | null;
  notes?: string;
};

export const HOUSES_STATUS: HouseStatus[] = [
  {
    houseNumber: 1,
    encounterId: 'house-01',
    dialogueId: 'house-01-recruit',
    recruitUnit: 'war-mage',
    notes: 'VS1 tutorial pattern: battle reward + recruit via dialogue effects (Forge Djinn)',
  },
  {
    houseNumber: 2,
    encounterId: 'house-02',
    dialogueId: 'house-02-recruit',
    recruitUnit: 'mystic',
    notes: 'Story join after battle (auto-recruit), equipment reward: bronze-sword',
  },
  {
    houseNumber: 3,
    encounterId: 'house-03',
    dialogueId: 'house-03-recruit',
    recruitUnit: 'ranger',
    notes: 'Story join after battle (auto-recruit), equipment reward: iron-armor',
  },
  {
    houseNumber: 4,
    encounterId: 'house-04',
    dialogueId: 'house-04-post',
    recruitUnit: null,
    notes: 'Post-battle victory dialogue only; no recruit',
  },
  {
    houseNumber: 5,
    encounterId: 'house-05',
    dialogueId: 'house-05-recruit',
    recruitUnit: 'blaze',
    notes: 'Battle recruit via encounter.reward.unlockUnit',
  },
  {
    houseNumber: 6,
    encounterId: 'house-06',
    dialogueId: 'house-06-post',
    recruitUnit: null,
    notes: 'Contains Stone Guardian (tank) + Ember Cleric; reward: steel-helm. Verify post-battle flow.',
  },
];
