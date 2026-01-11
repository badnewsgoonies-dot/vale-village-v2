import type { Enemy } from '../schemas/EnemySchema';
import {
  STRIKE,
  ICE_SHARD,
} from './abilities';

export const MIRE_TOAD: Enemy = {
  id: 'mire-toad',
  name: 'Mire Toad',
  level: 2,
  element: 'Mercury',
  stats: {
    hp: 60,
    pp: 15,
    atk: 18,
    def: 12,
    mag: 4,
    spd: 10,
  },

  abilities: [
    { ...STRIKE },
    { ...ICE_SHARD },
  ],
  baseXp: 15,
  baseGold: 8,
  drops: [],
};
