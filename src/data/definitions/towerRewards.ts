// [BT-DATA][BT-01] Battle Tower reward milestones
import type { TowerReward } from '../schemas/TowerRewardSchema';

/**
 * Tower rewards are milestone-based and reference existing content IDs.
 * These entries prove out tower-exclusive unlocks while keeping data-driven flow.
 */
export const TOWER_REWARDS: readonly TowerReward[] = [
  {
    floorNumber: 6,
    rewards: [
      {
        type: 'equipment',
        ids: ['eclipse-blade'],
        notes: 'Tower-exclusive artifact sword',
      },
    ],
  },
  {
    floorNumber: 7,
    rewards: [
      {
        type: 'djinn',
        ids: ['nova'],
        notes: 'Tower-exclusive Mars Djinn',
      },
    ],
  },
  {
    floorNumber: 10,
    rewards: [
      {
        type: 'recruit',
        ids: ['tower-champion'],
        notes: 'Tower-exclusive recruit unlocked after boss floor',
      },
    ],
  },
  {
    floorNumber: 15,
    rewards: [
      {
        type: 'equipment',
        ids: ['gaia-blade'],
        notes: 'Legendary Venus sword milestone',
      },
    ],
  },
  {
    floorNumber: 18,
    rewards: [
      {
        type: 'equipment',
        ids: ['titans-axe'],
        notes: 'Legendary Mars axe milestone',
      },
    ],
  },
  {
    floorNumber: 22,
    rewards: [
      {
        type: 'equipment',
        ids: ['zodiac-wand'],
        notes: 'Legendary Mercury wand milestone',
      },
    ],
  },
  {
    floorNumber: 25,
    rewards: [
      {
        type: 'equipment',
        ids: ['trident-neptune'],
        notes: 'Tower-exclusive legendary weapon',
      },
      {
        type: 'djinn',
        ids: ['tsunami'],
        notes: 'Tower-exclusive Mercury Djinn',
      },
    ],
  },
  {
    floorNumber: 30,
    rewards: [
      {
        type: 'equipment',
        ids: ['zeus-thunderbolt'],
        notes: 'Tower-exclusive ultimate artifact',
      },
      {
        type: 'recruit',
        ids: ['tower-legend'],
        notes: 'Tower-exclusive legendary recruit',
      },
      {
        type: 'djinn',
        ids: ['celestial'],
        notes: 'Tower-exclusive Jupiter Djinn',
      },
    ],
  },
] as const;
