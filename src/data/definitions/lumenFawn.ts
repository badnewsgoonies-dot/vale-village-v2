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
    agi: 12,
    luk: 15,
  },
  abilities: [
    { ...STRIKE, probability: 0.7 },
    { ...QUAKE, probability: 0.3 },
  ],
  xpReward: 12,
  goldReward: 6,
  dropTable: [],
  visuals: {
    spriteId: "enemy-fawn-venus",
    scale: 0.9,
    tint: "#aaff88", // Venus-ish tint
  },
  ai: {
    pattern: "random",
  }
};
