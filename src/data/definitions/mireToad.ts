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
    agi: 10,
    luk: 5,
  },
  abilities: [
    { ...STRIKE, probability: 0.6 },
    { ...ICE_SHARD, probability: 0.4 },
  ],
  xpReward: 15,
  goldReward: 8,
  dropTable: [],
  visuals: {
    spriteId: 'enemy-toad-mercury', // Placeholder or reused sprite
    scale: 1.0,
    tint: '#88aaff', // Mercury-ish tint
  },
  ai: {
    pattern: 'random',
  }
};
