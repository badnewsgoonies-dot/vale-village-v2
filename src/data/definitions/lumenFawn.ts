import type { Enemy } from "../schemas/EnemySchema";
import {
  STRIKE,
  QUAKE,
} from "./abilities";

export const LUMEN_FAWN: Enemy = {
  id: "lumen-fawn",
  name: "Lumen Fawn",
  level: 1,
  element: "Venus",
  stats: {
    hp: 45,
    pp: 10,
    atk: 14,
    def: 8,
    mag: 6,
    spd: 12,
  },

  abilities: [
    { ...STRIKE },
    { ...QUAKE },
  ],
  baseXp: 12,
  baseGold: 6,
  drops: [],
};
